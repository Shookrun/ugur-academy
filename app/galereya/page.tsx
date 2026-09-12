"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { galleryItems } from "@/data/gallery"

export default function GalereyaPage() {
  const [items, setItems] = useState<any[]>(galleryItems)
  const [lightbox, setLightbox] = useState<number | string | null>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

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

  const filtered = items

  /* ── Lightbox helpers ── */
  const openLightbox = (id: number | string) => setLightbox(id)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const lightboxIndex = lightbox !== null ? items.findIndex((i) => String(i.id) === String(lightbox)) : -1
  const lightboxItem = lightboxIndex >= 0 ? items[lightboxIndex] : null

  const goNext = useCallback(() => {
    if (lightboxIndex < 0) return
    setLightbox(items[(lightboxIndex + 1) % items.length].id)
  }, [lightboxIndex, items])

  const goPrev = useCallback(() => {
    if (lightboxIndex < 0) return
    setLightbox(items[(lightboxIndex - 1 + items.length) % items.length].id)
  }, [lightboxIndex, items])

  /* Keyboard */
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

  /* Lock scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [lightbox])

  /* Scroll active thumbnail into view */
  useEffect(() => {
    if (!thumbRef.current || lightboxIndex < 0) return
    const thumb = thumbRef.current.children[lightboxIndex] as HTMLElement | undefined
    if (thumb) thumb.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
  }, [lightboxIndex])

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-indigo-50/60 via-violet-50/30 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute right-[10%] top-24 h-72 w-72 rounded-full bg-indigo-200/30 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute left-[5%] top-40 h-56 w-56 rounded-full bg-violet-200/20 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Qalereya
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
            Tədris prosesi, məzuniyyət mərasimləri, seminarlar və akademiya həyatından ən gözəl anlar.
          </p>
          <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
            {[
              { value: `${galleryItems.length}+`, label: "Foto" },
              { value: "2024", label: "İl" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-slate-900 sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Grid ── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400">Bu kateqoriyada foto tapılmadı.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filtered.map((item, idx) => (
                <button
                  key={item.id}
                  id={`gallery-item-${item.id}`}
                  onClick={() => openLightbox(item.id)}
                  className="group relative overflow-hidden rounded-2xl shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  aria-label={`${item.title} şəkilini böyüt`}
                >
                  <div
                    className={`relative w-full transition-all duration-500 group-hover:scale-[1.03] ${
                      idx % 5 === 0 ? "h-72 sm:h-80" : "h-56 sm:h-64"
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:brightness-90"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {/* Hover content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <span className="mb-1.5 inline-block w-fit rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                        {item.category}
                      </span>
                      <h3 className="text-base font-semibold leading-tight text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/70">{item.date}</p>
                    </div>
                    {/* Zoom icon */}
                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LIGHTBOX MODAL (şəkildəki kimi)
      ══════════════════════════════════════════ */}
      {lightbox !== null && lightboxItem && (
        <div
          id="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.93)" }}
          onClick={closeLightbox}
        >
          {/* ── Close button ── */}
          <button
            id="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Bağla"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── Prev arrow ── */}
          <button
            id="gallery-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Əvvəlki şəkil"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/25 sm:left-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* ── Next arrow ── */}
          <button
            id="gallery-lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Növbəti şəkil"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/25 sm:right-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* ── Main image ── */}
          <div
            className="relative mx-4 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>

          {/* ── Thumbnail strip ── */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl px-4"
          >
            <div
              ref={thumbRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
              style={{ justifyContent: "center" }}
            >
              {galleryItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={(e) => { e.stopPropagation(); setLightbox(item.id) }}
                  aria-label={item.title}
                  aria-current={item.id === lightbox ? "true" : undefined}
                  className="relative shrink-0 overflow-hidden rounded-lg transition-all duration-200"
                  style={{
                    width: 72,
                    height: 52,
                    border: item.id === lightbox
                      ? "2px solid #818cf8"
                      : "2px solid transparent",
                    opacity: item.id === lightbox ? 1 : 0.55,
                    transform: item.id === lightbox ? "scale(1.07)" : "scale(1)",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>

            {/* Counter */}
            <p className="mt-3 text-center text-sm text-white/50">
              {lightboxIndex + 1} / {galleryItems.length}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
