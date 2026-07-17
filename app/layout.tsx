import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav/Nav";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { StatusBar } from "@/components/chrome/StatusBar";
import { AskProvider } from "@/components/ask-my-work/AskContext";
import { AskWidget } from "@/components/ask-my-work/AskWidget";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jayanth Krishna — AI Engineer",
  description:
    "AI Engineer building production RAG systems. Portfolio with live retrieval over his own work.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      id="top"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased pb-8">
        <SmoothScrollProvider>
          <AskProvider>
            <GrainOverlay />
            <Nav />
            <main className="relative z-[1]">{children}</main>
            <StatusBar />
            <AskWidget />
          </AskProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
