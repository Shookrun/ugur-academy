"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"
import { coursesData } from "@/data/courses"

type Course = {
  id: string
  title: string
  description: string
  category: string
  duration: string
  price: string
  discountPrice?: string
  image: string
  slug: string
}

export default function AdminKurslarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<Course | null>(null)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<Partial<Course>>({})
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  useEffect(() => {
    const saved = localStorage.getItem("ugur_admin_courses")
    if (saved) {
      setCourses(JSON.parse(saved))
    } else {
      // seed from data file
      const seeded = coursesData.map((c) => ({
        id: String(c.id),
        title: c.title,
        description: c.description,
        category: c.category,
        duration: c.duration,
        price: c.price,
        discountPrice: c.discountPrice,
        image: c.image,
        slug: c.slug,
      }))
      setCourses(seeded)
      localStorage.setItem("ugur_admin_courses", JSON.stringify(seeded))
    }
  }, [])

  const save = (list: Course[]) => {
    setCourses(list)
    localStorage.setItem("ugur_admin_courses", JSON.stringify(list))
  }

  const openAdd = () => {
    setForm({ id: Date.now().toString(), image: "/hero.jpeg", slug: "" })
    setModal("add")
  }

  const openEdit = (c: Course) => {
    setEditItem(c)
    setForm({ ...c })
    setModal("edit")
  }

  const handleSave = () => {
    if (!form.title || !form.category) return
    if (modal === "add") {
      const newList = [...courses, { ...form, slug: form.slug || form.id! } as Course]
      save(newList)
    } else if (modal === "edit" && editItem) {
      const newList = courses.map((c) =>
        c.id === editItem.id ? ({ ...c, ...form } as Course) : c
      )
      save(newList)
    }
    setModal(null)
    setForm({})
    setEditItem(null)
  }

  const handleDelete = (id: string) => {
    save(courses.filter((c) => c.id !== id))
    setDeleteId(null)
  }

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-extrabold text-white">Kurslar</h1>
            <p className="mt-1 text-sm text-slate-400">
              {courses.length} kurs mövcuddur
            </p>
          </div>
          <button
            onClick={openAdd}
            id="admin-add-course-btn"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:bg-amber-400"
          >
            + Kurs Əlavə Et
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Kurs axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4 text-left">Ad</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">Kateqoriya</th>
                <th className="px-6 py-4 text-left hidden lg:table-cell">Müddət</th>
                <th className="px-6 py-4 text-left hidden lg:table-cell">Qiymət</th>
                <th className="px-6 py-4 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{course.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                      {course.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-slate-400">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell font-semibold text-amber-400">
                    {course.discountPrice || course.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(course)}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        ✏️ Düzəlt
                      </button>
                      <button
                        onClick={() => setDeleteId(course.id)}
                        className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500">Kurs tapılmadı.</div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-lg font-bold text-white">
                {modal === "add" ? "Yeni Kurs Əlavə Et" : "Kursu Düzəlt"}
              </h2>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {(
                [
                  { key: "title", label: "Kurs Adı", required: true },
                  { key: "category", label: "Kateqoriya", required: true },
                  { key: "description", label: "Açıqlama", textarea: true },
                  { key: "duration", label: "Müddət (məs. 3 ay)" },
                  { key: "price", label: "Qiymət" },
                  { key: "discountPrice", label: "Endirimli Qiymət" },
                  { key: "image", label: "Şəkil URL" },
                  { key: "slug", label: "URL Slug" },
                ] as Array<{ key: keyof Course; label: string; required?: boolean; textarea?: boolean }>
              ).map(({ key, label, required, textarea }) => (
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
                      type="text"
                      value={(form[key] as string) || ""}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button
                onClick={() => { setModal(null); setForm({}) }}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Ləğv et
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-400"
              >
                {modal === "add" ? "Əlavə et" : "Yadda saxla"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <p className="text-center text-base font-semibold text-white">
              Bu kursu silmək istədiyinizdən əminsiniz?
            </p>
            <p className="mt-2 text-center text-sm text-slate-400">
              Bu əməliyyat geri qaytarıla bilməz.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
              >
                Ləğv et
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
