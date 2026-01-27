import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { QuickCapture } from "@/components/QuickCapture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bob Command Center",
  description: "Task & project management dashboard for AI-human collaboration",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Command Center",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Desktop top navigation */}
        <Navigation />
        
        {/* Main content with safe areas */}
        <main className="pt-safe pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
          <div className="pt-16 md:pt-20">
            {children}
          </div>
        </main>
        
        {/* Mobile bottom navigation */}
        <BottomNav />
        
        {/* Quick capture FAB */}
        <QuickCapture />
      </body>
    </html>
  );
}
