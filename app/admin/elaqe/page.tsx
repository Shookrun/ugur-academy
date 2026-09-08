"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"

type BranchInfo = {
  id: string
  city: string
  address: string
  phone: string
  instagram: string
  facebook: string
  mapSrc: string
}

export default function AdminElaqePage() {
  const { status } = useSession()
  const router = useRouter()

  const [branches, setBranches] = useState<BranchInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<BranchInfo | null>(null)
  const [form, setForm] = useState<Partial<BranchInfo>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/contact")
      if (res.ok) {
        const data = await res.json()
        setBranches(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const openAdd = () => {
    setForm({
      id: Date.now().toString(),
      city: "",
      address: "",
      phone: "+994 50 000 00 00",
      instagram: "https://www.instagram.com/ugur.academy",
      facebook: "https://www.facebook.com/ugur.academy",
    })
    setModal("add")
  }

  const openEdit = (branch: BranchInfo) => {
    setEditItem(branch)
    setForm({ ...branch })
    setModal("edit")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.city || !form.address) return
    setSaving(true)

    try {
      if (modal === "add") {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          await fetchBranches()
          setModal(null)
          setForm({})
        }
      } else if (modal === "edit" && editItem) {
        const res = await fetch("/api/contact", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editItem, ...form }),
        })
        if (res.ok) {
          await fetchBranches()
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
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setBranches(branches.filter((b) => b.id !== id))
        setDeleteId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Filiallar və Əlaqə
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədris mərkəzinin filial ünvanları və əlaqə vasitələrini idarə edin ({branches.length} filial)
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
            <span>Yeni Filial Əlavə Et</span>
          </button>
        </div>

        {/* Branches Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {branches.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-black text-xs border border-sky-200">
                        📍
                      </span>
                      <h3 className="text-lg font-black text-[#1e3a47]">{b.city} Filialı</h3>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Aktiv
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                    <p className="flex items-start gap-2">
                      <strong className="font-bold text-slate-800 shrink-0">Ünvan:</strong>
                      <span>{b.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <strong className="font-bold text-slate-800 shrink-0">Əlaqə:</strong>
                      <span>{b.phone}</span>
                    </p>
                    {b.instagram && (
                      <p className="flex items-center gap-2">
                        <strong className="font-bold text-slate-800 shrink-0">Instagram:</strong>
                        <a href={b.instagram} target="_blank" className="text-sky-600 hover:underline truncate">
                          {b.instagram}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Redaktə
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(b.id)}
                    className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Filial Əlavə Et" : "Filialı Redaktə Et"}
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
                    Şəhər / Filial Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Hacıqabul, Şirvan, Bakı..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dəqiq Ünvan *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address || ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Mərkəzi küçə 12"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon Nömrəsi
                  </label>
                  <input
                    type="text"
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+994 50 000 00 00"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instagram Linki
                  </label>
                  <input
                    type="text"
                    value={form.instagram || ""}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    placeholder="https://www.instagram.com/..."
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

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">
                Filialı silmək istədiyinizdən əminsiniz?
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Bu filial məlumatları saytın əlaqə səhifəsindən silinəcəkdir.
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
