"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminSidebar from "../AdminSidebar"
import type { Campaign } from "@/lib/campaigns"

type Toast = { type: "success" | "error"; message: string }

type FormState = {
  id: string
  title: string
  excerpt: string
  description: string
  image: string
  deadline: string
  tags: string
  active: boolean
}

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  excerpt: "",
  description: "",
  image: "",
  deadline: "",
  tags: "",
  active: true,
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

async function getErrorMessage(response: Response, fallback: string) {
  const data: unknown = await response.json().catch(() => null)
  const message =
    data && typeof data === "object" && "error" in data
      ? (data as { error?: unknown }).error
      : null

  return `${typeof message === "string" ? message : fallback} (HTTP ${response.status})`
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    ...init,
  })

  if (response.status === 401 || response.status === 403) {
    window.location.href = "/admin"
    throw new Error("Sessiya bitib. Yenidən daxil ol.")
  }

  return response
}

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")
    if (!context) {
      bitmap.close()
      return file
    }

    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    )

    if (!blob || (scale === 1 && blob.size >= file.size)) return file

    const baseName = file.name.replace(/\.[^.]+$/, "") || "kampaniya"
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" })
  } catch {
    return file
  }
}

function formatDate(deadline: string) {
  const [y, m, d] = deadline.split("-")
  return y && m && d ? `${d}.${m}.${y}` : deadline
}

export default function AdminKampaniyalarPage() {
  const { status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => setToast({ message, type }),
    []
  )

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await apiFetch("/api/campaigns")

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Kampaniyaları yükləmək olmadı."))
      }

      const data: unknown = await response.json().catch(() => null)
      if (!Array.isArray(data)) throw new Error("Server gözlənilməz cavab qaytardı.")

      setItems(data as Campaign[])
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Kampaniyalar yüklənmədi.",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void fetchCampaigns()
  }, [fetchCampaigns])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setModal("add")
  }

  const openEdit = (item: Campaign) => {
    setForm({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      description: item.description,
      image: item.image,
      deadline: item.deadline,
      tags: item.tags.join(", "),
      active: item.active,
    })
    setModal("edit")
  }

  const closeModal = () => {
    if (saving || uploading) return
    setModal(null)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const selected = input.files?.[0]
    if (!selected || uploading) return

    if (!selected.type.startsWith("image/")) {
      showToast("Yalnız şəkil faylı seçə bilərsən.", "error")
      input.value = ""
      return
    }

    setUploading(true)

    try {
      const file = await compressImage(selected)

      if (file.size > MAX_UPLOAD_BYTES) {
        showToast("Şəkil çox böyükdür (maksimum 4MB).", "error")
        return
      }

      const body = new FormData()
      body.append("file", file)

      const response = await apiFetch("/api/gallery/upload", { method: "POST", body })

      if (!response.ok) {
        showToast(await getErrorMessage(response, "Şəkli yükləmək olmadı."), "error")
        return
      }

      const data: unknown = await response.json().catch(() => null)
      const url =
        data && typeof data === "object" && "url" in data
          ? (data as { url?: unknown }).url
          : null

      if (typeof url !== "string" || !url) {
        showToast("Server şəkil ünvanını qaytarmadı.", "error")
        return
      }

      setForm((current) => ({ ...current, image: url }))
      showToast("Şəkil yükləndi. İndi yadda saxla.")
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Şəkli yükləmək olmadı.",
        "error"
      )
    } finally {
      setUploading(false)
      input.value = ""
    }
  }

  const saveCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving || uploading) return

    if (!form.title.trim()) {
      showToast("Kampaniya başlığı tələb olunur.", "error")
      return
    }

    setSaving(true)

    try {
      const editing = modal === "edit"

      const payload = {
        id: form.id,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        deadline: form.deadline,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        active: form.active,
      }

      const response = await apiFetch("/api/campaigns", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        showToast(await getErrorMessage(response, "Yadda saxlamaq olmadı."), "error")
        return
      }

      setModal(null)
      showToast(editing ? "Kampaniya yeniləndi." : "Kampaniya əlavə edildi.")
      await fetchCampaigns()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Serverlə əlaqə qurmaq olmadı.",
        "error"
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId || deleting) return

    setDeleting(true)

    try {
      const response = await apiFetch(
        `/api/campaigns?id=${encodeURIComponent(deleteId)}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        showToast(await getErrorMessage(response, "Silmək olmadı."), "error")
        return
      }

      setItems((current) => current.filter((item) => item.id !== deleteId))
      setDeleteId(null)
      showToast("Kampaniya silindi.")
      await fetchCampaigns()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Serverlə əlaqə qurmaq olmadı.",
        "error"
      )
    } finally {
      setDeleting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-800 border-t-transparent" />
      </div>
    )
  }

  if (status !== "authenticated") return null

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#1e3a47]"
  const labelClass = "mb-1.5 block text-xs font-bold text-slate-700"

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed right-5 top-5 z-[200] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>
              <button type="button" onClick={() => setToast(null)} aria-label="Bildirişi bağla">
                ×
              </button>
            </div>
          </div>
        )}

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1e3a47] sm:text-3xl">
              Kampaniyalar
            </h1>
            <p className="mt-1 text-sm text-slate-500">{items.length} kampaniya</p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-[#1e3a47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#162c37]"
          >
            + Yeni kampaniya
          </button>
        </header>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            Hələ kampaniya əlavə edilməyib.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-gradient-to-br from-sky-100 to-amber-100">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-4xl">
                      🎁
                    </span>
                  )}
                  {!item.active && (
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white">
                      Gizlidir
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.deadline ? `Son tarix: ${formatDate(item.deadline)}` : "Müddətsiz"}
                  </p>

                  <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Redaktə
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-6 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1e3a47]">
                {modal === "add" ? "Yeni kampaniya" : "Kampaniyanı redaktə et"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving || uploading}
                className="text-2xl text-slate-400"
                aria-label="Bağla"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveCampaign} className="space-y-4">
              <div>
                <span className={labelClass}>Şəkil</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(event) => void handleFileChange(event)}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || saving}
                  className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-[#1e3a47] hover:bg-slate-100 disabled:opacity-70"
                >
                  {form.image ? (
                    <div className="relative aspect-[16/10] w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="Seçilmiş şəkil" className="h-full w-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                        Şəkli dəyiş
                      </span>
                    </div>
                  ) : (
                    <span className="px-4 py-8">
                      <span className="block text-2xl">📷</span>
                      <span className="mt-2 block text-sm font-bold text-slate-700">
                        Kompüterdən şəkil seç
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Avtomatik kiçildilir
                      </span>
                    </span>
                  )}

                  {uploading && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 text-sm font-bold text-[#1e3a47]">
                      <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
                      Yüklənir...
                    </span>
                  )}
                </button>

                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, image: "" }))}
                    className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    Şəkli sil
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="c-title" className={labelClass}>
                  Başlıq *
                </label>
                <input
                  id="c-title"
                  value={form.title}
                  onChange={(event) => setForm((c) => ({ ...c, title: event.target.value }))}
                  required
                  maxLength={160}
                  className={inputClass}
                  placeholder="Məsələn, Oktyabr ayına özəl endirim"
                />
              </div>

              <div>
                <label htmlFor="c-excerpt" className={labelClass}>
                  Qısa təsvir (kartda görünür)
                </label>
                <textarea
                  id="c-excerpt"
                  value={form.excerpt}
                  onChange={(event) => setForm((c) => ({ ...c, excerpt: event.target.value }))}
                  maxLength={300}
                  rows={2}
                  className={inputClass}
                  placeholder="1-2 cümlə"
                />
              </div>

              <div>
                <label htmlFor="c-desc" className={labelClass}>
                  Ətraflı mətn (açılan səhifədə görünür)
                </label>
                <textarea
                  id="c-desc"
                  value={form.description}
                  onChange={(event) => setForm((c) => ({ ...c, description: event.target.value }))}
                  maxLength={8000}
                  rows={6}
                  className={inputClass}
                  placeholder="Şərtlər, endirim faizi, qeydiyyat qaydası və s."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-deadline" className={labelClass}>
                    Son tarix
                  </label>
                  <input
                    id="c-deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(event) => setForm((c) => ({ ...c, deadline: event.target.value }))}
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] text-slate-500">Boş buraxsan müddətsiz olur.</p>
                </div>

                <div>
                  <label htmlFor="c-tags" className={labelClass}>
                    Teqlər (vergüllə)
                  </label>
                  <input
                    id="c-tags"
                    value={form.tags}
                    onChange={(event) => setForm((c) => ({ ...c, tags: event.target.value }))}
                    className={inputClass}
                    placeholder="Endirim, Ailə, Yay"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-bold text-slate-800">Saytda göstər</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Söndürsən kampaniya gizlənir, amma silinmir
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((c) => ({ ...c, active: event.target.checked }))}
                  className="h-4 w-4 accent-[#1e3a47]"
                />
              </label>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-[#1e3a47] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#162c37] disabled:opacity-50"
                >
                  {saving ? "Saxlanılır..." : uploading ? "Yüklənir..." : "Yadda saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900">Kampaniyanı silmək istəyirsən?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Bu əməliyyat geri qaytarılmır.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {deleting ? "Silinir..." : "Bəli, sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
