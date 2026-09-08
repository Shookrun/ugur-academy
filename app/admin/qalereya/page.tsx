"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"
import { galleryItems } from "@/data/gallery"

type GalleryItem = {
  id: string
  src: string
  alt: string
  category: string
}

export default function AdminQalereyaPage() {
  const { status } = useSession()
  const router = useRouter()

  const [items, setItems] = useState<GalleryItem[]>([])
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState<Partial<GalleryItem>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  useEffect(() => {
    const saved = localStorage.getItem("ugur_admin_gallery")
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      const seeded: GalleryItem[] = galleryItems.map((g) => ({
        id: String(g.id),
        src: g.src,
        alt: g.alt,
        category: g.category,
      }))
      setItems(seeded)
      localStorage.setItem("ugur_admin_gallery", JSON.stringify(seeded))
    }
  }, [])

  const save = (list: GalleryItem[]) => {
    setItems(list)
    localStorage.setItem("ugur_admin_gallery", JSON.stringify(list))
  }

  const openAdd = () => {
    setForm({ id: Date.now().toString(), category: "Ümumi" })
    setModal("add")
  }

  const openEdit = (item: GalleryItem) => {
    setEditItem(item)
    setForm({ ...item })
    setModal("edit")
  }

  const handleSave = () => {
    if (!form.src || !form.alt) return
    if (modal === "add") {
      save([...items, form as GalleryItem])
    } else if (editItem) {
      save(items.map((i) => (i.id === editItem.id ? { ...i, ...form } as GalleryItem : i)))
    }
    setModal(null)
    setForm({})
    setEditItem(null)
  }

  const handleDelete = (id: string) => {
    save(items.filter((i) => i.id !== id))
    setDeleteId(null)
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Qalereya</h1>
            <p className="mt-1 text-sm text-slate-400">{items.length} şəkil</p>
          </div>
          <button
            onClick={openAdd}
            id="admin-add-gallery-btn"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:bg-amber-400"
          >
            + Şəkil Əlavə Et
          </button>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hero.jpeg"
                  }}
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-white">{item.alt}</p>
                <span className="mt-1 inline-block rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                  {item.category}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30"
                >
                  ✏️ Düzəlt
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="rounded-lg bg-red-500/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-20 text-center text-slate-500">Qalereya boşdur.</div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-lg font-bold text-white">
                {modal === "add" ? "Şəkil Əlavə Et" : "Şəkili Düzəlt"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "src", label: "Şəkil URL və ya yolu", required: true },
                { key: "alt", label: "Açıqlama (alt text)", required: true },
                { key: "category", label: "Kateqoriya" },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                    {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    value={(form[key as keyof GalleryItem] as string) || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              ))}
              {form.src && (
                <div className="overflow-hidden rounded-xl border border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.src} alt="preview" className="h-32 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button onClick={() => { setModal(null); setForm({}) }} className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800">
                Ləğv et
              </button>
              <button onClick={handleSave} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-400">
                {modal === "add" ? "Əlavə et" : "Yadda saxla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <p className="text-center text-base font-semibold text-white">Bu şəkili silmək istədiyinizdən əminsiniz?</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm text-slate-300 hover:bg-slate-800">Ləğv et</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400">Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
