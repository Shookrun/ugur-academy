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
  specialty?: string
  isTeacher?: boolean
  logo: string
  experienceYears: number
  studentsCount: number
  bio: string
  email?: string
  phone?: string
}

type Toast = {
  type: "success" | "error" | "info"
  message: string
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
  const [deleting, setDeleting] = useState(false)
  const [isTeacher, setIsTeacher] = useState<boolean>(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [uploading, setUploading] = useState(false)

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current))
    }, 4000)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "team")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm((prev) => ({ ...prev, logo: data.url }))
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err.error || "Şəkil yüklənərkən xəta baş verdi.", "error")
      }
    } catch {
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setUploading(false)
    }
  }

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
      } else {
        showToast("Əməkdaşlar siyahısını yükləmək mümkün olmadı.", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const openAdd = () => {
    setIsTeacher(true)
    setForm({
      id: Date.now().toString(),
      name: "",
      position: "",
      department: "Tədris Şöbəsi",
      specialty: "",
      isTeacher: true,
      logo: "/Mehman Bayramov.jpg",
      experienceYears: 5,
      studentsCount: 100,
      bio: "",
      phone: "+994 ",
      email: "",
    })
    setModal("add")
  }

  const openEdit = (p: PartnerAdmin) => {
    const isTeacherRole =
      p.isTeacher !== undefined
        ? Boolean(p.isTeacher)
        : Boolean(p.specialty && p.specialty.trim() !== "")
    setIsTeacher(isTeacherRole)
    setEditItem(p)
    setForm({
      ...p,
      isTeacher: isTeacherRole,
      specialty: isTeacherRole ? (p.specialty || "") : "",
      studentsCount: p.studentsCount ?? 0,
      logo: p.logo || "/Mehman Bayramov.jpg",
    })
    setModal("edit")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name?.trim()) {
      showToast("Zəhmət olmasa əməkdaşın ad və soyadını qeyd edin.", "error")
      return
    }

    if (!form.position?.trim()) {
      showToast("Zəhmət olmasa əməkdaşın vəzifəsini qeyd edin.", "error")
      return
    }

    if (isTeacher && !form.specialty?.trim()) {
      showToast("Müəllim üçün ixtisas sahəsini qeyd etmək mütləqdir.", "error")
      return
    }

    setSaving(true)

    const payload = {
      ...form,
      name: form.name.trim(),
      position: form.position.trim(),
      department: form.department?.trim() || "Tədris Şöbəsi",
      isTeacher,
      specialty: isTeacher ? (form.specialty?.trim() || "") : "",
      studentsCount: isTeacher ? (Number(form.studentsCount) || 0) : 0,
      experienceYears: Number(form.experienceYears) || 0,
      logo: form.logo?.trim() || "/Mehman Bayramov.jpg",
      email: form.email?.trim() || "",
      phone: form.phone?.trim() || "",
      bio: form.bio?.trim() || "",
    }

    try {
      if (modal === "add") {
        const res = await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          const newPartner = await res.json().catch(() => null)
          if (newPartner && newPartner.id) {
            setItems((prev) => [newPartner, ...prev.filter((p) => String(p.id) !== String(newPartner.id))])
          }
          await fetchPartners()
          setModal(null)
          setForm({})
          showToast("Yeni əməkdaş uğurla əlavə edildi!", "success")
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.error || "Əməkdaş əlavə edilərkən xəta baş verdi.", "error")
        }
      } else if (modal === "edit") {
        const targetId = editItem?.id || form.id
        const updatePayload = {
          ...editItem,
          ...payload,
          id: targetId,
        }

        const res = await fetch("/api/partners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        })

        if (res.ok) {
          const updatedPartner = await res.json().catch(() => null)
          if (updatedPartner && updatedPartner.id) {
            setItems((prev) =>
              prev.map((item) =>
                String(item.id) === String(updatedPartner.id) ? { ...item, ...updatedPartner } : item
              )
            )
          }
          await fetchPartners()
          setModal(null)
          setForm({})
          setEditItem(null)
          showToast("Əməkdaş məlumatları uğurla yeniləndi!", "success")
        } else {
          const err = await res.json().catch(() => ({}))
          showToast(err.error || "Əməkdaş məlumatları yenilənərkən xəta baş verdi.", "error")
        }
      }
    } catch (err) {
      console.error(err)
      showToast("Serverlə əlaqə qurulmadı. Zəhmət olmasa yenidən cəhd edin.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id))
        setDeleteId(null)
        showToast("Əməkdaş uğurla silindi!", "success")
      } else {
        showToast("Əməkdaş silinərkən xəta baş verdi.", "error")
      }
    } catch (err) {
      console.error(err)
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setDeleting(false)
    }
  }

  const filtered = items.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.position && p.position.toLowerCase().includes(search.toLowerCase())) ||
      (p.specialty && p.specialty.toLowerCase().includes(search.toLowerCase())) ||
      (p.department && p.department.toLowerCase().includes(search.toLowerCase()))
  )

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
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </div>
          <p className="text-xs font-semibold pr-2">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Komanda və Əməkdaşlar
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədris mərkəzinin müəllim və inzibati heyətini idarə edin ({items.length} əməkdaş)
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
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e3a47]/10 font-bold text-[#1e3a47]">
                              {item.logo ? (
                                <img
                                  src={item.logo}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none"
                                  }}
                                />
                              ) : (
                                item.name.charAt(0)
                              )}
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
                          {item.specialty && item.specialty.trim() ? (
                            <span title={item.specialty}>{item.specialty}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                              Müəllim deyil
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {item.experienceYears} il
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {item.isTeacher === false || (!item.specialty && (!item.studentsCount || item.studentsCount === 0))
                            ? "—"
                            : `${item.studentsCount}+`}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl my-8">
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
                {/* Ad və Soyad */}
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

                {/* Vəzifə və Şöbə */}
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
                      placeholder="Baş Təlimçi, Menecer, Həkim..."
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
                      placeholder="İT, İnzibati, Pedaqogika..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Əməkdaş Növü: Müəllim və ya Digər */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Əməkdaş statusu
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeacher(true)
                        setForm((prev) => ({ ...prev, isTeacher: true }))
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                        isTeacher
                          ? "border-[#1e3a47] bg-[#1e3a47] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">👨‍🏫</span>
                      <span>Müəllim / Təlimçi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeacher(false)
                        setForm((prev) => ({ ...prev, isTeacher: false, specialty: "", studentsCount: 0 }))
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                        !isTeacher
                          ? "border-[#1e3a47] bg-[#1e3a47] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">💼</span>
                      <span>Digər əməkdaş</span>
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {isTeacher
                      ? "Müəllim və təlimçilər üçün ixtisas sahəsi və tələbə sayı qeyd olunur."
                      : "Müəllim olmayan digər əməkdaşlar üçün ixtisas sahəsi tələb olunmur."}
                  </p>
                </div>

                {/* İxtisas Sahəsi - Yalnız Müəllimlər üçün */}
                {isTeacher && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      İxtisas Sahəsi *
                    </label>
                    <input
                      type="text"
                      required={isTeacher}
                      value={form.specialty || ""}
                      onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                      placeholder="Məs: Kompüter savadlılığı, Ofis proqramları..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Təcrübə və Tələbə Sayı */}
                <div className={`grid ${isTeacher ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Təcrübə (il)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.experienceYears ?? 0}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          experienceYears: e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  {isTeacher && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tələbə Sayı
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.studentsCount ?? 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            studentsCount: e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Əlaqə: Telefon və Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefon nömrəsi
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
                      Email ünvanı
                    </label>
                    <input
                      type="email"
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ad@ugur.az"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Fotoşəkil (Logo/Avatar) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fotoşəkil
                  </label>
                  <div className="flex items-start gap-3">
                    {/* Preview */}
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt="Önbaxış"
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = "none" }}
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Şəkil</span>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#1e3a47] hover:bg-slate-100">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploading ? "Yüklənir..." : "Foto yüklə"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={handleImageUpload}
                        />
                      </label>
                      <input
                        type="text"
                        value={form.logo || ""}
                        onChange={(e) => setForm({ ...form, logo: e.target.value })}
                        placeholder="və ya yol yazın: /Ad Soyad.jpg"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>


                {/* Bio / Haqqında */}
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
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37] disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Yadda saxlanılır...</span>
                      </>
                    ) : (
                      <span>Yadda Saxla</span>
                    )}
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
                Bu əməkdaş saytın komanda və əməkdaşlar bölməsindən çıxarılacaqdır.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Silinir...</span>
                    </>
                  ) : (
                    <span>Bəli, Sil</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
