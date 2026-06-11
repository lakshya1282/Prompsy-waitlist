import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support — Prompsy",
  description:
    "Submit a bug report, feature request, or general query to the Prompsy team. We respond within 24–48 hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
