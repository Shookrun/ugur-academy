"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { galleryItems } from "@/data/gallery"

const SLIDE_INTERVAL = 5000

/* ────────────────────────────────────────────────────────────────
   GALLERY SECTION  –  Cinematic hero + animated masonry strip
──────────────────────────────────────────────────────────────── */
export default function GallerySection() {
  const [items, setItems] = useState(galleryItems)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d) && d.length > 0) setItems(d)
      })
      .catch(() => {})
  }, [])

  /* featured slides */
  const featured = items.filter((i) => i.featured).length
    ? items.filter((i) => i.featured)
    : items.slice(0, 3)

  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return
      setPrev(current)
      setAnimating(true)
      setCurrent((idx + featured.length) % featured.length)
      setTimeout(() => {
        setPrev(null)
        setAnimating(false)
      }, 700)
    },
    [animating, current, featured.length]
  )

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (hovered) return
    timerRef.current = setInterval(goNext, SLIDE_INTERVAL)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [goNext, hovered])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [goNext, goPrev])

  /* grid items – everything except featured */
  const grid = items.filter((i) => !i.featured).slice(0, 3)

  return (
    <section
      id="galereya"
      className="relative overflow-hidden bg-[#06080f] py-24 sm:py-32"
      aria-label="Galereya"
    >
      {/* subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Section header */}
      <div className="relative z-10 mb-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Fotoqalereya
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Akademiya{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(to right, #818cf8, #a78bfa, #f472b6)" }}
          >
            həyatından anlar
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
          Tədris prosesi, mərasimlər və unudulmaz anlara nəzər atın.
        </p>
      </div>

      {/* Main layout: hero slider + side grid */}
      <div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

          {/* ====== HERO SLIDER ====== */}
          <div
            className="relative overflow-hidden rounded-[1.75rem]"
            style={{
              minHeight: 460,
              boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            }}
          >
            {featured.map((item, idx) => {
              const isCur = idx === current
              const isPrev = idx === prev
              let zIndex = 0
              let opacity = 0
              let scale = "scale-[1.04]"
              if (isCur) { zIndex = 20; opacity = 1; scale = "scale-100" }
              else if (isPrev) { zIndex = 10; opacity = 0; scale = "scale-[0.97]" }

              return (
                <div
                  key={item.id}
                  aria-hidden={!isCur}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${scale}`}
                  style={{ zIndex, opacity }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 800px"
                  />
                  {/* cinematic overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                  {/* caption */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 transition-all duration-700 delay-150"
                    style={{ transform: isCur ? "translateY(0)" : "translateY(24px)", opacity: isCur ? 1 : 0 }}
                  >
                    <span
                      className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <span className="h-1 w-1 rounded-full bg-indigo-400" />
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-white/60">{item.date}</p>
                  </div>
                </div>
              )
            })}

            {/* nav arrows */}
            <button
              id="gallery-prev-btn"
              onClick={goPrev}
              aria-label="Əvvəlki"
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              id="gallery-next-btn"
              onClick={goNext}
              aria-label="Növbəti"
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* dot indicators */}
            <div className="absolute bottom-5 right-5 z-30 flex items-center gap-1.5">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  id={`gallery-dot-${idx}`}
                  onClick={() => goTo(idx)}
                  aria-label={`${idx + 1}-ci şəkilə keç`}
                  aria-current={idx === current ? "true" : undefined}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === current ? 24 : 8,
                    height: 8,
                    background: idx === current ? "#818cf8" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>

            {/* progress bar */}
            {!hovered && (
              <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px]" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div key={current} className="h-full gallery-progress-bar" style={{ background: "rgba(129,140,248,0.8)" }} />
              </div>
            )}
          </div>

          {/* ====== SIDE GRID ====== */}
          <div className="flex flex-col gap-4 lg:max-h-[460px]">
            {(grid.length ? grid : items.slice(0, 3)).map((item, idx) => (
              <Link
                key={item.id}
                href="/galereya"
                id={`gallery-side-${idx}`}
                className="group relative flex-1 overflow-hidden rounded-2xl"
                style={{ minHeight: 132, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="300px"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)",
                    opacity: 0.8,
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span
                    className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/70 backdrop-blur-sm"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {item.category}
                  </span>
                  <p className="text-sm font-bold leading-tight text-white">{item.title}</p>
                </div>
                {/* zoom icon */}
                <div
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Thumbnail filmstrip */}
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {featured.map((item, idx) => (
            <button
              key={item.id}
              id={`gallery-thumb-${idx}`}
              onClick={() => goTo(idx)}
              aria-label={item.title}
              className="relative shrink-0 overflow-hidden rounded-xl transition-all duration-300"
              style={{
                width: 100,
                height: 64,
                opacity: idx === current ? 1 : 0.4,
                transform: idx === current ? "scale(1.05)" : "scale(1)",
                boxShadow: idx === current ? "0 0 0 2px #818cf8, 0 0 0 4px #06080f" : "none",
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-12 flex justify-center px-4">
        <Link
          href="/galereya"
          id="gallery-view-all-link"
          className="group inline-flex items-center gap-3 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span>Bütün fotolara bax</span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white"
            style={{ background: "rgba(129,140,248,0.2)", color: "#818cf8" }}
          >
            →
          </span>
        </Link>
      </div>
    </section>
  )
}
