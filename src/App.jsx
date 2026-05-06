import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot } from "./components/animate-ui/icons/bot";
import ColorBends from "./components/ColorBends";
import { DownloadIcon } from "./components/ui/download-icon";
import { useBotEyeOffset } from "./hooks/use-bot-eye-offset";

const A = "/assets/";
const contactHref = "#contact";
const cvHref = "/assets/arthur-chequer-cv.pdf";
const socialLinks = {
  LINKEDIN: contactHref,
  GITHUB: contactHref,
  TWITTER: contactHref,
  EMAIL: contactHref,
};
const contactActions = [
  ["terminal.svg", "Project details", "#projects"],
  ["share.svg", "Share portfolio", "#top"],
  ["mail.svg", "Email Arthur", contactHref],
];

const shadowCard =
  "shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]";
const shadowSoft = "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";
const border = "border border-[#d1d5db]";
const pagePadding = "px-[22px] sm:px-[35px] lg:px-[53px]";
const sectionSpacing = "mt-[114px] sm:mt-[141px] lg:mt-[176px]";
const chatLayoutTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
};

const toolkit = [
  {
    title: "PYTHON",
    icon: "python-brand.png",
    iconClass: "size-[41px]",
    tags: ["PANDAS", "NUMPY", "FASTAPI"],
  },
  {
    title: "LANGCHAIN",
    icon: "langchain-brand.png",
    iconClass: "size-[41px]",
    tags: ["AGENTS", "RAG", "VECTOR DBS"],
  },
  {
    title: "HUGGING FACE",
    icon: "huggingface-brand.png",
    iconClass: "h-[59px] w-[58px]",
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
    title: "RAG KNOWLEDGE BASE",
    badge: null,
    badgeClass: "",
    gradient:
      "linear-gradient(33deg, rgb(165, 201, 255) 0%, rgb(255, 255, 255) 100%)",
    summary:
      "Hybrid retrieval tuned per document family for enterprise corpora.",
    description:
      "Enterprise-grade document retrieval system using advanced chunking strategies and hybrid search (BM25 + Dense Vectors) for highly accurate contextual answers.",
    tools: ["PINECONE", "LLAMAINDEX", "DOCKER"],
    process:
      "Profiled the corpus into document families, then matched each family to a chunking strategy (semantic, recursive, or table-aware). Hybrid retrieval combines BM25 with dense embeddings, fused via reciprocal rank.",
    results:
      "Top-3 retrieval recall climbed from 71% to 93% on the internal eval set; downstream answer faithfulness improved from 82% to 96%.",
    observations:
      "Chunking is not a hyperparameter — it is a modeling decision. Treating each document family separately produced larger gains than swapping embedding models.",
    metrics: [
      { label: "Recall@3", value: "93%" },
      { label: "Faithfulness", value: "96%" },
      { label: "Index size", value: "1.2M" },
    ],
  },
  {
    id: "prompt-eval-harness",
    title: "PROMPT EVAL HARNESS",
    badge: "INTERNAL",
    badgeClass: "bg-white/95 text-black border-[#d1d5db]",
    gradient:
      "linear-gradient(112deg, rgb(165, 201, 255) 0%, rgb(243, 244, 246) 60%, rgb(255, 255, 255) 100%)",
    summary:
      "CI-friendly evaluation pipeline that scores every prompt change.",
    description:
      "An evaluation harness that runs prompt regression tests on every commit, tracking pass-rate, latency and cost across providers in a single dashboard.",
    tools: ["PYTHON", "PYTEST", "OPENAI", "ANTHROPIC", "W&B"],
    process:
      "Treats prompts as versioned artifacts paired with golden datasets. Each PR runs the harness against a frozen test slice; results are pushed to W&B and surfaced as a GitHub status check that blocks merges on regressions.",
    results:
      "Caught 14 silent regressions in the first quarter of use, including one that would have shipped a 12% drop in answer quality on a critical flow.",
    observations:
      "Treating evaluation as a build step — not a notebook — was the cultural shift that mattered. The infra is small; the discipline is large.",
    metrics: [
      { label: "Regressions caught", value: "14" },
      { label: "Avg run time", value: "92s" },
      { label: "Providers", value: "3" },
    ],
  },
];

const skills = [
  {
    title: "AI / ML FRAMEWORKS",
    items: [
      ["pytorch.png", "PyTorch", "h-[21px] w-[18px]", "gap-4"],
      ["keras.png", "Keras", "size-4", "gap-4"],
      ["huggingface-small.png", "Hugging Face", "size-6 rounded-[11px]", "gap-[10px]"],
      ["langchain-small.png", "LangChain", "size-5", "gap-4"],
      ["langgraph.png", "LangGraph", "size-5", "gap-4"],
      ["scikit.png", "scikit-learn", "h-[15px] w-[29px]", "gap-[10px]"],
      ["opencv.png", "openCV", "size-5", "gap-4"],
    ],
  },
  {
    title: "LANGUAGES",
    items: [
      ["python-mini.png", "Python", "size-[19px]", "gap-4"],
      ["sql.png", "SQL", "h-5 w-[20px]", "gap-4"],
    ],
  },
  {
    title: "DEVOPS",
    items: [
      ["mlflow.png", "MLFlow", "size-[20px]", "gap-4"],
      ["wandb.png", <>Weights &amp; Biases<br />(W&amp;B)</>, "size-4", "gap-4"],
      ["github.png", "GitHub", "size-4", "gap-4"],
    ],
  },
  {
    title: "BACK-END",
    items: [
      ["fastapi.png", "FastAPI", "size-[20px]", "gap-4"],
      ["chroma.png", "Chroma", "h-[21px] w-6", "gap-[10px]"],
    ],
  },
];

const educationLeft = [
  ["AI & ML Engineering", "Microsoft", "microsoft.png", "size-[53px]"],
  ["Azure Fundamentals (AZ-900)", "Microsoft", "az900.png", "size-[64px]"],
  ["Data Analytics Certificate", "Google", "google-data.png", "h-[64px] w-[67px]"],
  ["Dale Carnegie Training", "Dale Carnegie", "dale.png", "h-[46px] w-[79px]"],
];

const educationRight = [
  ["Cyber Defense", "FIAP", "fiap.png", "size-[62px] rounded-[11px]"],
  ["MBA - IA, Data Science e Big Data", "Ibmec", "ibmec.png", "size-[62px] rounded-[11px]"],
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
    <header className="pointer-events-none fixed inset-x-0 top-[15px] z-50 px-[13px] sm:top-[20px] sm:px-[22px]">
      <div
        className={`nav-shell nav-float-in pointer-events-auto mx-auto flex h-[64px] w-full items-center justify-between rounded-full border px-[10px] pl-[20px] transition-[max-width,background-color,border-color,box-shadow] duration-[440ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[79px] sm:px-[13px] sm:pl-[31px] ${
          isScrolled
            ? "max-w-[858px] border-[#d1d5db] bg-white/92 shadow-[0px_18px_45px_-24px_rgba(17,24,39,0.42)] backdrop-blur-[20px]"
            : "max-w-[1285px] border-[#e5e7eb] bg-white/78 shadow-[0px_10px_30px_-26px_rgba(17,24,39,0.34)] backdrop-blur-[15px]"
        }`}
      >
        <a
          href="#top"
          className="rounded-full font-space text-[18px] font-black uppercase leading-[24px] tracking-normal text-black outline-none transition-[color,transform] duration-300 ease-out hover:text-[#1f2937] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:text-[23px] sm:leading-[31px]"
        >
          AI_ENGINEER
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center rounded-full border border-[#e5e7eb] bg-[#f9fafb]/80 p-[6px] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:flex"
        >
          {navItems.map(({ label, id }) => {
            const isActive = activeSection === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-[21px] py-[11px] font-space text-[13px] font-bold uppercase leading-[20px] tracking-normal outline-none transition-[background-color,color,box-shadow,transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] ${
                  isActive
                    ? "bg-white text-black shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08)]"
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
          className="rounded-full border border-[#8fbaff] bg-[#a5c9ff] px-[13px] py-[10px] text-center font-space text-[12px] font-bold uppercase leading-[18px] tracking-normal text-black shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_14px_24px_-20px_rgba(17,24,39,0.55)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:px-[26px] sm:py-[14px] sm:text-[13px] sm:leading-[20px]"
        >
          CONTACT ME
        </a>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto mx-auto mt-[9px] flex w-fit max-w-[calc(100vw-26px)] items-center gap-[4px] rounded-full border border-[#e5e7eb] bg-white/92 p-[6px] shadow-[0px_10px_30px_-24px_rgba(17,24,39,0.38)] backdrop-blur-[15px] md:hidden"
      >
        {navItems.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-[13px] py-[9px] font-space text-[11px] font-bold uppercase leading-[15px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:bg-[#f9fafb] hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
    <section className="relative left-1/2 mt-[191px] min-h-[682px] w-screen -translate-x-1/2 overflow-hidden py-[53px] [contain:layout_style] sm:mt-[207px] sm:py-[70px] md:mt-[145px] lg:mt-[194px] lg:py-[79px]">
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
      <div className={`mx-auto grid w-full max-w-[1320px] gap-[53px] ${pagePadding} lg:min-h-[572px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,660px)] lg:items-center lg:gap-[70px]`}>
        <div className="flex max-w-[616px] flex-col items-start gap-[31px] self-center lg:max-w-none">
          <h1 className="font-space text-[62px] font-normal leading-[0.95] tracking-normal text-[#1a1c1c] sm:text-[84px] lg:text-[106px]">
            Hi, I&apos;m
            <br />
            Arthur.
          </h1>
          <p className="max-w-[48ch] text-[18px] font-normal leading-[30px] text-[#4b5563] [text-wrap:pretty] sm:text-[19px] sm:leading-[31px]">
            A pragmatic <strong>AI Engineer</strong> with 1 year of hands-on experience building autonomous agents, robust LLM pipelines, and scalable backend infrastructure. Focused on creating quietly useful tools.
          </p>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-[13px] pt-[9px] lg:pt-[18px]">
            <a
              href={cvHref}
              download
              onMouseEnter={() => downloadIconRef.current?.startAnimation()}
              onMouseLeave={() => downloadIconRef.current?.stopAnimation()}
              className={`group flex min-h-[62px] w-full min-w-[180px] items-center justify-center gap-[11px] rounded-[13px] ${border} bg-[#a5c9ff] px-[31px] py-[19px] text-center text-[15px] font-bold uppercase leading-[22px] tracking-normal text-[#1a1c1c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_14px_24px_-20px_rgba(17,24,39,0.45)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:w-auto`}
            >
              Download CV
              <DownloadIcon ref={downloadIconRef} size={20} duration={0.9} className="shrink-0" />
            </a>
            <a href="#toolkit" className="group flex items-center gap-[9px] text-[13px] font-normal uppercase leading-[18px] tracking-normal text-[#6b7280] outline-none transition-[color,transform] duration-200 hover:text-[#1a1c1c] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white">
              Scroll down to explore more
              <svg
                aria-hidden="true"
                className="size-[17px] shrink-0 transition-transform duration-200 group-hover:translate-y-[2px]"
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

function ChatWidget() {
  const [activeTab, setActiveTab] = useState("About");
  const [messages, setMessages] = useState(initialChatMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isResetSpinning, setIsResetSpinning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResetExiting, setIsResetExiting] = useState(false);
  const [shouldHopAvatar, setShouldHopAvatar] = useState(false);
  const messagesRef = useRef(null);
  const typingTimerRef = useRef(null);
  const resetCommitTimerRef = useRef(null);
  const resetEndTimerRef = useRef(null);
  const resetExitTimerRef = useRef(null);
  const hopTimerRef = useRef(null);
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

  useEffect(() => {
    return () => {
      window.clearTimeout(typingTimerRef.current);
      window.clearTimeout(resetCommitTimerRef.current);
      window.clearTimeout(resetEndTimerRef.current);
      window.clearTimeout(hopTimerRef.current);
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
    window.clearTimeout(hopTimerRef.current);
    setShouldHopAvatar(true);
    hopTimerRef.current = window.setTimeout(() => setShouldHopAvatar(false), 420);
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "agent",
          text: getAgentReply(cleanDraft, tab),
          animateBot: true,
        },
      ]);
      setIsTyping(false);
    }, botReplyDelay);
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
    if (isResetting) {
      return;
    }

    window.clearTimeout(typingTimerRef.current);
    window.clearTimeout(resetCommitTimerRef.current);
    window.clearTimeout(resetEndTimerRef.current);
    window.clearTimeout(resetExitTimerRef.current);
    window.clearTimeout(hopTimerRef.current);

    setIsResetting(true);
    setShouldHopAvatar(false);
    setIsResetSpinning(true);
    setIsResetExiting(false);
    setIsTyping(false);
    resetCommitTimerRef.current = window.setTimeout(() => {
      setActiveTab("About");
      setMessages(initialChatMessages);
      setDraft("");
    }, 180);

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
      className={`flex h-[572px] min-w-0 flex-col overflow-hidden rounded-[22px] ${border} bg-white/72 p-px ${shadowCard} backdrop-blur-[11px] sm:rounded-[26px] lg:h-[550px] lg:w-full`}
    >
      <div className="relative z-20 min-h-[78px] shrink-0 border-b border-[#d1d5db] bg-white/[.97] px-[16px] py-[18px] backdrop-blur-[7px] sm:px-[20px] sm:py-[20px]">
        <div className="flex h-full items-center gap-[8px] sm:gap-[16px]">
          {chatTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className="cursor-pointer rounded-[8px] border border-[#e5e7eb] bg-white px-[12px] py-[8px] text-center text-[13px] font-medium leading-[18px] tracking-normal text-[#6b7280] shadow-[0px_1px_1px_rgba(0,0,0,0.03)] outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-[#a5c9ff] hover:bg-[#a5c9ff] hover:text-black hover:shadow-[0px_8px_18px_-16px_rgba(17,24,39,0.45)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] sm:px-[18px]"
              type="button"
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto hidden h-[38px] items-center gap-[12px] sm:flex">
            <button
              type="button"
              onClick={resetChat}
              aria-label="Reset conversation"
              disabled={isResetting}
              className="group relative mr-[4px] flex size-[28px] items-center justify-center rounded-full border border-[#d1d5db] bg-white text-[#6b7280] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors duration-200 hover:border-[#a5c9ff] hover:text-black disabled:cursor-wait disabled:border-[#a5c9ff] disabled:text-black"
            >
              <svg
                aria-hidden="true"
                className={`size-[14px] ${isResetSpinning ? "reset-spin-clockwise" : ""}`}
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
              <span className="pointer-events-none absolute left-1/2 top-[37px] z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[9px] border border-[#d1d5db] bg-white px-[11px] py-[8px] text-[12px] font-medium leading-[15px] tracking-normal text-[#4b5563] opacity-0 shadow-[0px_14px_24px_-10px_rgba(17,24,39,0.22),0px_4px_8px_-6px_rgba(17,24,39,0.18)] transition-all duration-150 before:absolute before:left-1/2 before:top-[-6px] before:size-[10px] before:-translate-x-1/2 before:rotate-45 before:border-l before:border-t before:border-[#d1d5db] before:bg-white group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Reset chat
              </span>
            </button>
            <span className="agent-active-dot size-[11px] rounded-full bg-[#22c55e]" />
            <span className="whitespace-nowrap text-[11px] font-medium uppercase leading-[15px] tracking-normal text-[#6b7280]">
              AGENT ACTIVE
            </span>
          </div>
        </div>
      </div>
      <div
        ref={messagesRef}
        className={`chat-messages-surface relative z-0 min-h-0 flex-1 space-y-[18px] overflow-y-auto px-[16px] py-[20px] sm:px-[28px] sm:py-[24px] ${isResetting ? "chat-resetting" : ""}`}
      >
        {messages.map((message, index) =>
          message.role === "agent" ? (
            <motion.div
              key={`${message.role}-${index}`}
              layout
              transition={{ layout: chatLayoutTransition }}
              className={`chat-message-in chat-agent-row ${index === lastAgentMessageIndex && !isTyping ? "chat-agent-row-current" : ""}`}
            >
              {index === lastAgentMessageIndex && !isTyping ? (
                <AgentAvatar animateBot={message.animateBot} eyeX={eyeX} eyeY={eyeY} />
              ) : null}
              <motion.div
                layout
                transition={{ layout: chatLayoutTransition }}
                className={`chat-agent-bubble rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] ${border} bg-[#f9fafb] px-[14px] py-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:px-[18px] sm:py-[15px]`}
              >
                <p className="text-[15px] leading-[24px] text-[#374151]">{message.text}</p>
              </motion.div>
            </motion.div>
          ) : (
            <div key={`${message.role}-${index}`} className="chat-message-in flex justify-end">
              <div className="max-w-[82%] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] border border-black bg-black px-[16px] py-[14px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:max-w-[409px] sm:px-[18px] sm:py-[16px]">
                <p className="text-[15px] leading-[24px] text-white">{message.text}</p>
              </div>
            </div>
          ),
        )}
        {isTyping && (
          <motion.div
            layout
            transition={{ layout: chatLayoutTransition }}
            className="chat-message-in chat-agent-row chat-agent-row-current chat-typing-row"
          >
            <AgentAvatar animateEntrance={shouldHopAvatar} eyeX={eyeX} eyeY={eyeY} />
            <motion.div
              layout
              transition={{ layout: chatLayoutTransition }}
              className="chat-typing-indicator flex h-[36px] items-center gap-[6px] sm:h-[40px]"
            >
              <span className="typing-dot" />
              <span className="typing-dot animation-delay-150" />
              <span className="typing-dot animation-delay-300" />
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="h-[98px] shrink-0 border-t border-[#d1d5db] bg-white/[.97] px-[16px] pb-[20px] pt-[21px] backdrop-blur-[7px] sm:px-[20px]">
        <form className="flex h-[57px] items-center gap-[12px]" onSubmit={sendMessage}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={`h-[57px] min-w-0 flex-1 appearance-none rounded-[12px] ${border} bg-[#f9fafb] px-[22px] text-[16px] font-light leading-normal text-[#1f2937] outline-none ${shadowSoft} placeholder:font-light placeholder:text-[#9ca3af] focus:border-[#a5c9ff] ${isResetting ? "reset-input-pulse" : isResetExiting ? "reset-input-exit" : ""}`}
            placeholder={isResetting ? "Resetting chat..." : "Ask the agent..."}
            aria-label="Ask the agent"
            disabled={isResetting}
          />
          <button
            className="flex h-[57px] w-[56px] shrink-0 items-center justify-center rounded-[12px] border border-black bg-black shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:w-[69px]"
            type="submit"
            aria-label="Send message"
            disabled={!draft.trim() || isTyping || isResetting}
          >
            <img alt="" src={`${A}send-icon.svg`} className="h-[16px] w-[19px]" />
          </button>
        </form>
      </div>
    </div>
  );
}

function AgentAvatar({ animateEntrance = false, animateBot = false, eyeX, eyeY }) {
  return (
    <div className="size-[52px] shrink-0 sm:size-[60px]" aria-hidden="true" onMouseDown={e => e.preventDefault()}>
      <div className={`${animateEntrance ? "agent-avatar-hop" : ""} flex size-full items-center justify-center rounded-full ${border} bg-[#a5c9ff] p-px shadow-[0px_1px_1px_rgba(0,0,0,0.05)]`}>
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
    <h2 className="font-space text-[37px] font-normal uppercase leading-[42px] tracking-normal text-[#111827] [text-wrap:balance] sm:text-[44px] sm:leading-[46px] lg:text-[53px] lg:leading-[53px]">
      {children}
    </h2>
  );
}

function Pill({ children, small = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border border-[#d1d5db] bg-[#f9fafb] ${small ? "px-[10px] py-[6px] rounded-[4px] border-[#e5e7eb]" : "px-[19px] py-[8px]"} text-[13px] font-bold uppercase leading-[18px] tracking-normal text-[#6b7280] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]`}>
      {children}
    </span>
  );
}

function ToolkitSection() {
  return (
    <section id="toolkit" className={`${sectionSpacing} ${pagePadding} pt-[35px] sm:pt-[53px] lg:pt-[70px]`}>
      <SectionTitle>MY CORE AI TOOLKIT</SectionTitle>
      <div className="mt-[35px] grid gap-[22px] sm:mt-[53px] lg:grid-cols-3 lg:gap-[26px]">
        {toolkit.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
            className={`group relative rounded-[18px] border border-[#d1d5db] bg-white p-[22px] ${shadowCard} cursor-default transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#a5c9ff] hover:shadow-[0px_24px_36px_-8px_rgba(165,201,255,0.22),0px_8px_12px_-6px_rgba(0,0,0,0.08)] sm:p-[28px]`}
          >
            <div className="flex size-[62px] items-center justify-center rounded-[14px] border border-[#d1d5db] bg-[#a5c9ff] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] [will-change:transform] [backface-visibility:hidden] transition-[transform,box-shadow] duration-200 ease-out group-hover:scale-[1.06] group-hover:shadow-[0px_6px_14px_-4px_rgba(165,201,255,0.52)]">
              <img alt="" src={`${A}${item.icon}`} className={`${item.iconClass} object-cover`} />
            </div>
            <h3 className="pt-[24px] font-space text-[24px] font-normal uppercase leading-[32px] tracking-normal text-[#1a1c1c]">
              {item.title}
            </h3>
            <div className="mt-[16px] flex flex-wrap gap-[8px]">
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

function ProjectCard({ project, variant, index, className = "", onOpen }) {
  const isFeatured = variant === "featured";
  const isHorizontal = variant === "horizontal";

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.24, ease: "easeOut" } }}
      className={`group relative flex h-full overflow-hidden rounded-[22px] border border-[#d1d5db] bg-white text-left ${shadowCard} cursor-pointer outline-none transition-[border-color,box-shadow] duration-200 ease-out hover:border-[#a5c9ff] hover:shadow-[0px_28px_42px_-12px_rgba(165,201,255,0.32),0px_10px_20px_-12px_rgba(0,0,0,0.18)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white ${
        isHorizontal ? "flex-col md:flex-row" : "flex-col"
      } ${className}`}
      aria-label={`Open ${project.title} details`}
    >
      <div
        className={`relative shrink-0 overflow-hidden ${
          isHorizontal
            ? "h-[180px] md:h-auto md:w-[44%]"
            : isFeatured
              ? "h-[240px] sm:h-[280px] lg:h-[340px]"
              : "h-[180px] sm:h-[200px]"
        }`}
      >
        <div
          className="absolute inset-0 [will-change:transform] [backface-visibility:hidden] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          style={{ backgroundImage: project.gradient }}
        />
        {project.badge && (
          <span
            className={`absolute right-[16px] top-[16px] rounded-full border px-[14px] py-[6px] font-space text-[11px] font-bold uppercase leading-[15px] tracking-normal ${project.badgeClass} shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[2px] sm:right-[20px] sm:top-[20px]`}
          >
            {project.badge}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-[16px] left-[16px] flex translate-y-2 items-center gap-[8px] rounded-full border border-[#d1d5db] bg-white/95 px-[14px] py-[7px] font-space text-[11px] font-bold uppercase leading-[15px] tracking-normal text-black opacity-0 shadow-[0px_8px_18px_-8px_rgba(0,0,0,0.28)] backdrop-blur-[6px] transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-[20px] sm:left-[20px]">
          See more about
          <svg
            aria-hidden="true"
            className="size-[12px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
          </svg>
        </span>
      </div>
      <div
        className={`flex min-w-0 flex-1 flex-col p-[22px] sm:p-[26px] ${
          isFeatured ? "lg:p-[32px]" : ""
        }`}
      >
        <h3
          className={`font-space font-normal uppercase tracking-normal text-[#1a1c1c] ${
            isFeatured
              ? "text-[26px] leading-[32px] sm:text-[30px] sm:leading-[38px] lg:text-[34px] lg:leading-[42px]"
              : "text-[22px] leading-[28px] sm:text-[24px] sm:leading-[32px]"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-[12px] text-[#4b5563] [text-wrap:pretty] ${
            isFeatured || isHorizontal
              ? "text-[16px] leading-[26px] lg:text-[17px] lg:leading-[28px]"
              : "text-[15px] leading-[24px]"
          }`}
        >
          {isFeatured || isHorizontal ? project.description : project.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-[8px] pt-[20px]">
          {project.tools.slice(0, isFeatured ? 5 : 3).map((tool) => (
            <Pill key={tool} small>
              {tool}
            </Pill>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function ModalSection({ title, children }) {
  return (
    <section className="mt-[26px] border-t border-[#e5e7eb] pt-[22px] sm:mt-[30px] sm:pt-[26px]">
      <h3 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.06em] text-[#6b7280]">
        {title}
      </h3>
      <div className="mt-[12px] text-[15px] leading-[25px] text-[#374151] [text-wrap:pretty] sm:text-[16px] sm:leading-[26px]">
        {children}
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] sm:p-[26px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[10px]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[22px] border border-[#d1d5db] bg-white shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-[18px] top-[18px] z-20 flex size-[36px] items-center justify-center rounded-full border border-[#d1d5db] bg-white/95 text-[#4b5563] shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.18)] outline-none transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#a5c9ff] hover:text-black focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:right-[22px] sm:top-[22px]"
        >
          <svg
            aria-hidden="true"
            className="size-[16px]"
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
        <div className="overflow-y-auto">
          <div className="relative h-[200px] sm:h-[260px] lg:h-[300px]">
            <div className="absolute inset-0" style={{ backgroundImage: project.gradient }} />
            {project.badge && (
              <span
                className={`absolute left-[22px] top-[22px] rounded-full border px-[16px] py-[7px] font-space text-[12px] font-bold uppercase leading-[16px] tracking-normal ${project.badgeClass} shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[2px] sm:left-[32px] sm:top-[32px]`}
              >
                {project.badge}
              </span>
            )}
          </div>
          <div className="px-[22px] py-[28px] sm:px-[40px] sm:py-[40px] lg:px-[48px]">
            <h2
              id={`project-${project.id}-title`}
              className="font-space text-[28px] font-normal uppercase leading-[34px] tracking-normal text-[#1a1c1c] sm:text-[36px] sm:leading-[44px]"
            >
              {project.title}
            </h2>
            <p className="mt-[14px] text-[16px] leading-[26px] text-[#4b5563] [text-wrap:pretty] sm:text-[17px] sm:leading-[28px]">
              {project.description}
            </p>
            <ModalSection title="How it was built">
              <p>{project.process}</p>
            </ModalSection>
            <ModalSection title="Tools used">
              <div className="flex flex-wrap gap-[8px]">
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
            {project.metrics && project.metrics.length > 0 && (
              <ModalSection title="Metrics">
                <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-[18px] py-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]"
                    >
                      <p className="text-[11px] font-bold uppercase leading-[14px] tracking-[0.04em] text-[#6b7280]">
                        {metric.label}
                      </p>
                      <p className="mt-[6px] font-space text-[24px] font-normal leading-[30px] text-[#1a1c1c]">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </ModalSection>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectsSection() {
  const [openProject, setOpenProject] = useState(null);

  const cards = [
    { project: projects[0], variant: "featured", className: "md:col-span-2 lg:col-span-8 lg:row-span-2" },
    { project: projects[1], variant: "compact", className: "lg:col-span-4 lg:row-span-1" },
    { project: projects[2], variant: "compact", className: "lg:col-span-4 lg:row-span-1" },
    { project: projects[3], variant: "horizontal", className: "md:col-span-2 lg:col-span-12" },
  ];

  return (
    <section id="projects" className={`${sectionSpacing} ${pagePadding} pt-[35px] sm:pt-[53px] lg:pt-[70px]`}>
      <div className="flex flex-col gap-[18px] border-b border-[#d1d5db] pb-[28px] sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle>SELECTED PROJECTS</SectionTitle>
        <a href="#projects" className="flex shrink-0 items-center gap-[9px] text-center text-[15px] font-bold uppercase leading-[22px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white">
          VIEW ALL
          <img alt="" src={`${A}arrow-right.svg`} className="size-[18px]" />
        </a>
      </div>
      <div className="mt-[35px] grid grid-cols-1 gap-[22px] sm:mt-[53px] md:grid-cols-2 lg:grid-cols-12 lg:gap-[26px]">
        {cards.map(({ project, variant, className }, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            variant={variant}
            index={index}
            className={className}
            onOpen={setOpenProject}
          />
        ))}
      </div>
      <AnimatePresence>
        {openProject && (
          <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className={`${sectionSpacing} ${pagePadding} pt-[35px] sm:pt-[53px] lg:pt-[70px]`}>
      <SectionTitle>SKILLS</SectionTitle>
      <div className="mt-[35px] grid gap-[26px] sm:mt-[53px] md:grid-cols-2 lg:grid-cols-4 lg:gap-[35px]">
        {skills.map((column) => (
          <article key={column.title} className={`h-full min-h-[286px] rounded-[18px] ${border} bg-white p-[26px] ${shadowCard} sm:p-[36px] lg:min-h-[457px]`}>
            <h3 className="border-b border-[#d1d5db] pb-[19px] text-[15px] font-bold uppercase leading-[22px] tracking-normal text-[#111827]">
              {column.title}
            </h3>
            <div className="mt-[26px] flex flex-col gap-[22px]">
              {column.items.map(([icon, label, sizeClass, gapClass]) => (
                <div key={icon} className={`flex items-center ${gapClass}`}>
                  <img alt="" src={`${A}${icon}`} className={`${sizeClass} shrink-0 object-cover`} />
                  <span className="text-[18px] leading-[26px] text-[#4b5563]">{label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationCard({ title, school, icon, iconClass }) {
  return (
    <article className={`flex min-h-[174px] items-center justify-between gap-[22px] rounded-[18px] ${border} bg-white p-[26px] ${shadowCard} sm:p-[36px] lg:h-[174px]`}>
      <div className="min-w-0">
        <h3 className="font-space text-[24px] font-normal leading-[32px] tracking-normal text-[#1a1c1c] sm:text-[26px] sm:leading-[35px] lg:text-[24px] lg:leading-[32px] xl:text-[26px] xl:leading-[35px]">
          {title}
        </h3>
        <p className="mt-[9px] text-[18px] font-medium leading-[26px] text-[#111827]">{school}</p>
        <p className="mt-[9px] text-[15px] leading-[22px] text-[#6b7280]">Jan 2020 {"\u2022"} Present</p>
      </div>
      <div className="flex h-[70px] w-[84px] shrink-0 items-center justify-center overflow-visible sm:w-[97px]">
        <img alt="" src={`${A}${icon}`} className={`${iconClass} object-contain`} />
      </div>
    </article>
  );
}

function EducationSection() {
  return (
    <section id="education" className={`${sectionSpacing} ${pagePadding} pb-[26px] pt-[35px] sm:pt-[53px] lg:pt-[70px]`}>
      <SectionTitle>EDUCATION</SectionTitle>
      <div className="relative mt-[35px] grid gap-[26px] sm:mt-[53px] lg:grid-cols-2 lg:gap-[35px]">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#d1d5db] lg:block" />
        <div className="flex flex-col gap-[26px] lg:gap-[35px] lg:pr-[18px]">
          {educationLeft.map(([title, school, icon, iconClass]) => (
            <EducationCard key={title} title={title} school={school} icon={icon} iconClass={iconClass} />
          ))}
        </div>
        <div className="flex flex-col gap-[26px] lg:gap-[35px] lg:pl-[18px] lg:pt-[105px]">
          {educationRight.map(([title, school, icon, iconClass]) => (
            <EducationCard key={title} title={title} school={school} icon={icon} iconClass={iconClass} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section id="contact" className={`mx-auto ${sectionSpacing} h-auto w-[calc(100%-44px)] max-w-[986px] overflow-hidden rounded-[18px] ${border} bg-white px-[26px] py-[53px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:w-[calc(100%-70px)] sm:px-[44px] sm:py-[70px] lg:w-[calc(100%-106px)] lg:px-[54px] lg:py-[89px]`} style={{ backgroundImage: "linear-gradient(161.91182704738304deg, rgba(165, 201, 255, 0.1) 0%, rgba(165, 201, 255, 0) 100%)" }}>
      <div className="flex flex-col gap-[40px] lg:min-h-[145px] lg:flex-row lg:gap-0">
        <div className="w-full lg:w-[386px]">
          <h2 className="font-space text-[35px] font-normal uppercase leading-[40px] tracking-normal text-[#111827] sm:text-[44px] sm:leading-[48px]">
            LET&apos;S BUILD
            <br />
            SOMETHING
          </h2>
          <span className="mt-[2px] inline-block max-w-full rounded-[4px] border border-[rgba(165,201,255,0.3)] bg-[rgba(165,201,255,0.4)] px-[10px] py-[7px] font-space text-[35px] font-normal uppercase leading-[40px] tracking-normal text-[#111827] sm:-mt-[7px] sm:text-[44px] sm:leading-[48px]">
            QUIETLY USEFUL.
          </span>
        </div>
        <div className="hidden h-[106px] w-px bg-[#9ca3af] lg:ml-[53px] lg:mr-[53px] lg:mt-[20px] lg:block" />
        <div className="lg:mt-[29px] lg:w-[386px]">
          <p className="text-[11px] font-bold uppercase leading-[17px] tracking-normal text-[#6b7280]">CONTACT ME:</p>
          <div className="mt-[18px] flex gap-[18px]">
            {contactActions.map(([icon, label, href]) => (
              <a key={icon} href={href} aria-label={label} className={`flex size-[53px] items-center justify-center rounded-[9px] border border-[#e5e7eb] bg-[#f9fafb]/50 p-px ${shadowSoft}`}>
                <img alt="" src={`${A}${icon}`} className={icon === "share.svg" ? "h-[18px] w-[17px]" : "h-[15px] w-[18px]"} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-[22px] mt-[114px] flex min-h-[138px] flex-col gap-6 border-t border-[#d1d5db] bg-white px-0 pb-[53px] pt-[44px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:mx-[35px] lg:mx-[53px] lg:mt-[176px] lg:flex-row lg:items-center lg:justify-between lg:pt-[54px]">
      <a href="#top" className="font-space text-[22px] font-black uppercase leading-[31px] tracking-normal text-[#111827]">
        AI_ENGINEER
      </a>
      <nav className="flex flex-wrap justify-start gap-[35px] lg:justify-center">
        {Object.entries(socialLinks).map(([item, href]) => (
          <a key={item} href={href} className="font-space text-[13px] font-medium uppercase leading-[18px] tracking-normal text-[#4b5563]">
            {item}
          </a>
        ))}
      </nav>
      <p className="text-left font-space text-[13px] font-medium uppercase leading-[18px] tracking-normal text-[#6b7280] lg:text-right">
        &copy; 2024 AI ENGINEER PORTFOLIO. BUILT WITH PRECISION.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-white">
      <Nav />
      <main className="mx-auto w-full max-w-[1320px]">
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
