import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import Navbar from "@/components/layout/Navbar"
import AnimatedBackground from "@/components/ui/AnimatedBackground"
import Footer from "@/components/layout/Footer"

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
      <body className="min-h-screen bg-white">

        {/* Background */}
        <div className="jestdili-background-animation">
          <AnimatedBackground />
        </div>

        {/* Navbar */}
        <div className="jestdili-navbar-animation">
          <Navbar />
        </div>

        {/* Main content */}
        <main className="jestdili-page-animation">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  )
}