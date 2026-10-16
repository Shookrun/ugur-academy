"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react"
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
  technologies: string[]
  glowGradient?: string
  iconType?: string
}

type CourseForm = Omit<Course, "id"> & { id?: string }

type Toast = {
  id: number
  type: "success" | "error" | "info"
  message: string
}

const CATEGORIES = [
  "Kompüter & İT",
  "Tibb",
  "Psixologiya",
  "Loqopediya",
  "Baytarlıq",
  "Pedaqogika",
  "MİQ & İmtahan",
  "Digər",
]

const DEFAULT_FORM: CourseForm = {
  title: "",
  subtitle: "",
  description: "",
  category: "Kompüter & İT",
  duration: "",
  price: "",
  discountPrice: "",
  image: "/hero.jpeg",
  slug: "",
  buttonText: "Ətraflı məlumat",
  neonColor: "#0ea5e9",
  technologies: [],
  glowGradient: "rgba(14, 165, 233, 0.8)",
  iconType: "star",
}

function normalizeTechnologies(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

function normalizeCourse(value: unknown): Course | null {
  if (!value || typeof value !== "object") return null

  const item = value as Record<string, unknown>

  if (item.id === undefined || item.id === null || String(item.id).trim() === "") {
    return null
  }

  return {
    id: String(item.id),
    title: typeof item.title === "string" ? item.title : "",
    subtitle: typeof item.subtitle === "string" ? item.subtitle : "",
    description: typeof item.description === "string" ? item.description : "",
    category: typeof item.category === "string" ? item.category : "Digər",
    duration: typeof item.duration === "string" ? item.duration : "",
    price: typeof item.price === "string" ? item.price : "",
    discountPrice: typeof item.discountPrice === "string" ? item.discountPrice : "",
    image: typeof item.image === "string" ? item.image : "/hero.jpeg",
    slug: typeof item.slug === "string" ? item.slug : "",
    buttonText: typeof item.buttonText === "string" ? item.buttonText : "Ətraflı məlumat",
    neonColor: typeof item.neonColor === "string" ? item.neonColor : DEFAULT_FORM.neonColor,
    technologies: normalizeTechnologies(item.technologies),
    glowGradient: typeof item.glowGradient === "string" ? item.glowGradient : DEFAULT_FORM.glowGradient,
    iconType: typeof item.iconType === "string" ? item.iconType : DEFAULT_FORM.iconType,
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[ə]/g, "e")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/&/g, "ve")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function AdminKurslarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editItem, setEditItem] = useState<Course | null>(null)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<CourseForm>({ ...DEFAULT_FORM })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random()

    setToasts((current) => [...current, { id, message, type }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  const fetchCourses = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)

      const response = await fetch(`/api/courses?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Kursları yükləmək mümkün olmadı.")
      }

      const data: unknown = await response.json()

      if (!Array.isArray(data)) {
        throw new Error("Serverdən düzgün kurs məlumatı gəlmədi.")
      }

      setCourses(
        data
          .map(normalizeCourse)
          .filter((course): course is Course => course !== null),
      )
    } catch (error) {
      console.error("fetchCourses:", error)
      showToast(
        error instanceof Error ? error.message : "Şəbəkə xətası baş verdi.",
        "error",
      )
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }

    if (status === "authenticated") {
      void fetchCourses()
    }
  }, [status, router, fetchCourses])

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az-AZ")

    if (!query) return courses

    return courses.filter((course) =>
      [
        course.title,
        course.subtitle ?? "",
        course.description,
        course.category,
        course.slug,
        ...course.technologies,
      ]
        .join(" ")
        .toLocaleLowerCase("az-AZ")
        .includes(query),
    )
  }, [courses, search])

  const openAdd = () => {
    setEditItem(null)
    setForm({ ...DEFAULT_FORM, technologies: [] })
    setModal("add")
  }

  const openEdit = (course: Course) => {
    setEditItem(course)
    setForm({
      ...course,
      technologies: [...course.technologies],
    })
    setModal("edit")
  }

  const closeModal = () => {
    if (saving || uploading) return

    setModal(null)
    setEditItem(null)
    setForm({ ...DEFAULT_FORM, technologies: [] })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const updateForm = <K extends keyof CourseForm>(
    field: K,
    value: CourseForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleTitleChange = (title: string) => {
    setForm((current) => {
      const shouldUpdateSlug =
        !current.slug || current.slug === slugify(current.title)

      return {
        ...current,
        title,
        slug: shouldUpdateSlug ? slugify(title) : current.slug,
      }
    })
  }

  const handleTechnologiesChange = (value: string) => {
    updateForm("technologies", normalizeTechnologies(value.split(",")))
  }

  const removeTechnology = (technology: string) => {
    updateForm(
      "technologies",
      form.technologies.filter((item) => item !== technology),
    )
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (saving || uploading) return

    const title = form.title.trim()
    const category = form.category.trim()
    const slug = slugify(form.slug || form.title)

    if (!title || !category) {
      showToast("Kursun adı və kateqoriyası daxil edilməlidir.", "error")
      return
    }

    if (!slug) {
      showToast("Kurs üçün düzgün slug daxil edin.", "error")
      return
    }

    const isEditing = modal === "edit" && Boolean(editItem)

    const payload: Course = {
      id: isEditing && editItem ? editItem.id : Date.now().toString(),
      title,
      subtitle: form.subtitle?.trim() ?? "",
      description: form.description.trim() || form.subtitle?.trim() || "",
      category,
      duration: form.duration.trim(),
      price: form.price.trim(),
      discountPrice: form.discountPrice?.trim() ?? "",
      image: form.image.trim() || "/hero.jpeg",
      slug,
      buttonText: form.buttonText?.trim() || "Ətraflı məlumat",
      neonColor: form.neonColor || DEFAULT_FORM.neonColor,
      technologies: normalizeTechnologies(form.technologies),
      glowGradient: form.glowGradient || DEFAULT_FORM.glowGradient,
      iconType: form.iconType || DEFAULT_FORM.iconType,
    }

    setSaving(true)

    try {
      const response = await fetch("/api/courses", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      })

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "Kurs yadda saxlanılarkən xəta baş verdi."

        throw new Error(message)
      }

      const savedCourse = normalizeCourse(data) ?? payload

      if (isEditing) {
        setCourses((current) =>
          current.map((course) =>
            course.id === payload.id ? savedCourse : course,
          ),
        )
        showToast("Kurs məlumatları uğurla yeniləndi!")
      } else {
        setCourses((current) => [savedCourse, ...current])
        showToast("Yeni kurs uğurla əlavə edildi!")
      }

      setModal(null)
      setEditItem(null)
      setForm({ ...DEFAULT_FORM, technologies: [] })

      await fetchCourses(false)
    } catch (error) {
      console.error("handleSave:", error)
      showToast(
        error instanceof Error ? error.message : "Serverlə əlaqə qurulmadı.",
        "error",
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId || deleting) return

    setDeleting(true)

    try {
      const response = await fetch(
        `/api/courses?id=${encodeURIComponent(deleteId)}`,
        {
          method: "DELETE",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Kurs silinərkən xəta baş verdi.")
      }

      setCourses((current) =>
        current.filter((course) => course.id !== deleteId),
      )

      setDeleteId(null)
      showToast("Kurs uğurla silindi!")
      await fetchCourses(false)
    } catch (error) {
      console.error("handleDelete:", error)
      showToast(
        error instanceof Error ? error.message : "Kurs silinərkən xəta baş verdi.",
        "error",
      )
    } finally {
      setDeleting(false)
    }
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]

    if (!allowedTypes.includes(file.type)) {
      showToast("JPG, PNG, WEBP və ya GIF şəkli seç.", "error")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Şəklin ölçüsü maksimum 5 MB ola bilər.", "error")
      event.target.value = ""
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "courses")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error("Şəkil yüklənərkən xəta baş verdi.")
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("url" in data) ||
        typeof data.url !== "string"
      ) {
        throw new Error("Şəkil URL-i alınmadı.")
      }

      updateForm("image", data.url)
      showToast("Şəkil uğurla yükləndi!")
    } catch (error) {
      console.error("handleImageUpload:", error)
      showToast(
        error instanceof Error ? error.message : "Şəkil yüklənərkən xəta baş verdi.",
        "error",
      )
    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                  : toast.type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-950"
                    : "border-sky-200 bg-sky-50 text-sky-950"
              }`}
            >
              <span className="text-sm font-black">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "×" : "i"}
              </span>
              <span className="text-xs font-bold">{toast.message}</span>
              <button
                type="button"
                aria-label="Bildirişi bağla"
                onClick={() =>
                  setToasts((current) =>
                    current.filter((item) => item.id !== toast.id),
                  )
                }
                className="ml-auto text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
              Kursların İdarə Edilməsi
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Kursları və onların texnologiyalarını idarə et ({courses.length} kurs)
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kurs və texnologiya axtar..."
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
            />
            <button
              type="button"
              onClick={openAdd}
              className="rounded-xl bg-[#1e3a47] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#162c37]"
            >
              + Yeni Kurs Əlavə Et
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
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Kurs adı</th>
                    <th className="px-4 py-3.5">Kateqoriya</th>
                    <th className="px-4 py-3.5">Texnologiyalar</th>
                    <th className="px-4 py-3.5">Müddət</th>
                    <th className="px-4 py-3.5">Qiymət</th>
                    <th className="px-6 py-3.5 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Heç bir kurs tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="transition-colors hover:bg-slate-50/60">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{course.title}</p>
                          <p className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-slate-500">
                            {course.subtitle || course.description}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-md border border-sky-200/60 bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-800">
                            {course.category}
                          </span>
                        </td>

                        <td className="max-w-[300px] px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {course.technologies.length > 0 ? (
                              course.technologies.map((technology) => (
                                <span
                                  key={technology}
                                  className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700"
                                >
                                  {technology}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">Əlavə edilməyib</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-600">
                          {course.duration || "—"}
                        </td>

                        <td className="px-4 py-4 font-bold text-slate-900">
                          {course.discountPrice || course.price || "—"}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(course)}
                              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-xs">
            <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#1e3a47]">
                  {modal === "add" ? "Yeni Kurs Əlavə Et" : "Kursu Redaktə Et"}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Bağla"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kursun Adı *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="Məs: Kompüter, Tibb, Psixologiya..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Kateqoriya *</label>
                    <select
                      value={form.category}
                      onChange={(event) => updateForm("category", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      {!CATEGORIES.includes(form.category) && form.category && (
                        <option value={form.category}>{form.category}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Link / Slug *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(event) => updateForm("slug", event.target.value)}
                      placeholder="Məs: komputer"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Qısa Təsvir / Alt Başlıq</label>
                  <textarea
                    rows={2}
                    value={form.subtitle || form.description || ""}
                    onChange={(event) => {
                      updateForm("subtitle", event.target.value)
                      updateForm("description", event.target.value)
                    }}
                    placeholder="Kurs haqqında qısa izahat..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                  />
                </div>

                {/* Technologies / sub-categories */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Kursun daxili kateqoriyaları (HTML & CSS, JavaScript, Python...)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {form.technologies.filter((item) => item.trim()).length} ədəd
                    </span>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    {form.technologies.length === 0 && (
                      <p className="text-[11px] text-slate-400">Hələ heç nə əlavə edilməyib.</p>
                    )}

                    {form.technologies.map((technology, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={technology}
                          onChange={(event) =>
                            updateForm(
                              "technologies",
                              form.technologies.map((item, itemIndex) =>
                                itemIndex === index ? event.target.value : item,
                              ),
                            )
                          }
                          placeholder="Məs: JavaScript"
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                        />
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            const next = [...form.technologies]
                            ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                            updateForm("technologies", next)
                          }}
                          aria-label="Yuxarı daşı"
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === form.technologies.length - 1}
                          onClick={() => {
                            const next = [...form.technologies]
                            ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                            updateForm("technologies", next)
                          }}
                          aria-label="Aşağı daşı"
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateForm(
                              "technologies",
                              form.technologies.filter((_, itemIndex) => itemIndex !== index),
                            )
                          }
                          aria-label="Sil"
                          className="rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => updateForm("technologies", [...form.technologies, ""])}
                      className="w-full rounded-lg border border-dashed border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#1e3a47] hover:text-[#1e3a47]"
                    >
                      + Yeni kateqoriya əlavə et
                    </button>
                  </div>
                </div>

                {/* Course Image Upload */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Kurs Şəkli</label>
                  <div className="flex items-start gap-3">
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {form.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.image}
                          alt="Kurs şəkli"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            ;(event.target as HTMLImageElement).src = "/hero.jpeg"
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-300">
                          Şəkil yoxdur
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#1e3a47] hover:bg-slate-100">
                        {uploading ? "Yüklənir..." : "Şəkil yüklə"}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={handleImageUpload}
                        />
                      </label>
                      <input
                        type="text"
                        value={form.image}
                        onChange={(event) => updateForm("image", event.target.value)}
                        placeholder="və ya şəkil yolunu yazın: /courses/img.jpg"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Müddət</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(event) => updateForm("duration", event.target.value)}
                      placeholder="3 - 6 ay"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Qiymət</label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(event) => updateForm("price", event.target.value)}
                      placeholder="120 AZN / ay"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">Endirimli qiymət</label>
                    <input
                      type="text"
                      value={form.discountPrice ?? ""}
                      onChange={(event) => updateForm("discountPrice", event.target.value)}
                      placeholder="99 AZN / ay"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#1e3a47] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
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
              <h3 className="text-base font-bold text-slate-900">Kursu silmək istədiyinizdən əminsiniz?</h3>
              <p className="mt-2 text-xs text-slate-500">Bu əməliyyat kursu saytdan dərhal siləcəkdir.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
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
