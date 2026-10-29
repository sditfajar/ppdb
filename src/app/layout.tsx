import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ppdb.sditfajar.sch.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  title: {
    default: "PPDB Online — SDIT Fajar",
    template: "%s | SDIT Fajar",
  },
  description:
    "Penerimaan Peserta Didik Baru (PPDB) SDIT Fajar. Formulir pendaftaran siswa baru online, cepat, transparan, dan aman.",
  applicationName: "PPDB Online SDIT Fajar",
  keywords: [
    "PPDB SDIT Fajar",
    "SDIT Fajar",
    "Pendaftaran Siswa Baru",
    "SD Islam Terpadu Fajar",
    "PPDB Online",
    "SDIT Depok",
  ],
  authors: [{ name: "SDIT Fajar", url: siteUrl }],
  creator: "SDIT Fajar",
  publisher: "SDIT Fajar",
  openGraph: {
    title: "PPDB Online — SDIT Fajar",
    description:
      "Penerimaan Peserta Didik Baru (PPDB) SDIT Fajar. Daftarkan putra-putri Anda secara online dengan mudah dan aman.",
    url: "/",
    siteName: "PPDB SDIT Fajar",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PPDB Online — SDIT Fajar",
    description:
      "Penerimaan Peserta Didik Baru (PPDB) SDIT Fajar. Pendaftaran online mudah dan aman.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
