// Streaming client for the RAG agent API.
//
// Reads Server-Sent Events from `POST {VITE_CHAT_API_URL}/chat`. The backend
// emits frames like:
//   event: token
//   data: {"text": "..."}
//
//   event: done
//   data: {"refusal": false}
//
//   event: error
//   data: {"message": "ClassName"}
//
// Falls back to the local mock reply when no API URL is configured.

const API_URL = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/$/, "");

export const isApiConfigured = Boolean(API_URL);

function parseSseChunk(buffer) {
  const events = [];
  const frames = buffer.split("\n\n");
  const remainder = frames.pop() ?? "";

  for (const frame of frames) {
    if (!frame.trim()) continue;
    let event = "message";
    let data = "";
    for (const line of frame.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        data += line.slice(5).trim();
      }
    }
    let parsed = null;
    if (data) {
      try {
        parsed = JSON.parse(data);
      } catch {
        parsed = { text: data };
      }
    }
    events.push({ event, data: parsed });
  }
  return { events, remainder };
}

/**
 * Stream an answer from the RAG API.
 *
 * @param {string} question
 * @param {object} handlers
 * @param {(text: string) => void} handlers.onToken    Called for each token delta.
 * @param {(meta: object) => void}  handlers.onDone    Called once when the stream ends.
 * @param {(message: string) => void} handlers.onError Called when the request fails.
 * @param {Array<{role: string, text: string}>} [handlers.history] Recent turns (oldest first).
 * @param {AbortSignal} [handlers.signal]
 */
export async function streamChat(
  question,
  { onToken, onDone, onError, history = [], signal },
) {
  if (!isApiConfigured) {
    onError?.("API not configured");
    return;
  }

  let response;
  try {
    response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ question, history }),
      signal,
    });
  } catch (err) {
    onError?.(err?.name === "AbortError" ? "aborted" : "network");
    return;
  }

  if (!response.ok || !response.body) {
    onError?.(`http_${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { events, remainder } = parseSseChunk(buffer);
      buffer = remainder;
      for (const { event, data } of events) {
        if (event === "token" && data?.text) {
          onToken?.(data.text);
        } else if (event === "done") {
          onDone?.(data ?? {});
          return;
        } else if (event === "error") {
          onError?.(data?.message || "stream_error");
          return;
        }
      }
    }
  } catch (err) {
    onError?.(err?.name === "AbortError" ? "aborted" : "stream_read");
    return;
  }

  // Stream ended without an explicit `done` event — treat as success.
  onDone?.({});
}
