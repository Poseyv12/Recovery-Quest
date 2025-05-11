import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Head from "next/head";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/app_icon.png" />
        <meta name="theme-color" content="#1d4ed8" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NavBar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}