import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Bot } from "./components/animate-ui/icons/bot";
import ColorBends from "./components/ColorBends";
import { DownloadIcon } from "./components/ui/download-icon";
import { useBotEyeOffset } from "./hooks/use-bot-eye-offset";
import { BentoGrid, BentoCard } from "./components/ui/bento-grid";
import { LightningBoltIcon, MagicWandIcon, MagnifyingGlassIcon, TargetIcon } from "@radix-ui/react-icons";
import { streamChat, warmupChat, isApiConfigured } from "./lib/chatApi";

const A = "/assets/";
const contactHref = "#contact";
const cvHref = "/assets/arthur-chequer-cv.pdf";
const githubUrl = "https://github.com/0x4rthur";
const linkedinUrl = "https://www.linkedin.com/in/arthurchequer/";
const emailAddress = "arthurchequer@hotmail.com";
const emailHref = `mailto:${emailAddress}`;
const socialLinks = {
  LINKEDIN: linkedinUrl,
  GITHUB: githubUrl,
  EMAIL: emailHref,
};
const contactActions = [
  ["github.svg", "Arthur on GitHub", githubUrl, true],
  ["linkedin.svg", "Arthur on LinkedIn", linkedinUrl, true],
  ["mail.svg", "Email Arthur", emailHref, false],
];

const shadowCard =
  "shadow-[0px_16.2px_20.7px_-4px_rgba(0,0,0,0.1),0px_6.6px_8.1px_-5px_rgba(0,0,0,0.1)]";
const shadowSoft = "shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.05)]";
const border = "border border-[#d1d5db]";
const pagePadding = "px-[18px] sm:px-[28px] lg:px-[40px]";
const sectionSpacing = "mt-[52px] sm:mt-[64px] lg:mt-[80px]";


const toolkit = [
  {
    title: "PYTHON",
    icon: "python-brand.png",
    iconClass: "size-[33.3px]",
    tags: ["PANDAS", "NUMPY", "FASTAPI"],
  },
  {
    title: "LANGCHAIN",
    icon: "langchain-brand.png",
    iconClass: "size-[33.3px]",
    tags: ["AGENTS", "RAG", "VECTOR DBS"],
  },
  {
    title: "HUGGING FACE",
    icon: "huggingface-brand.png",
    iconClass: "h-[48.6px] w-[47.7px]",
    tags: ["TRANSFORMERS", "LLMS", "DIFFUSERS"],
  },
];

const projects = [
  {
    id: "arthur-pay-ai",
    title: "ARTHUR PAY AI",
    badge: "PRODUCTION",
    badgeClass: "bg-black text-white border-[#1f2937]",
    gradient:
      "linear-gradient(147deg, rgb(165, 201, 255) 0%, rgb(255, 255, 255) 100%)",
    summary:
      "Intelligent financial assistant powered by LangChain and a custom multi-agent router.",
    description:
      "An intelligent financial assistant built with LangChain and custom LLM routing. Capable of analyzing transaction histories and executing semantic queries against relational databases.",
    tools: ["LANGCHAIN", "POSTGRESQL", "OPENAI", "FASTAPI"],
    process:
      "Designed a multi-agent routing system that dispatches user queries to specialized sub-agents — one for SQL generation, another for transaction summarization, and a third for compliance checks. Each agent uses a tightly scoped tool set and a shared semantic memory layer backed by pgvector.",
    results:
      "Reduced manual financial review time by 78% across the pilot cohort and reached 94% accuracy on natural-language to SQL benchmarks over 2.000 evaluated queries.",
    observations:
      "The single largest unlock was avoiding a monolithic prompt. Splitting concerns across small, evaluable agents made the system reliable, debuggable and cheap to iterate on.",
    metrics: [
      { label: "Query accuracy", value: "94%" },
      { label: "Latency p95", value: "1.4s" },
      { label: "Cost / query", value: "$0.012" },
    ],
  },
  {
    id: "creatory-agent",
    title: "CREATORY AGENT",
    badge: "BETA",
    badgeClass: "bg-white/95 text-black border-[#d1d5db]",
    gradient:
      "linear-gradient(-33deg, rgb(243, 244, 246) 0%, rgb(165, 201, 255) 100%)",
    summary:
      "Multi-agent ideation engine with brand-aware critic loops.",
    description:
      "A multi-agent system designed to automate content ideation and drafting. Implements a custom critic-generator loop to ensure brand voice consistency across outputs.",
    tools: ["PYTHON", "AUTOGEN", "FASTAPI"],
    process:
      "Built a critic-generator loop where a draft agent proposes copy and a critic agent scores it against a brand-voice rubric encoded as a structured prompt. The loop terminates either when scores cross a threshold or after a fixed iteration budget.",
    results:
      "Cut average ideation time from 35 to 6 minutes per asset and lifted internal brand-fit scores by ~22% versus single-shot generation.",
    observations:
      "Letting the critic emit structured feedback — per-axis scores, not just text — was decisive. The generator could finally act on the critique instead of guessing.",
    metrics: [
      { label: "Time / asset", value: "−83%" },
      { label: "Brand fit", value: "+22%" },
      { label: "Iterations", value: "3 avg" },
    ],
  },
  {
    id: "rag-knowledge-base",
    title: "PORTFOLIO AI AGENT",
    badge: "LIVE",
    badgeClass: "bg-white/95 text-[#166534] border-[#86efac]",
    gradient:
      "linear-gradient(33deg, rgb(165, 201, 255) 0%, rgb(255, 255, 255) 100%)",
    summary:
      "Live RAG assistant grounded on Arthur's resume, notes, and website.",
    description:
      "A retrieval-augmented assistant built end-to-end for this portfolio. It indexes Arthur's resume, personal B-side notes, and website into a local ChromaDB vector store, then answers visitor questions via a FastAPI streaming API — with conversation history, multilingual support, and security hardening throughout.",
    tools: ["LANGCHAIN", "CHROMADB", "FASTAPI", "OPENAI", "PYTHON", "RENDER"],
    process:
      "Scraped arthurchequer.com and loaded two PDFs (resume + B-side notes) using PyPDFLoader. Chunked with RecursiveCharacterTextSplitter (1,000 chars, 150 overlap) and embedded with text-embedding-3-small into a persistent ChromaDB instance. The vectorstore is baked at deploy time — no re-embedding on cold starts. A FastAPI backend exposes a POST /chat endpoint with Server-Sent Events, streaming tokens to the React chat widget as they arrive. Conversation history (last 6 turns) is sanitized and forwarded with each request so follow-up questions resolve correctly. The system prompt keeps the agent strictly grounded to retrieved context and mirrors the user's language.",
    results:
      "Fully deployed: Render backend + Vercel frontend, integrated in the same session they were built. Streaming SSE delivers the first token under 500 ms (warm instance). The agent correctly refuses off-topic questions, handles Portuguese and English follow-ups, and never invents facts outside the indexed sources.",
    observations:
      "Baking the vectorstore at deploy time — rather than rebuilding on every cold start — was the single most impactful cost decision: it eliminates per-restart embedding charges entirely. On the safety side, stripping newlines and control characters from client-supplied history was essential; without it, a crafted history payload could inject fake conversation turns directly into the prompt.",
    metrics: [
      { label: "Chunks indexed", value: "10" },
      { label: "Sources", value: "3" },
      { label: "Top-k retrieval", value: "4" },
    ],
  },
  {
    id: "textvision",
    title: "TEXTVISION",
    badge: "OPEN SOURCE",
    badgeClass: "bg-white/95 text-black border-[#d1d5db]",
    gradient:
      "linear-gradient(112deg, rgb(165, 201, 255) 0%, rgb(243, 244, 246) 60%, rgb(255, 255, 255) 100%)",
    summary:
      "Real-time digital magnifier with OCR and offline text-to-speech for low-vision users.",
    description:
      "An accessibility-first desktop app that magnifies webcam or screen content in real time, applies high-contrast filters, runs Tesseract OCR on demand, and reads recognized text aloud — all running locally with no cloud dependency.",
    tools: ["PYTHON", "OPENCV", "TESSERACT", "TKINTER", "PYTTSX3"],
    process:
      "Threaded architecture: capture, magnification, and OCR each run on separate threads so the UI stays responsive at 30 FPS. Frames pass through adaptive 1× to 10× zoom, CLAHE contrast enhancement, and color filtering before display. When the user triggers OCR, an extra pre-processing chain — upscale, bilateral filter, Otsu or adaptive thresholding, deskew — feeds Tesseract under multiple page-segmentation modes; the highest-confidence result wins, with early exit when a strong match is found.",
    results:
      "Runs end-to-end on a stock Windows laptop with no GPU. The hot path stays under the 33 ms per-frame budget so magnification and the cursor-following overlay feel instant, and on-demand OCR completes without dropping frames.",
    observations:
      "Keeping everything local — no cloud OCR, no cloud TTS — meant accepting Tesseract's quirks instead of reaching for a hosted API. The multi-PSM scoring loop with early exit was the compromise that kept accuracy acceptable without burning frames.",
    metrics: [
      { label: "Frame rate", value: "30 FPS" },
      { label: "Cloud calls", value: "0" },
      { label: "Zoom range", value: "1×–10×" },
    ],
  },
];

const skills = [
  {
    title: "AI / ML FRAMEWORKS",
    items: [
      ["pytorch.png", "PyTorch", "h-[17.1px] w-[14.4px]", "gap-4"],
      ["keras.png", "Keras", "size-4", "gap-4"],
      ["huggingface-small.png", "Hugging Face", "size-6 rounded-[9px]", "gap-[8.1px]"],
      ["langchain-small.png", "LangChain", "size-5", "gap-4"],
      ["langgraph.png", "LangGraph", "size-5", "gap-4"],
      ["scikit.png", "scikit-learn", "h-[12.6px] w-[23.4px]", "gap-[8.1px]"],
      ["opencv.png", "openCV", "size-5", "gap-4"],
    ],
  },
  {
    title: "LANGUAGES",
    items: [
      ["python-mini.png", "Python", "size-[15.3px]", "gap-4"],
      ["sql.png", "SQL", "h-5 w-[16.2px]", "gap-4"],
    ],
  },
  {
    title: "DEVOPS",
    items: [
      ["mlflow.png", "MLFlow", "size-[16.2px]", "gap-4"],
      ["wandb.png", <>Weights &amp; Biases<br />(W&amp;B)</>, "size-4", "gap-4"],
      ["github.png", "GitHub", "size-4", "gap-4"],
    ],
  },
  {
    title: "BACK-END",
    items: [
      ["fastapi.png", "FastAPI", "size-[16.2px]", "gap-4"],
      ["chroma.png", "Chroma", "h-[17.1px] w-6", "gap-[8.1px]"],
    ],
  },
];

const educationLeft = [
  ["AI & ML Engineering", "Microsoft", "microsoft.png", "size-[43.2px]", "Apr 2026"],
  ["Azure Fundamentals (AZ-900)", "Microsoft", "az900.png", "size-[52.2px]", "Mar 2023"],
  ["Data Analytics Certificate", "Google", "google-data.png", "h-[52.2px] w-[54.9px]", "Apr 2026"],
];

const educationRight = [
  ["MBA - IA, Data Science e Big Data", "Ibmec", "ibmec.png", "size-[50.4px] rounded-[9px]", "May 2025 – May 2026"],
  ["Cyber Defense", "FIAP", "fiap.png", "size-[50.4px] rounded-[9px]", "Feb 2023 – Feb 2025"],
  ["Dale Carnegie Training", "Dale Carnegie", "dale.png", "h-[37.8px] w-[64.8px]", "Jun 2022"],
];

const navItems = [
  { label: "PROJECTS", id: "projects" },
  { label: "SKILLS", id: "skills" },
  { label: "EDUCATION", id: "education" },
];

const chatTabs = ["About", "Skills", "More"];
const botAnimationDuration = 2300;
const botAnimationLoops = 1;
const botReplyDelay = 850;

const initialChatMessages = [
  {
    role: "agent",
    text: "Hello! I'm Arthur's AI assistant. I can help you navigate his portfolio. What you want to know about Arthur?",
  },
];

function getAgentReply(message, activeTab) {
  const text = message.toLowerCase();

  if (text.includes("skill") || text.includes("toolkit") || activeTab === "Skills") {
    return "Arthur's core toolkit centers on Python, LangChain, Hugging Face, FastAPI, vector databases, and production LLM workflows.";
  }

  if (text.includes("project") || text.includes("pay") || text.includes("rag")) {
    return "The selected projects highlight financial assistants, multi-agent content systems, and enterprise RAG knowledge bases.";
  }

  if (text.includes("education") || text.includes("certificate") || text.includes("mba")) {
    return "His education section includes AI and ML engineering, Azure fundamentals, data analytics, cyber defense, and an MBA focused on AI, data science, and big data.";
  }

  if (text.includes("contact") || text.includes("email") || text.includes("linkedin")) {
    return "You can use the contact section near the bottom of the page to reach Arthur directly.";
  }

  if (activeTab === "More") {
    return "I can summarize projects, list technical skills, or point you to education and contact details.";
  }

  return "Arthur is a pragmatic AI Engineer focused on autonomous agents, robust LLM pipelines, and scalable backend infrastructure.";
}

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isScrolledRef = useRef(false);
  const activeSectionRef = useRef("");

  useEffect(() => {
    let ticking = false;
    const compactAt = 64;
    const expandAt = 40;

    function updateScrollState() {
      const scrollY = window.scrollY;
      let currentSection = "";

      navItems.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 136) {
          currentSection = id;
        }
      });

      const nextIsScrolled = isScrolledRef.current
        ? scrollY > expandAt
        : scrollY > compactAt;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      if (currentSection !== activeSectionRef.current) {
        activeSectionRef.current = currentSection;
        setActiveSection(currentSection);
      }

      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-[12.6px] z-50 px-[10.8px] sm:top-[16.2px] sm:px-[18px]">
      <div
        className={`nav-shell nav-float-in pointer-events-auto mx-auto flex h-[52.2px] w-full items-center justify-between rounded-full border px-[8.1px] pl-[16.2px] transition-[max-width,background-color,border-color,box-shadow] duration-[440ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[64.8px] sm:px-[10.8px] sm:pl-[25.2px] ${
          isScrolled
            ? "max-w-[700px] border-[#d1d5db] bg-white/92 shadow-[0px_14.4px_36.9px_-19.6px_rgba(17,24,39,0.42)] backdrop-blur-[16.2px]"
            : "max-w-[1080px] border-[#e5e7eb] bg-white/78 shadow-[0px_8.1px_24.3px_-21.2px_rgba(17,24,39,0.34)] backdrop-blur-[12.6px]"
        }`}
      >
        <a
          href="#top"
          className="rounded-full font-space text-[14.4px] font-black uppercase leading-[19.8px] tracking-normal text-black outline-none transition-[color,transform] duration-300 ease-out hover:text-[#1f2937] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:text-[18.9px] sm:leading-[25.2px]"
        >
          ARTHUR
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center rounded-full border border-[#e5e7eb] bg-[#f9fafb]/80 p-[5px] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:flex"
        >
          {navItems.map(({ label, id }) => {
            const isActive = activeSection === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-[17.1px] py-[9px] font-space text-[10.8px] font-bold uppercase leading-[16.2px] tracking-normal outline-none transition-[background-color,color,box-shadow,transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] ${
                  isActive
                    ? "bg-white text-black shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.08)]"
                    : "text-[#6b7280] hover:bg-white/70 hover:text-[#111827]"
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <a
          href={contactHref}
          className="rounded-full border border-[#8fbaff] bg-[#a5c9ff] px-[10.8px] py-[8.1px] text-center font-space text-[9.9px] font-bold uppercase leading-[14.4px] tracking-normal text-black shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_11.7px_19.8px_-16.4px_rgba(17,24,39,0.55)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:px-[21.6px] sm:py-[11.7px] sm:text-[10.8px] sm:leading-[16.2px]"
        >
          CONTACT ME
        </a>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto mx-auto mt-[7.4px] flex w-fit max-w-[calc(100vw-21.2px)] items-center gap-[3.2px] rounded-full border border-[#e5e7eb] bg-white/92 p-[5px] shadow-[0px_8.1px_24.3px_-19.6px_rgba(17,24,39,0.38)] backdrop-blur-[12.6px] md:hidden"
      >
        {navItems.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-[10.8px] py-[7.4px] font-space text-[9px] font-bold uppercase leading-[12.6px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:bg-[#f9fafb] hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  const downloadIconRef = useRef(null);

  return (
    <section className="relative left-1/2 mt-[116px] w-screen -translate-x-1/2 overflow-hidden py-[32px] [contain:layout_style] sm:mt-[132px] sm:py-[40px] md:mt-[96px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <ColorBends
          rotation={90}
          speed={0.2}
          colors={["#a4c8ff"]}
          transparent
          autoRotate={0}
          scale={1}
          frequency={0.8}
          warpStrength={1}
          mouseInfluence={0.3}
          parallax={0.3}
          noise={0}
          iterations={1}
          intensity={1.5}
          bandWidth={7}
        />
      </div>
      {/* 6 overlay divs → 1; backdrop-blur removido (forçava readback GPU a cada frame) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: [
          'linear-gradient(to bottom,#fff 0%,rgba(255,255,255,.92) 7%,transparent 33%)',
          'linear-gradient(to top,#fff 0%,rgba(255,255,255,.78) 17%,transparent 40%)',
          'linear-gradient(to right,#fff 0%,rgba(255,255,255,.82) 13%,transparent 33%)',
          'linear-gradient(to left,rgba(255,255,255,.88) 0%,rgba(255,255,255,.42) 7%,transparent 21%)',
          'radial-gradient(ellipse at center,transparent 18%,rgba(255,255,255,.44) 58%,rgba(255,255,255,.96) 100%)',
          'rgba(255,255,255,.40)',
        ].join(',') }}
      />
      <div className={`mx-auto grid w-full max-w-[1080px] gap-[36px] ${pagePadding} lg:min-h-[468px] lg:grid-cols-[minmax(0,1fr)_minmax(392.4px,540px)] lg:items-center lg:gap-[57.6px]`}>
        <div className="flex max-w-[504px] flex-col items-start gap-[20px] self-center lg:max-w-none">
          <h1 className="font-space text-[50.4px] font-normal leading-[0.95] tracking-normal text-[#1a1c1c] sm:text-[68.4px] lg:text-[86.4px]">
            Hi, I&apos;m
            <br />
            Arthur.
          </h1>
          <p className="max-w-[48ch] text-[14.4px] font-normal leading-[24.3px] text-[#4b5563] [text-wrap:pretty] sm:text-[15.3px] sm:leading-[25.2px]">
            A pragmatic <strong>AI Engineer</strong> with 1 year of hands-on experience building autonomous agents, robust LLM pipelines, and scalable backend infrastructure. Focused on creating quietly useful tools.
          </p>
          <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[10.8px] pt-[4px] lg:pt-[8px]">
            <a
              href={cvHref}
              download
              onMouseEnter={() => downloadIconRef.current?.startAnimation()}
              onMouseLeave={() => downloadIconRef.current?.stopAnimation()}
              className={`group flex min-h-[50.4px] w-full min-w-[147.6px] items-center justify-center gap-[9px] rounded-[10.8px] ${border} bg-[#a5c9ff] px-[25.2px] py-[15.3px] text-center text-[12.6px] font-bold uppercase leading-[18px] tracking-normal text-[#1a1c1c] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_11.7px_19.8px_-16.4px_rgba(17,24,39,0.45)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:w-auto`}
            >
              Download CV
              <DownloadIcon ref={downloadIconRef} size={18} duration={0.9} className="shrink-0" />
            </a>
            <a href="#toolkit" className="group flex items-center gap-[7.4px] text-[10.8px] font-normal uppercase leading-[14.4px] tracking-normal text-[#6b7280] outline-none transition-[color,transform] duration-200 hover:text-[#1a1c1c] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white">
              Scroll down to explore more
              <svg
                aria-hidden="true"
                className="size-[13.5px] shrink-0 transition-transform duration-200 group-hover:translate-y-[1.6px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
        <ChatWidget />
      </div>
    </section>
  );
}

function PageScrollbar() {
  const [thumb, setThumb] = useState({ height: 0, top: 0 });
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const ratio = viewportHeight / scrollHeight;
      if (ratio >= 1) { setThumb({ height: 0, top: 0 }); return; }
      const h = Math.max(ratio * viewportHeight, 32);
      const maxTop = viewportHeight - h;
      setThumb({ height: h, top: (scrollTop / (scrollHeight - viewportHeight)) * maxTop });
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 800);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && thumb.height > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none fixed inset-y-0 right-[5px] z-[200] w-[4px]"
        >
          <motion.div
            className="absolute w-full rounded-full bg-[#1a1c1c]/[.22]"
            animate={{ height: thumb.height, top: thumb.top }}
            transition={{ duration: 0.06, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChatScrollbar({ containerRef, visible }) {
  const [thumb, setThumb] = useState({ height: 0, top: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const ratio = el.clientHeight / el.scrollHeight;
      if (ratio >= 1) { setThumb({ height: 0, top: 0 }); return; }
      const h = Math.max(ratio * el.clientHeight, 28);
      const maxTop = el.clientHeight - h;
      setThumb({ height: h, top: (el.scrollTop / (el.scrollHeight - el.clientHeight)) * maxTop });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {visible && thumb.height > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-[81px] right-[5px] top-[65px] w-[4px]"
        >
          <motion.div
            className="absolute w-full rounded-full bg-[#1a1c1c]/[.22]"
            animate={{ height: thumb.height, top: thumb.top }}
            transition={{ duration: 0.06, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExpandedScrollbar({ containerRef, visible }) {
  const [thumb, setThumb] = useState({ height: 0, top: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const ratio = el.clientHeight / el.scrollHeight;
      if (ratio >= 1) { setThumb({ height: 0, top: 0 }); return; }
      const h = Math.max(ratio * el.clientHeight, 28);
      const maxTop = el.clientHeight - h;
      setThumb({ height: h, top: (el.scrollTop / (el.scrollHeight - el.clientHeight)) * maxTop });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {visible && thumb.height > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-0 right-[5px] top-[140px] z-10 w-[4px] sm:top-[180px]"
        >
          <motion.div
            className="absolute w-full rounded-full bg-[#1a1c1c]/[.22]"
            animate={{ height: thumb.height, top: thumb.top }}
            transition={{ duration: 0.06, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChatWidget() {
  const [activeTab, setActiveTab] = useState("About");
  const [messages, setMessages] = useState(initialChatMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isResetSpinning, setIsResetSpinning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetExiting, setIsResetExiting] = useState(false);
  const [isChatScrolling, setIsChatScrolling] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const messagesRef = useRef(null);
  const pendingResetRef = useRef(null);
  const typingTimerRef = useRef(null);
  const resetEndTimerRef = useRef(null);
  const resetExitTimerRef = useRef(null);
  const { eyeX, eyeY } = useBotEyeOffset();
  const lastAgentMessageIndex = messages.reduce(
    (lastIndex, message, index) => (message.role === "agent" ? index : lastIndex),
    -1,
  );

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Wake the Render dyno as soon as the widget mounts so the first real
  // question doesn't pay the ~30–60s cold-start penalty.
  useEffect(() => {
    warmupChat();
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    let timer;
    const onScroll = () => {
      setIsChatScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsChatScrolling(false), 800);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(typingTimerRef.current);
      window.clearTimeout(resetEndTimerRef.current);
      window.clearTimeout(resetExitTimerRef.current);
    };
  }, []);

  function submitMessage(message, tab = activeTab) {
    const cleanDraft = message.trim();
    if (!cleanDraft || isTyping || isResetting) {
      return;
    }

    setMessages((current) => [...current, { role: "user", text: cleanDraft }]);
    setDraft("");
    setIsTyping(true);
    window.clearTimeout(typingTimerRef.current);

    // Offline fallback: if the chat API isn't configured, keep the legacy
    // mock so local development still feels responsive.
    if (!isApiConfigured) {
      typingTimerRef.current = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          { role: "agent", text: getAgentReply(cleanDraft, tab), animateBot: true },
        ]);
        setIsTyping(false);
      }, botReplyDelay);
      return;
    }

    let bubbleStarted = false;

    const ensureBubble = () => {
      if (bubbleStarted) return;
      bubbleStarted = true;
      setIsTyping(false);
      setMessages((current) => [
        ...current,
        { role: "agent", text: "", animateBot: true, streaming: true },
      ]);
    };

    const appendToken = (text) => {
      setMessages((current) => {
        const next = current.slice();
        const lastIndex = next.length - 1;
        const last = next[lastIndex];
        if (last && last.role === "agent" && last.streaming) {
          next[lastIndex] = { ...last, text: last.text + text };
        }
        return next;
      });
    };

    const finalizeBubble = () => {
      setMessages((current) => {
        const next = current.slice();
        const lastIndex = next.length - 1;
        const last = next[lastIndex];
        if (last && last.role === "agent" && last.streaming) {
          next[lastIndex] = { ...last, streaming: false };
        }
        return next;
      });
    };

    // Send only recent turns so follow-ups like "tell me more" have context.
    // Only meaningful turns (no streaming placeholders, no empty text).
    const history = messages
      .filter((m) => (m.role === "user" || m.role === "agent") && m.text && !m.streaming)
      .slice(-6)
      .map((m) => ({ role: m.role, text: m.text }));

    streamChat(cleanDraft, {
      history,
      onToken: (text) => {
        ensureBubble();
        appendToken(text);
      },
      onDone: () => {
        ensureBubble();
        finalizeBubble();
      },
      onError: () => {
        if (!bubbleStarted) {
          setMessages((current) => [
            ...current,
            {
              role: "agent",
              text:
                "I couldn't reach the agent right now. Please try again in a moment.",
              animateBot: true,
            },
          ]);
          setIsTyping(false);
        } else {
          finalizeBubble();
        }
      },
    });
  }

  function sendMessage(event) {
    event.preventDefault();
    submitMessage(draft);
  }

  function selectTab(tab) {
    setActiveTab(tab);

    const promptByTab = {
      About: "Tell me about Arthur!",
      Skills: "What are Arthur skills?",
    };

    const prompt = promptByTab[tab];
    if (!prompt || isTyping || isResetting) {
      return;
    }

    setDraft(prompt);
    window.setTimeout(() => submitMessage(prompt, tab), 180);
  }

  function resetChat() {
    if (isResetting) return;

    window.clearTimeout(typingTimerRef.current);
    window.clearTimeout(resetEndTimerRef.current);
    window.clearTimeout(resetExitTimerRef.current);

    pendingResetRef.current = () => {
      setActiveTab("About");
      setMessages(initialChatMessages);
      setDraft("");
    };

    setIsResetting(true);
    setIsResetSpinning(true);
    setIsResetExiting(false);
    setIsTyping(false);
    setMessagesVisible(false);

    resetEndTimerRef.current = window.setTimeout(() => {
      setIsResetting(false);
      setIsResetSpinning(false);
      setIsResetExiting(true);
      resetExitTimerRef.current = window.setTimeout(() => {
        setIsResetExiting(false);
      }, 560);
    }, 620);
  }

  return (
    <div
      className={`relative flex h-[400px] min-w-0 flex-col overflow-hidden rounded-[18px] ${border} bg-white/72 p-px ${shadowCard} backdrop-blur-[9px] sm:h-[420px] sm:rounded-[21.6px] lg:h-[520px] lg:w-full`}
    >
      <div className="relative z-20 min-h-[63.9px] shrink-0 border-b border-[#d1d5db] bg-white/[.97] px-[13.5px] py-[14.4px] backdrop-blur-[5.8px] sm:px-[16.2px] sm:py-[16.2px]">
        <div className="flex h-full items-center gap-[6.6px] sm:gap-[13.5px]">
          {chatTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className="cursor-pointer rounded-[6.6px] border border-[#e5e7eb] bg-white px-[9.9px] py-[6.6px] text-center text-[10.8px] font-medium leading-[14.4px] tracking-normal text-[#6b7280] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.03)] outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-[#a5c9ff] hover:bg-[#a5c9ff] hover:text-black hover:shadow-[0px_6.6px_14.4px_-13px_rgba(17,24,39,0.45)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] sm:px-[14.4px]"
              type="button"
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto hidden h-[31.5px] items-center gap-[9.9px] sm:flex">
            <button
              type="button"
              onClick={resetChat}
              aria-label="Reset conversation"
              disabled={isResetting}
              className="group relative mr-[3.2px] flex size-[22.5px] items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#6b7280] shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.05)] transition-colors duration-200 hover:border-[#a5c9ff] hover:text-black disabled:cursor-wait disabled:border-[#a5c9ff] disabled:text-black"
            >
              <svg
                aria-hidden="true"
                className={`size-[11.7px] ${isResetSpinning ? "reset-spin-clockwise" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 12a9 9 0 0 1 15.1-6.6L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15.1 6.6L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span className="pointer-events-none absolute left-1/2 top-[30.6px] z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[7.4px] border border-[#d1d5db] bg-white px-[9px] py-[6.6px] text-[9.9px] font-medium leading-[12.6px] tracking-normal text-[#4b5563] opacity-0 shadow-[0px_11.7px_19.8px_-8.1px_rgba(17,24,39,0.22),0px_3.2px_6.6px_-5px_rgba(17,24,39,0.18)] transition-all duration-150 before:absolute before:left-1/2 before:top-[-5px] before:size-[8.1px] before:-translate-x-1/2 before:rotate-45 before:border-l before:border-t before:border-[#d1d5db] before:bg-white group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Reset chat
              </span>
            </button>
            <span className="agent-active-dot size-[9px] rounded-full bg-[#22c55e]" />
            <span className="whitespace-nowrap text-[9px] font-medium uppercase leading-[12.6px] tracking-normal text-[#6b7280]">
              AGENT ACTIVE
            </span>
          </div>
        </div>
      </div>
      <div
        ref={messagesRef}
        className="chat-messages-surface relative z-0 min-h-0 flex-1 overflow-y-auto"
      >
        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            pendingResetRef.current?.();
            pendingResetRef.current = null;
            setMessagesVisible(true);
          }}
        >
          {messagesVisible && (
            <motion.div
              key="chat-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-[13.5px] px-[13.5px] py-[16.2px] sm:px-[22.5px] sm:py-[19.8px]"
            >
              {messages.map((message, index) => {
                const isCurrent = index === lastAgentMessageIndex && !isTyping;
                return message.role === "agent" ? (
                  <div key={`a-${index}`} className="relative" style={{ minHeight: 45 }}>
                    {isCurrent && (
                      <div
                        className="absolute left-0 top-0"
                        style={{ width: 45, height: 45 }}
                        aria-hidden="true"
                        onMouseDown={e => e.preventDefault()}
                      >
                        <motion.div
                          layoutId="bot-avatar"
                          className="absolute inset-0"
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        >
                          <AgentAvatar animateBot={message.animateBot} eyeX={eyeX} eyeY={eyeY} />
                        </motion.div>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        marginLeft: isCurrent ? 54.9 : 0,
                      }}
                      transition={{
                        opacity: { duration: 0.22, ease: "easeOut", delay: (isCurrent && message.animateBot) ? 0.15 : 0 },
                        marginLeft: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: isCurrent ? 0 : 0.1 },
                      }}
                      className={`chat-agent-bubble rounded-bl-[13.5px] rounded-br-[13.5px] rounded-tr-[13.5px] ${border} bg-[#f9fafb] px-[11.7px] py-[10.8px] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] sm:px-[14.4px] sm:py-[12.6px]`}
                    >
                      <p className="text-[12.6px] leading-[19.8px] text-[#374151]">{message.text}</p>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    key={`u-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="flex justify-end"
                  >
                    <motion.div
                      whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
                      className="max-w-[82%] rounded-bl-[13.5px] rounded-br-[13.5px] rounded-tl-[13.5px] border border-black bg-black px-[13.5px] py-[11.7px] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] sm:max-w-[334.8px] sm:px-[14.4px] sm:py-[13.5px]"
                    >
                      <p className="text-[12.6px] leading-[19.8px] text-white">{message.text}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
              <AnimatePresence mode="popLayout">
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="chat-agent-row chat-agent-row-current chat-typing-row"
                  >
                    <motion.div
                      layoutId="bot-avatar"
                      style={{ width: 45, height: 45 }}
                      className="shrink-0"
                      aria-hidden="true"
                      onMouseDown={e => e.preventDefault()}
                      transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    >
                      <AgentAvatar eyeX={eyeX} eyeY={eyeY} />
                    </motion.div>
                    <div className="chat-typing-indicator flex h-[29.7px] items-center gap-[5px] sm:h-[32.4px]">
                      <span className="typing-dot" />
                      <span className="typing-dot animation-delay-150" />
                      <span className="typing-dot animation-delay-300" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChatScrollbar containerRef={messagesRef} visible={isChatScrolling} />
      <div className="h-[80.1px] shrink-0 border-t border-[#e9ecf0] bg-white/[.97] px-[13.5px] pb-[16.2px] pt-[17.1px] backdrop-blur-[5.8px] sm:px-[16.2px]">
        <form className="flex h-[46.8px] items-center gap-[10.8px]" onSubmit={sendMessage}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={warmupChat}
            className={`h-[46.8px] min-w-0 flex-1 appearance-none rounded-full border border-[#e2e6eb] bg-[#f4f6f9] px-[20px] text-[13.5px] font-light leading-normal text-[#1f2937] outline-none shadow-[0px_1px_2px_rgba(0,0,0,0.04)] placeholder:font-light placeholder:text-[#a8b0bb] focus:border-[#a5c9ff] focus:bg-white ${isResetting ? "reset-input-pulse" : isResetExiting ? "reset-input-exit" : ""}`}
            placeholder={isResetting ? "Resetting chat..." : "Ask the agent..."}
            aria-label="Ask the agent"
            disabled={isResetting}
          />
          <button
            className="flex size-[46.8px] shrink-0 items-center justify-center rounded-full bg-[#a5c9ff] shadow-[0px_1px_4px_rgba(165,201,255,0.5)] transition-all duration-200 hover:bg-[#8fbcff] hover:shadow-[0px_2px_8px_rgba(165,201,255,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || isTyping || isResetting}
          >
            <img alt="" src={`${A}send-icon.svg`} className="h-[13.5px] w-[15.3px]" />
          </button>
        </form>
      </div>
    </div>
  );
}

function AgentAvatar({ animateBot = false, eyeX, eyeY }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-[#d1d5db] bg-[#a5c9ff] p-px shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)]">
      <div className="translate-x-[1px] -translate-y-[2px]">
        {animateBot ? (
          <BotLoopIcon eyeX={eyeX} eyeY={eyeY} />
        ) : (
          <HoverBlinkBotIcon eyeX={eyeX} eyeY={eyeY} />
        )}
      </div>
    </div>
  );
}

function HoverBlinkBotIcon({ eyeX, eyeY }) {
  return (
    <Bot
      aria-hidden="true"
      animateOnHover="blink"
      animateOnTap="wink"
      completeOnStop
      size={34}
      className="cursor-pointer text-black"
      eyeX={eyeX}
      eyeY={eyeY}
    />
  );
}

function BotLoopIcon({ eyeX, eyeY }) {
  const [loopIndex, setLoopIndex] = useState(0);
  const isLooping = loopIndex < botAnimationLoops;

  useEffect(() => {
    if (loopIndex >= botAnimationLoops - 1) {
      const timer = window.setTimeout(() => {
        setLoopIndex((current) => current + 1);
      }, botAnimationDuration);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setLoopIndex((current) => current + 1);
    }, botAnimationDuration);

    return () => window.clearTimeout(timer);
  }, [loopIndex]);

  if (!isLooping) {
    return <HoverBlinkBotIcon eyeX={eyeX} eyeY={eyeY} />;
  }

  return (
    <Bot
      key={loopIndex}
      aria-hidden="true"
      animate="happy"
      pauseMouseTracking
      size={34}
      className="text-black"
      eyeX={eyeX}
      eyeY={eyeY}
    />
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-space text-[30.6px] font-normal uppercase leading-[34.2px] tracking-normal text-[#111827] [text-wrap:balance] sm:text-[36px] sm:leading-[37.8px] lg:text-[43.2px] lg:leading-[43.2px]">
      {children}
    </h2>
  );
}

function Pill({ children, small = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border border-[#d1d5db] bg-[#f9fafb] ${small ? "px-[8.1px] py-[5px] rounded-[3.2px] border-[#e5e7eb]" : "px-[15.3px] py-[6.6px]"} text-[10.8px] font-bold uppercase leading-[14.4px] tracking-normal text-[#6b7280] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)]`}>
      {children}
    </span>
  );
}

function ToolkitSection() {
  return (
    <section id="toolkit" className={`${sectionSpacing} px-[18px] sm:px-[28px] pt-[28.8px] sm:pt-[43.2px] lg:px-[120px] lg:py-[40px]`}>
      <SectionTitle>MY CORE AI TOOLKIT</SectionTitle>
      <div className="mt-[28.8px] grid gap-[18px] sm:mt-[43.2px] lg:grid-cols-3 lg:gap-[21.6px]">
        {toolkit.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-49px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
            className={`group relative rounded-[14.4px] border border-[#d1d5db] bg-white p-[18px] ${shadowCard} cursor-default transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#a5c9ff] hover:shadow-[0px_19.8px_29.7px_-6.6px_rgba(165,201,255,0.22),0px_6.6px_9.9px_-5px_rgba(0,0,0,0.08)] sm:p-[22.5px]`}
          >
            <div className="flex size-[50.4px] items-center justify-center rounded-[11.7px] border border-[#d1d5db] bg-[#a5c9ff] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] [will-change:transform] [backface-visibility:hidden] transition-[transform,box-shadow] duration-200 ease-out group-hover:scale-[1.06] group-hover:shadow-[0px_5px_11.7px_-3.2px_rgba(165,201,255,0.52)]">
              <img alt="" src={`${A}${item.icon}`} className={`${item.iconClass} object-cover`} />
            </div>
            <h3 className="pt-[19.8px] font-space text-[19.8px] font-normal uppercase leading-[26.1px] tracking-normal text-[#1a1c1c]">
              {item.title}
            </h3>
            <div className="mt-[13.5px] flex flex-wrap gap-[6.6px]">
              {item.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}


function ModalSection({ title, children }) {
  return (
    <section className="mt-[21.6px] border-t border-[#e5e7eb] pt-[18px] sm:mt-[24.3px] sm:pt-[21.6px]">
      <h3 className="text-[9.9px] font-bold uppercase leading-[13.5px] tracking-[0.06em] text-[#6b7280]">
        {title}
      </h3>
      <div className="mt-[9.9px] text-[12.6px] leading-[20.7px] text-[#374151] [text-wrap:pretty] sm:text-[13.5px] sm:leading-[21.6px]">
        {children}
      </div>
    </section>
  );
}

function ProjectExpanded({ project, onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    let handler = null;
    const id = window.setTimeout(() => {
      handler = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
      };
      document.addEventListener("mousedown", handler);
    }, 150);
    return () => {
      window.clearTimeout(id);
      if (handler) document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const onScroll = () => {
      setIsScrollVisible(true);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrollVisible(false), 800);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const layoutTransition = shouldReduceMotion
    ? { duration: 0.15 }
    : { type: "spring", stiffness: 460, damping: 40, mass: 0.7 };

  const contentTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { delay: 0.11, duration: 0.18, ease: "easeOut" };

  return (
    <motion.div
      ref={panelRef}
      layoutId={`card-${project.id}`}
      className="absolute inset-0 z-30 flex flex-col overflow-hidden border border-[#d1d5db] bg-white shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.22),0px_8px_16px_-8px_rgba(0,0,0,0.1)]"
      style={{ borderRadius: 32, willChange: "transform" }}
      transition={layoutTransition}
      role="dialog"
      aria-modal="true"
      aria-labelledby="expanded-project-title"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project details"
        className="absolute right-[14.4px] top-[14.4px] z-20 flex size-[29.7px] items-center justify-center rounded-full border border-[#d1d5db] bg-white/95 text-[#4b5563] shadow-[0px_1.6px_6.6px_-1.6px_rgba(0,0,0,0.18)] outline-none transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#a5c9ff] hover:text-black focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:right-[18px] sm:top-[18px]"
      >
        <svg
          aria-hidden="true"
          className="size-[13.5px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      {/* gradient header — visible during layout morph for visual continuity */}
      <div
        className="relative h-[140px] flex-shrink-0 sm:h-[180px]"
        style={{ backgroundImage: project.gradient }}
      >
        {project.badge && (
          <span
            className={`absolute left-[18px] top-[18px] rounded-full border px-[13.5px] py-[5.8px] font-space text-[9.9px] font-bold uppercase leading-[13.5px] tracking-normal ${project.badgeClass} shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.05)] backdrop-blur-[1.6px] sm:left-[25.2px] sm:top-[25.2px]`}
          >
            {project.badge}
          </span>
        )}
      </div>

      {/* content — fades in after layout morph completes */}
      <motion.div
        ref={scrollRef}
        className="overflow-y-auto overscroll-contain flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.07 } }}
        transition={contentTransition}
      >
        <div className="px-[18px] py-[21.6px] sm:px-[28.8px] sm:py-[28.8px] lg:px-[36px]">
          <h2
            id="expanded-project-title"
            className="font-space text-[21.6px] font-normal uppercase leading-[27px] tracking-normal text-[#1a1c1c] sm:text-[27.9px] sm:leading-[34.2px]"
          >
            {project.title}
          </h2>
          <p className="mt-[10.8px] text-[13.5px] leading-[21.6px] text-[#4b5563] [text-wrap:pretty]">
            {project.description}
          </p>

          {project.metrics?.length > 0 && (
            <div className="mt-[16.2px] grid grid-cols-3 gap-[8.1px] sm:gap-[9.9px]">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-[10.8px] border border-[#e5e7eb] bg-[#f9fafb] px-[11.7px] py-[10.8px] shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.04)] sm:rounded-[11.7px] sm:px-[14.4px] sm:py-[13.5px]"
                >
                  <p className="text-[8.1px] font-bold uppercase leading-[10.8px] tracking-[0.04em] text-[#6b7280] sm:text-[9px] sm:leading-[11.7px]">
                    {m.label}
                  </p>
                  <p className="mt-[3.6px] font-space text-[16.2px] font-normal leading-[20.7px] text-[#1a1c1c] sm:mt-[5px] sm:text-[19.8px] sm:leading-[24.3px]">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <ModalSection title="How it was built">
            <p>{project.process}</p>
          </ModalSection>

          <ModalSection title="Tools used">
            <div className="flex flex-wrap gap-[6.6px]">
              {project.tools.map((tool) => (
                <Pill key={tool} small>
                  {tool}
                </Pill>
              ))}
            </div>
          </ModalSection>

          <ModalSection title="Results">
            <p>{project.results}</p>
          </ModalSection>

          <ModalSection title="Observations">
            <p>{project.observations}</p>
          </ModalSection>
        </div>
      </motion.div>

      <ExpandedScrollbar containerRef={scrollRef} visible={isScrollVisible} />
    </motion.div>
  );
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      project: projects[0],
      Icon: LightningBoltIcon,
      className: "col-span-3 lg:col-span-2",
      background: (
        <>
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04] [mask-image:linear-gradient(to_top,transparent_25%,#000_75%)]"
            style={{ backgroundImage: projects[0].gradient }}
          />
          <span className="absolute left-4 top-4 rounded-full border border-[#1f2937] bg-black px-3 py-1.5 font-space text-[9px] font-bold uppercase leading-tight text-white shadow-[0px_0.9px_1.6px_0px_rgba(0,0,0,0.05)]">
            PRODUCTION
          </span>
          <div className="absolute right-4 top-14 flex flex-col gap-2">
            {projects[0].metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="rounded-xl border border-black/10 bg-white/75 px-3 py-2 text-right shadow-sm backdrop-blur-sm">
                <div className="font-space text-[18px] leading-tight text-[#1a1c1c]">{m.value}</div>
                <div className="text-[9px] font-bold uppercase text-[#6b7280]">{m.label}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      project: projects[1],
      Icon: MagicWandIcon,
      className: "col-span-3 lg:col-span-1",
      background: (
        <>
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04] [mask-image:linear-gradient(to_top,transparent_25%,#000_75%)]"
            style={{ backgroundImage: projects[1].gradient }}
          />
          <span className="absolute right-4 top-4 rounded-full border border-[#d1d5db] bg-white/95 px-3 py-1.5 font-space text-[9px] font-bold uppercase leading-tight text-black shadow-sm">
            BETA
          </span>
        </>
      ),
    },
    {
      project: projects[2],
      Icon: MagnifyingGlassIcon,
      className: "col-span-3 lg:col-span-1",
      background: (
        <>
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04] [mask-image:linear-gradient(to_top,transparent_25%,#000_75%)]"
            style={{ backgroundImage: projects[2].gradient }}
          />
          {/* LIVE badge */}
          <span className="absolute left-4 top-4 rounded-full border border-[#86efac] bg-white/95 px-3 py-1.5 font-space text-[9px] font-bold uppercase leading-tight text-[#166534] shadow-sm">
            LIVE
          </span>
        </>
      ),
    },
    {
      project: projects[3],
      Icon: TargetIcon,
      className: "col-span-3 lg:col-span-2",
      background: (
        <>
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04] [mask-image:linear-gradient(to_top,transparent_25%,#000_75%)]"
            style={{ backgroundImage: projects[3].gradient }}
          />
          <span className="absolute right-4 top-4 rounded-full border border-[#d1d5db] bg-white/95 px-3 py-1.5 font-space text-[9px] font-bold uppercase leading-tight text-black shadow-sm">
            INTERNAL
          </span>
          <div className="absolute right-4 top-14 flex flex-col gap-2">
            {projects[3].metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="rounded-xl border border-black/10 bg-white/75 px-3 py-2 text-right shadow-sm backdrop-blur-sm">
                <div className="font-space text-[18px] leading-tight text-[#1a1c1c]">{m.value}</div>
                <div className="text-[9px] font-bold uppercase text-[#6b7280]">{m.label}</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <section id="projects" className={`${sectionSpacing} px-[18px] sm:px-[28px] pt-[28.8px] sm:pt-[43.2px] lg:px-[120px] lg:py-[40px]`}>
      <div className="flex flex-col gap-[14.4px] border-b border-[#d1d5db] pb-[22.5px] sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle>SELECTED PROJECTS</SectionTitle>
        <a href="#projects" className="flex shrink-0 items-center gap-[7.4px] text-center text-[12.6px] font-bold uppercase leading-[18px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white">
          VIEW ALL
          <img alt="" src={`${A}arrow-right.svg`} className="size-[14.4px]" />
        </a>
      </div>
      <div className="relative mt-[28.8px] sm:mt-[43.2px]">
        <BentoGrid className={selectedProject ? "pointer-events-none" : ""}>
          {features.map(({ project, Icon, className, background }) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <motion.div
                key={project.id}
                className={className}
                animate={{
                  opacity: selectedProject
                    ? isSelected ? 0 : 0.2
                    : 1,
                }}
                transition={
                  shouldReduceMotion || isSelected
                    ? { duration: 0 }
                    : { duration: 0.16, ease: "easeOut" }
                }
              >
                {isSelected ? (
                  <div className="h-full" aria-hidden="true" />
                ) : (
                  <motion.div
                    layoutId={`card-${project.id}`}
                    style={{ height: "100%", borderRadius: 18, willChange: "transform" }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.15 }
                        : { type: "spring", stiffness: 460, damping: 40, mass: 0.7 }
                    }
                  >
                    <BentoCard
                      name={project.title}
                      description={project.summary}
                      Icon={Icon}
                      background={background}
                      className="h-full"
                      onClick={() => setSelectedProject(project)}
                      cta="See more"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </BentoGrid>

        <AnimatePresence>
          {selectedProject && (
            <ProjectExpanded
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className={`${sectionSpacing} px-[18px] sm:px-[28px] pt-[28.8px] sm:pt-[43.2px] lg:px-[120px] lg:py-[40px]`}>
      <SectionTitle>SKILLS</SectionTitle>
      <div className="mt-[28.8px] grid gap-[21.6px] sm:mt-[43.2px] md:grid-cols-2 lg:grid-cols-4 lg:gap-[28.8px]">
        {skills.map((column) => (
          <article key={column.title} className={`h-full min-h-[234px] rounded-[14.4px] ${border} bg-white p-[21.6px] ${shadowCard} sm:p-[29.7px] lg:min-h-[373.5px]`}>
            <h3 className="border-b border-[#d1d5db] pb-[15.3px] text-[12.6px] font-bold uppercase leading-[18px] tracking-normal text-[#111827]">
              {column.title}
            </h3>
            <div className="mt-[21.6px] flex flex-col gap-[18px]">
              {column.items.map(([icon, label, sizeClass, gapClass]) => (
                <div key={icon} className={`flex items-center ${gapClass}`}>
                  <img alt="" src={`${A}${icon}`} loading="lazy" className={`${sizeClass} shrink-0 object-cover`} />
                  <span className="text-[14.4px] leading-[21.6px] text-[#4b5563]">{label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationCard({ title, school, icon, iconClass, date, variants }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.article
      variants={variants}
      whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
      className={`flex items-center justify-between gap-[14px] rounded-[14.4px] ${border} bg-white p-[16px] ${shadowCard} cursor-default transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#a5c9ff] hover:shadow-[0px_16px_28px_-8px_rgba(165,201,255,0.22),0px_5px_8px_-4px_rgba(0,0,0,0.07)] sm:p-[22px]`}
    >
      <div className="min-w-0">
        <h3 className="font-space text-[17px] font-normal leading-[23px] tracking-normal text-[#1a1c1c] sm:text-[19px] sm:leading-[25px] lg:text-[17px] lg:leading-[23px] xl:text-[19px] xl:leading-[25px]">
          {title}
        </h3>
        <p className="mt-[5px] text-[13px] font-medium leading-[19px] text-[#111827]">{school}</p>
        <p className="mt-[4px] text-[11.7px] leading-[17px] text-[#6b7280]">{date}</p>
      </div>
      <div className="flex h-[48px] w-[56px] shrink-0 items-center justify-center overflow-visible sm:w-[64px]">
        <img alt="" src={`${A}${icon}`} loading="lazy" className={`${iconClass} object-contain`} />
      </div>
    </motion.article>
  );
}

function EducationSection() {
  const shouldReduceMotion = useReducedMotion();

  const leftCardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : { hidden: { opacity: 0, x: -10, y: 12 }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } } };

  const rightCardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : { hidden: { opacity: 0, x: 10, y: 12 }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section id="education" className={`${sectionSpacing} px-[18px] sm:px-[28px] pb-[21.6px] pt-[28.8px] sm:pt-[43.2px] lg:px-[120px] lg:py-[40px]`}>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: shouldReduceMotion ? 0.3 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionTitle>EDUCATION</SectionTitle>
      </motion.div>
      <div className="relative mt-[28.8px] grid gap-[18px] sm:mt-[43.2px] lg:grid-cols-2 lg:gap-[24px]">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#d1d5db] lg:block" />
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-[14px] lg:gap-[16px] lg:pr-[14.4px]"
        >
          {educationLeft.map(([title, school, icon, iconClass, date]) => (
            <EducationCard key={title} title={title} school={school} icon={icon} iconClass={iconClass} date={date} variants={leftCardVariants} />
          ))}
        </motion.div>
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-[14px] lg:gap-[16px] lg:pl-[14.4px] lg:pt-[56px]"
        >
          {educationRight.map(([title, school, icon, iconClass, date]) => (
            <EducationCard key={title} title={title} school={school} icon={icon} iconClass={iconClass} date={date} variants={rightCardVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContactCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact" className={`${sectionSpacing} px-[18px] sm:px-[28px] lg:px-[120px]`}>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.975 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: shouldReduceMotion ? 0.3 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[24px] border border-[#d1d5db] bg-white px-[28px] py-[48px] shadow-[0px_20.7px_40.5px_-9.9px_rgba(0,0,0,0.18)] sm:px-[48px] sm:py-[56px] lg:flex lg:items-center lg:justify-between lg:px-[64px] lg:py-[60px]"
        style={{ backgroundImage: "linear-gradient(161.91deg, rgba(165,201,255,0.12) 0%, rgba(165,201,255,0) 100%)" }}
      >
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <h2 className="font-space text-[32px] font-normal uppercase leading-[1.05] tracking-normal text-[#111827] sm:text-[44px] lg:text-[52px]">
            LET&apos;S BUILD
            <br />
            SOMETHING
          </h2>
          <span className="mt-[6px] inline-block rounded-[4px] border border-[rgba(165,201,255,0.3)] bg-[rgba(165,201,255,0.4)] px-[10px] py-[6px] font-space text-[32px] font-normal uppercase leading-[1.05] tracking-normal text-[#111827] sm:text-[44px] lg:text-[52px]">
            QUIETLY USEFUL.
          </span>
        </motion.div>

        <div className="hidden h-[80px] w-px shrink-0 bg-[#9ca3af] lg:mx-[56px] lg:block" />

        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.32, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-[32px] shrink-0 lg:mt-0"
        >
          <p className="text-[9px] font-bold uppercase leading-[13.5px] tracking-[0.08em] text-[#6b7280]">CONTACT ME:</p>
          <div className="mt-[14px] flex gap-[10px]">
            {contactActions.map(([icon, label, href, external]) => (
              <motion.a
                key={icon}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
                className={`group flex size-[46px] items-center justify-center rounded-[11px] border border-[#e5e7eb] bg-[#f9fafb] p-px ${shadowSoft} transition-[border-color,box-shadow] duration-200 hover:border-[#a5c9ff] hover:shadow-[0px_6px_14px_-6px_rgba(165,201,255,0.5)]`}
              >
                <img
                  alt=""
                  src={`${A}${icon}`}
                  className={icon === "mail.svg" ? "h-[12.6px] w-[14.4px]" : "size-[15.3px]"}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-[18px] mt-[93.6px] flex min-h-[112.5px] flex-col gap-6 border-t border-[#d1d5db] bg-white px-0 pb-[43.2px] pt-[36px] shadow-[0px_0.9px_0.9px_rgba(0,0,0,0.05)] sm:mx-[28px] lg:mx-0 lg:mt-[144px] lg:min-h-[120px] lg:flex-row lg:items-center lg:justify-center lg:px-[120px] lg:py-[20px]">
      <a href="#top" className="font-space text-[18px] font-black uppercase leading-[25.2px] tracking-normal text-[#111827]">
        ARTHUR
      </a>
      <nav className="flex flex-wrap justify-start gap-[28.8px] lg:justify-center">
        {Object.entries(socialLinks).map(([item, href]) => {
          const external = href.startsWith("http");
          return (
            <a
              key={item}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="font-space text-[10.8px] font-medium uppercase leading-[14.4px] tracking-normal text-[#4b5563]"
            >
              {item}
            </a>
          );
        })}
      </nav>
      <p className="text-left font-space text-[10.8px] font-medium uppercase leading-[14.4px] tracking-normal text-[#6b7280] lg:text-right">
        &copy; 2026 Arthur Chequer.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-white">
      <PageScrollbar />
      <Nav />
      <main className="mx-auto w-full max-w-[1080px]">
        <Hero />
        <ToolkitSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ContactCta />
        <Footer />
      </main>
    </div>
  );
}
