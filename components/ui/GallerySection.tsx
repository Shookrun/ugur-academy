"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { galleryItems } from "@/data/gallery"

const SLIDE_INTERVAL = 4500

export default function GallerySection() {
  const [items, setItems] = useState(galleryItems)

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setItems(data)
        }
      })
      .catch(() => {})
  }, [])

  const featured = items.filter((item) => item.featured).length > 0
    ? items.filter((item) => item.featured)
    : items
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent((index + featured.length) % featured.length)
      setTimeout(() => setIsTransitioning(false), 600)
    },
    [isTransitioning, featured.length]
  )

  const goNext = useCallback(() => {
    goTo(current + 1)
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo(current - 1)
  }, [current, goTo])

  /* Auto-play */
  useEffect(() => {
    if (isHovered) return
    timerRef.current = setInterval(goNext, SLIDE_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [goNext, isHovered])

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, goPrev])

  return (
    <section
      id="galereya"
      className="relative overflow-hidden py-20 sm:py-28"
      aria-label="Galereya"
    >
      {/* Section header */}
      <div className="relative z-10 mb-12 px-4 text-center sm:mb-16">


        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Uğur Şəxsi İnkişaf Mərkəzindən görüntülər

        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
          Tədris prosesi, mərasimlər və unudulmaz anlara nəzər atın.
        </p>
      </div>

      {/* Slider */}
      <div
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Slides */}
          <div className="relative h-[340px] sm:h-[460px] lg:h-[560px]">
            {featured.map((item, idx) => {
              const isCurrent = idx === current
              return (
                <div
                  key={item.id}
                  aria-hidden={!isCurrent}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${isCurrent
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-[1.02] z-0"
                    }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1152px"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Caption */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-6 sm:p-10 transition-all duration-700 delay-200 ${isCurrent
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                      }`}
                  >
                    <span className="mb-2 inline-block rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">{item.date}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Prev button */}
          <button
            id="gallery-prev-btn"
            onClick={goPrev}
            aria-label="Əvvəlki şəkil"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 sm:left-6 sm:h-12 sm:w-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next button */}
          <button
            id="gallery-next-btn"
            onClick={goNext}
            aria-label="Növbəti şəkil"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 sm:right-6 sm:h-12 sm:w-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Progress bar */}
          {!isHovered && (
            <div className="absolute bottom-0 left-0 z-20 h-[3px] w-full">
              <div
                key={current}
                className="h-full bg-white/60 gallery-progress-bar"
              />
            </div>
          )}
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {featured.map((_, idx) => (
            <button
              key={idx}
              id={`gallery-dot-${idx}`}
              onClick={() => goTo(idx)}
              aria-label={`${idx + 1}-ci şəkilə keç`}
              aria-current={idx === current ? "true" : undefined}
              className={`rounded-full transition-all duration-300 ${idx === current
                ? "w-8 h-2.5 bg-indigo-600"
                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {featured.map((item, idx) => (
            <button
              key={item.id}
              id={`gallery-thumb-${idx}`}
              onClick={() => goTo(idx)}
              aria-label={item.title}
              className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${idx === current
                ? "ring-2 ring-indigo-500 ring-offset-2 scale-[0.98]"
                : "opacity-60 hover:opacity-90 hover:scale-[0.99]"
                }`}
            >
              <div className="relative h-20 sm:h-28">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 384px"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-12 flex justify-center px-4">
        <Link
          href="/galereya"
          id="gallery-view-all-link"
          className="group inline-flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md"
        >
          <span>Bütün fotoları gör</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">→</span>
        </Link>
      </div>
    </section>
  )
}
