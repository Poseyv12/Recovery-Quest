import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recovery Quest - Gamify Your Recovery Journey",
  description:
    "Turn your recovery journey into an adventure with daily quests, achievements, and community support.",
  manifest: "/manifest.webmanifest",
  themeColor: "#1d4ed8",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Recovery Quest",
  },
  icons: {
    apple: "/images/app_icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NavBar />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}