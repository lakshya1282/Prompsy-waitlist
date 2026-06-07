import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Prompsy",
  description:
    "Learn how Prompsy collects, uses, and protects your personal data. We are committed to transparency and your privacy.",
};

const LAST_UPDATED = "June 6, 2026";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "1.1 Information You Provide",
        body: "When you join our waitlist or create an account, we collect your email address. If you purchase a subscription, your billing details are processed securely by our payment partner, Razorpay. We do not store your full card or UPI credentials on our servers.",
      },
      {
        subtitle: "1.2 Clipboard Data",
        body: "Prompsy requires access to your system clipboard to capture selected text for AI enhancement. IMPORTANT: Clipboard content is accessed only when you trigger the hotkey, is processed in real-time for enhancement, is never stored on our servers or logged, and is discarded immediately after enhancement. We treat clipboard data as strictly ephemeral and private.",
      },
      {
        subtitle: "1.3 Usage Data",
        body: "We may collect anonymised usage statistics such as feature usage frequency, enhancement mode preferences, and error reports. This data cannot be used to identify you personally and helps us improve the product.",
      },
      {
        subtitle: "1.4 Device & Technical Data",
        body: "We may collect your operating system type and version, app version, and crash logs to provide support and improve stability.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "",
        body: "We use the information we collect to: provide, operate, and improve the Prompsy application and services; process payments and manage your subscription; send you important service updates, security alerts, and product announcements (you may opt out of marketing emails at any time); respond to your support requests; comply with legal obligations under applicable Indian law, including the Information Technology Act 2000 and the Digital Personal Data Protection (DPDP) Act 2023.",
      },
    ],
  },
  {
    id: "clipboard-transparency",
    title: "3. Clipboard Access — Full Transparency",
    content: [
      {
        subtitle: "Why We Need It",
        body: "Prompsy's core function is to intercept text you have selected and enhance it using AI. This necessarily requires reading from your clipboard. Without this, the app cannot work.",
      },
      {
        subtitle: "What We Do NOT Do",
        body: "We do not continuously monitor your clipboard in the background. We do not read your clipboard unless you explicitly trigger the Prompsy hotkey. We do not send raw clipboard content to third parties — only the text you trigger for enhancement is sent to the AI provider for processing. We do not store clipboard history on our servers.",
      },
      {
        subtitle: "AI Processing",
        body: "When you trigger an enhancement, the selected text is sent to a third-party AI provider (such as OpenAI or Anthropic) via an encrypted API call. Their data processing is governed by their respective privacy policies. We recommend reviewing them at openai.com/privacy and anthropic.com/privacy.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing & Third Parties",
    content: [
      {
        subtitle: "",
        body: "We do not sell your personal data. We may share your data with: Supabase (database & authentication infrastructure); Razorpay (payment processing); AI providers (OpenAI, Anthropic — for prompt enhancement only); and legal authorities if required by law. All third-party processors are contractually obligated to protect your data.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    content: [
      {
        subtitle: "",
        body: "We retain your account data for as long as your account is active or as needed to provide services. If you request account deletion, we will delete your personal data within 30 days, except where retention is required by law (e.g. financial records for tax compliance). Anonymised analytics data may be retained indefinitely.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights (DPDP Act 2023 & GDPR)",
    content: [
      {
        subtitle: "",
        body: "You have the right to: access the personal data we hold about you; correct inaccurate personal data; request deletion of your personal data; withdraw consent for processing at any time; object to or restrict certain types of processing; and lodge a complaint with the relevant data protection authority. To exercise any of these rights, contact us at privacy@prompsy.app.",
      },
    ],
  },
  {
    id: "security",
    title: "7. Security",
    content: [
      {
        subtitle: "",
        body: "We use industry-standard security measures including TLS encryption for all data in transit, encrypted storage for API keys and credentials, and regular security reviews. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your Prompsy account.",
      },
    ],
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    content: [
      {
        subtitle: "",
        body: "Prompsy is not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, please contact us immediately and we will delete it.",
      },
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: [
      {
        subtitle: "",
        body: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use of Prompsy after changes constitutes acceptance of the updated policy.",
      },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      {
        subtitle: "",
        body: "For privacy-related queries, data requests, or concerns, please contact us at: privacy@prompsy.app. We aim to respond to all requests within 15 business days.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Legal Document
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight mb-4 leading-tight">
          Privacy{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
            Policy
          </span>
        </h1>
        <p className="text-[#666666] text-base max-w-xl font-medium leading-relaxed">
          We believe privacy is a right, not a feature. Here's exactly how we handle your data —
          no legalese, no surprises.
        </p>
        <p className="text-[#999999] text-sm mt-4">Last updated: {LAST_UPDATED}</p>
      </section>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pb-24">
        {/* Table of Contents */}
        <div className="neu-card p-8 mb-10">
          <h2 className="text-base font-bold text-[#111111] mb-4 tracking-tight">Table of Contents</h2>
          <ul className="space-y-2">
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
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="neu-card p-8 scroll-mt-24"
            >
              <h2 className="text-lg font-bold text-[#111111] mb-5 tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-5">
                {section.content.map((block, i) => (
                  <div key={i}>
                    {block.subtitle && (
                      <h3 className="text-sm font-bold text-[#333333] mb-2">
                        {block.subtitle}
                      </h3>
                    )}
                    <p className="text-[#555555] text-sm leading-relaxed">{block.body}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link href="/terms" className="text-xs text-[#8b5cf6] hover:underline font-medium">Terms of Service</Link>
          <span className="text-[#ccc] text-xs">·</span>
          <Link href="/refund-policy" className="text-xs text-[#8b5cf6] hover:underline font-medium">Refund Policy</Link>
          <span className="text-[#ccc] text-xs">·</span>
          <Link href="/beta-disclaimer" className="text-xs text-[#8b5cf6] hover:underline font-medium">Beta Disclaimer</Link>
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
