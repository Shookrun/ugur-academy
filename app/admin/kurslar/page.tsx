"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"

type Course = {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  duration: string
  price: string
  discountPrice?: string
  image: string
  slug: string
  buttonText?: string
  neonColor?: string
}

export default function AdminKurslarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<Course | null>(null)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<Partial<Course>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/courses")
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const openAdd = () => {
    setForm({
      id: Date.now().toString(),
      image: "/hero.jpeg",
      category: "Kompüter & İT",
      buttonText: "Ətraflı məlumat",
    })
    setModal("add")
  }

  const openEdit = (c: Course) => {
    setEditItem(c)
    setForm({ ...c })
    setModal("edit")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.category) return
    setSaving(true)

    try {
      if (modal === "add") {
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          await fetchCourses()
          setModal(null)
          setForm({})
        }
      } else if (modal === "edit" && editItem) {
        const res = await fetch("/api/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editItem, ...form }),
        })
        if (res.ok) {
          await fetchCourses()
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
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setCourses(courses.filter((c) => c.id !== id))
        setDeleteId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [
    "Kompüter & İT",
    "Tibb",
    "Psixologiya",
    "Loqopediya",
    "Baytarlıq",
    "Pedaqogika",
    "MİQ & İmtahan",
    "Digər",
  ]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Kursların İdarə Edilməsi
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Saytdakı bütün kursları yaradın, redaktə edin və silin ({courses.length} kurs aktivdir)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Kurs axtar..."
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
              <span>Yeni Kurs Əlavə Et</span>
            </button>
          </div>
        </div>

        {/* Content Table / Cards */}
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
                    <th className="px-6 py-3.5">Kurs Adı</th>
                    <th className="px-6 py-3.5">Kateqoriya</th>
                    <th className="px-6 py-3.5">Müddət</th>
                    <th className="px-6 py-3.5">Qiymət</th>
                    <th className="px-6 py-3.5">Düymə mətni</th>
                    <th className="px-6 py-3.5 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Heç bir kurs tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((course) => (
                      <tr key={course.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{course.title}</p>
                            <p className="mt-0.5 text-[11px] font-normal text-slate-500 line-clamp-1 max-w-xs">
                              {course.subtitle || course.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-800 border border-sky-200/60">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {course.duration || "Müəyyən olunmayıb"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">
                            {course.discountPrice || course.price || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {course.buttonText || "Ətraflı məlumat"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(course)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            >
                              Redaktə
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(course.id)}
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

        {/* Modal: Add or Edit Course */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Kurs Əlavə Et" : "Kursu Redaktə Et"}
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
                    Kursun Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Məs: Kompüter, Tibb, Psixologiya..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kateqoriya *
                    </label>
                    <select
                      value={form.category || "Kompüter & İT"}
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
                      Link / Slug *
                    </label>
                    <input
                      type="text"
                      value={form.slug || ""}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="Məs: komputer"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Qısa Təsvir / Alt Başlıq
                  </label>
                  <textarea
                    rows={2}
                    value={form.subtitle || form.description || ""}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value, description: e.target.value })}
                    placeholder="Kurs haqqında qısa izahat..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Müddət
                    </label>
                    <input
                      type="text"
                      value={form.duration || ""}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="3 - 6 ay"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Qiymət
                    </label>
                    <input
                      type="text"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="120 AZN / ay"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Düymə Mətni
                    </label>
                    <input
                      type="text"
                      value={form.buttonText || "Ətraflı məlumat"}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      placeholder="İstiqamətlərə bax"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
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
                Kursu silmək istədiyinizdən əminsiniz?
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Bu əməliyyat kursu saytdan dərhal siləcəkdir.
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
