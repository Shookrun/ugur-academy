import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import Navbar from "@/components/layout/Navbar"
import AnimatedBackground from "@/components/ui/AnimatedBackground"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "JestDili",
  description: "Təhsil və inkişaf platforması",
}

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="az"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-[#fafafa]">

        {/* Background */}
        <div className="background-enter">
          <AnimatedBackground />
        </div>

        {/* Bütün sayt */}
        <div className="relative z-10 flex min-h-screen flex-col">

          {/* Navbar */}
          <div className="navbar-enter">
            <Navbar />
          </div>

          {/* Content */}
          <main className="page-enter">
            {children}
          </main>

        </div>

      </body>
    </html>
  )
}