"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

const CATEGORIES = [
  { value: "review", label: "⭐ User Review" },
  { value: "bug", label: "🐛 Bug Report" },
  { value: "feature", label: "💡 Feature Request" },
  { value: "billing", label: "💳 Billing Issue" },
  { value: "account", label: "👤 Account Help" },
  { value: "other", label: "💬 Other" },
];

const RATINGS = [1, 2, 3, 4, 5];

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("review");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isReview = category === "review";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isReview && rating === 0) {
      setErrorMsg("Please select a star rating.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? category;
    const ratingLine = isReview ? `Rating: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)\n\n` : "";

    try {
      const res = await fetch("/api/admin/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: `[${categoryLabel}] ${subject}`,
          message: `Name: ${name}\n${ratingLine}${message}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans overflow-x-hidden">

      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 flex justify-center pt-5 px-4">
        <nav className="w-full max-w-5xl bg-[#111111] rounded-full flex items-center px-8 py-4 shadow-xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Prompsy" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">Prompsy</span>
          </Link>
          <Link
            href="/download"
            className="ml-auto bg-white text-[#111111] text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white/90 transition-all shadow-sm"
          >
            Download
          </Link>
        </nav>
      </header>

      {/* ─── HERO ─── */}
      <section className="pt-20 pb-16 px-6 text-center relative overflow-hidden">
        <div className="neu-circle w-[600px] h-[600px] -top-[30%] left-[50%] -translate-x-1/2 opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-black/15 bg-white/70 text-[#111111] px-5 py-2 rounded-full text-xs font-bold tracking-widest mb-8 uppercase shadow-sm">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" className="text-amber-500">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Reviews &amp; Feedback
          </div>
          <h1 className="text-[36px] md:text-[52px] font-bold text-[#111111] tracking-tight leading-[1.1] mb-5">
            Tell us what you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
              think.
            </span>
          </h1>
          <p className="text-[#555555] text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Your feedback shapes Prompsy. Leave a review, report a bug, or suggest a feature — we read and act on every submission.
          </p>
        </div>
      </section>

      {/* ─── MAIN ─── */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* Left: Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-amber-500">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ),
                title: "Post a Review",
                desc: "Share your honest experience",
                sub: "Helps others discover Prompsy",
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-red-500">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ),
                title: "Report a Bug",
                desc: "Found something broken?",
                sub: "All reports are tracked & prioritized",
              },
              {
                icon: (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-[#8b5cf6]">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.995.012-2.067.012-3a5 5 0 10-9.9 0c0 .933-.003 2.005.013 3h9.875z" />
                  </svg>
                ),
                title: "Request a Feature",
                desc: "Shape the Prompsy roadmap",
                sub: "We read every suggestion",
              },
            ].map((card) => (
              <div key={card.title} className="neu-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                  {card.icon}
                </div>
                <div>
                  <p className="font-bold text-[#111111] text-sm mb-0.5">{card.title}</p>
                  <p className="text-[#333] text-sm font-medium">{card.desc}</p>
                  <p className="text-[#888] text-xs mt-1">{card.sub}</p>
                </div>
              </div>
            ))}

            <div className="border border-black/5 bg-white/60 rounded-2xl p-6">
              <p className="text-xs font-bold text-[#111] uppercase tracking-widest mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm text-[#555] hover:text-[#111] font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[#8b5cf6] group-hover:translate-x-1 transition-transform inline-block">→</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="neu-card p-12 text-center flex flex-col items-center gap-5">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="28" height="28" className="text-emerald-500">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#111111] tracking-tight mb-2">Thank you!</h2>
                  <p className="text-[#555] text-base leading-relaxed">
                    Your {isReview ? "review" : "message"} has been received. We&apos;ll follow up at <strong>{email}</strong> if needed.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setName(""); setEmail(""); setSubject(""); setMessage(""); setCategory("review"); setRating(0);
                  }}
                  className="mt-2 text-sm text-[#8b5cf6] font-bold hover:underline"
                >
                  Submit another →
                </button>
              </div>
            ) : (
              <div className="neu-card p-8 md:p-10">
                <h2 className="text-xl font-bold text-[#111111] tracking-tight mb-1">Share your experience</h2>
                <p className="text-[#888] text-sm mb-8">All fields are required.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="review-name" className="text-xs font-bold text-[#555] uppercase tracking-wider">Your Name</label>
                      <input
                        id="review-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#111] text-sm font-medium placeholder-[#bbb] outline-none focus:border-[#8b5cf6]/40 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="review-email" className="text-xs font-bold text-[#555] uppercase tracking-wider">Email Address</label>
                      <input
                        id="review-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#111] text-sm font-medium placeholder-[#bbb] outline-none focus:border-[#8b5cf6]/40 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="review-category" className="text-xs font-bold text-[#555] uppercase tracking-wider">Type</label>
                    <select
                      id="review-category"
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setRating(0); }}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#111] text-sm font-medium outline-none focus:border-[#8b5cf6]/40 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Star Rating — only shown for reviews */}
                  {isReview && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[#555] uppercase tracking-wider">Your Rating</label>
                      <div className="flex items-center gap-2">
                        {RATINGS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            id={`star-${r}`}
                            onMouseEnter={() => setHoveredRating(r)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(r)}
                            className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                            aria-label={`Rate ${r} out of 5`}
                          >
                            <span className={
                              r <= (hoveredRating || rating)
                                ? "text-amber-400"
                                : "text-[#ddd]"
                            }>
                              ★
                            </span>
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-sm font-semibold text-[#555]">
                            {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="review-subject" className="text-xs font-bold text-[#555] uppercase tracking-wider">
                      {isReview ? "Review Title" : "Subject"}
                    </label>
                    <input
                      id="review-subject"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={isReview ? "e.g. Game-changer for my workflow" : "Brief description of your issue"}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#111] text-sm font-medium placeholder-[#bbb] outline-none focus:border-[#8b5cf6]/40 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="review-message" className="text-xs font-bold text-[#555] uppercase tracking-wider">
                      {isReview ? "Your Review" : "Message"}
                    </label>
                    <textarea
                      id="review-message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isReview
                          ? "Tell us how Prompsy has improved your workflow, what you love, or what could be better…"
                          : "Describe your issue in detail. For bugs, include your OS version and Prompsy version."
                      }
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#111] text-sm font-medium placeholder-[#bbb] outline-none focus:border-[#8b5cf6]/40 focus:ring-2 focus:ring-[#8b5cf6]/10 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    id="review-submit-btn"
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex items-center justify-center gap-3 bg-[#111111] hover:bg-black text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        {isReview ? "Submit Review" : "Send Message"}
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="group-hover:translate-x-1 transition-transform">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-[#aaa] text-xs text-center">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy-policy" className="underline hover:text-[#555]">Privacy Policy</Link>.
                  </p>
                </form>
              </div>
            )}
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
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/25 text-sm font-semibold">© {new Date().getFullYear()} Prompsy. All rights reserved.</p>
              <p className="text-white/25 text-sm font-semibold">Made in India · v0.9.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
