import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";

// African Museum photo — place the file at public/banner.jpg
const HEADER_IMAGE_URL = '/banner.jpg';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Beth Lesser",
  description: "Photographer, writer, and witness to reggae — Jamaica, 1980s",
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${garamond.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F5EFE0] text-[#163320]">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header
          className="relative overflow-hidden bg-[#163320]"
          style={HEADER_IMAGE_URL ? {
            backgroundImage: `url(${HEADER_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundColor: '#163320',
          } : { backgroundColor: '#163320' }}
        >
          {/* Overlay */}
          <div className={`absolute inset-0 pointer-events-none ${
            HEADER_IMAGE_URL
              ? 'bg-gradient-to-b from-[#0D1C0F]/80 via-[#0D1C0F]/65 to-[#0D1C0F]/80 sm:from-[#0D1C0F]/75 sm:via-[#0D1C0F]/50 sm:to-[#0D1C0F]/75'
              : 'jamaica-texture'
          }`} />

          {/* Top gold rule */}
          <div className="gold-rule" />

          <div className="relative z-10 py-9 text-center px-6">
            {/* Eyebrow */}
            <p
              className="text-[#C8A200] text-[0.65rem] tracking-[0.45em] uppercase mb-3"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Jamaica &nbsp;·&nbsp; Reggae &nbsp;·&nbsp; The 80&rsquo;s
            </p>

            {/* Name */}
            <h1
              className="text-[3rem] sm:text-[4rem] font-normal tracking-[0.18em] uppercase leading-none"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                color: "#E8CC7A",
                textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7), 0 2px 24px rgba(200,162,0,0.25)",
              }}
            >
              Beth Lesser
            </h1>

            {/* Divider with diamond */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-16 sm:w-28 bg-[#C8A200] opacity-60" />
              <span className="text-[#C8A200] text-xs">◆</span>
              <div className="h-px w-16 sm:w-28 bg-[#C8A200] opacity-60" />
            </div>
          </div>

          {/* Bottom gold rule */}
          <div className="gold-rule" />
        </header>

        {/* ── Navigation ─────────────────────────────────────────── */}
        <Nav />

        {/* ── Main content ───────────────────────────────────────── */}
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-12 py-10">
          {children}
        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="bg-[#163320] border-t-2 border-[#C8A200]/40 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-10 bg-[#C8A200] opacity-50" />
            <span className="text-[#C8A200] text-xs">◆</span>
            <div className="h-px w-10 bg-[#C8A200] opacity-50" />
          </div>
          <p
            className="text-[#E8CC7A] text-sm tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Beth Lesser
          </p>
          <a
            href="mailto:bethlesser0@gmail.com"
            className="text-[#C8A200]/80 hover:text-[#E8CC7A] text-sm mt-2 block tracking-wide transition-colors"
            style={{ fontFamily: "var(--font-garamond), Georgia, serif" }}
          >
            bethlesser0@gmail.com
          </a>
          <p className="text-[#C8A200]/60 text-xs mt-2 tracking-wide">
            Photographs &amp; Writings from Jamaica
          </p>
        </footer>

      </body>
    </html>
  );
}
