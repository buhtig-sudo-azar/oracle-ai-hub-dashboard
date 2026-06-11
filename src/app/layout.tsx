import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oracle AI Developer Hub — Project Explorer",
  description: "Interactive dashboard showcasing 15+ AI projects, notebooks, workshops, and guides from Oracle AI Developer Hub. Explore reasoning agents, RAG systems, vector search, and more.",
  keywords: ["Oracle", "AI", "Developer Hub", "Agents", "RAG", "Vector Search", "LLM", "Reasoning"],
  authors: [{ name: "Oracle DevRel" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Oracle AI Developer Hub",
    description: "Explore 15+ AI projects from Oracle",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
