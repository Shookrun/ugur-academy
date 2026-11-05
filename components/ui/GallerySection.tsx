"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { galleryItems } from "@/data/gallery"

const SLIDE_INTERVAL = 5000

const cardTints: readonly string[] = [
  "bg-amber-200",
  "bg-sky-200",
  "bg-rose-200",
  "bg-emerald-200",
  "bg-violet-200",
  "bg-orange-200",
  "bg-teal-200",
]

export default function GallerySection() {
  const [items, setItems] = useState(galleryItems)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d) && d.length > 0) setItems(d)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  /* featured slides */
  const featured = items.filter((i) => i.featured).length
    ? items.filter((i) => i.featured)
    : items.slice(0, 3)

  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (idx: number) => {
      if (animating || featured.length === 0) return
      setAnimating(true)
      setCurrent((idx + featured.length) % featured.length)
      setTimeout(() => setAnimating(false), 700)
    },
    [animating, featured.length]
  )

  const goNext = useCallback(() => goTo(current + 1), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (hovered || featured.length < 2) return
    timerRef.current = setInterval(goNext, SLIDE_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [goNext, hovered, featured.length])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [goNext, goPrev])

  /* side items – everything except featured */
  const nonFeatured = items.filter((i) => !i.featured).slice(0, 3)
  const side = nonFeatured.length ? nonFeatured : items.slice(0, 3)

  return (
    <section
      id="galereya"
      ref={sectionRef}
      aria-label="Galereya"
      className="relative overflow-hidden"
    >
      <div className="mx-auto max-w-full px-6 py-24 sm:px-8 lg:px-10">
        {/* ───────── Header ───────── */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div
            className={`max-w-2xl transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`h-px bg-black transition-all duration-700 ${
                  isVisible ? "w-8 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <span className="text-sm font-medium tracking-wide text-gray-500">
                Fotoqalereya
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
              <span className="font-light text-gray-500">Akademiya</span>
              <br />
              həyatından anlar.
            </h2>
          </div>

          <div
            className={`max-w-xl transform transition-all delay-150 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:ml-auto ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <p className="text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              Tədris prosesi, mərasimlər və unudulmaz anlara nəzər atın.
            </p>
          </div>
        </div>

        {/* ───────── Main layout ───────── */}
        <div
          className={`mt-14 grid gap-6 transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-cols-[1fr_300px] ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >
          {/* ====== HERO SLIDER ====== */}
          <div
            className="group relative mr-3 pb-3"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* colored offset layer */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 left-3 top-3 rounded-[1.5rem] transition-all duration-500 group-hover:left-1.5 group-hover:top-1.5 ${
                cardTints[current % cardTints.length]
              }`}
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gray-200 sm:aspect-[16/10] lg:aspect-auto lg:h-[480px]">
              {featured.map((item, idx) => {
                const isCur = idx === current

                return (
                  <div
                    key={item.id}
                    aria-hidden={!isCur}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      isCur ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                    }`}
                    style={{ zIndex: isCur ? 20 : 0 }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={idx === 0}
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 800px"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    {/* caption */}
                    <div
                      className={`absolute inset-x-0 bottom-0 p-6 transition-all delay-150 duration-700 sm:p-8 ${
                        isCur
                          ? "translate-y-0 opacity-100"
                          : "translate-y-6 opacity-0"
                      }`}
                    >
                      <span className="mb-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium tracking-wide text-gray-950">
                        {item.category}
                      </span>
                      <h3 className="max-w-xl text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70">{item.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ====== SIDE GRID ====== */}
          <div className="grid grid-cols-3 gap-4 lg:flex lg:h-[480px] lg:flex-col lg:gap-6">
            {side.map((item, idx) => (
              <Link
                key={item.id}
                href="/galereya"
                id={`gallery-side-${idx}`}
                className="group relative mr-2 pb-2 lg:mr-3 lg:flex-1 lg:pb-3"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 left-2 top-2 rounded-[1.5rem] transition-all duration-500 group-hover:left-1 group-hover:top-1 lg:left-3 lg:top-3 lg:group-hover:left-1.5 lg:group-hover:top-1.5 ${
                    cardTints[(idx + 1 + current) % cardTints.length]
                  }`}
                />

                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-gray-200 lg:aspect-auto lg:h-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 hidden p-4 lg:block">
                    <span className="mb-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-950">
                      {item.category}
                    </span>
                    <p className="text-sm font-semibold leading-tight tracking-tight text-white">
                      {item.title}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-950 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ───────── Controls ───────── */}
        <div
          className={`mt-8 flex flex-wrap items-center justify-between gap-4 transform transition-all delay-500 duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-5">
            <p className="text-sm font-medium tabular-nums tracking-wide text-gray-950">
              {String(current + 1).padStart(2, "0")}
              <span className="text-gray-400">
                {" "}
                / {String(featured.length).padStart(2, "0")}
              </span>
            </p>

            <div className="flex items-center gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  id={`gallery-dot-${idx}`}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`${idx + 1}-ci şəkilə keç`}
                  aria-current={idx === current ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === current
                      ? "w-8 bg-gray-950"
                      : "w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="gallery-prev-btn"
              type="button"
              onClick={goPrev}
              aria-label="Əvvəlki"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-950 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-black hover:bg-black hover:text-white active:scale-95"
            >
              ←
            </button>

            <button
              id="gallery-next-btn"
              type="button"
              onClick={goNext}
              aria-label="Növbəti"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg text-white shadow-sm transition-all duration-300 hover:translate-x-1 hover:bg-gray-800 active:scale-95"
            >
              →
            </button>
          </div>
        </div>

        {/* ───────── CTA ───────── */}
        <div
          className={`mt-12 flex justify-center transform transition-all delay-700 duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Link
            href="/galereya"
            id="gallery-view-all-link"
            className="group inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white py-2 pl-6 pr-2 text-sm font-medium text-gray-950 shadow-sm transition-all duration-300 hover:border-black"
          >
            <span>Bütün fotolara bax</span>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-gray-800"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gray-100" />
    </section>
  )
}
