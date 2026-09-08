"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function PageLoader() {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const step = prev < 50 ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 25) + 15
        const next = prev + step
        return next > 100 ? 100 : next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true)
      }, 200)

      const hideTimer = setTimeout(() => {
        setHidden(true)
      }, 550)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [progress])

  if (hidden) return null

  return (
    <div
      aria-label="Səhifə yüklənir..."
      role="status"
      className={`
        fixed inset-0 z-[99999] flex flex-col items-center justify-center
        bg-white text-slate-900 select-none
        transition-opacity duration-350 ease-out
        ${fadeOut ? "pointer-events-none opacity-0" : "opacity-100"}
      `}
    >
      {/* Central Content */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Uğur Academy"
            width={85}
            height={85}
            priority
            className="h-auto w-20 object-contain"
          />
        </div>

        {/* Brand Name */}
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1e3a47]">
          Uğur İnkişaf Mərkəzi
        </h2>

        {/* Clean Minimal Progress Bar */}
        <div className="mt-6 w-48 sm:w-56">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#1e3a47] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Yüklənir...</span>
            <span className="font-semibold text-slate-600">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
