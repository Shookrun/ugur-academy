import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

import Navbar from "@/components/layout/Navbar"
import AnimatedBackground from "@/components/ui/AnimatedBackground"
import Footer from "@/components/layout/Footer"
import PageLoader from "@/components/ui/PageLoader"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Uğur Şəxsi İnkişaf Mərkəzi",
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
      <body className="relative z-0 min-h-screen bg-slate-50 text-slate-900">
        {/* Page Loader */}
        <PageLoader />

        {/* Background - z-index -1 ilə ən arxaya keçirilir */}
        <div className="jestdili-background-animation pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <AnimatedBackground />
        </div>

        {/* Navbar - birbaşa ən üstdə yerləşdirilir, kliklər tam işləkdir */}
        <Navbar />

        {/* Məzmun z-10 ilə yuxarı qaldırılır */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <main className="jestdili-page-animation flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}