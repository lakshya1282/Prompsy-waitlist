import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Prompsy",
  description:
    "Read the Prompsy Terms of Service. Understand your rights, obligations, and the rules governing your use of our AI prompt enhancement tool.",
};

const LAST_UPDATED = "June 6, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: `By downloading, installing, or using Prompsy (the "App") or visiting our website ("Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our services. These Terms constitute a legally binding agreement between you and Prompsy ("we", "us", or "our"). We reserve the right to update these Terms at any time, and your continued use of the App constitutes acceptance of the revised Terms.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    body: `Prompsy is an AI-powered desktop utility that enhances text prompts using artificial intelligence. The App operates in the background and is triggered via a user-defined global hotkey. The enhanced prompt is then returned to the user via clipboard, auto-paste, or a floating overlay. Prompsy is currently in Beta, meaning features may be incomplete, unstable, or change without notice.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    body: `You must be at least 18 years of age to use Prompsy. By using the App, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using Prompsy on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.`,
  },
  {
    id: "account",
    title: "4. Account & Beta Access",
    body: `Beta access to Prompsy is granted by invitation only. We reserve the right to grant, suspend, or revoke beta access at our sole discretion without notice or liability. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at support@prompsy.app if you become aware of any unauthorised use of your account.`,
  },
  {
    id: "subscriptions",
    title: "5. Subscriptions & Payments",
    body: `Prompsy offers free (limited) and paid (Pro) subscription tiers. Paid subscriptions are billed on a recurring basis (monthly or annually) via Razorpay. You authorise us to charge your selected payment method at the beginning of each billing period. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change pricing with 30 days' advance notice. Refunds are governed by our Refund & Cancellation Policy.`,
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable Use Policy",
    body: `You agree NOT to use Prompsy to: generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene; generate content that exploits or harms minors in any way; create, distribute, or facilitate spam, phishing, or fraudulent content; circumvent, hack, or reverse engineer any part of the App or its underlying systems; violate the terms of service of any third-party AI provider (OpenAI, Anthropic, etc.) via the output of Prompsy; infringe any intellectual property rights of any party; or use the App for any purpose that violates applicable Indian law or international regulations. Violation of this policy may result in immediate account suspension without refund.`,
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    body: `Prompsy and all its original content, features, and functionality are owned by us and are protected by applicable intellectual property laws. You retain all rights to the text you input into Prompsy. We do not claim ownership over your prompts or the enhanced outputs. You grant us a limited, non-exclusive, royalty-free licence to process your input solely for the purpose of delivering the enhancement service.`,
  },
  {
    id: "ai-disclaimer",
    title: "8. AI Output Disclaimer",
    body: `Prompsy uses third-party AI models to enhance your prompts. We do not guarantee the accuracy, quality, safety, or suitability of AI-generated output. Enhanced prompts are provided "as-is" and you use them at your own risk. We are not responsible for any decisions made based on AI-enhanced output. Always review AI output before using it in any critical context.`,
  },
  {
    id: "privacy",
    title: "9. Privacy",
    body: `Your use of Prompsy is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using Prompsy, you consent to our collection and use of your personal data as described in the Privacy Policy. Please review it carefully — especially the section on clipboard access, which is central to how the App operates.`,
  },
  {
    id: "termination",
    title: "10. Termination",
    body: `You may cancel your account and subscription at any time through the App settings. We reserve the right to suspend or terminate your access immediately and without prior notice if we determine you have violated these Terms, your subscription payment fails and is not remedied within 7 days, or we are required to do so by law. Upon termination, your right to use the App ceases immediately. Your data will be handled in accordance with our Privacy Policy.`,
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    body: `To the maximum extent permitted by applicable law, Prompsy and its founders, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the App, including but not limited to loss of data, loss of profits, or business interruption. Our total aggregate liability to you for any claims arising out of these Terms shall not exceed the amount you paid to Prompsy in the 3 months preceding the event giving rise to the claim.`,
  },
  {
    id: "disclaimer",
    title: "12. Disclaimer of Warranties",
    body: `Prompsy is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components. This is particularly applicable during the Beta period.`,
  },
  {
    id: "governing-law",
    title: "13. Governing Law & Dispute Resolution",
    body: `These Terms are governed by and construed in accordance with the laws of India. Any disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the courts located in India. We encourage you to contact us first at support@prompsy.app before initiating any formal dispute, as we are committed to resolving issues amicably.`,
  },
  {
    id: "contact",
    title: "14. Contact",
    body: `For any questions about these Terms, please contact us at: support@prompsy.app. We aim to respond within 5 business days.`,
  },
];

export default function TermsOfServicePage() {
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
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Legal Document
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight mb-4 leading-tight">
          Terms of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
            Service
          </span>
        </h1>
        <p className="text-[#666666] text-base max-w-xl font-medium leading-relaxed">
          These terms govern your use of Prompsy. Please read them carefully — they're
          written to be clear and fair.
        </p>
        <p className="text-[#999999] text-sm mt-4">Last updated: {LAST_UPDATED}</p>
      </section>

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

        {/* Footer nav */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link href="/privacy-policy" className="text-xs text-[#8b5cf6] hover:underline font-medium">Privacy Policy</Link>
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
