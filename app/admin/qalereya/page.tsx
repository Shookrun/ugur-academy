"use client"

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AdminSidebar from "../AdminSidebar"

type GalleryItem = {
  id: string
  src: string
  alt: string
  title: string
  category: string
  date: string
  featured?: boolean
}

type Toast = {
  type: "success" | "error"
  message: string
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const EMPTY_FORM: Omit<GalleryItem, "id"> = {
  src: "",
  alt: "",
  title: "",
  category: "",
  date: "2026",
  featured: false,
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#1e3a47]"
const labelClass = "mb-1.5 block text-xs font-bold text-slate-700"

/* ------------------------------------------------------------------ */
/* Köməkçi funksiyalar                                                 */
/* ------------------------------------------------------------------ */

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
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

function extractCategories(data: unknown, fallback: string[]): string[] {
  if (data && typeof data === "object" && "categories" in data) {
    const list = (data as { categories?: unknown }).categories

    if (Array.isArray(list)) {
      return list.filter(
        (category): category is string => typeof category === "string"
      )
    }
  }

  return fallback
}

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

// Şəkli brauzerdə kiçildir (max 1920px, JPEG)
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file
  if (typeof createImageBitmap !== "function") return file

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

    const baseName = file.name.replace(/\.[^.]+$/, "") || "sekil"

    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" })
  } catch {
    return file
  }
}

/* ------------------------------------------------------------------ */
/* Xəta tutucu: səhifə çökəndə boş ekran əvəzinə xətanı göstərir       */
/* ------------------------------------------------------------------ */

class PageErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="m-6 max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
          <p className="font-black">Səhifədə xəta baş verdi.</p>
          <p className="mt-2 break-words font-mono text-xs">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white"
          >
            Yenidən yüklə
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/* ------------------------------------------------------------------ */
/* Modal: document.body-yə portal, hər şeyin üstündə                    */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  children,
  zIndex = 1000,
  widthClass = "max-w-lg",
  escape = true,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  zIndex?: number
  widthClass?: string
  escape?: boolean
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !escape) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKey)

    return () => window.removeEventListener("keydown", onKey)
  }, [open, escape, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{ zIndex }}
      className="fixed inset-0 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={`my-6 w-full ${widthClass} rounded-2xl bg-white p-6 shadow-2xl`}>
        {children}
      </div>
    </div>,
    document.body
  )
}

/* ------------------------------------------------------------------ */
/* Şəkil önizləməsi: yüklənməsə səhifəni çökdürmür                      */
/* ------------------------------------------------------------------ */

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl">
        🖼️
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Əsas səhifə                                                         */
/* ------------------------------------------------------------------ */

function AdminQalereyaContent() {
  const { status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [categoryModal, setCategoryModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<GalleryItem>({ id: "", ...EMPTY_FORM })

  const [newCategory, setNewCategory] = useState("")
  const [deleteCategory, setDeleteCategory] = useState("")
  const [moveTo, setMoveTo] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      setToast({ message, type })
    },
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

  const fetchGallery = useCallback(async () => {
    try {
      const response = await apiFetch("/api/gallery")

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Qalereyanı yükləmək mümkün olmadı.")
        )
      }

      const data: unknown = await response.json().catch(() => null)

      if (!Array.isArray(data)) {
        throw new Error("Server gözlənilməz cavab qaytardı (qalereya).")
      }

      setItems(data as GalleryItem[])
      return null
    } catch (error) {
      return errorText(error, "Qalereya yüklənmədi.")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiFetch("/api/gallery/categories")

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "Kateqoriyaları yükləmək mümkün olmadı.")
        )
      }

      const data: unknown = await response.json().catch(() => null)

      if (!Array.isArray(data)) {
        throw new Error("Server gözlənilməz cavab qaytardı (kateqoriyalar).")
      }

      const valid = data.filter(
        (category): category is string =>
          typeof category === "string" && category.trim().length > 0
      )

      setCategories(Array.from(new Set(valid.map((category) => category.trim()))))
      return null
    } catch (error) {
      return errorText(error, "Kateqoriyalar yüklənmədi.")
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  const reloadAll = useCallback(async () => {
    setLoadError(null)

    const [galleryError, categoryError] = await Promise.all([
      fetchGallery(),
      fetchCategories(),
    ])

    const errors = [galleryError, categoryError].filter(
      (message): message is string => Boolean(message)
    )

    setLoadError(errors.length > 0 ? errors.join(" | ") : null)
  }, [fetchGallery, fetchCategories])

  useEffect(() => {
    void reloadAll()
  }, [reloadAll])

  const openAdd = () => {
    setEditId(null)
    setForm({
      id: String(Date.now()),
      ...EMPTY_FORM,
      category: categories[0] ?? "",
    })
    setModal("add")
  }

  const openEdit = (item: GalleryItem) => {
    setEditId(item.id)
    setForm({ ...item })
    setModal("edit")
  }

  const closeModal = useCallback(() => {
    if (saving || uploading) return
    setModal(null)
    setEditId(null)
  }, [saving, uploading])

  const openCategoryModal = () => {
    setNewCategory("")
    setCategoryModal(true)
  }

  const closeCategoryModal = useCallback(() => {
    if (categorySaving) return
    setCategoryModal(false)
  }, [categorySaving])

  const closeDeleteCategory = useCallback(() => {
    if (categorySaving) return
    setDeleteCategory("")
    setMoveTo("")
  }, [categorySaving])

  const closeDeleteImage = useCallback(() => {
    if (deleting) return
    setDeleteId(null)
  }, [deleting])

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
        showToast("Şəkil çox böyükdür (maksimum 4MB). Daha kiçik şəkil seç.", "error")
        return
      }

      const body = new FormData()
      body.append("file", file)

      const response = await apiFetch("/api/gallery/upload", {
        method: "POST",
        body,
      })

      if (!response.ok) {
        showToast(
          await getErrorMessage(response, "Şəkli yükləmək mümkün olmadı."),
          "error"
        )
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

      const fileTitle = selected.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")

      setForm((current) => ({
        ...current,
        src: url,
        title: current.title.trim() ? current.title : fileTitle,
      }))
      showToast("Şəkil yükləndi. İndi yadda saxla.")
    } catch (error) {
      showToast(errorText(error, "Şəkli yükləmək mümkün olmadı."), "error")
    } finally {
      setUploading(false)
      input.value = ""
    }
  }

  const createCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = newCategory.trim()

    if (!name || categorySaving) return

    setCategorySaving(true)

    try {
      const response = await apiFetch("/api/gallery/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        showToast(
          await getErrorMessage(response, "Kateqoriya yaradıla bilmədi."),
          "error"
        )
        return
      }

      const data: unknown = await response.json().catch(() => null)

      setCategories(extractCategories(data, [...categories, name]))
      setForm((current) => ({ ...current, category: name }))
      setNewCategory("")
      setCategoryModal(false)
      showToast(`"${name}" kateqoriyası yaradıldı.`)
    } catch (error) {
      showToast(errorText(error, "Serverlə əlaqə qurmaq mümkün olmadı."), "error")
    } finally {
      setCategorySaving(false)
    }
  }

  const requestDeleteCategory = (category: string) => {
    const remaining = categories.filter((item) => item !== category)
    const hasImages = items.some((item) => item.category === category)

    if (hasImages && remaining.length === 0) {
      showToast(
        "Bu kateqoriyanı silməzdən əvvəl başqa kateqoriya yaratmalısan.",
        "error"
      )
      return
    }

    setDeleteCategory(category)
    setMoveTo(remaining[0] ?? "")
  }

  const confirmDeleteCategory = async () => {
    if (!deleteCategory || categorySaving) return

    const affected = items.filter((item) => item.category === deleteCategory)

    if (affected.length > 0 && !moveTo) {
      showToast("Şəkillərin köçürüləcəyi kateqoriyanı seç.", "error")
      return
    }

    setCategorySaving(true)

    try {
      const response = await apiFetch("/api/gallery/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deleteCategory,
          moveTo: affected.length > 0 ? moveTo : "",
        }),
      })

      if (!response.ok) {
        showToast(
          await getErrorMessage(response, "Kateqoriyanı silmək mümkün olmadı."),
          "error"
        )
        return
      }

      const data: unknown = await response.json().catch(() => null)

      const updatedCategories = extractCategories(
        data,
        categories.filter((category) => category !== deleteCategory)
      )

      setCategories(updatedCategories)

      if (affected.length > 0) {
        setItems((current) =>
          current.map((item) =>
            item.category === deleteCategory ? { ...item, category: moveTo } : item
          )
        )
      }

      if (form.category === deleteCategory) {
        setForm((current) => ({
          ...current,
          category: affected.length > 0 ? moveTo : updatedCategories[0] ?? "",
        }))
      }

      const deleted = deleteCategory
      setDeleteCategory("")
      setMoveTo("")
      showToast(
        affected.length > 0
          ? `"${deleted}" silindi. ${affected.length} şəkil "${moveTo}" kateqoriyasına köçürüldü.`
          : "Kateqoriya uğurla silindi."
      )

      await reloadAll()
    } catch (error) {
      showToast(errorText(error, "Serverlə əlaqə qurmaq mümkün olmadı."), "error")
    } finally {
      setCategorySaving(false)
    }
  }

  const saveGalleryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (saving || uploading) return

    const title = form.title.trim()
    const src = form.src.trim()
    const category = form.category.trim()

    if (!src) {
      showToast("Əvvəlcə şəkil yüklə və ya şəkil ünvanı daxil et.", "error")
      return
    }

    if (!title || !category) {
      showToast("Başlıq və kateqoriya tələb olunur.", "error")
      return
    }

    if (!categories.includes(category)) {
      showToast("Seçilmiş kateqoriya mövcud deyil.", "error")
      return
    }

    setSaving(true)

    try {
      const editing = modal === "edit" && editId !== null

      const payload: GalleryItem = {
        ...form,
        id: editing ? editId : String(Date.now()),
        title,
        src,
        alt: form.alt.trim() || title,
        category,
        date: form.date.trim() || "2026",
        featured: Boolean(form.featured),
      }

      const response = await apiFetch("/api/gallery", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        showToast(
          await getErrorMessage(response, "Şəkli yadda saxlamaq mümkün olmadı."),
          "error"
        )
        return
      }

      setModal(null)
      setEditId(null)
      showToast(editing ? "Şəkil yeniləndi." : "Şəkil əlavə edildi.")

      await fetchGallery()
    } catch (error) {
      showToast(errorText(error, "Serverlə əlaqə qurmaq mümkün olmadı."), "error")
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteImage = async () => {
    if (!deleteId || deleting) return

    setDeleting(true)

    try {
      const response = await apiFetch(
        `/api/gallery?id=${encodeURIComponent(deleteId)}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        showToast(
          await getErrorMessage(response, "Şəkli silmək mümkün olmadı."),
          "error"
        )
        return
      }

      setItems((current) => current.filter((item) => item.id !== deleteId))
      setDeleteId(null)
      showToast("Şəkil silindi.")
      await fetchGallery()
    } catch (error) {
      showToast(errorText(error, "Serverlə əlaqə qurmaq mümkün olmadı."), "error")
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

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Giriş səhifəsinə yönləndirilir...
      </div>
    )
  }

  const deleteCategoryHasImages = items.some(
    (item) => item.category === deleteCategory
  )

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed right-5 top-5 z-[2000] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Bildirişi bağla"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1e3a47] sm:text-3xl">
              Qalereya İdarəetməsi
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {items.length} şəkil · {categories.length} kateqoriya
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openCategoryModal}
              className="rounded-xl border border-[#1e3a47] bg-white px-4 py-2.5 text-sm font-bold text-[#1e3a47] hover:bg-slate-50"
            >
              + Kateqoriya yarat
            </button>

            <button
              type="button"
              onClick={openAdd}
              className="rounded-xl bg-[#1e3a47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#162c37]"
            >
              + Yeni şəkil
            </button>
          </div>
        </header>

        {loadError && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-black">Məlumatlar tam yüklənmədi.</p>
              <p className="mt-1 break-words text-xs">{loadError}</p>
            </div>
            <button
              type="button"
              onClick={() => void reloadAll()}
              className="shrink-0 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              Yenidən yüklə
            </button>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-black text-slate-900">
            Kateqoriyaları idarə et
          </h2>

          {categoriesLoading ? (
            <p className="text-sm text-slate-500">Yüklənir...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-slate-500">Hələ kateqoriya yoxdur.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = items.filter((item) => item.category === category).length

                return (
                  <div
                    key={category}
                    className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 py-1 pl-3 pr-1"
                  >
                    <span className="text-xs font-bold text-indigo-800">{category}</span>
                    <span className="text-[10px] text-indigo-500">{count}</span>
                    <button
                      type="button"
                      onClick={() => requestDeleteCategory(category)}
                      aria-label={`${category} kateqoriyasını sil`}
                      title="Kateqoriyanı sil"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-rose-600 hover:bg-rose-100"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            Hələ şəkil əlavə edilməyib.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Thumb src={item.src} alt={item.alt || item.title} />
                  <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{item.date}</p>

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

      {/* ---------------- Şəkil əlavə / redaktə ---------------- */}
      <Modal
        open={modal !== null}
        onClose={closeModal}
        zIndex={1000}
        escape={!categoryModal}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1e3a47]">
            {modal === "add" ? "Yeni şəkil əlavə et" : "Şəkli redaktə et"}
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

        <form onSubmit={saveGalleryItem} className="space-y-4">
          <div>
            <span className={labelClass}>Şəkil *</span>

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
              className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-[#1e3a47] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {form.src ? (
                <div className="relative aspect-[16/10] w-full">
                  <Thumb src={form.src} alt="Seçilmiş şəkil" />
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
                    JPG, PNG, WEBP, GIF · avtomatik kiçildilir
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

            <details className="mt-2 text-xs text-slate-500">
              <summary className="cursor-pointer font-bold text-indigo-600">
                Və ya şəkil ünvanı (URL) daxil et
              </summary>
              <input
                id="gallery-src"
                value={form.src}
                onChange={(event) =>
                  setForm((current) => ({ ...current, src: event.target.value }))
                }
                className={`${inputClass} mt-2`}
                placeholder="/galereya/seminar.jpeg və ya https://..."
              />
            </details>
          </div>

          <div>
            <label htmlFor="gallery-title" className={labelClass}>
              Şəkil başlığı *
            </label>
            <input
              id="gallery-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              required
              maxLength={200}
              className={inputClass}
              placeholder="Məsələn, Seminar günü"
            />
          </div>

          <div>
            <label htmlFor="gallery-alt" className={labelClass}>
              Şəkil təsviri
            </label>
            <input
              id="gallery-alt"
              value={form.alt}
              onChange={(event) =>
                setForm((current) => ({ ...current, alt: event.target.value }))
              }
              className={inputClass}
              placeholder="Şəklin qısa təsviri"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="gallery-category" className={labelClass}>
                Kateqoriya *
              </label>

              {categories.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  {categoriesLoading
                    ? "Kateqoriyalar yüklənir..."
                    : "Kateqoriya yoxdur və ya yüklənmədi."}
                  {!categoriesLoading && (
                    <button
                      type="button"
                      onClick={() => void reloadAll()}
                      className="mt-1 block font-bold text-amber-800 underline"
                    >
                      Yenidən yüklə
                    </button>
                  )}
                </div>
              ) : (
                <select
                  id="gallery-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  required
                  className={inputClass}
                >
                  <option value="">Kateqoriya seç</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={openCategoryModal}
                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                + Yeni kateqoriya yarat
              </button>
            </div>

            <div>
              <label htmlFor="gallery-date" className={labelClass}>
                Tarix
              </label>
              <input
                id="gallery-date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
                className={inputClass}
                placeholder="Oktyabr 2026"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
            <span>
              <span className="block text-sm font-bold text-slate-800">
                Əsas slayderdə göstər
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                Ana səhifənin seçilmiş şəkilləri üçün
              </span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) =>
                setForm((current) => ({ ...current, featured: event.target.checked }))
              }
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
      </Modal>

      {/* ---------------- Yeni kateqoriya ---------------- */}
      <Modal
        open={categoryModal}
        onClose={closeCategoryModal}
        zIndex={1100}
        widthClass="max-w-md"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-[#1e3a47]">Yeni kateqoriya</h2>
            <p className="mt-1 text-xs text-slate-500">
              Kateqoriya adı maksimum 60 simvol ola bilər.
            </p>
          </div>
          <button
            type="button"
            onClick={closeCategoryModal}
            disabled={categorySaving}
            className="text-2xl text-slate-400"
            aria-label="Bağla"
          >
            ×
          </button>
        </div>

        <form onSubmit={createCategory}>
          <label htmlFor="new-gallery-category" className="mb-2 block text-xs font-bold text-slate-700">
            Kateqoriya adı
          </label>
          <input
            id="new-gallery-category"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            maxLength={60}
            required
            autoFocus
            placeholder="Məsələn, Yarışlar"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1e3a47]"
          />

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeCategoryModal}
              disabled={categorySaving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={categorySaving || !newCategory.trim()}
              className="rounded-xl bg-[#1e3a47] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {categorySaving ? "Yaradılır..." : "Yarat"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- Kateqoriyanı sil ---------------- */}
      <Modal
        open={Boolean(deleteCategory)}
        onClose={closeDeleteCategory}
        zIndex={1200}
        widthClass="max-w-md"
      >
        <h2 className="text-lg font-black text-slate-900">
          Kateqoriyanı silmək istəyirsən?
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          <strong>{deleteCategory}</strong> kateqoriyası silinəcək. Şəkillər silinməyəcək.
        </p>

        {deleteCategoryHasImages && (
          <div className="mt-5">
            <label htmlFor="move-gallery-category" className="mb-2 block text-xs font-bold text-slate-700">
              Şəkilləri hansı kateqoriyaya köçürək?
            </label>
            <select
              id="move-gallery-category"
              value={moveTo}
              onChange={(event) => setMoveTo(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#1e3a47]"
            >
              {categories
                .filter((category) => category !== deleteCategory)
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeDeleteCategory}
            disabled={categorySaving}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={() => void confirmDeleteCategory()}
            disabled={categorySaving || (deleteCategoryHasImages && !moveTo)}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {categorySaving ? "İcra olunur..." : "Sil və köçür"}
          </button>
        </div>
      </Modal>

      {/* ---------------- Şəkli sil ---------------- */}
      <Modal
        open={deleteId !== null}
        onClose={closeDeleteImage}
        zIndex={1300}
        widthClass="max-w-sm"
      >
        <h2 className="text-lg font-black text-slate-900">Şəkli silmək istəyirsən?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bu əməliyyat seçilmiş şəkli qalereyadan siləcək.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeDeleteImage}
            disabled={deleting}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={() => void confirmDeleteImage()}
            disabled={deleting}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {deleting ? "Silinir..." : "Bəli, sil"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default function AdminQalereyaPage() {
  return (
    <PageErrorBoundary>
      <AdminQalereyaContent />
    </PageErrorBoundary>
  )
}