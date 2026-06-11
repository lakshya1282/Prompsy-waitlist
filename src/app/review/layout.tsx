import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Review — Prompsy",
  description:
    "Share your experience with Prompsy. Post a review, report a bug, or request a feature. We read every submission.",
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
