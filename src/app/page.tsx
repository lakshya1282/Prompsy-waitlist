"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          setStatus("success"); // Treat duplicate as success visually
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center w-full relative overflow-hidden font-sans">
      {/* Background Neumorphic Circles */}
      <div className="neu-circle w-64 h-64 top-[5%] left-[-5%]"></div>
      <div className="neu-circle w-[800px] h-[800px] top-[15%] -left-[25%] opacity-60"></div>
      <div className="neu-circle w-[600px] h-[600px] -top-[15%] -right-[15%] opacity-80 border-[64px] border-[var(--bg-primary)] bg-transparent box-shadow-none" style={{ boxShadow: "12px 12px 32px rgba(0,0,0,0.05), -12px -12px 32px rgba(255,255,255,0.9)" }}></div>
      <div className="neu-circle w-[320px] h-[320px] bottom-[5%] right-[0%]"></div>

      {/* Header (Pill Shaped) */}
      <header className="w-[90%] max-w-4xl bg-[#111111] rounded-full flex items-center px-6 py-3 z-10 relative mt-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">Prompsy</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center z-10 relative">
        
        {/* Coming Soon Pill */}
        <div className="bg-[#111111] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest mb-6 flex items-center gap-2 uppercase shadow-xl">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18M3 12h18M15 9l-6 6M9 9l6 6"/>
          </svg>
          COMING SOON
        </div>
        
        {/* Hero Title */}
        <h1 className="text-[48px] md:text-[64px] font-extrabold text-[#111111] tracking-tight mb-3 leading-[1.1]">
          Prompt Engineering, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
            Elevated.
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-[#666666] max-w-xl mb-8 font-medium leading-relaxed">
          Join the waitlist for Prompsy, the ultimate prompt enhancement tool.<br/>
          Supercharge your workflow instantly.
        </p>

        {/* Neumorphic Card */}
        <div className="w-full max-w-[420px] neu-card p-8 flex flex-col items-center justify-center min-h-[220px]">
          {status === "success" ? (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-14 h-14 bg-[#111111] text-white rounded-full flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-[20px] font-bold text-[#111111] mb-2 tracking-tight">You're on the list!</h3>
              <p className="text-[#666666] text-sm font-medium">We'll notify you as soon as Prompsy is ready.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
              <h3 className="text-[20px] font-bold text-[#111111] mb-2 tracking-tight text-center">Reserve Your Spot</h3>
              <div className="flex flex-col text-left">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={status === "loading"}
                  className="w-full px-5 py-3.5 bg-white border-none rounded-xl text-[#111111] text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all"
                />
              </div>
              
              {status === "error" && (
                <p className="text-red-500 text-xs font-medium">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#111111] hover:bg-black text-white font-semibold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-1"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
        </div>

      </main>

      {/* Footer Curve */}
      <div className="w-full mt-auto relative z-10 shrink-0">
        <svg viewBox="0 0 1440 100" className="w-full h-auto block max-h-[8vh]" preserveAspectRatio="none">
          <path d="M0,100 L1440,100 L1440,0 C960,80 480,80 0,0 Z" fill="#111111" />
        </svg>
        <footer className="bg-[#111111] w-full pb-6 -mt-1">
        </footer>
      </div>
    </div>
  );
}
