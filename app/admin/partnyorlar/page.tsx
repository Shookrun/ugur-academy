"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"
import { partnersData } from "@/data/partners"

type PartnerAdmin = {
  id: string
  name: string
  position: string
  department: string
  specialty: string
  logo: string
  experienceYears: number
  studentsCount: number
  bio: string
}

export default function AdminPartnyorlarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [items, setItems] = useState<PartnerAdmin[]>([])
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<PartnerAdmin | null>(null)
  const [form, setForm] = useState<Partial<PartnerAdmin>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  useEffect(() => {
    const saved = localStorage.getItem("ugur_admin_partners")
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      const seeded: PartnerAdmin[] = partnersData.map((p) => ({
        id: String(p.id),
        name: p.name,
        position: p.position,
        department: p.department,
        specialty: p.specialty,
        logo: p.logo,
        experienceYears: p.experienceYears,
        studentsCount: p.studentsCount,
        bio: p.bio,
      }))
      setItems(seeded)
      localStorage.setItem("ugur_admin_partners", JSON.stringify(seeded))
    }
  }, [])

  const save = (list: PartnerAdmin[]) => {
    setItems(list)
    localStorage.setItem("ugur_admin_partners", JSON.stringify(list))
  }

  const openAdd = () => {
    setForm({ id: Date.now().toString(), experienceYears: 1, studentsCount: 0 })
    setModal("add")
  }

  const openEdit = (item: PartnerAdmin) => {
    setEditItem(item)
    setForm({ ...item })
    setModal("edit")
  }

  const handleSave = () => {
    if (!form.name || !form.position) return
    if (modal === "add") {
      save([...items, form as PartnerAdmin])
    } else if (editItem) {
      save(items.map((i) => (i.id === editItem.id ? { ...i, ...form } as PartnerAdmin : i)))
    }
    setModal(null)
    setForm({})
    setEditItem(null)
  }

  const handleDelete = (id: string) => {
    save(items.filter((i) => i.id !== id))
    setDeleteId(null)
  }

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.department.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-2xl font-extrabold text-white">Partnyorlar / Müəllimlər</h1>
            <p className="mt-1 text-sm text-slate-400">{items.length} nəfər</p>
          </div>
          <button
            onClick={openAdd}
            id="admin-add-partner-btn"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:bg-amber-400"
          >
            + Müəllim Əlavə Et
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Ad və ya departament axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
          />
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all hover:border-slate-700"
            >
              <div className="mb-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover border border-slate-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/hero.jpeg" }}
                />
                <div>
                  <p className="font-bold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.position}</p>
                </div>
              </div>
              <span className="inline-block rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                {item.department}
              </span>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 rounded-xl border border-slate-700 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  ✏️ Düzəlt
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="flex-1 rounded-xl border border-red-500/30 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-500">Nəticə tapılmadı.</div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-lg font-bold text-white">
                {modal === "add" ? "Müəllim Əlavə Et" : "Müəllimi Düzəlt"}
              </h2>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-6 space-y-4">
              {([
                { key: "name", label: "Ad Soyad", required: true },
                { key: "position", label: "Vəzifə", required: true },
                { key: "department", label: "Departament" },
                { key: "specialty", label: "İxtisas" },
                { key: "logo", label: "Foto URL" },
                { key: "experienceYears", label: "Təcrübə (il)", type: "number" },
                { key: "studentsCount", label: "Tələbə sayı", type: "number" },
                { key: "bio", label: "Bio", textarea: true },
              ] as Array<{key: keyof PartnerAdmin; label: string; required?: boolean; type?: string; textarea?: boolean}>).map(({ key, label, required, type, textarea }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                    {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  {textarea ? (
                    <textarea
                      value={(form[key] as string) || ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500 resize-none"
                    />
                  ) : (
                    <input
                      type={type || "text"}
                      value={(form[key] as string | number) || ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button onClick={() => { setModal(null); setForm({}) }} className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800">Ləğv et</button>
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
            <p className="text-center text-base font-semibold text-white">Bu müəllimi silmək istədiyinizdən əminsiniz?</p>
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
