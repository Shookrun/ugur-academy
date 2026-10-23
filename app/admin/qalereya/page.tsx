"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"
import Image from "next/image"

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
  type: "success" | "error" | "info"
  message: string
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

  const [editItem, setEditItem] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState<Partial<GalleryItem>>({})

  const [newCategory, setNewCategory] = useState("")

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)

  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type })

    setTimeout(() => {
      setToast((current) =>
        current?.message === message ? null : current
      )
    }, 4000)
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  const fetchGallery = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      }

      const res = await fetch(
        `/api/gallery?t=${Date.now()}&_nonce=${Math.random()
          .toString(36)
          .slice(2)}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      )

      if (res.ok) {
        const data: unknown = await res.json()

        if (Array.isArray(data)) {
          setItems(data as GalleryItem[])
        }
      } else {
        showToast("Qalereyanı yükləmək mümkün olmadı.", "error")
      }
    } catch (error) {
      console.error(error)
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  const fetchCategories = async (showLoading = true) => {
    try {
      if (showLoading) {
        setCategoriesLoading(true)
      }

      const res = await fetch(
        `/api/gallery/categories?t=${Date.now()}&_nonce=${Math.random()
          .toString(36)
          .slice(2)}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      )

      if (!res.ok) {
        showToast("Kateqoriyaları yükləmək mümkün olmadı.", "error")
        return
      }

      const data: unknown = await res.json()

      if (!Array.isArray(data)) {
        return
      }

      const validCategories = data.filter(
        (category): category is string =>
          typeof category === "string" && category.trim().length > 0
      )

      const uniqueCategories = Array.from(
        new Set(validCategories.map((category) => category.trim()))
      )

      setCategories(uniqueCategories)
    } catch (error) {
      console.error(error)
      showToast("Kateqoriyalar yüklənərkən xəta baş verdi.", "error")
    } finally {
      if (showLoading) {
        setCategoriesLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchGallery(true)
    fetchCategories(true)
  }, [])

  const openAdd = () => {
    const defaultCategory = categories[0] || ""

    setForm({
      id: Date.now().toString(),
      src: "/galereya/ugur-01.jpeg",
      alt: "",
      title: "",
      category: defaultCategory,
      date: "2026",
      featured: false,
    })

    setModal("add")
  }

  const openEdit = (item: GalleryItem) => {
    setEditItem(item)
    setForm({ ...item })
    setModal("edit")
  }

  const closeGalleryModal = () => {
    if (saving) {
      return
    }

    setModal(null)
    setEditItem(null)
    setForm({})
  }

  const openCategoryModal = () => {
    setNewCategory("")
    setCategoryModal(true)
  }

  const closeCategoryModal = () => {
    if (categorySaving) {
      return
    }

    setCategoryModal(false)
    setNewCategory("")
  }

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault()

    const categoryName = newCategory.trim()

    if (!categoryName) {
      showToast("Kateqoriya adı boş ola bilməz.", "error")
      return
    }

    if (categoryName.length > 60) {
      showToast(
        "Kateqoriya adı maksimum 60 simvol ola bilər.",
        "error"
      )
      return
    }

    setCategorySaving(true)

    try {
      const res = await fetch("/api/gallery/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          name: categoryName,
        }),
      })

      const data: unknown = await res.json().catch(() => null)

      if (!res.ok) {
        if (
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          showToast(data.error, "error")
        } else {
          showToast(
            "Kateqoriya yaradılarkən xəta baş verdi.",
            "error"
          )
        }

        return
      }

      if (
        data &&
        typeof data === "object" &&
        "categories" in data &&
        Array.isArray(data.categories)
      ) {
        const updatedCategories = data.categories.filter(
          (category): category is string =>
            typeof category === "string" &&
            category.trim().length > 0
        )

        setCategories(updatedCategories)
      } else {
        await fetchCategories(false)
      }

      setForm((current) => ({
        ...current,
        category: categoryName,
      }))

      setNewCategory("")
      setCategoryModal(false)

      showToast(
        `"${categoryName}" kateqoriyası uğurla yaradıldı.`,
        "success"
      )
    } catch (error) {
      console.error(error)
      showToast(
        "Serverlə əlaqə qurulmadı.",
        "error"
      )
    } finally {
      setCategorySaving(false)
    }
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.title?.trim()) {
      showToast("Şəkil başlığı daxil edilməlidir.", "error")
      return
    }

    if (!form.src?.trim()) {
      showToast("Şəkil yolu və ya URL daxil edilməlidir.", "error")
      return
    }

    if (!form.category?.trim()) {
      showToast("Şəkil üçün kateqoriya seçilməlidir.", "error")
      return
    }

    setSaving(true)

    try {
      if (modal === "add") {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            ...form,
            id: form.id
              ? String(form.id).trim()
              : String(Date.now()),
            src: form.src.trim(),
            title: form.title.trim(),
            alt: form.alt?.trim() || form.title.trim(),
            category: form.category.trim(),
            date: form.date?.trim() || "2026",
            featured: Boolean(form.featured),
          }),
        })

        if (res.ok) {
          const newItem: unknown = await res.json().catch(() => null)

          if (
            newItem &&
            typeof newItem === "object" &&
            "id" in newItem &&
            typeof newItem.id === "string"
          ) {
            setItems((prev) => [
              newItem as GalleryItem,
              ...prev,
            ])
          }

          setModal(null)
          setForm({})

          showToast(
            "Yeni şəkil uğurla əlavə edildi!",
            "success"
          )

          await fetchGallery(false)
        } else {
          const errorData: unknown = await res
            .json()
            .catch(() => null)

          if (
            errorData &&
            typeof errorData === "object" &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
            showToast(errorData.error, "error")
          } else {
            showToast(
              "Şəkil əlavə edilərkən xəta baş verdi.",
              "error"
            )
          }
        }
      }

      if (modal === "edit" && editItem) {
        const targetId = String(editItem.id).trim()

        const updatePayload = {
          ...editItem,
          ...form,
          id: targetId,
          src: form.src?.trim() || editItem.src,
          title: form.title?.trim() || editItem.title,
          alt:
            form.alt?.trim() ||
            form.title?.trim() ||
            editItem.alt,
          category:
            form.category?.trim() ||
            editItem.category,
          date: form.date?.trim() || editItem.date,
          featured: Boolean(form.featured),
        }

        const res = await fetch("/api/gallery", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(updatePayload),
        })

        if (res.ok) {
          const updated: unknown = await res
            .json()
            .catch(() => null)

          const merged =
            updated &&
            typeof updated === "object" &&
            "id" in updated
              ? (updated as GalleryItem)
              : updatePayload

          setItems((prev) =>
            prev.map((item) =>
              String(item.id).trim() === targetId
                ? {
                    ...item,
                    ...merged,
                  }
                : item
            )
          )

          setModal(null)
          setForm({})
          setEditItem(null)

          showToast(
            "Şəkil məlumatları uğurla yeniləndi!",
            "success"
          )

          await fetchGallery(false)
        } else {
          const errorData: unknown = await res
            .json()
            .catch(() => null)

          if (
            errorData &&
            typeof errorData === "object" &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
            showToast(errorData.error, "error")
          } else {
            showToast(
              "Şəkil yenilənərkən xəta baş verdi.",
              "error"
            )
          }
        }
      }
    } catch (error) {
      console.error(error)
      showToast("Serverlə əlaqə qurulmadı.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)

    const cleanId = String(id).trim()

    try {
      const res = await fetch(
        `/api/gallery?id=${encodeURIComponent(
          cleanId
        )}&t=${Date.now()}`,
        {
          method: "DELETE",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      )

      if (res.ok) {
        setItems((prev) =>
          prev.filter(
            (item) =>
              String(item.id).trim() !== cleanId
          )
        )

        setDeleteId(null)

        showToast(
          "Şəkil uğurla silindi!",
          "success"
        )

        await fetchGallery(false)
      } else {
        showToast(
          "Şəkil silinərkən xəta baş verdi.",
          "error"
        )
      }
    } catch (error) {
      console.error(error)
      showToast(
        "Şəbəkə xətası baş verdi.",
        "error"
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : toast.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-950"
                : "border-sky-200 bg-sky-50 text-sky-950"
          }`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : toast.type === "error"
                  ? "bg-rose-600 text-white"
                  : "bg-sky-600 text-white"
            }`}
          >
            {toast.type === "success"
              ? "✓"
              : toast.type === "error"
                ? "✕"
                : "i"}
          </div>

          <span className="text-xs font-bold">
            {toast.message}
          </span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Qalereya İdarəetməsi
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədbirlər, seminarlar və dərslərdən olan
              fotoşəkilləri idarə edin ({items.length} şəkil)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCategoryModal}
              className="flex items-center gap-2 rounded-xl border border-[#1e3a47] bg-white px-4 py-2 text-xs font-bold text-[#1e3a47] shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span>Kateqoriya Əlavə Et</span>
            </button>

            <button
              type="button"
              onClick={openAdd}
              disabled={categories.length === 0}
              className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#162c37] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span>Yeni Şəkil Əlavə Et</span>
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Qalereya Kateqoriyaları
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Şəkilləri qruplaşdırmaq üçün admin paneldən
                istədiyin kateqoriyanı yarada bilərsən.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <span className="text-xs text-slate-400">
                  Kateqoriyalar yüklənir...
                </span>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">
                  Hələ kateqoriya yoxdur.
                </span>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                🖼️
              </div>

              <h3 className="text-sm font-bold text-slate-800">
                Hələ şəkil yoxdur
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                İlk şəklini əlavə edərək qalereyanı yaratmağa başla.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.alt || item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                    {item.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.date}
                  </p>

                  <div className="mt-auto flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Redaktə
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {categoryModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a47]">
                    Yeni Kateqoriya
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Bu kateqoriya şəkil əlavə edərkən seçilə biləcək.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCategoryModal}
                  disabled={categorySaving}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleCreateCategory}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Kateqoriya adı *
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={newCategory}
                    onChange={(event) =>
                      setNewCategory(event.target.value)
                    }
                    placeholder="Məs: Yarışlar"
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#1e3a47] focus:ring-2 focus:ring-[#1e3a47]/10"
                  />

                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-slate-400">
                      {newCategory.length}/60
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    disabled={categorySaving}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Ləğv et
                  </button>

                  <button
                    type="submit"
                    disabled={categorySaving || !newCategory.trim()}
                    className="rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categorySaving
                      ? "Yaradılır..."
                      : "Kateqoriya Yarat"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a47]">
                    {modal === "add"
                      ? "Yeni Şəkil Əlavə Et"
                      : "Şəkli Redaktə Et"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Şəkili istədiyin kateqoriyaya bağlaya bilərsən.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeGalleryModal}
                  disabled={saving}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12-12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleSave}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Başlıq *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.title || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        title: event.target.value,
                      })
                    }
                    placeholder="Məs: Sertifikat Mərasimi..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Şəkil Yolu / URL *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.src || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        src: event.target.value,
                      })
                    }
                    placeholder="/galereya/ugur-01.jpeg və ya URL"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Alt mətn
                  </label>

                  <input
                    type="text"
                    value={form.alt || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        alt: event.target.value,
                      })
                    }
                    placeholder="Şəklin qısa təsviri..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Kateqoriya *
                      </label>

                      <button
                        type="button"
                        onClick={openCategoryModal}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        + Yeni
                      </button>
                    </div>

                    <select
                      required
                      value={form.category || ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          category: event.target.value,
                        })
                      }
                      disabled={
                        categoriesLoading ||
                        categories.length === 0
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47] disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      {categories.length === 0 ? (
                        <option value="">
                          Əvvəlcə kateqoriya yaradın
                        </option>
                      ) : (
                        categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Tarix
                    </label>

                    <input
                      type="text"
                      value={form.date || ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          date: event.target.value,
                        })
                      }
                      placeholder="Məs: İyun 2026"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Əsas Slayder
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Ana səhifənin qalereya slaydında göstərilsin
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          featured: !form.featured,
                        })
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                        form.featured
                          ? "bg-[#1e3a47]"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          form.featured
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={closeGalleryModal}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Ləğv et
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      categories.length === 0 ||
                      !form.category
                    }
                    className="rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saxlanılır..."
                      : "Yadda Saxla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">
                Şəkli silmək istədiyinizdən əminsiniz?
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Bu şəkil qalereyadan çıxarılacaqdır.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Ləğv et
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    deleteId && handleDelete(deleteId)
                  }
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting
                    ? "Silinir..."
                    : "Bəli, Sil"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
