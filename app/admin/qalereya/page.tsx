
"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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

type ApiError = {
  error?: string
}

const EMPTY_FORM: Omit<GalleryItem, "id"> = {
  src: "",
  alt: "",
  title: "",
  category: "",
  date: "2026",
  featured: false,
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null)

  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof (data as ApiError).error === "string"
  ) {
    return (data as ApiError).error!
  }

  return fallback
}

export default function AdminQalereyaPage() {
  const { status } = useSession()
  const router = useRouter()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [categoryModal, setCategoryModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<GalleryItem>({
    id: "",
    ...EMPTY_FORM,
  })

  const [newCategory, setNewCategory] = useState("")
  const [deleteCategory, setDeleteCategory] = useState("")
  const [moveTo, setMoveTo] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  const fetchGallery = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Qalereyanı yükləmək mümkün olmadı.")
      }

      const data: unknown = await response.json()

      if (Array.isArray(data)) {
        setItems(data as GalleryItem[])
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Qalereya yüklənmədi.",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery/categories", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Kateqoriyaları yükləmək mümkün olmadı.")
      }

      const data: unknown = await response.json()

      if (Array.isArray(data)) {
        const valid = data.filter(
          (category): category is string =>
            typeof category === "string" && category.trim().length > 0
        )

        setCategories(Array.from(new Set(valid.map((category) => category.trim()))))
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Kateqoriyalar yüklənmədi.",
        "error"
      )
    } finally {
      setCategoriesLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void fetchGallery()
    void fetchCategories()
  }, [fetchGallery, fetchCategories])

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

  const closeModal = () => {
    if (saving) return
    setModal(null)
    setEditId(null)
  }

  const createCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = newCategory.trim()

    if (!name || categorySaving) return

    setCategorySaving(true)

    try {
      const response = await fetch("/api/gallery/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        showToast(await getErrorMessage(response, "Kateqoriya yaradıla bilmədi."), "error")
        return
      }

      const data: unknown = await response.json()
      const returnedCategories =
        data &&
        typeof data === "object" &&
        "categories" in data &&
        Array.isArray(data.categories)
          ? data.categories.filter(
              (category): category is string => typeof category === "string"
            )
          : [...categories, name]

      setCategories(returnedCategories)
      setForm((current) => ({ ...current, category: name }))
      setNewCategory("")
      setCategoryModal(false)
      showToast(`"${name}" kateqoriyası yaradıldı.`)
    } catch {
      showToast("Serverlə əlaqə qurmaq mümkün olmadı.", "error")
    } finally {
      setCategorySaving(false)
    }
  }

  const requestDeleteCategory = (category: string) => {
    const remaining = categories.filter((item) => item !== category)
    const hasImages = items.some((item) => item.category === category)

    setDeleteCategory(category)
    setMoveTo(remaining[0] ?? "")

    if (hasImages && remaining.length === 0) {
      showToast(
        "Bu kateqoriyanı silməzdən əvvəl başqa kateqoriya yaratmalısan.",
        "error"
      )
      setCategoryModal(false)
      return
    }
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
      const response = await fetch("/api/gallery/categories", {
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

      const data: unknown = await response.json()

      const updatedCategories =
        data &&
        typeof data === "object" &&
        "categories" in data &&
        Array.isArray(data.categories)
          ? data.categories.filter(
              (category): category is string => typeof category === "string"
            )
          : categories.filter((category) => category !== deleteCategory)

      setCategories(updatedCategories)

      if (affected.length > 0) {
        setItems((current) =>
          current.map((item) =>
            item.category === deleteCategory
              ? { ...item, category: moveTo }
              : item
          )
        )
      }

      if (form.category === deleteCategory) {
        setForm((current) => ({
          ...current,
          category: affected.length > 0 ? moveTo : updatedCategories[0] ?? "",
        }))
      }

      setDeleteCategory("")
      setMoveTo("")
      showToast(
        affected.length > 0
          ? `Kateqoriya silindi. ${affected.length} şəkil "${moveTo}" kateqoriyasına köçürüldü.`
          : "Kateqoriya uğurla silindi."
      )

      await Promise.all([fetchGallery(), fetchCategories()])
    } catch {
      showToast("Serverlə əlaqə qurmaq mümkün olmadı.", "error")
    } finally {
      setCategorySaving(false)
    }
  }

  const saveGalleryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (saving) return

    const title = form.title.trim()
    const src = form.src.trim()
    const category = form.category.trim()

    if (!title || !src || !category) {
      showToast("Başlıq, şəkil yolu və kateqoriya tələb olunur.", "error")
      return
    }

    if (!categories.includes(category)) {
      showToast("Seçilmiş kateqoriya artıq mövcud deyil.", "error")
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

      const response = await fetch("/api/gallery", {
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
    } catch {
      showToast("Serverlə əlaqə qurmaq mümkün olmadı.", "error")
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteImage = async () => {
    if (!deleteId || deleting) return

    setDeleting(true)

    try {
      const response = await fetch(
        `/api/gallery?id=${encodeURIComponent(deleteId)}`,
        { method: "DELETE", cache: "no-store" }
      )

      if (!response.ok) {
        showToast(await getErrorMessage(response, "Şəkli silmək mümkün olmadı."), "error")
        return
      }

      setItems((current) => current.filter((item) => item.id !== deleteId))
      setDeleteId(null)
      showToast("Şəkil silindi.")
      await fetchGallery()
    } catch {
      showToast("Serverlə əlaqə qurmaq mümkün olmadı.", "error")
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

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed right-5 top-5 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{toast.message}</span>
              <button type="button" onClick={() => setToast(null)} aria-label="Bildirişi bağla">×</button>
            </div>
          </div>
        )}

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              onClick={() => {
                setNewCategory("")
                setCategoryModal(true)
              }}
              className="rounded-xl border border-[#1e3a47] bg-white px-4 py-2.5 text-sm font-bold text-[#1e3a47] hover:bg-slate-50"
            >
              + Kateqoriya yarat
            </button>

            <button
              type="button"
              onClick={openAdd}
              disabled={categories.length === 0 || categoriesLoading}
              className="rounded-xl bg-[#1e3a47] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#162c37] disabled:opacity-50"
            >
              + Yeni şəkil
            </button>
          </div>
        </header>

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
                    <span className="text-xs font-bold text-indigo-800">
                      {category}
                    </span>
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
                  <Image
                    src={item.src}
                    alt={item.alt || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
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

      {categoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1e3a47]">Yeni kateqoriya</h2>
                <p className="mt-1 text-xs text-slate-500">Kateqoriya adı maksimum 60 simvol ola bilər.</p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModal(false)}
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
                  onClick={() => setCategoryModal(false)}
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
          </div>
        </div>
      )}

      {deleteCategory && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900">
              Kateqoriyanı silmək istəyirsən?
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              <strong>{deleteCategory}</strong> kateqoriyası silinəcək. Şəkillər silinməyəcək.
            </p>

            {items.some((item) => item.category === deleteCategory) && (
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
                onClick={() => {
                  setDeleteCategory("")
                  setMoveTo("")
                }}
                disabled={categorySaving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteCategory()}
                disabled={
                  categorySaving ||
                  (items.some((item) => item.category === deleteCategory) && !moveTo)
                }
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {categorySaving ? "İcra olunur..." : "Sil və köçür"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1e3a47]">
                {modal === "add" ? "Yeni şəkil əlavə et" : "Şəkli redaktə et"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-2xl text-slate-400"
                aria-label="Bağla"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveGalleryItem} className="space-y-4">
              <div>
                <label htmlFor="gallery-title" className="mb-1.5 block text-xs font-bold text-slate-700">
                  Şəkil başlığı *
                </label>
                <input
                  id="gallery-title"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                  maxLength={200}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#1e3a47]"
                  placeholder="Məsələn, Seminar günü"
                />
              </div>

              <div>
                <label htmlFor="gallery-src" className="mb-1.5 block text-xs font-bold text-slate-700">
                  Şəkil yolu və ya URL *
                </label>
                <input
                  id="gallery-src"
                  value={form.src}
                  onChange={(event) => setForm((current) => ({ ...current, src: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#1e3a47]"
                  placeholder="/galereya/seminar.jpeg"
                />
              </div>

              <div>
                <label htmlFor="gallery-alt" className="mb-1.5 block text-xs font-bold text-slate-700">
                  Şəkil təsviri
                </label>
                <input
                  id="gallery-alt"
                  value={form.alt}
                  onChange={(event) => setForm((current) => ({ ...current, alt: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#1e3a47]"
                  placeholder="Şəklin qısa təsviri"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="gallery-category" className="mb-1.5 block text-xs font-bold text-slate-700">
                    Kateqoriya *
                  </label>
                  <select
                    id="gallery-category"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    required
                    disabled={categoriesLoading || categories.length === 0}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#1e3a47] disabled:bg-slate-50"
                  >
                    <option value="">Kateqoriya seç</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory("")
                      setCategoryModal(true)
                    }}
                    className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Yeni kateqoriya yarat
                  </button>
                </div>

                <div>
                  <label htmlFor="gallery-date" className="mb-1.5 block text-xs font-bold text-slate-700">
                    Tarix
                  </label>
                  <input
                    id="gallery-date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#1e3a47]"
                    placeholder="Oktyabr 2026"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-bold text-slate-800">Əsas slayderdə göstər</span>
                  <span className="mt-1 block text-xs text-slate-500">Ana səhifənin seçilmiş şəkilləri üçün</span>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                  className="h-4 w-4 accent-[#1e3a47]"
                />
              </label>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={saving || categoriesLoading || categories.length === 0}
                  className="rounded-xl bg-[#1e3a47] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#162c37] disabled:opacity-50"
                >
                  {saving ? "Saxlanılır..." : "Yadda saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900">Şəkli silmək istəyirsən?</h2>
            <p className="mt-2 text-sm text-slate-500">Bu əməliyyat seçilmiş şəkli qalereyadan siləcək.</p>
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
                onClick={() => void confirmDeleteImage()}
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
