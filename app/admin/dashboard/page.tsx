"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"

interface Inquiry {
  id: string
  fullName: string
  contact: string
  childInfo?: {
    age?: number
    language?: string
  }
  status: "Baxılıb" | "Gözləmədə" | "Yeni"
  date: string
  time: string
  courseApplied?: string
  notes?: string
}

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("Hamısı")
  const [modal, setModal] = useState<"add" | null>(null)
  const [form, setForm] = useState<Partial<Inquiry>>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/inquiries")
      if (res.ok) {
        const data = await res.json()
        setInquiries(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const handleStatusChange = async (id: string, newStatus: Inquiry["status"]) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (res.ok) {
        setInquiries(inquiries.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bu sorğunu silmək istədiyinizdən əminsiniz?")) {
      try {
        const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" })
        if (res.ok) {
          setInquiries(inquiries.filter((item) => item.id !== id))
          if (selectedInquiry?.id === id) setSelectedInquiry(null)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleAddInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.contact) return

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        await fetchInquiries()
        setModal(null)
        setForm({})
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.contact.includes(searchQuery) ||
      (inq.courseApplied && inq.courseApplied.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "Hamısı" ? true : inq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1e3a47]">
              Sorğular və Müraciətlər
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Veb-saytdan daxil olan tələbə və valideyn müraciətlərini idarə edin ({inquiries.length} müraciət)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Axtar (ad, nömrə)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:border-[#1e3a47] focus:outline-hidden"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-xs focus:border-[#1e3a47] focus:outline-hidden"
            >
              <option value="Hamısı">Bütün statuslar</option>
              <option value="Yeni">Yeni</option>
              <option value="Gözləmədə">Gözləmədə</option>
              <option value="Baxılıb">Baxılıb</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setForm({ status: "Yeni", courseApplied: "Kompüter Kursu" })
                setModal("add")
              }}
              className="rounded-xl bg-[#1e3a47] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#162c37] active:scale-95"
            >
              + Yeni Sorğu
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <p className="text-2xl font-black text-slate-900">{inquiries.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Ümumi Sorğu</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5 shadow-xs">
            <p className="text-2xl font-black text-sky-700">
              {inquiries.filter((i) => i.status === "Yeni").length}
            </p>
            <p className="text-xs font-semibold text-sky-600 mt-1">Yeni Sorğular</p>
          </div>
          <div className="rounded-2xl border border-[#1e3a47] bg-[#1e3a47]/10 p-5 shadow-xs">
            <p className="text-2xl font-black text-[#1e3a47]">
              {inquiries.filter((i) => i.status === "Gözləmədə").length}
            </p>
            <p className="text-xs font-semibold text-[#1e3a47] mt-1">Gözləmədə</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-xs">
            <p className="text-2xl font-black text-emerald-700">
              {inquiries.filter((i) => i.status === "Baxılıb").length}
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-1">Baxılıb</p>
          </div>
        </div>

        {/* Inquiries Table */}
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
                    <th className="px-6 py-3.5">Müraciət edən</th>
                    <th className="px-6 py-3.5">Əlaqə nömrəsi</th>
                    <th className="px-6 py-3.5">Müraciət olunan kurs</th>
                    <th className="px-6 py-3.5">Tarix</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Sorğu tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {inq.fullName}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {inq.contact}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                            {inq.courseApplied || "Ümumi müraciət"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {inq.date} {inq.time}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={inq.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${inq.status === "Yeni"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : inq.status === "Gözləmədə"
                                ? "bg-[#1e3a47]/10 text-[#1e3a47] border-[#1e3a47]"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                          >
                            <option value="Yeni">Yeni</option>
                            <option value="Gözləmədə">Gözləmədə</option>
                            <option value="Baxılıb">Baxılıb</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(inq.id)
                            }}
                            className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#1e3a47]">
                    {selectedInquiry.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedInquiry.date} tarixində göndərilib
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                  <p><strong className="text-slate-700">Əlaqə nömrəsi:</strong> {selectedInquiry.contact}</p>
                  <p><strong className="text-slate-700">Müraciət edilən kurs:</strong> {selectedInquiry.courseApplied || "Ümumi"}</p>
                  {selectedInquiry.notes && (
                    <p><strong className="text-slate-700">Qeyd:</strong> {selectedInquiry.notes}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Status:</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as Inquiry["status"])}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 font-bold text-slate-800"
                    >
                      <option value="Yeni">Yeni</option>
                      <option value="Gözləmədə">Gözləmədə</option>
                      <option value="Baxılıb">Baxılıb</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="rounded-lg bg-rose-50 px-3 py-1.5 font-bold text-rose-600 hover:bg-rose-100"
                  >
                    Müraciəti Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Inquiry */}
        {modal === "add" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">Yeni Müraciət Qeydi</h3>
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

              <form onSubmit={handleAddInquiry} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ad və Soyad *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName || ""}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Məs: Əli Məmmədov"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Əlaqə Nömrəsi *</label>
                  <input
                    type="text"
                    required
                    value={form.contact || ""}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="050 000 00 00"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Müraciət Edilən Kurs</label>
                  <input
                    type="text"
                    value={form.courseApplied || ""}
                    onChange={(e) => setForm({ ...form, courseApplied: e.target.value })}
                    placeholder="Kompüter, Tibb, MİQ..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qeyd</label>
                  <textarea
                    rows={2}
                    value={form.notes || ""}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Əlavə məlumat..."
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
                    className="rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37]"
                  >
                    Əlavə Et
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
