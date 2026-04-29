import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRegisterClient from "@/components/SWRegisterClient";

export const metadata: Metadata = {
  title: "HabiLog - Habit Tracker PWA",
  description: "Log your habits, track your progress, and build a better life.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HabiLog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SWRegisterClient />
        {children}
      </body>
    </html>
  );
}
