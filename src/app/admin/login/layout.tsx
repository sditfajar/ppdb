import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Admin — PPDB SDIT Fajar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
