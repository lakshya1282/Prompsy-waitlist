"use client";

import { useState } from "react";
import Link from "next/link";

type Format = "msi" | "exe";

interface DownloadIntent {
  format: Format;
}

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<Format | null>(null);
  const [modal, setModal] = useState<DownloadIntent | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedBeta, setAgreedBeta] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState<Format | null>(null);

  const allAgreed = agreedTerms && agreedPrivacy && agreedBeta;

  const openModal = (format: Format) => {
    setAgreedTerms(false);
    setAgreedPrivacy(false);
    setAgreedBeta(false);
    setModal({ format });
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleConfirmDownload = async () => {
    if (!modal || !allAgreed) return;
    const { format } = modal;
    closeModal();
    setDownloading(format);

    try {
      const response = await fetch(`/api/download?format=${format}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Download failed (${response.status})`);
      }

      const blob = await response.blob();
      const filename = format === "msi" ? "Prompsy_x64_en-US.msi" : "Prompsy_x64-setup.exe";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStarted(format);
    } catch (err: any) {
      console.error("[download] Error:", err);
      alert(err.message || "Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center w-full relative overflow-hidden font-sans">
        {/* Subtle background claymorphic depth */}
        <div className="neu-circle w-[800px] h-[800px] top-[15%] -left-[25%] opacity-60 pointer-events-none" />

        {/* Header */}
        <header className="w-[90%] max-w-4xl bg-[#111111] rounded-full flex items-center px-6 py-3 z-10 relative mt-4 shadow-lg">
          <Link href="/" className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-md">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Prompsy" className="w-4 h-4 object-contain" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Prompsy</span>
          </Link>
          <Link
            href="/"
            className="ml-auto text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ← Back to Home
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center w-full max-w-4xl px-6 text-center z-10 relative py-14">
          
          {/* Badge */}
          <div className="border border-black/15 bg-white/70 text-[#111111] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest mb-8 flex items-center gap-2 uppercase shadow-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Beta Download — Windows
          </div>

          {/* Title */}
          <h1 className="text-[38px] md:text-[54px] font-extrabold text-[#111111] tracking-tight mb-4 leading-[1.1]">
            Download <span className="text-[#8b5cf6]">Prompsy Beta</span>
          </h1>
          <p className="text-base text-[#666] max-w-xl mb-12 font-medium leading-relaxed">
            Choose your Windows installer. Both install the same app — pick the one you're more comfortable with.
          </p>

          {/* Download card */}
          <div className="w-full max-w-md mb-8">
            <div
              className="neu-card p-8 flex flex-col items-center justify-between min-h-[270px] transition-all hover:scale-[1.02] relative"
            >
              <div className="flex flex-col items-center text-center w-full">
                {/* Windows logo */}
                <div className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-5 shadow-md">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.101zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-1">EXE Installer</h3>
                <p className="text-[#666] text-xs font-medium mb-1">Setup Executable (.exe)</p>
                <p className="text-[#aaa] text-[11px] mb-6">Windows 10 & 11 (64-bit)</p>
              </div>

              {downloadStarted === "exe" ? (
                <div className="w-full flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-1">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-emerald-600 text-xs font-semibold">Download started!</p>
                  <button
                    onClick={() => openModal("exe")}
                    className="text-[10px] text-[#aaa] hover:text-[#666] underline underline-offset-2 cursor-pointer mt-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] rounded"
                  >
                    Download again
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openModal("exe")}
                  disabled={downloading !== null}
                  className="w-full bg-[#111111] hover:bg-black text-white font-semibold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                >
                  {downloading === "exe" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .exe
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="neu-card p-6 max-w-2xl w-full text-left">
            <h3 className="text-sm font-bold text-[#111111] mb-3">
              Installation Notes
            </h3>
            <ul className="space-y-2 text-xs text-[#666] leading-relaxed">
              <li className="flex gap-2"><span className="text-[#8b5cf6] font-bold shrink-0">·</span> This is a Beta release — some features may be incomplete or unstable.</li>
              <li className="flex gap-2"><span className="text-[#8b5cf6] font-bold shrink-0">·</span> Windows SmartScreen may show a warning. Click <strong>"More Info" → "Run Anyway"</strong> to proceed safely.</li>
              <li className="flex gap-2"><span className="text-[#8b5cf6] font-bold shrink-0">·</span> Prompsy requires clipboard and global hotkey access to function. Grant permissions when prompted.</li>
              <li className="flex gap-2"><span className="text-[#8b5cf6] font-bold shrink-0">·</span> You'll need your own API key from OpenAI, Anthropic, or Google (BYOK model).</li>
              <li className="flex gap-2"><span className="text-[#8b5cf6] font-bold shrink-0">·</span> Issues? Email <a href="mailto:support@prompsy.app" className="text-[#8b5cf6] hover:underline focus-visible:outline-2 focus-visible:outline-[#8b5cf6] rounded">support@prompsy.app</a></li>
            </ul>
          </div>
        </main>

        {/* Footer curve */}
        <div className="w-full mt-auto relative z-10 shrink-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0,80 L1440,80 L1440,0 C960,60 480,60 0,0 Z" fill="#111111" />
          </svg>
          <footer className="bg-[#111111] w-full pb-8 -mt-1 flex flex-col items-center gap-3 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link href="/privacy-policy" className="text-white/50 hover:text-white/80 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">Privacy Policy</Link>
              <span className="text-white/20 text-xs">·</span>
              <Link href="/terms" className="text-white/50 hover:text-white/80 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">Terms of Service</Link>
              <span className="text-white/20 text-xs">·</span>
              <Link href="/refund-policy" className="text-white/50 hover:text-white/80 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">Refund Policy</Link>
              <span className="text-white/20 text-xs">·</span>
              <Link href="/beta-disclaimer" className="text-white/50 hover:text-white/80 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">Beta Disclaimer</Link>
            </div>
            <p className="text-white/25 text-[11px]">© {new Date().getFullYear()} Prompsy. All rights reserved.</p>
          </footer>
        </div>
      </div>

      {/* ─── LEGAL AGREEMENT MODAL ─── */}
      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-md neu-card p-8 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f4f5f7] hover:bg-[#e8e9ec] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-14 h-14 bg-white border border-black/5 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-[#8b5cf6]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#111111] tracking-tight">Before You Download</h2>
              <p className="text-sm text-[#666] mt-2 leading-relaxed">
                Please read and agree to the following before downloading the Prompsy Beta (.{modal.format}).
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-8">
              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#8b5cf6] ${
                      agreedTerms
                        ? "bg-[#8b5cf6] border-[#8b5cf6]"
                        : "border-[#ccc] bg-white group-hover:border-[#8b5cf6]"
                    }`}
                  >
                    {agreedTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#444] leading-snug">
                  I have read and agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-[#8b5cf6] hover:underline font-semibold focus-visible:outline-none">
                    Terms of Service
                  </Link>
                </span>
              </label>

              {/* Privacy */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    id="agree-privacy"
                    checked={agreedPrivacy}
                    onChange={(e) => setAgreedPrivacy(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#8b5cf6] ${
                      agreedPrivacy
                        ? "bg-[#8b5cf6] border-[#8b5cf6]"
                        : "border-[#ccc] bg-white group-hover:border-[#8b5cf6]"
                    }`}
                  >
                    {agreedPrivacy && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#444] leading-snug">
                  I have read and agree to the{" "}
                  <Link href="/privacy-policy" target="_blank" className="text-[#8b5cf6] hover:underline font-semibold focus-visible:outline-none">
                    Privacy Policy
                  </Link>
                  , including clipboard access disclosure
                </span>
              </label>

              {/* Beta */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    id="agree-beta"
                    checked={agreedBeta}
                    onChange={(e) => setAgreedBeta(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#8b5cf6] ${
                      agreedBeta
                        ? "bg-[#8b5cf6] border-[#8b5cf6]"
                        : "border-[#ccc] bg-white group-hover:border-[#8b5cf6]"
                    }`}
                  >
                    {agreedBeta && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#444] leading-snug">
                  I understand this is a{" "}
                  <Link href="/beta-disclaimer" target="_blank" className="text-[#8b5cf6] hover:underline font-semibold focus-visible:outline-none">
                    Beta release
                  </Link>
                  {" "}and may contain bugs or incomplete features
                </span>
              </label>
            </div>

            {/* Action */}
            <button
              onClick={handleConfirmDownload}
              disabled={!allAgreed}
              className={`w-full font-bold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] ${
                allAgreed
                  ? "bg-[#111111] hover:bg-black text-white"
                  : "bg-[#e8e9ec] text-[#aaa] cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {allAgreed ? `Download .${modal.format}` : "Agree to all terms to continue"}
            </button>

            <p className="text-center text-[10px] text-[#bbb] mt-4">
              By downloading, you confirm your agreement to the above terms.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
