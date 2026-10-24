
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import AdminSidebar from "../AdminSidebar"

type PartnerAdmin = {
  id: string
  slug?: string
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
  order?: number
}

type Toast = {
  type: "success" | "error" | "info"
  message: string
}

const DEFAULT_LOGO = "/Mehman Bayramov.jpg"

const getOrder = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
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
  const [isTeacher, setIsTeacher] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [uploading, setUploading] = useState(false)

  const sortedItems = useMemo(
    () =>
      items
        .map((item, index) => ({
          ...item,
          order: getOrder(item.order, index + 1),
          originalIndex: index,
        }))
        .sort(
          (a, b) =>
            (a.order ?? 0) - (b.order ?? 0) ||
            a.originalIndex - b.originalIndex
        )
        .map(({ originalIndex: _originalIndex, ...item }) => item),
    [items]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()

    if (!query) return sortedItems

    return sortedItems.filter((item) =>
      [
        item.name,
        item.position,
        item.specialty,
        item.department,
      ].some((value) => value?.toLocaleLowerCase().includes(query))
    )
  }, [sortedItems, search])

  const showToast = (
    message: string,
    type: Toast["type"] = "success"
  ) => {
    setToast({ message, type })

    window.setTimeout(() => {
      setToast((current) =>
        current?.message === message ? null : current
      )
    }, 4000)
  }

  const fetchPartners = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)

      const res = await fetch(`/api/partners?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
          Pragma: "no-cache",
        },
      })

      if (!res.ok) {
        showToast("Əməkdaşlar siyahısını yükləmək mümkün olmadı.", "error")
        return
      }

      const data: unknown = await res.json()

      if (Array.isArray(data)) {
        setItems(
          data.map((item: PartnerAdmin, index: number) => ({
            ...item,
            order: getOrder(item.order, index + 1),
          }))
        )
      }
    } catch {
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  useEffect(() => {
    void fetchPartners()
  }, [])

  const openAdd = () => {
    setIsTeacher(true)
    setEditItem(null)
    setForm({
      id: Date.now().toString(),
      name: "",
      position: "",
      department: "Tədris Şöbəsi",
      specialty: "",
      isTeacher: true,
      logo: DEFAULT_LOGO,
      experienceYears: 5,
      studentsCount: 100,
      bio: "",
      phone: "+994 ",
      email: "",
      order:
        sortedItems.reduce(
          (maximum, item) => Math.max(maximum, item.order ?? 0),
          0
        ) + 1,
    })
    setModal("add")
  }

  const openEdit = (partner: PartnerAdmin) => {
    const teacher =
      partner.isTeacher !== undefined
        ? Boolean(partner.isTeacher)
        : Boolean(partner.specialty?.trim())

    setIsTeacher(teacher)
    setEditItem(partner)
    setForm({
      ...partner,
      order: getOrder(partner.order, 1),
      isTeacher: teacher,
      specialty: teacher ? partner.specialty || "" : "",
      studentsCount: partner.studentsCount ?? 0,
      logo: partner.logo || DEFAULT_LOGO,
    })
    setModal("edit")
  }

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const body = new FormData()
      body.append("file", file)
      body.append("folder", "team")

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || typeof data.url !== "string") {
        showToast(
          data.error || "Şəkil yüklənərkən xəta baş verdi.",
          "error"
        )
        return
      }

      setForm((previous) => ({ ...previous, logo: data.url }))
      showToast("Şəkil uğurla yükləndi.")
    } catch {
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = form.name?.trim() ?? ""
    const position = form.position?.trim() ?? ""
    const order = Number(form.order)

    if (!name) {
      showToast("Zəhmət olmasa əməkdaşın ad və soyadını qeyd edin.", "error")
      return
    }

    if (!position) {
      showToast("Zəhmət olmasa əməkdaşın vəzifəsini qeyd edin.", "error")
      return
    }

    if (!Number.isInteger(order) || order < 1) {
      showToast("Sıra nömrəsi 1 və ya daha böyük tam ədəd olmalıdır.", "error")
      return
    }

    if (isTeacher && !form.specialty?.trim()) {
      showToast("Müəllim üçün ixtisas sahəsini qeyd edin.", "error")
      return
    }

    setSaving(true)

    const payload: PartnerAdmin = {
      ...(form as PartnerAdmin),
      id: String(editItem?.id ?? form.id ?? Date.now()),
      name,
      position,
      department: form.department?.trim() || "Tədris Şöbəsi",
      isTeacher,
      specialty: isTeacher ? form.specialty?.trim() || "" : "",
      studentsCount: isTeacher ? Math.max(0, Number(form.studentsCount) || 0) : 0,
      experienceYears: Math.max(0, Number(form.experienceYears) || 0),
      logo: form.logo?.trim() || DEFAULT_LOGO,
      email: form.email?.trim() || "",
      phone: form.phone?.trim() || "",
      bio: form.bio?.trim() || "",
      order,
    }

    try {
      const isEditing = modal === "edit"

      const res = await fetch("/api/partners", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      })

      const data: unknown = await res.json().catch(() => null)

      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Əməliyyat zamanı xəta baş verdi."

        showToast(message, "error")
        return
      }

      setModal(null)
      setEditItem(null)
      setForm({})
      showToast(
        isEditing
          ? "Əməkdaş məlumatları yeniləndi."
          : "Yeni əməkdaş uğurla əlavə edildi."
      )

      await fetchPartners(false)
    } catch {
      showToast("Serverlə əlaqə qurulmadı. Yenidən cəhd edin.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)

    try {
      const res = await fetch(
        `/api/partners?id=${encodeURIComponent(id)}&t=${Date.now()}`,
        {
          method: "DELETE",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        }
      )

      if (!res.ok) {
        showToast("Əməkdaş silinərkən xəta baş verdi.", "error")
        return
      }

      setDeleteId(null)
      showToast("Əməkdaş uğurla silindi.")
      await fetchPartners(false)
    } catch {
      showToast("Şəbəkə xətası baş verdi.", "error")
    } finally {
      setDeleting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : toast.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-950"
                : "border-sky-200 bg-sky-50 text-sky-950"
          }`}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </div>
          <p className="pr-2 text-xs font-semibold">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Bildirişi bağla"
            className="rounded-lg p-1 text-slate-400 transition hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Komanda və Əməkdaşlar
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Tədris mərkəzinin müəllim və inzibati heyətini idarə edin ({items.length} əməkdaş)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Əməkdaş axtar..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xs placeholder:text-slate-400 focus:border-[#1e3a47] focus:outline-hidden"
            />
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#162c37] active:scale-95"
            >
              <span className="text-base">+</span>
              Yeni Əməkdaş Əlavə Et
            </button>
          </div>
        </div>

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
                    <th className="px-4 py-3.5">Sıra</th>
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
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        Heç bir əməkdaş tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-4 py-4">
                          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#1e3a47]/10 px-2 font-black text-[#1e3a47]">
                            {item.order}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e3a47]/10 font-bold text-[#1e3a47]">
                              {item.logo ? (
                                <img
                                  src={item.logo}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none"
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
                          <span className="inline-flex rounded-md border border-sky-200/60 bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-800">
                            {item.position}
                          </span>
                        </td>
                        <td className="max-w-xs truncate px-6 py-4 font-medium text-slate-600">
                          {item.specialty?.trim() || (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                              Müəllim deyil
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {item.experienceYears} il
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {item.isTeacher === false ||
                          (!item.specialty && (!item.studentsCount || item.studentsCount === 0))
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

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="my-8 w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Əməkdaş Əlavə Et" : "Əməkdaşı Redaktə Et"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Pəncərəni bağla"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Ad və Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name || ""}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Məs: Mehman Bayramov"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Vəzifə *</label>
                    <input
                      type="text"
                      required
                      value={form.position || ""}
                      onChange={(event) => setForm({ ...form, position: event.target.value })}
                      placeholder="Baş təlimçi, menecer..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Şöbə</label>
                    <input
                      type="text"
                      value={form.department || ""}
                      onChange={(event) => setForm({ ...form, department: event.target.value })}
                      placeholder="İT, İnzibati..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Sıra nömrəsi *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    step={1}
                    value={form.order ?? 1}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        order:
                          event.target.value === ""
                            ? undefined
                            : Math.max(1, Number.parseInt(event.target.value, 10) || 1),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Kiçik sıra nömrəsi olan əməkdaş saytda daha əvvəl görünəcək.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Əməkdaş statusu
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeacher(true)
                        setForm((previous) => ({ ...previous, isTeacher: true }))
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                        isTeacher
                          ? "border-[#1e3a47] bg-[#1e3a47] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      👨‍🏫 Müəllim / Təlimçi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTeacher(false)
                        setForm((previous) => ({
                          ...previous,
                          isTeacher: false,
                          specialty: "",
                          studentsCount: 0,
                        }))
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                        !isTeacher
                          ? "border-[#1e3a47] bg-[#1e3a47] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      💼 Digər əməkdaş
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {isTeacher
                      ? "Müəllim və təlimçilər üçün ixtisas sahəsi və tələbə sayı qeyd olunur."
                      : "Müəllim olmayan əməkdaşlar üçün ixtisas sahəsi tələb olunmur."}
                  </p>
                </div>

                {isTeacher && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      İxtisas sahəsi *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.specialty || ""}
                      onChange={(event) => setForm({ ...form, specialty: event.target.value })}
                      placeholder="Məs: Kompüter savadlılığı..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                )}

                <div className={`grid ${isTeacher ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Təcrübə (il)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.experienceYears ?? 0}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          experienceYears: Math.max(0, Number.parseInt(event.target.value, 10) || 0),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                  {isTeacher && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">Tələbə sayı</label>
                      <input
                        type="number"
                        min={0}
                        value={form.studentsCount ?? 0}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            studentsCount: Math.max(0, Number.parseInt(event.target.value, 10) || 0),
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Telefon nömrəsi</label>
                    <input
                      type="text"
                      value={form.phone || ""}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      placeholder="+994 50 000 00 00"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Email ünvanı</label>
                    <input
                      type="email"
                      value={form.email || ""}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="ad@ugur.az"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Fotoşəkil</label>
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {form.logo ? (
                        <img
                          src={form.logo}
                          alt="Önbaxış"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none"
                          }}
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
                        onChange={(event) => setForm({ ...form, logo: event.target.value })}
                        placeholder="və ya yol yazın: /Ad Soyad.jpg"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Haqqında qısa məlumat
                  </label>
                  <textarea
                    rows={2}
                    value={form.bio || ""}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    placeholder="Əməkdaş haqqında qısa bio..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
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
                    disabled={saving || uploading}
                    className="flex items-center gap-2 rounded-xl bg-[#1e3a47] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#162c37] disabled:opacity-50"
                  >
                    {saving ? "Yadda saxlanılır..." : "Yadda Saxla"}
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
                  onClick={() => void handleDelete(deleteId)}
                  className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting ? "Silinir..." : "Bəli, Sil"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
