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
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState<Partial<GalleryItem>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr))
    }, 4000)
  }

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const fetchGallery = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await fetch(`/api/gallery?t=${Date.now()}&_nonce=${Math.random().toString(36).slice(2)}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setItems(data)
        }
      } else {
        showToast("Qalereyanı yükləmək mümkün olmadı.", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery(true)
  }, [])

  const openAdd = () => {
    setForm({
      id: Date.now().toString(),
      src: "/galereya/ugur-01.jpeg",
      category: "Dərslər",
      date: "2026",
    })
    setModal("add")
  }

  const openEdit = (item: GalleryItem) => {
    setEditItem(item)
    setForm({ ...item })
    setModal("edit")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title?.trim() || !form.src?.trim()) {
      showToast("Şəkil başlığı və fayl seçilməlidir.", "error")
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
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const newItem = await res.json().catch(() => null)
          if (newItem && newItem.id) {
            setItems((prev) => [newItem, ...prev])
          }
          setModal(null)
          setForm({})
          showToast("Yeni şəkil uğurla əlavə edildi!", "success")
          fetchGallery(false)
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.error || "Şəkil əlavə edilərkən xəta baş verdi.", "error")
        }
      } else if (modal === "edit" && editItem) {
        const targetId = String(editItem.id).trim()
        const updatePayload = { ...editItem, ...form, id: targetId }
        const res = await fetch("/api/gallery", {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(updatePayload),
        })
        if (res.ok) {
          const updated = await res.json().catch(() => null)
          const merged = updated && updated.id ? updated : updatePayload
          setItems((prev) =>
            prev.map((i) => (String(i.id).trim() === targetId ? { ...i, ...merged } : i))
          )
          setModal(null)
          setForm({})
          setEditItem(null)
          showToast("Şəkil məlumatları uğurla yeniləndi!", "success")
          fetchGallery(false)
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.error || "Şəkil yenilənərkən xəta baş verdi.", "error")
        }
      }
    } catch (err) {
      console.error(err)
      showToast("Serverlə əlaqə qurulmadı.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    const cleanId = String(id).trim()
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(cleanId)}&t=${Date.now()}`, { 
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => String(item.id).trim() !== cleanId))
        setDeleteId(null)
        showToast("Şəkil uğurla silindi!", "success")
        fetchGallery(false)
      } else {
        showToast("Şəkil silinərkən xəta baş verdi.", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setDeleting(false)
    }
  }

  const categories = ["Dərslər", "Mərasimlər", "Seminarlar", "Komanda", "Hadisələr", "Mentorluq"]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 ${
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
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "i"}
          </div>
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Qalereya İdarəetməsi
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədbirlər, seminarlar və dərslərdən olan fotoşəkilləri idarə edin ({items.length} şəkil)
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#162c37] active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Yeni Şəkil Əlavə Et</span>
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
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
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{item.date}</p>

                  <div className="mt-auto pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
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

        {/* Modal: Add or Edit */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Şəkil Əlavə Et" : "Şəkli Redaktə Et"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Başlıq *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Məs: Sertifikat Mərasimi..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Şəkil Yolu / URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.src || ""}
                    onChange={(e) => setForm({ ...form, src: e.target.value })}
                    placeholder="/galereya/ugur-01.jpeg və ya URL"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alt mətn (əlçatanlıq üçün)
                  </label>
                  <input
                    type="text"
                    value={form.alt || ""}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    placeholder="Şəkilin qısa təsviri..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kateqoriya
                    </label>
                    <select
                      value={form.category || "Dərslər"}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tarix
                    </label>
                    <input
                      type="text"
                      value={form.date || ""}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="Məs: İyun 2026"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Əsas Slayder</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Ana səhifənin qalereya slaydında göstərilsin
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                      form.featured ? "bg-[#1e3a47]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        form.featured ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37] disabled:opacity-50"
                  >
                    {saving ? "Saxlanılır..." : "Yadda Saxla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
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
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
                >
                  Bəli, Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
