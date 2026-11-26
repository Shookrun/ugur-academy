"use client"

import { useEffect, useState } from "react"

type Review = {
  id: string
  name: string
  title: string
  description: string
  videoId: string
  type: "STUDENT" | "PARENT"
  course: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<Review | null>(null)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("/api/reviews", { cache: "no-store" })
        if (!response.ok) return
        const data: unknown = await response.json()
        if (Array.isArray(data)) setReviews(data as Review[])
      } catch {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    void loadReviews()
  }, [])

  useEffect(() => {
    if (!activeVideo) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeVideo])

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20 pt-36 sm:pt-44">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[#1e3a47]/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#1e3a47] shadow-sm">Uğur Academy</span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-[#1e3a47] sm:text-5xl lg:text-6xl">Tələbələrimizin <span className="text-sky-600">rəyləri</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Uğur Academy ailəsinin üzvləri təcrübələrini bölüşür. Uğur hekayələrini öz dilindən dinlə.</p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" /></div>
        ) : reviews.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#1e3a47]">Video rəylər tezliklə burada olacaq.</p>
            <p className="mt-2 text-sm text-slate-500">Bizi izləməyə davam et.</p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
                <button type="button" onClick={() => setActiveVideo(review)} className="relative block aspect-video w-full overflow-hidden bg-slate-100 text-left">
                  <img src={`https://img.youtube.com/vi/${review.videoId}/hqdefault.jpg`} alt={review.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/10 transition group-hover:bg-slate-950/25">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/90 text-2xl text-[#1e3a47] shadow-xl transition group-hover:scale-110">▶</span>
                  </span>
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#1e3a47]">{review.type === "STUDENT" ? "Tələbə rəyi" : "Valideyn rəyi"}</span>
                </button>
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg font-black text-[#1e3a47]">{review.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-sky-700">{review.title}</p>
                  {review.course && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{review.course}</p>}
                  {review.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{review.description}</p>}
                  <button type="button" onClick={() => setActiveVideo(review)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1e3a47] transition hover:text-sky-700">Videoya bax <span aria-hidden="true">↗</span></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeVideo && (
        <div role="dialog" aria-modal="true" aria-label={`${activeVideo.name} video rəyi`} className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveVideo(null) }}>
          <div className="w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0"><p className="truncate font-bold">{activeVideo.name}</p><p className="truncate text-xs text-white/60">{activeVideo.title}</p></div>
              <button type="button" onClick={() => setActiveVideo(null)} aria-label="Videonu bağla" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-white/20">×</button>
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`} title={`${activeVideo.name} video rəyi`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
