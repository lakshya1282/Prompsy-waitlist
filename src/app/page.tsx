"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "The Problem", href: "#problem" },
  { label: "Workflow", href: "#solution" },
  { label: "BYOK", href: "#byok" },
  { label: "Post a Review", href: "/review" },
];

const INPUT_FULL_TEXT = "write a python function to check if string is palindrome but ignore punctuation";
const OUTPUT_FULL_TEXT = "Write a highly optimized Python function to check if a string is a palindrome. Requirements:\n1. Disregard all punctuation symbols and whitespace characters.\n2. Ensure compliance with Unicode/non-ASCII character sets.\n3. Include comprehensive docstrings, type hinting, and representative unit tests.";

export default function Home() {
  // Typewriter States
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [phase, setPhase] = useState<"typing-input" | "waiting-output" | "typing-output" | "done">("typing-input");

  // Scroll animations observer hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Typewriter Loop Effect
  useEffect(() => {
    if (phase === "typing-input") {
      if (inputText.length < INPUT_FULL_TEXT.length) {
        const timeout = setTimeout(() => {
          setInputText(INPUT_FULL_TEXT.slice(0, inputText.length + 2)); // Type 2 chars at a time for speed
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase("waiting-output");
        }, 500);
        return () => clearTimeout(timeout);
      }
    } else if (phase === "waiting-output") {
      const timeout = setTimeout(() => {
        setPhase("typing-output");
      }, 700); // Simulate API response delay
      return () => clearTimeout(timeout);
    } else if (phase === "typing-output") {
      if (outputText.length < OUTPUT_FULL_TEXT.length) {
        const timeout = setTimeout(() => {
          setOutputText(OUTPUT_FULL_TEXT.slice(0, outputText.length + 4)); // Type 4 chars at a time for fast output
        }, 12);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase("done");
        }, 5000); // Display finished result for 5s
        return () => clearTimeout(timeout);
      }
    } else if (phase === "done") {
      const timeout = setTimeout(() => {
        setInputText("");
        setOutputText("");
        setPhase("typing-input");
      }, 1000); // Wait 1s before restarting loop
      return () => clearTimeout(timeout);
    }
  }, [phase, inputText, outputText]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans overflow-x-hidden">

      {/* ─── STICKY NAV ─── */}
      <header className="sticky top-0 z-50 flex justify-center pt-5 px-4">
        <nav className="w-full max-w-5xl bg-[#111111] rounded-full flex items-center px-8 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Prompsy" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">Prompsy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 ml-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/60 hover:text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-md"
              >
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/download"
            className="ml-auto bg-white text-[#111111] text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white/90 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Download Beta
          </Link>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-28 px-6 md:px-12 overflow-hidden">
        {/* Subtle Neumorphic background depth */}
        <div className="neu-circle w-[900px] h-[900px] -top-[35%] -left-[20%] opacity-40 pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Texts and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Flat Beta pill badge */}
            <div className="border border-black/15 bg-white/70 text-[#111111] px-5 py-2 rounded-full text-xs font-bold tracking-widest mb-8 flex items-center gap-2.5 uppercase shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Beta Windows Release
            </div>

            <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#111111] tracking-tight leading-[1.1] mb-6">
              From rough thoughts to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
                structured prompts.
              </span>
              <br />
              <span className="text-[#111111]">In any app, instantly.</span>
            </h1>

            <p className="text-[#555555] text-sm md:text-base mb-10 font-medium leading-relaxed max-w-2xl">
              Prompsy is a lightweight Windows desktop utility. It intercepts highlighted text in your active window, structures it using your preferred LLM prompt system, and pastes the optimized prompt back immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/download"
                className="group flex items-center justify-center gap-4 bg-[#111111] hover:bg-black text-white font-bold text-base px-8 py-4.5 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Beta for Windows
                <span className="text-white/40 font-normal text-xs">v0.1.0</span>
              </Link>
              <a
                href="#problem"
                className="text-[#666666] text-base font-bold hover:text-[#111111] transition-colors py-3 px-4 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Learn the workflow ↓
              </a>
            </div>

            <p className="text-[#999999] text-xs mt-6 font-semibold">
              Windows 10/11 · 64-bit · Portable & Installer builds
            </p>
          </div>

          {/* Right Column: Active Pipeline Mockup with Typewriter Animation */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-xl neu-card p-6 md:p-8 text-left relative overflow-hidden shadow-2xl border border-black">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[10px] md:text-xs text-[#888] font-bold font-mono tracking-wider">PROMPSY ACTIVE PIPELINE</span>
              </div>
              
              <div className="space-y-5">
                {/* Input block */}
                <div>
                  <p className="text-[10px] text-[#aaa] font-bold uppercase tracking-wider mb-1.5">Original Highlighted Text</p>
                  <div className="bg-white/80 rounded-xl px-4 py-3 text-xs md:text-sm text-[#555] font-mono border border-black/5 leading-relaxed min-h-[70px] relative select-none">
                    {inputText}
                    {phase === "typing-input" && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#8b5cf6] animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Separator / Enhancer status */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-black/5" />
                  <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                    phase === "waiting-output" ? "text-emerald-500 scale-105" : "text-[#8b5cf6]"
                  }`}>
                    {phase === "waiting-output" ? "● Enhancing..." : "System Enhancement"}
                  </span>
                  <div className="flex-1 h-px bg-black/5" />
                </div>

                {/* Output block */}
                <div>
                  <p className="text-[10px] text-[#aaa] font-bold uppercase tracking-wider mb-1.5">Injected Context Output</p>
                  <div className={`bg-white/95 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111111] font-mono border leading-relaxed min-h-[160px] transition-all duration-300 shadow-sm relative select-none ${
                    phase === "waiting-output" ? "border-emerald-300 bg-emerald-50/10" : "border-[#8b5cf6]/20"
                  }`}>
                    {outputText}
                    {phase === "typing-output" && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-[#8b5cf6] animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section id="problem" className="py-28 px-6 border-t border-black/5">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Left column */}
            <div className="md:col-span-1 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                The Friction
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
                Why prompt engineering feels like a chore.
              </h2>
              <p className="text-[#555555] text-base md:text-lg mt-6 font-medium leading-relaxed">
                Developers write dozens of prompts a day. But the process is filled with invisible context-switching and repetitive typing.
              </p>
            </div>
            
            {/* Right column - Asymmetric list */}
            <div className="md:col-span-2 space-y-10 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              {[
                {
                  num: "01",
                  title: "The Iteration Loop Tax",
                  desc: "Typing raw, unstructured thoughts results in subpar outputs. You waste time refining the AI's response instead of coding."
                },
                {
                  num: "02",
                  title: "Context-Switching Drag",
                  desc: "Leaving your active window, opening a browser tab, pasting text, tweaking it, and copying it back. Each hop breaks your state of flow."
                },
                {
                  num: "03",
                  title: "Structural Disparity",
                  desc: "High-quality prompts require role definitions, output constraints, and clear schema instructions. Manually typing these structures is tedious."
                },
                {
                  num: "04",
                  title: "Invisible Repetition",
                  desc: "Constantly appending instructions like 'output valid JSON', 'don't explain', or 'use type hints' manually wastes seconds on every single query."
                }
              ].map((p) => (
                <div key={p.num} className="flex gap-6 items-start">
                  <span className="text-sm md:text-base font-mono font-bold text-[#8b5cf6] bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 px-3 py-1.5 rounded-md shrink-0">
                    {p.num}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-2">{p.title}</h3>
                    <p className="text-base md:text-lg text-[#555555] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOLUTIONS & TIMELINE ─── */}
      <section id="solution" className="py-28 px-6 relative overflow-hidden bg-white/40 border-t border-black/5">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            {/* Left column - Sticky info */}
            <div className="md:col-span-1 md:sticky md:top-28 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                Workflow
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
                From keyboard to clipboard.
              </h2>
              <p className="text-[#555555] text-base md:text-lg mt-6 font-medium leading-relaxed mb-10">
                Prompsy intercepts your clipboard selection and processes it through your chosen LLM on your custom hotkey.
              </p>
              
              {/* Enhancement Modes */}
              <div className="border border-black/5 bg-[#f8f9fa] rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-4">Custom System Presets</h4>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { label: "Coding", style: "border-blue-200 bg-blue-50/50 text-blue-700" },
                    { label: "Creative", style: "border-rose-200 bg-rose-50/50 text-rose-700" },
                    { label: "Image Gen", style: "border-violet-200 bg-violet-50/50 text-violet-700" },
                    { label: "Writing", style: "border-emerald-200 bg-emerald-50/50 text-emerald-700" },
                    { label: "Agentic", style: "border-indigo-200 bg-indigo-50/50 text-indigo-700" },
                  ].map((m) => (
                    <span
                      key={m.label}
                      className={`border text-xs md:text-sm font-bold px-3 py-1.5 rounded-full ${m.style}`}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Steps list */}
            <div className="md:col-span-2 space-y-14 pl-0 md:pl-10 md:border-l md:border-black/5 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              {[
                {
                  step: "Step 1",
                  title: "Highlight and capture",
                  desc: "Select any raw prompt, outline, or code comment in your IDE, terminal, browser, or editor.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.82 2.82 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  )
                },
                {
                  step: "Step 2",
                  title: "Trigger the keyhook",
                  desc: "Press your customizable global hotkey (default: Ctrl+Shift+E). Prompsy's active background listener intercepts the selection without bringing up an app window.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
                    </svg>
                  )
                },
                {
                  step: "Step 3",
                  title: "Context-aware processing",
                  desc: "The app injects your selection into a templated system prompt tailored to your active mode, executing a direct API call to your provider.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                    </svg>
                  )
                },
                {
                  step: "Step 4",
                  title: "Direct injection",
                  desc: "The optimized prompt is placed directly back into your clipboard or typed out inside your active editor window via virtual key events.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )
                }
              ].map((s) => (
                <div key={s.step} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-xl bg-white border border-black/5 shadow-sm text-[#8b5cf6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                    {s.icon}
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold text-[#8b5cf6] uppercase tracking-wider block mb-1">{s.step}</span>
                    <h3 className="text-lg md:text-2xl font-bold text-[#111111] mb-2">{s.title}</h3>
                    <p className="text-base md:text-lg text-[#555555] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BYOK ─── */}
      <section id="byok" className="py-28 px-6 border-t border-black/5">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            {/* Left column */}
            <div className="md:col-span-1 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                Privacy First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight leading-tight">
                Direct API connections.
              </h2>
              <p className="text-[#555555] text-base md:text-lg mt-6 font-medium leading-relaxed mb-8">
                No middleman servers. Prompsy connects directly to your chosen AI provider using your own credentials.
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "OpenAI", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { name: "Anthropic", color: "bg-amber-50 text-amber-700 border-amber-200" },
                  { name: "Google Gemini", color: "bg-blue-50 text-blue-700 border-blue-200" },
                  { name: "Local Ollama", color: "bg-gray-50 text-gray-700 border-gray-200" },
                ].map((p) => (
                  <span
                    key={p.name}
                    className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border ${p.color}`}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-2 space-y-12 pl-0 md:pl-10 md:border-l md:border-black/5 reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
              
              {/* Data Flow Diagram (Minimal & clean, no emojis) */}
              <div className="border border-black/5 bg-[#f8f9fa] rounded-2xl p-8 shadow-sm">
                <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider text-center mb-6">Secure Local Datapath</h4>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
                  {[
                    { label: "Active Window", desc: "Clipboard selection" },
                    { label: "→", desc: "" },
                    { label: "Windows OS", desc: "Prompsy App (Local)" },
                    { label: "→", desc: "" },
                    { label: "Direct HTTPS", desc: "AI Provider API" }
                  ].map((node, i) => 
                    node.label === "→" ? (
                      <span key={i} className="text-2xl text-[#8b5cf6] font-bold hidden sm:block">→</span>
                    ) : (
                      <div key={i} className="flex-1 w-full sm:w-auto flex flex-col items-center bg-white border border-black/5 rounded-xl px-5 py-4 shadow-sm">
                        <span className="text-sm md:text-base font-bold text-[#111111]">{node.label}</span>
                        <span className="text-xs md:text-sm text-[#666] mt-1">{node.desc}</span>
                      </div>
                    )
                  )}
                </div>
                <p className="text-center text-xs text-[#888] mt-6 font-semibold">
                  Credentials are cryptographically stored using OS security primitives.
                </p>
              </div>

              {/* Text benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    title: "At-Cost Usage",
                    desc: "Pay your providers directly at raw API rates. Save up to 90% compared to typical monthly SaaS subscription wrappers."
                  },
                  {
                    title: "Zero Log Buffering",
                    desc: "Your prompts never hit our servers because we don't have them. Data flows straight from your localhost to your AI provider."
                  },
                  {
                    title: "Ollama Integration",
                    desc: "Run completely local models offline. Zero latency, complete data confidentiality, and no network connections required."
                  },
                  {
                    title: "Model Switching",
                    desc: "Deploy custom model selections. Instantly shift between Claude 3.5 Sonnet, GPT-4o, and local models via client configuration."
                  }
                ].map((b) => (
                  <div key={b.title}>
                    <h4 className="text-base md:text-lg font-bold text-[#111111] mb-2">{b.title}</h4>
                    <p className="text-sm md:text-base text-[#555555] leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-28 px-6 border-t border-black/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="neu-card p-16 flex flex-col items-center reveal-on-scroll opacity-0 translate-y-6 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight mb-4">
              Prompt smarter, natively.
            </h2>
            <p className="text-[#555555] text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-xl">
              Download the Prompsy Beta for Windows. No account registration, no telemetry, and direct local key execution.
            </p>
            <Link
              href="/download"
              className="flex items-center gap-4 bg-[#111111] hover:bg-black text-white font-bold text-base px-12 py-5 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
            >
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Beta for Windows
            </Link>
            <p className="text-xs md:text-sm text-[#999] mt-5 font-semibold">Windows 10/11 · 64-bit · Beta v0.1.0</p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <div className="w-full relative shrink-0">
        <svg viewBox="0 0 1440 80" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0,80 L1440,80 L1440,0 C960,60 480,60 0,0 Z" fill="#111111" />
        </svg>
        <footer className="bg-[#111111] w-full -mt-1 pt-6 pb-12 px-8">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-10 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <img src="/logo.png" alt="Prompsy" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg tracking-tight block">Prompsy</span>
                  <span className="text-white/40 text-sm font-semibold">Prompt engineering, elevated.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <div className="flex flex-col gap-2.5">
                  <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Product</span>
                  <a href="#problem" className="text-white/60 hover:text-white text-sm transition-colors">The Problem</a>
                  <a href="#solution" className="text-white/60 hover:text-white text-sm transition-colors">Workflow</a>
                  <a href="#byok" className="text-white/60 hover:text-white text-sm transition-colors">BYOK</a>
                  <Link href="/download" className="text-white/60 hover:text-white text-sm transition-colors">Download Beta</Link>
                  <Link href="/review" className="text-white/60 hover:text-white text-sm transition-colors">Post a Review</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Legal</span>
                  <Link href="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</Link>
                  <Link href="/refund-policy" className="text-white/60 hover:text-white text-sm transition-colors">Refund Policy</Link>
                  <Link href="/beta-disclaimer" className="text-white/60 hover:text-white text-sm transition-colors">Beta Disclaimer</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Contact</span>
                  <a href="mailto:support@prompsy.app" className="text-white/60 hover:text-white text-sm transition-colors">support@prompsy.app</a>
                  <a href="mailto:billing@prompsy.app" className="text-white/60 hover:text-white text-sm transition-colors">billing@prompsy.app</a>
                </div>
              </div>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/25 text-sm font-semibold">© {new Date().getFullYear()} Prompsy. All rights reserved.</p>
              <p className="text-white/25 text-sm font-semibold">Made in India · Beta v0.1.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
