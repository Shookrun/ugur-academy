"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"

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
  email?: string
  phone?: string
}

export default function AdminPartnyorlarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [items, setItems] = useState<PartnerAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<PartnerAdmin | null>(null)
  const [form, setForm] = useState<Partial<PartnerAdmin>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/partners")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const openAdd = () => {
    setForm({
      id: Date.now().toString(),
      logo: "/Mehman Bayramov.jpg",
      experienceYears: 5,
      studentsCount: 100,
      department: "Tədris Şöbəsi",
    })
    setModal("add")
  }

  const openEdit = (p: PartnerAdmin) => {
    setEditItem(p)
    setForm({ ...p })
    setModal("edit")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.position) return
    setSaving(true)

    try {
      if (modal === "add") {
        const res = await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          await fetchPartners()
          setModal(null)
          setForm({})
        }
      } else if (modal === "edit" && editItem) {
        const res = await fetch("/api/partners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editItem, ...form }),
        })
        if (res.ok) {
          await fetchPartners()
          setModal(null)
          setForm({})
          setEditItem(null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id))
        setDeleteId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Komanda və Əməkdaşlar
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədris mərkəzinin müəllim və rəhbər heyətini idarə edin ({items.length} əməkdaş)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Əməkdaş axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:border-[#1e3a47] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#162c37] active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Yeni Əməkdaş Əlavə Et</span>
            </button>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Əməkdaş</th>
                    <th className="px-6 py-3.5">Vəzifə</th>
                    <th className="px-6 py-3.5">İxtisas sahəsi</th>
                    <th className="px-6 py-3.5">Təcrübə</th>
                    <th className="px-6 py-3.5">Tələbə sayı</th>
                    <th className="px-6 py-3.5 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Heç bir əməkdaş tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a47]/10 font-bold text-[#1e3a47]">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.name}</p>
                              <p className="text-[11px] font-normal text-slate-500">{item.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-800 border border-sky-200/60">
                            {item.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium max-w-xs truncate">
                          {item.specialty}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {item.experienceYears} il
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {item.studentsCount}+
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            >
                              Redaktə
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(item.id)}
                              className="rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add or Edit */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Əməkdaş Əlavə Et" : "Əməkdaşı Redaktə Et"}
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
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Məs: Mehman Bayramov"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vəzifə *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.position || ""}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="Baş Təlimçi, Psixoloq, Həkim..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Şöbə
                    </label>
                    <input
                      type="text"
                      value={form.department || ""}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      placeholder="İT, Səhiyyə, Pedaqogika..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    İxtisas Sahəsi
                  </label>
                  <input
                    type="text"
                    value={form.specialty || ""}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="Məs: Kompüter savadlılığı, Ofis proqramları..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Təcrübə (il)
                    </label>
                    <input
                      type="number"
                      value={form.experienceYears || 0}
                      onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tələbə Sayı
                    </label>
                    <input
                      type="number"
                      value={form.studentsCount || 0}
                      onChange={(e) => setForm({ ...form, studentsCount: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Haqqında Qısa Məlumat
                  </label>
                  <textarea
                    rows={2}
                    value={form.bio || ""}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Əməkdaş haqqında qısa bio..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
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

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">
                Əməkdaşı silmək istədiyinizdən əminsiniz?
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Bu əməkdaş saytın komanda səhifəsindən çıxarılacaqdır.
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
                  onClick={() => handleDelete(deleteId)}
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
