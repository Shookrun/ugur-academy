"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminSidebar from "../AdminSidebar"

type Review = {
  id: string
  name: string
  title: string
  description: string
  youtubeUrl: string
  videoId: string
  isActive: boolean
  order: number
  createdAt: string
}

type ReviewForm = Omit<Review, "id" | "videoId" | "createdAt">

const EMPTY_FORM: ReviewForm = {
  name: "",
  title: "",
  description: "",
  youtubeUrl: "",
  isActive: true,
  order: 0,
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#1e3a47] focus:ring-2 focus:ring-[#1e3a47]/10"
const labelClass = "mb-1.5 block text-xs font-bold text-slate-700"

async function responseError(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null)
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
    return data.error
  }
  return fallback
}

function getVideoId(url: string): string {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase()
    let id = ""

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] ?? ""
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") ?? ""
      } else {
        const parts = parsed.pathname.split("/").filter(Boolean)
        if (["embed", "shorts", "live"].includes(parts[0] ?? "")) id = parts[1] ?? ""
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ""
  } catch {
    return ""
  }
}

export default function AdminReviewsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<ReviewForm>(EMPTY_FORM)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/reviews/manage", {
        cache: "no-store",
        credentials: "same-origin",
      })

      if (response.status === 401 || response.status === 403) {
        router.replace("/admin")
        return
      }

      if (!response.ok) throw new Error(await responseError(response, "Rəyləri yükləmək olmadı."))

      const data: unknown = await response.json()
      setReviews(Array.isArray(data) ? data as Review[] : [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Serverlə əlaqə qurmaq mümkün olmadı.")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (status === "authenticated") void loadReviews()
  }, [status, loadReviews])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError("")
    setFormOpen(true)
  }

  const openEdit = (review: Review) => {
    setEditingId(review.id)
    setForm({
      name: review.name,
      title: review.title,
      description: review.description,
      youtubeUrl: review.youtubeUrl,
      isActive: review.isActive,
      order: review.order,
    })
    setError("")
    setFormOpen(true)
  }

  const saveReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    const videoId = getVideoId(form.youtubeUrl.trim())
    if (!videoId) {
      setError("Düzgün YouTube linki daxil et. youtube.com/watch, youtu.be, Shorts və Embed linkləri dəstəklənir.")
      return
    }

    setSaving(true)
    setError("")

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
        order: Number(form.order) || 0,
        ...(editingId ? { id: editingId } : {}),
      }

      const response = await fetch("/api/reviews/manage", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(await responseError(response, "Rəyi yadda saxlamaq mümkün olmadı."))

      setFormOpen(false)
      setNotice(editingId ? "Rəy yeniləndi." : "Yeni rəy əlavə edildi.")
      await loadReviews()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Serverlə əlaqə qurmaq mümkün olmadı.")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (review: Review) => {
    try {
      const response = await fetch("/api/reviews/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...review, isActive: !review.isActive }),
      })

      if (!response.ok) throw new Error(await responseError(response, "Status dəyişdirilə bilmədi."))
      setNotice(review.isActive ? "Rəy saytdan gizlədildi." : "Rəy saytda aktivləşdirildi.")
      await loadReviews()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status dəyişdirilə bilmədi.")
    }
  }

  const deleteReview = async (review: Review) => {
    if (!window.confirm(`"${review.name}" rəyini silmək istəyirsən?`)) return

    setDeletingId(review.id)
    try {
      const response = await fetch(`/api/reviews/manage?id=${encodeURIComponent(review.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      })

      if (!response.ok) throw new Error(await responseError(response, "Rəyi silmək mümkün olmadı."))
      setNotice("Rəy silindi.")
      await loadReviews()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Rəyi silmək mümkün olmadı.")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(""), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  if (status === "loading" || status === "unauthenticated") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm text-slate-500">Yoxlanılır...</div>
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Kontent idarəetməsi</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">Video rəylər</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-500">Müxtəlif şəxslərin video rəylərini YouTube linki ilə əlavə et, redaktə et və saytda göstərilməsini idarə et.</p>
            </div>
            <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a47] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#162c37]">
              <span className="text-lg leading-none">+</span> Yeni rəy əlavə et
            </button>
          </div>

          {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</div>}
          {error && !formOpen && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Ümumi rəylər</p>
              <p className="mt-2 text-2xl font-black text-[#1e3a47]">{reviews.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Aktiv rəylər</p>
              <p className="mt-2 text-2xl font-black text-emerald-600">{reviews.filter((review) => review.isActive).length}</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
              <p className="text-xs font-semibold text-slate-500">Gizli rəylər</p>
              <p className="mt-2 text-2xl font-black text-slate-500">{reviews.filter((review) => !review.isActive).length}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">▶</div>
              <h2 className="mt-4 text-lg font-black text-[#1e3a47]">Hələ video rəy yoxdur</h2>
              <p className="mt-2 text-sm text-slate-500">İlk rəyi əlavə etmək üçün YouTube video linkini daxil et.</p>
              <button type="button" onClick={openCreate} className="mt-5 rounded-xl bg-[#1e3a47] px-5 py-3 text-sm font-bold text-white">İlk rəyi əlavə et</button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-video bg-slate-100">
                    <img src={`https://img.youtube.com/vi/${review.videoId}/hqdefault.jpg`} alt={review.title} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#1e3a47]">Video rəy</span>
                    <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold ${review.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{review.isActive ? "Aktiv" : "Gizli"}</span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-black text-[#1e3a47]">{review.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{review.title}</p>
                    {review.course && <p className="mt-2 text-xs text-slate-400">{review.course}</p>}
                    {review.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{review.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      <button type="button" onClick={() => openEdit(review)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Redaktə et</button>
                      <button type="button" onClick={() => void toggleActive(review)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#1e3a47] hover:bg-slate-50">{review.isActive ? "Gizlət" : "Aktiv et"}</button>
                      <button type="button" onClick={() => void deleteReview(review)} disabled={deletingId === review.id} className="ml-auto rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">{deletingId === review.id ? "Silinir..." : "Sil"}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {formOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4">
            <form onSubmit={saveReview} className="my-6 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#1e3a47]">{editingId ? "Rəyi redaktə et" : "Yeni video rəy"}</h2>
                  <p className="mt-1 text-xs text-slate-500">YouTube linkini əlavə et, video avtomatik tanınacaq.</p>
                </div>
                <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Bağla">×</button>
              </div>

              {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-name" className={labelClass}>Ad və soyad *</label>
                  <input id="review-name" required maxLength={120} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} placeholder="Məsələn, Aysel Məmmədova" />
                </div>
                <div>
                  <label htmlFor="review-title" className={labelClass}>Qısa başlıq *</label>
                  <input id="review-title" required maxLength={160} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Məsələn, Tədris və xidmətlərimiz haqqında" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="review-youtube" className={labelClass}>YouTube video linki *</label>
                  <input id="review-youtube" type="url" required value={form.youtubeUrl} onChange={(event) => setForm((current) => ({ ...current, youtubeUrl: event.target.value }))} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
                  {form.youtubeUrl && <p className={`mt-2 text-xs font-semibold ${getVideoId(form.youtubeUrl) ? "text-emerald-600" : "text-rose-600"}`}>{getVideoId(form.youtubeUrl) ? "✓ YouTube videosu tanındı" : "Düzgün YouTube linki daxil et"}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="review-description" className={labelClass}>Rəy haqqında</label>
                  <textarea id="review-description" rows={3} maxLength={1000} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="Rəyin məzmunu haqqında qısa məlumat..." />
                </div>
                <div>
                  <label htmlFor="review-order" className={labelClass}>Sıralama</label>
                  <input id="review-order" type="number" min={0} value={form.order} onChange={(event) => setForm((current) => ({ ...current, order: Number(event.target.value) }))} className={inputClass} />
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} className="h-4 w-4 accent-[#1e3a47]" />
                  <span><span className="block text-sm font-bold text-slate-800">Saytda göstər</span><span className="block text-xs text-slate-500">Aktiv olduqda ictimai səhifədə görünəcək</span></span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600">Ləğv et</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#1e3a47] px-5 py-3 text-sm font-bold text-white hover:bg-[#162c37] disabled:opacity-50">{saving ? "Saxlanılır..." : "Yadda saxla"}</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
