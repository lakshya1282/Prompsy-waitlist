import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Prompsy",
  description:
    "Understand Prompsy's refund and cancellation policy. We aim to be fair and transparent about how subscription refunds and cancellations are handled.",
};

const LAST_UPDATED = "June 6, 2026";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    body: `This Refund & Cancellation Policy ("Policy") governs all payments made to Prompsy for our subscription plans. By purchasing a Prompsy subscription, you acknowledge and agree to the terms outlined in this Policy. This Policy is compliant with India's Consumer Protection Act 2019 and the Consumer Protection (E-Commerce) Rules 2020.`,
  },
  {
    id: "subscriptions",
    title: "2. Subscription Plans",
    body: `Prompsy offers the following subscription tiers: a Free plan with limited daily enhancements at no cost, and a Pro plan with unlimited enhancements, all enhancement modes, prompt history, custom templates, and priority support — billed monthly or annually. All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise at the time of purchase.`,
  },

  {
    id: "refund-eligibility",
    title: "4. Refund Eligibility",
    body: `We offer refunds under the following circumstances: (a) You request a refund within 7 days of your initial subscription purchase and have not used the Pro features excessively (more than 50 enhancements). (b) You experienced a significant service outage (more than 24 hours of continuous downtime) during your paid period. (c) You were charged incorrectly due to a billing error on our part. (d) The App fails to launch or function at all on your supported operating system despite following all setup instructions and our support team is unable to resolve the issue within 72 hours. Refunds are not available for: partial subscription periods; change of mind after 7 days; dissatisfaction with AI output quality (as AI results can be subjective); or accounts found to be in violation of our Terms of Service or Acceptable Use Policy.`,
  },
  {
    id: "cancellation",
    title: "5. Cancellation",
    body: `You may cancel your Prompsy Pro subscription at any time through the App settings under Account > Subscription > Cancel Plan. Upon cancellation: Your subscription will remain active until the end of the current billing period. You will not be charged again after the current period ends. You will retain access to Pro features until your subscription expires. We do not offer prorated refunds for cancellations mid-period, except as covered under Section 4 above.`,
  },
  {
    id: "annual-plans",
    title: "6. Annual Plan Refunds",
    body: `For annual subscription holders: A full refund is available within 7 days of purchase (see Section 4a). After 7 days, a prorated refund may be considered at our discretion for the unused months, provided a valid reason is submitted. Annual plan refunds are handled on a case-by-case basis. Contact us at billing@prompsy.app with your account email and reason for the refund request.`,
  },
  {
    id: "how-to-request",
    title: "7. How to Request a Refund",
    body: `To request a refund, email us at billing@prompsy.app with the subject line "Refund Request — [Your Registered Email]". Please include: your registered email address, the date of purchase, your Razorpay payment ID (found in your purchase confirmation email), and a brief description of the reason for your request. We will acknowledge your request within 2 business days and process eligible refunds within 7–10 business days. Refunds will be issued to the original payment method used at the time of purchase.`,
  },
  {
    id: "payment-failures",
    title: "8. Failed Payments & Auto-Renewal",
    body: `If a subscription renewal payment fails, we will attempt to retry the charge up to 3 times over 7 days. If the payment continues to fail, your subscription will be downgraded to the Free plan. You will be notified via email before and after any payment failure. You can update your payment method at any time in the App settings.`,
  },
  {
    id: "disputes",
    title: "9. Disputes & Chargebacks",
    body: `We strongly encourage you to contact us at billing@prompsy.app before initiating a chargeback with your bank or payment provider. Most issues can be resolved quickly and amicably. Chargebacks initiated without prior contact may result in account suspension. We reserve the right to dispute chargebacks where the refund request falls outside the terms of this Policy.`,
  },
  {
    id: "contact",
    title: "10. Contact Us",
    body: `For all billing and refund-related queries, contact us at: billing@prompsy.app. Business hours: Monday to Friday, 10:00 AM – 6:00 PM IST. We aim to respond to all billing queries within 2 business days.`,
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-center pt-4 px-4">
        <div className="w-full max-w-4xl bg-[#111111] rounded-full flex items-center px-6 py-3 shadow-lg">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Prompsy Logo" className="w-4 h-4 object-contain" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">Prompsy</span>
          </Link>
          <Link
            href="/"
            className="ml-auto text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-16 pb-10 px-6">
        <div className="bg-[#111111] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest mb-6 flex items-center gap-2 uppercase shadow-xl">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Legal Document
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight mb-4 leading-tight">
          Refund &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
            Cancellation
          </span>
        </h1>
        <p className="text-[#666666] text-base max-w-xl font-medium leading-relaxed">
          We believe in being fair. Here's everything you need to know about refunds,
          cancellations, and how we handle billing issues.
        </p>
        <p className="text-[#999999] text-sm mt-4">Last updated: {LAST_UPDATED}</p>
      </section>

      {/* Quick Summary Card */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] p-[1px]">
          <div className="bg-[#f4f5f7] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-[#111111] mb-4 tracking-tight uppercase">
              ⚡ Quick Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Full Refund Window", value: "7 days", sub: "from initial purchase" },
                { label: "Refund Processing", value: "7–10 days", sub: "to original payment method" },
                { label: "Cancellation", value: "Anytime", sub: "access until period ends" },
              ].map((item) => (
                <div key={item.label} className="neu-card p-4 text-center">
                  <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] mb-1">
                    {item.value}
                  </div>
                  <div className="text-[11px] font-bold text-[#111111] uppercase tracking-wide">{item.label}</div>
                  <div className="text-[11px] text-[#888] mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pb-24">
        {/* Table of Contents */}
        <div className="neu-card p-8 mb-10">
          <h2 className="text-base font-bold text-[#111111] mb-4 tracking-tight">Table of Contents</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] transition-colors font-medium"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="neu-card p-8 scroll-mt-24"
            >
              <h2 className="text-lg font-bold text-[#111111] mb-4 tracking-tight">
                {section.title}
              </h2>
              <p className="text-[#555555] text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="neu-card p-8 mt-10 text-center">
          <p className="text-[#333333] text-sm font-semibold mb-2">Have a billing question?</p>
          <p className="text-[#666666] text-sm mb-5">We're happy to help. Reach out and we'll sort it out.</p>
          <a
            href="mailto:billing@prompsy.app"
            className="inline-block bg-[#111111] hover:bg-black text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-md"
          >
            Contact Billing Support
          </a>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link href="/privacy-policy" className="text-xs text-[#8b5cf6] hover:underline font-medium">Privacy Policy</Link>
          <span className="text-[#ccc] text-xs">·</span>
          <Link href="/terms" className="text-xs text-[#8b5cf6] hover:underline font-medium">Terms of Service</Link>
        </div>
      </main>

      {/* Footer curve */}
      <div className="w-full relative shrink-0">
        <svg viewBox="0 0 1440 80" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0,80 L1440,80 L1440,0 C960,60 480,60 0,0 Z" fill="#111111" />
        </svg>
        <footer className="bg-[#111111] w-full py-6 -mt-1 text-center">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Prompsy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
