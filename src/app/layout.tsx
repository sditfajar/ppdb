import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sditfajar.sch.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  title: {
    default: "SPMB — SDIT Fajar",
    template: "%s | SDIT Fajar",
  },
  description:
    "Sistem Penerimaan Murid Baru (SPMB) SDIT Fajar. Formulir pendaftaran siswa baru online, cepat, transparan, dan aman.",
  applicationName: "SPMB SDIT Fajar",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "SPMB SDIT Fajar",
    "SDIT Fajar",
    "Pendaftaran Siswa Baru",
    "SD Islam Terpadu Fajar",
    "SPMB",
    "SDIT Depok",
  ],
  authors: [{ name: "SDIT Fajar", url: siteUrl }],
  creator: "SDIT Fajar",
  publisher: "SDIT Fajar",
  openGraph: {
    title: "SPMB — SDIT Fajar",
    description:
      "Sistem Penerimaan Murid Baru (SPMB) SDIT Fajar. Daftarkan putra-putri Anda secara online dengan mudah dan aman.",
    url: "/",
    siteName: "SPMB SDIT Fajar",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPMB — SDIT Fajar",
    description:
      "Sistem Penerimaan Murid Baru (SPMB) SDIT Fajar. Pendaftaran online mudah dan aman.",
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var clean=p.length>1&&p.endsWith('/')?p.slice(0,-1):p;var isLocked=clean===''||clean==='/'||clean==='/spmb'||clean.indexOf('/spmb/')===0;var theme='light';if(!isLocked){var stored=localStorage.getItem('theme');if(stored==='dark'||stored==='light'){theme=stored;}}var root=document.documentElement;root.setAttribute('data-theme',theme);if(theme==='dark'){root.classList.add('dark');root.classList.remove('light');root.style.colorScheme='dark';}else{root.classList.add('light');root.classList.remove('dark');root.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
