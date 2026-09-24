"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { galleryItems, galleryCategories, type GalleryCategory } from "@/data/gallery"

export default function GalereyaPage() {
  const [items, setItems] = useState<any[]>(galleryItems)
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "Hamısı">("Hamısı")
  const [lightbox, setLightbox] = useState<number | string | null>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {})
  }, [])

  const filtered =
    activeCategory === "Hamısı" ? items : items.filter((i) => i.category === activeCategory)

  /* ── Lightbox helpers ── */
  const openLightbox = (id: number | string) => setLightbox(id)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const lightboxIndex =
    lightbox !== null ? filtered.findIndex((i) => String(i.id) === String(lightbox)) : -1
  const lightboxItem = lightboxIndex >= 0 ? filtered[lightboxIndex] : null

  const goNext = useCallback(() => {
    if (lightboxIndex < 0) return
    setLightbox(filtered[(lightboxIndex + 1) % filtered.length].id)
  }, [lightboxIndex, filtered])

  const goPrev = useCallback(() => {
    if (lightboxIndex < 0) return
    setLightbox(filtered[(lightboxIndex - 1 + filtered.length) % filtered.length].id)
  }, [lightboxIndex, filtered])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, closeLightbox, goNext, goPrev])

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  useEffect(() => {
    if (!thumbRef.current || lightboxIndex < 0) return
    const thumb = thumbRef.current.children[lightboxIndex] as HTMLElement | undefined
    if (thumb) thumb.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
  }, [lightboxIndex])

  /* masonry-like heights for grid items */
  const heights = [280, 240, 320, 260, 300, 240]

  return (
    <main className="min-h-screen bg-[#06080f]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        {/* ambient glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-20 h-72 w-72 rounded-full blur-[120px]"
          style={{ background: "rgba(139,92,246,0.15)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[5%] top-36 h-56 w-56 rounded-full blur-[100px]"
          style={{ background: "rgba(59,130,246,0.1)" }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Fotoqalereya
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Akademiya{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to right, #818cf8, #a78bfa, #f472b6)" }}
            >
              Qalereya
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Tədris prosesi, məzuniyyət mərasimləri, seminarlar və akademiya həyatından ən gözəl anlar.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { value: `${galleryItems.length}+`, label: "Foto" },
              { value: "2024–2026", label: "İllər" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category filters ── */}
      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["Hamısı", ...galleryCategories] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as GalleryCategory | "Hamısı")}
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? {
                        background: "rgba(99,102,241,0.25)",
                        border: "1px solid rgba(99,102,241,0.6)",
                        color: "#c7d2fe",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Grid ── */}
      <section className="py-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-500">Bu kateqoriyada foto tapılmadı.</div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" style={{ columnGap: "1rem" }}>
              {filtered.map((item, idx) => {
                const h = heights[idx % heights.length]
                return (
                  <button
                    key={item.id}
                    id={`gallery-item-${item.id}`}
                    onClick={() => openLightbox(item.id)}
                    className="group relative mb-4 block w-full overflow-hidden rounded-2xl focus:outline-none"
                    style={{ height: h, breakInside: "avoid" }}
                    aria-label={`${item.title} şəkilini böyüt`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                        opacity: 0,
                      }}
                      ref={(el) => {
                        if (el) {
                          el.style.cssText += "; transition: opacity 300ms;"
                        }
                      }}
                    />
                    {/* hover content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }}
                    >
                      <span
                        className="mb-1.5 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/80 backdrop-blur-sm"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold leading-tight text-white">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-white/60">{item.date}</p>
                    </div>
                    {/* zoom icon */}
                    <div
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.35)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                      </svg>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && lightboxItem && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            id="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Bağla"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            id="gallery-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Əvvəlki şəkil"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all hover:scale-110 sm:left-6"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next */}
          <button
            id="gallery-lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Növbəti şəkil"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all hover:scale-110 sm:right-6"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Main image */}
          <div
            className="relative mx-4 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            style={{ marginBottom: "1.5rem" }}
          >
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{ aspectRatio: "16/9", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}
            >
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
            {/* Caption */}
            <div className="mt-4 text-center">
              <span
                className="mb-2 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white/60 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {lightboxItem.category}
              </span>
              <p className="text-base font-bold text-white">{lightboxItem.title}</p>
              <p className="text-xs text-white/40 mt-0.5">{lightboxItem.date}</p>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl px-4">
            <div ref={thumbRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 justify-center">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => { e.stopPropagation(); setLightbox(item.id) }}
                  aria-label={item.title}
                  aria-current={item.id === lightbox ? "true" : undefined}
                  className="relative shrink-0 overflow-hidden rounded-lg transition-all duration-200"
                  style={{
                    width: 72,
                    height: 52,
                    border: item.id === lightbox ? "2px solid #818cf8" : "2px solid transparent",
                    opacity: item.id === lightbox ? 1 : 0.5,
                    transform: item.id === lightbox ? "scale(1.07)" : "scale(1)",
                  }}
                >
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="72px" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {lightboxIndex + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
