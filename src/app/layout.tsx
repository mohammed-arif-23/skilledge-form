import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVSEC SkillEdge — Elite Students Portal",
  description: "AVS Engineering College — SkillEdge Elite Students Form Portal. Register, manage, and track elite programme participants.",
  keywords: ["AVS Engineering College", "SkillEdge", "Elite Students", "Form Portal", "AVSEC"],
  authors: [{ name: "AVS Engineering College" }],
  openGraph: {
    title: "AVSEC SkillEdge — Elite Students Portal",
    description: "AVS Engineering College SkillEdge Elite Students Form Portal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col font-[var(--font-inter)] bg-[#F4F6FD]`}>
        {children}
      </body>
    </html>
  );
}
