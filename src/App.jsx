import { useEffect, useRef, useState } from "react";
import { Bot } from "./components/animate-ui/icons/bot";
import ColorBends from "./components/ColorBends";
import { useBotEyeOffset } from "./hooks/use-bot-eye-offset";

const A = "/assets/";
const contactHref = "#contact";
const resumeHref = "#contact";
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
const pagePadding = "px-[20px] sm:px-[32px] lg:px-[48px]";
const sectionSpacing = "mt-[104px] sm:mt-[128px] lg:mt-[160px]";

const toolkit = [
  {
    title: "PYTHON",
    icon: "python-brand.png",
    iconClass: "size-[37px]",
    tags: ["PANDAS", "NUMPY", "FASTAPI"],
  },
  {
    title: "LANGCHAIN",
    icon: "langchain-brand.png",
    iconClass: "size-[37px]",
    tags: ["AGENTS", "RAG", "VECTOR DBS"],
  },
  {
    title: "HUGGING FACE",
    icon: "huggingface-brand.png",
    iconClass: "h-[54px] w-[53px]",
    tags: ["TRANSFORMERS", "LLMS", "DIFFUSERS"],
  },
];

const projects = [
  {
    title: "ARTHUR PAY AI",
    badge: "PRODUCTION",
    badgeClass: "bg-black text-white border-[#1f2937]",
    gradient: "linear-gradient(147.0965495236286deg, rgb(165, 201, 255) 0%, rgb(255, 255, 255) 100%)",
    description:
      "An intelligent financial assistant built with LangChain and custom LLM routing. Capable of analyzing transaction histories and executing semantic queries against relational databases.",
    tags: ["LANGCHAIN", "POSTGRESQL", "OPENAI"],
  },
  {
    title: "CREATORY AGENT",
    badge: "BETA",
    badgeClass: "bg-white/90 text-black border-[#d1d5db]",
    gradient: "linear-gradient(-32.902691562825424deg, rgb(243, 244, 246) 0%, rgb(165, 201, 255) 100%)",
    description:
      "A multi-agent system designed to automate content ideation and drafting. Implements a custom critic-generator loop to ensure brand voice consistency across outputs.",
    tags: ["PYTHON", "AUTOGEN", "FASTAPI"],
  },
  {
    title: "RAG KNOWLEDGE BASE",
    gradient: "linear-gradient(32.90294607305161deg, rgb(165, 201, 255) 0%, rgb(255, 255, 255) 100%)",
    description:
      "Enterprise-grade document retrieval system using advanced chunking strategies and hybrid search (BM25 + Dense Vectors) for highly accurate contextual answers.",
    tags: ["PINECONE", "LLAMAINDEX", "DOCKER"],
  },
];

const skills = [
  {
    title: "AI / ML FRAMEWORKS",
    items: [
      ["pytorch.png", "PyTorch", "h-[19px] w-[16px]", "gap-4"],
      ["keras.png", "Keras", "size-4", "gap-4"],
      ["huggingface-small.png", "Hugging Face", "size-6 rounded-[10px]", "gap-[9px]"],
      ["langchain-small.png", "LangChain", "size-5", "gap-4"],
      ["langgraph.png", "LangGraph", "size-5", "gap-4"],
      ["scikit.png", "scikit-learn", "h-[14px] w-[26px]", "gap-[9px]"],
      ["opencv.png", "openCV", "size-5", "gap-4"],
    ],
  },
  {
    title: "LANGUAGES",
    items: [
      ["python-mini.png", "Python", "size-[17px]", "gap-4"],
      ["sql.png", "SQL", "h-5 w-[18px]", "gap-4"],
    ],
  },
  {
    title: "DEVOPS",
    items: [
      ["mlflow.png", "MLFlow", "size-[18px]", "gap-4"],
      ["wandb.png", <>Weights &amp; Biases<br />(W&amp;B)</>, "size-4", "gap-4"],
      ["github.png", "GitHub", "size-4", "gap-4"],
    ],
  },
  {
    title: "BACK-END",
    items: [
      ["fastapi.png", "FastAPI", "size-[18px]", "gap-4"],
      ["chroma.png", "Chroma", "h-[19px] w-6", "gap-[9px]"],
    ],
  },
];

const educationLeft = [
  ["AI & ML Engineering", "Microsoft", "microsoft.png", "size-[48px]"],
  ["Azure Fundamentals (AZ-900)", "Microsoft", "az900.png", "size-[58px]"],
  ["Data Analytics Certificate", "Google", "google-data.png", "h-[58px] w-[61px]"],
  ["Dale Carnegie Training", "Dale Carnegie", "dale.png", "h-[42px] w-[72px]"],
];

const educationRight = [
  ["Cyber Defense", "FIAP", "fiap.png", "size-[56px] rounded-[10px]"],
  ["MBA - IA, Data Science e Big Data", "Ibmec", "ibmec.png", "size-[56px] rounded-[10px]"],
];

const navItems = [
  { label: "PROJECTS", id: "projects" },
  { label: "SKILLS", id: "skills" },
  { label: "EDUCATION", id: "education" },
];

const chatTabs = ["About", "Skills", "More"];
const botAnimationDuration = 1300;
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
    <header className="pointer-events-none fixed inset-x-0 top-[14px] z-50 px-[12px] sm:top-[18px] sm:px-[20px]">
      <div
        className={`nav-shell nav-float-in pointer-events-auto mx-auto flex h-[58px] w-full items-center justify-between rounded-full border px-[9px] pl-[18px] transition-[max-width,background-color,border-color,box-shadow] duration-[440ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[72px] sm:px-[12px] sm:pl-[28px] ${
          isScrolled
            ? "max-w-[780px] border-[#d1d5db] bg-white/92 shadow-[0px_18px_45px_-24px_rgba(17,24,39,0.42)] backdrop-blur-[18px]"
            : "max-w-[1168px] border-[#e5e7eb] bg-white/78 shadow-[0px_10px_30px_-26px_rgba(17,24,39,0.34)] backdrop-blur-[14px]"
        }`}
      >
        <a
          href="#top"
          className="rounded-full font-space text-[16px] font-black uppercase leading-[22px] tracking-normal text-black outline-none transition-[color,transform] duration-300 ease-out hover:text-[#1f2937] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:text-[21px] sm:leading-[28px]"
        >
          AI_ENGINEER
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
                className={`rounded-full px-[19px] py-[10px] font-space text-[12px] font-bold uppercase leading-[18px] tracking-normal outline-none transition-[background-color,color,box-shadow,transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9fafb] ${
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
          className="rounded-full border border-[#8fbaff] bg-[#a5c9ff] px-[12px] py-[9px] text-center font-space text-[11px] font-bold uppercase leading-[16px] tracking-normal text-black shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_14px_24px_-20px_rgba(17,24,39,0.55)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:px-[24px] sm:py-[13px] sm:text-[12px] sm:leading-[18px]"
        >
          CONTACT ME
        </a>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto mx-auto mt-[8px] flex w-fit max-w-[calc(100vw-24px)] items-center gap-[4px] rounded-full border border-[#e5e7eb] bg-white/92 p-[5px] shadow-[0px_10px_30px_-24px_rgba(17,24,39,0.38)] backdrop-blur-[14px] md:hidden"
      >
        {navItems.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full px-[12px] py-[8px] font-space text-[10px] font-bold uppercase leading-[14px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:bg-[#f9fafb] hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative left-1/2 mt-[174px] min-h-[620px] w-screen -translate-x-1/2 overflow-hidden py-[48px] [contain:layout_style] sm:mt-[188px] sm:py-[64px] md:mt-[132px] lg:mt-[176px] lg:py-[72px]">
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
      <div className={`mx-auto grid w-full max-w-[1200px] gap-[48px] ${pagePadding} lg:min-h-[520px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,520px)] lg:items-center lg:gap-[64px]`}>
        <div className="flex max-w-[560px] flex-col items-start gap-[28px] self-center lg:max-w-none">
          <h1 className="font-space text-[56px] font-normal leading-[0.95] tracking-normal text-[#1a1c1c] sm:text-[76px] lg:text-[96px]">
            Hi, I&apos;m
            <br />
            Arthur.
          </h1>
          <p className="max-w-[48ch] text-[18px] font-normal leading-[30px] text-[#4b5563] [text-wrap:pretty] sm:text-[19px] sm:leading-[31px]">
            A pragmatic <strong>AI Engineer</strong> with 1 year of hands-on experience building autonomous agents, robust LLM pipelines, and scalable backend infrastructure. Focused on creating quietly useful tools.
          </p>
          <div className="flex w-full flex-col gap-[12px] pt-[8px] sm:w-auto sm:flex-row sm:flex-wrap sm:gap-[16px] lg:pt-[16px]">
            <a href="#projects" className={`flex min-h-[56px] w-full min-w-[164px] items-center justify-center rounded-[12px] ${border} bg-[#a5c9ff] px-[33px] py-[17px] text-center text-[14px] font-bold uppercase leading-[20px] tracking-normal text-[#1a1c1c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#97c0ff] hover:shadow-[0px_14px_24px_-20px_rgba(17,24,39,0.45)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:w-auto`}>
              VIEW PROJECTS
            </a>
            <a href={resumeHref} className={`flex min-h-[56px] w-full min-w-[164px] items-center justify-center rounded-[12px] ${border} bg-white px-[33px] py-[17px] text-center text-[14px] font-bold uppercase leading-[20px] tracking-normal text-[#1a1c1c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#f9fafb] hover:shadow-[0px_14px_24px_-22px_rgba(17,24,39,0.35)] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:w-auto`}>
              RESUME
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
  const messagesRef = useRef(null);
  const typingTimerRef = useRef(null);
  const resetCommitTimerRef = useRef(null);
  const resetEndTimerRef = useRef(null);
  const { eyeX, eyeY } = useBotEyeOffset();

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

    setIsResetting(true);
    setIsResetSpinning(true);
    setIsTyping(false);
    resetCommitTimerRef.current = window.setTimeout(() => {
      setActiveTab("About");
      setMessages(initialChatMessages);
      setDraft("");
    }, 180);

    resetEndTimerRef.current = window.setTimeout(() => {
      setIsResetting(false);
      setIsResetSpinning(false);
    }, 620);
  }

  return (
    <div
      className={`flex h-[520px] min-w-0 flex-col overflow-hidden rounded-[20px] ${border} bg-white p-px ${shadowCard} sm:rounded-[24px] lg:h-[500px] lg:w-full`}
    >
      <div className="min-h-[78px] shrink-0 border-b border-[#d1d5db] bg-[#f9fafb]/50 px-[16px] py-[18px] sm:px-[20px] sm:pb-[21px] sm:pt-[20px]">
        <div className="flex h-full items-center gap-[8px] sm:items-start sm:gap-[16px]">
          {chatTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`rounded-[8px] border px-[14px] py-[9px] text-center text-[14px] font-bold leading-[20px] tracking-normal transition-colors duration-200 sm:px-[21px] ${
                activeTab === tab
                  ? "border-[#d1d5db] bg-[#a5c9ff] text-black shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                  : "border-transparent text-[#6b7280]"
              }`}
              type="button"
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto hidden h-[38px] items-center gap-[12px] pt-[8.3px] sm:flex">
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
              <span className="pointer-events-none absolute left-1/2 top-[34px] z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[8px] border border-[#d1d5db] bg-white px-[10px] py-[7px] text-[11px] font-medium leading-[14px] tracking-normal text-[#4b5563] opacity-0 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-all duration-150 before:absolute before:left-1/2 before:top-[-5px] before:size-[9px] before:-translate-x-1/2 before:rotate-45 before:border-l before:border-t before:border-[#d1d5db] before:bg-white group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Reset chat
              </span>
            </button>
            <span className="agent-active-dot size-[10px] rounded-full bg-[#22c55e]" />
            <span className="whitespace-nowrap text-[10px] font-medium uppercase leading-[14px] tracking-normal text-[#6b7280]">
              AGENT ACTIVE
            </span>
          </div>
        </div>
      </div>
      <div
        ref={messagesRef}
        className={`min-h-0 flex-1 space-y-[24px] overflow-y-auto bg-white px-[16px] py-[24px] sm:px-[32px] sm:py-[32px] ${isResetting ? "chat-resetting" : ""}`}
      >
        {messages.map((message, index) =>
          message.role === "agent" ? (
            <div key={`${message.role}-${index}`} className="chat-message-in flex max-w-full items-start gap-[12px] sm:gap-[16px]">
              <div className={`flex size-[36px] shrink-0 items-center justify-center rounded-full ${border} bg-[#a5c9ff] p-px shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:size-[40px]`}>
                {message.animateBot ? (
                  <BotLoopIcon eyeX={eyeX} eyeY={eyeY} />
                ) : (
                  <HoverBlinkBotIcon eyeX={eyeX} eyeY={eyeY} />
                )}
              </div>
              <div className={`rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] ${border} bg-[#f9fafb] px-[16px] py-[16px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:px-[21px] sm:py-[18px]`}>
                <p className="text-[16px] leading-[26px] text-[#374151]">{message.text}</p>
              </div>
            </div>
          ) : (
            <div key={`${message.role}-${index}`} className="chat-message-in flex justify-end">
              <div className="max-w-[82%] rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] border border-black bg-black p-[18px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:max-w-[386px] sm:p-[21px]">
                <p className="text-[16px] leading-[26px] text-white">{message.text}</p>
              </div>
            </div>
          ),
        )}
        {isTyping && (
          <div className="chat-message-in flex max-w-full items-start gap-[12px] sm:gap-[16px]">
              <div className={`flex size-[36px] shrink-0 items-center justify-center rounded-full ${border} bg-[#a5c9ff] p-px shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:size-[40px]`}>
              <Bot aria-hidden="true" animate size={23} className="text-black" eyeX={eyeX} eyeY={eyeY} />
            </div>
            <div className={`flex h-[52px] items-center gap-[6px] rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] ${border} bg-[#f9fafb] px-[21px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]`}>
              <span className="typing-dot" />
              <span className="typing-dot animation-delay-150" />
              <span className="typing-dot animation-delay-300" />
            </div>
          </div>
        )}
      </div>
      <div className="h-[98px] shrink-0 border-t border-[#d1d5db] bg-white px-[16px] pb-[20px] pt-[21px] sm:px-[20px]">
        <form className="flex h-[57px] items-center gap-[12px]" onSubmit={sendMessage}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={`h-[57px] min-w-0 flex-1 rounded-[12px] ${border} bg-[#f9fafb] px-[17px] text-[16px] leading-normal text-[#374151] outline-none ${shadowSoft} placeholder:text-[#6b7280] focus:border-[#a5c9ff]`}
            placeholder={isResetting ? "Resetting conversation..." : "Ask the agent..."}
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

function HoverBlinkBotIcon({ eyeX, eyeY }) {
  return (
    <Bot
      aria-hidden="true"
      animateOnHover="blink"
      size={23}
      className="text-black"
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
      animate
      size={23}
      className="text-black"
      eyeX={eyeX}
      eyeY={eyeY}
    />
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="font-space text-[34px] font-normal uppercase leading-[38px] tracking-normal text-[#111827] [text-wrap:balance] sm:text-[40px] sm:leading-[42px] lg:text-[48px] lg:leading-[48px]">
      {children}
    </h2>
  );
}

function Pill({ children, small = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border border-[#d1d5db] bg-[#f9fafb] ${small ? "px-[9px] py-[5px] rounded-[4px] border-[#e5e7eb]" : "px-[17px] py-[7px]"} text-[12px] font-bold uppercase leading-[16px] tracking-normal text-[#6b7280] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]`}>
      {children}
    </span>
  );
}

function ToolkitSection() {
  return (
    <section id="toolkit" className={`${sectionSpacing} ${pagePadding} pt-[32px] sm:pt-[48px] lg:pt-[64px]`}>
      <SectionTitle>MY CORE AI TOOLKIT</SectionTitle>
      <div className="mt-[32px] grid gap-[24px] sm:mt-[48px] lg:grid-cols-3 lg:gap-[32px]">
        {toolkit.map((item) => (
          <article key={item.title} className={`relative min-h-[282px] rounded-[16px] ${border} bg-white p-[24px] ${shadowCard} sm:p-[33px]`}>
            <div className={`flex size-[64px] items-center justify-center rounded-[16px] ${border} bg-[#a5c9ff] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]`}>
              <img alt="" src={`${A}${item.icon}`} className={`${item.iconClass} object-cover`} />
            </div>
            <h3 className="pt-[32px] font-space text-[24px] font-normal uppercase leading-[32px] tracking-normal text-[#1a1c1c]">
              {item.title}
            </h3>
            <div className="mt-[20px] flex flex-wrap gap-[8px]">
              {item.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className={`${sectionSpacing} ${pagePadding} pt-[32px] sm:pt-[48px] lg:pt-[64px]`}>
      <div className="flex flex-col gap-[16px] border-b border-[#d1d5db] pb-[25px] sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle>SELECTED PROJECTS</SectionTitle>
        <a href="#projects" className="flex shrink-0 items-center gap-[8px] text-center text-[14px] font-bold uppercase leading-[20px] tracking-normal text-[#6b7280] outline-none transition-colors duration-200 hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4 focus-visible:ring-offset-white">
          VIEW ALL
          <img alt="" src={`${A}arrow-right.svg`} className="size-[16px]" />
        </a>
      </div>
      <div className="mt-[32px] grid gap-[24px] sm:mt-[48px] lg:grid-cols-3 lg:gap-[32px]">
        {projects.map((project) => (
          <article key={project.title} className={`flex min-h-[560px] flex-col overflow-hidden rounded-[20px] ${border} bg-white p-px ${shadowCard} sm:rounded-[24px]`}>
            <div className="relative h-[200px] shrink-0 border-b border-[#d1d5db] bg-[#f9fafb] sm:h-[224px]">
              <div className="absolute inset-0 opacity-80" style={{ backgroundImage: project.gradient }} />
              {project.badge && (
                <span className={`absolute right-[20px] top-[20px] rounded-full border px-[17px] py-[7px] text-[12px] font-bold uppercase leading-[16px] tracking-normal ${project.badgeClass} shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[2px]`}>
                  {project.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-[24px] sm:p-[32px]">
              <h3 className="pb-[12px] font-space text-[24px] font-normal uppercase leading-[32px] tracking-normal text-[#1a1c1c]">
                {project.title}
              </h3>
              <p className="pb-[32px] text-[16px] leading-[26px] text-[#4b5563] [text-wrap:pretty]">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-[12px] border-t border-[#d1d5db] pt-[24px]">
                {project.tags.map((tag) => (
                  <Pill key={tag} small>
                    {tag}
                  </Pill>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className={`${sectionSpacing} ${pagePadding} pt-[32px] sm:pt-[48px] lg:pt-[64px]`}>
      <SectionTitle>SKILLS</SectionTitle>
      <div className="mt-[32px] grid gap-[24px] sm:mt-[48px] md:grid-cols-2 lg:grid-cols-4 lg:gap-[32px]">
        {skills.map((column) => (
          <article key={column.title} className={`h-full min-h-[260px] rounded-[16px] ${border} bg-white p-[24px] ${shadowCard} sm:p-[33px] lg:min-h-[415px]`}>
            <h3 className="border-b border-[#d1d5db] pb-[17px] text-[14px] font-bold uppercase leading-[20px] tracking-normal text-[#111827]">
              {column.title}
            </h3>
            <div className="mt-[24px] flex flex-col gap-[20px]">
              {column.items.map(([icon, label, sizeClass, gapClass]) => (
                <div key={icon} className={`flex items-center ${gapClass}`}>
                  <img alt="" src={`${A}${icon}`} className={`${sizeClass} shrink-0 object-cover`} />
                  <span className="text-[16px] leading-[24px] text-[#4b5563]">{label}</span>
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
    <article className={`flex min-h-[158px] items-center justify-between gap-[20px] rounded-[16px] ${border} bg-white p-[24px] ${shadowCard} sm:p-[33px] lg:h-[158px]`}>
      <div className="min-w-0">
        <h3 className="font-space text-[22px] font-normal leading-[29px] tracking-normal text-[#1a1c1c] sm:text-[24px] sm:leading-[32px] lg:text-[22px] lg:leading-[29px] xl:text-[24px] xl:leading-[32px]">
          {title}
        </h3>
        <p className="mt-[8px] text-[16px] font-medium leading-[24px] text-[#111827]">{school}</p>
        <p className="mt-[8px] text-[14px] leading-[20px] text-[#6b7280]">Jan 2020 {"\u2022"} Present</p>
      </div>
      <div className="flex h-[64px] w-[76px] shrink-0 items-center justify-center overflow-visible sm:w-[88px]">
        <img alt="" src={`${A}${icon}`} className={`${iconClass} object-contain`} />
      </div>
    </article>
  );
}

function EducationSection() {
  return (
    <section id="education" className={`${sectionSpacing} ${pagePadding} pb-[24px] pt-[32px] sm:pt-[48px] lg:pt-[64px]`}>
      <SectionTitle>EDUCATION</SectionTitle>
      <div className="relative mt-[32px] grid gap-[24px] sm:mt-[48px] lg:grid-cols-2 lg:gap-[32px]">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#d1d5db] lg:block" />
        <div className="flex flex-col gap-[24px] lg:gap-[32px] lg:pr-[16px]">
          {educationLeft.map(([title, school, icon, iconClass]) => (
            <EducationCard key={title} title={title} school={school} icon={icon} iconClass={iconClass} />
          ))}
        </div>
        <div className="flex flex-col gap-[24px] lg:gap-[32px] lg:pl-[16px] lg:pt-[95px]">
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
    <section id="contact" className={`mx-auto ${sectionSpacing} h-auto w-[calc(100%-40px)] max-w-[896px] overflow-hidden rounded-[16px] ${border} bg-white px-[24px] py-[48px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:w-[calc(100%-64px)] sm:px-[40px] sm:py-[64px] lg:w-[calc(100%-96px)] lg:px-[49px] lg:py-[81px]`} style={{ backgroundImage: "linear-gradient(161.91182704738304deg, rgba(165, 201, 255, 0.1) 0%, rgba(165, 201, 255, 0) 100%)" }}>
      <div className="flex flex-col gap-[36px] lg:min-h-[132px] lg:flex-row lg:gap-0">
        <div className="w-full lg:w-[350.5px]">
          <h2 className="font-space text-[32px] font-normal uppercase leading-[36px] tracking-normal text-[#111827] sm:text-[40px] sm:leading-[44px]">
            LET&apos;S BUILD
            <br />
            SOMETHING
          </h2>
          <span className="mt-[2px] inline-block max-w-full rounded-[4px] border border-[rgba(165,201,255,0.3)] bg-[rgba(165,201,255,0.4)] px-[9px] py-[6.5px] font-space text-[32px] font-normal uppercase leading-[36px] tracking-normal text-[#111827] sm:-mt-[6.5px] sm:text-[40px] sm:leading-[44px]">
            QUIETLY USEFUL.
          </span>
        </div>
        <div className="hidden h-[96px] w-px bg-[#9ca3af] lg:ml-[48px] lg:mr-[48px] lg:mt-[18px] lg:block" />
        <div className="lg:mt-[26.5px] lg:w-[350.5px]">
          <p className="text-[10px] font-bold uppercase leading-[15px] tracking-normal text-[#6b7280]">CONTACT ME:</p>
          <div className="mt-[16px] flex gap-[16px]">
            {contactActions.map(([icon, label, href]) => (
              <a key={icon} href={href} aria-label={label} className={`flex size-[48px] items-center justify-center rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb]/50 p-px ${shadowSoft}`}>
                <img alt="" src={`${A}${icon}`} className={icon === "share.svg" ? "h-[16.667px] w-[15px]" : "h-[13.333px] w-[16.667px]"} />
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
    <footer className="mx-[20px] mt-[104px] flex min-h-[125px] flex-col gap-6 border-t border-[#d1d5db] bg-white px-0 pb-[48px] pt-[40px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:mx-[32px] lg:mx-[48px] lg:mt-[160px] lg:flex-row lg:items-center lg:justify-between lg:pt-[49px]">
      <a href="#top" className="font-space text-[20px] font-black uppercase leading-[28px] tracking-normal text-[#111827]">
        AI_ENGINEER
      </a>
      <nav className="flex flex-wrap justify-start gap-[32px] lg:justify-center">
        {Object.entries(socialLinks).map(([item, href]) => (
          <a key={item} href={href} className="font-space text-[12px] font-medium uppercase leading-[16px] tracking-normal text-[#4b5563]">
            {item}
          </a>
        ))}
      </nav>
      <p className="text-left font-space text-[12px] font-medium uppercase leading-[16px] tracking-normal text-[#6b7280] lg:text-right">
        &copy; 2024 AI ENGINEER PORTFOLIO. BUILT WITH PRECISION.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-white">
      <Nav />
      <main className="mx-auto w-full max-w-[1200px]">
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
