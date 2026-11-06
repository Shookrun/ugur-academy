"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react"
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
  order: number
}

type CourseForm = Omit<Course, "id" | "order"> & { id?: string }

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

  const rawOrder = Number(item.order)

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
    order: item.order !== undefined && item.order !== null && Number.isFinite(rawOrder) ? rawOrder : Number.MAX_SAFE_INTEGER,
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

/** Kursları order-ə görə düzür, sonra 0,1,2... kimi yenidən nömrələyir. */
function sortCourses(list: Course[]): Course[] {
  return [...list]
    .sort((a, b) => a.order - b.order)
    .map((course, index) => ({ ...course, order: index }))
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
  const [techInput, setTechInput] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random()

    setToasts((current) => [...current, { id, message, type }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  const fetchCourses = useCallback(
    async (showLoading = true) => {
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
          sortCourses(
            data
              .map(normalizeCourse)
              .filter((course): course is Course => course !== null),
          ),
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
    },
    [showToast],
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }

    if (status === "authenticated") {
      void fetchCourses()
    }
  }, [status, router, fetchCourses])

  const canReorder = search.trim() === "" && !reordering

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

  const resetModalState = () => {
    setModal(null)
    setEditItem(null)
    setForm({ ...DEFAULT_FORM, technologies: [] })
    setTechInput("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ ...DEFAULT_FORM, technologies: [] })
    setTechInput("")
    setModal("add")
  }

  const openEdit = (course: Course) => {
    const { order: _order, ...rest } = course
    void _order

    setEditItem(course)
    setForm({ ...rest, technologies: [...course.technologies] })
    setTechInput("")
    setModal("edit")
  }

  const closeModal = () => {
    if (saving || uploading) return
    resetModalState()
  }

  const updateForm = <K extends keyof CourseForm>(field: K, value: CourseForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleTitleChange = (title: string) => {
    setForm((current) => {
      const shouldUpdateSlug = !current.slug || current.slug === slugify(current.title)

      return {
        ...current,
        title,
        slug: shouldUpdateSlug ? slugify(title) : current.slug,
      }
    })
  }

  const addTechnologies = (raw: string) => {
    const incoming = normalizeTechnologies(raw.split(","))

    if (incoming.length === 0) return

    setForm((current) => ({
      ...current,
      technologies: normalizeTechnologies([...current.technologies, ...incoming]),
    }))
    setTechInput("")
  }

  const handleTechKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addTechnologies(techInput)
    }

    if (event.key === "Backspace" && techInput === "" && form.technologies.length > 0) {
      updateForm("technologies", form.technologies.slice(0, -1))
    }
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

    // Gözləyən texnologiya yazısı qalıbsa, onu da əlavə et
    const pendingTech = normalizeTechnologies(techInput.split(","))
    const technologies = normalizeTechnologies([...form.technologies, ...pendingTech])

    const nextOrder =
      courses.length === 0 ? 0 : Math.max(...courses.map((course) => course.order)) + 1

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
      technologies,
      glowGradient: form.glowGradient || DEFAULT_FORM.glowGradient,
      iconType: form.iconType || DEFAULT_FORM.iconType,
      order: isEditing && editItem ? editItem.order : nextOrder,
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

      const normalized = normalizeCourse(data)
      // Server order qaytarmırsa, öz order dəyərimizi saxlayırıq
      const savedCourse: Course = normalized
        ? { ...normalized, order: normalized.order === Number.MAX_SAFE_INTEGER ? payload.order : normalized.order }
        : payload

      if (isEditing) {
        setCourses((current) =>
          sortCourses(current.map((course) => (course.id === payload.id ? savedCourse : course))),
        )
        showToast("Kurs məlumatları uğurla yeniləndi!")
      } else {
        setCourses((current) => sortCourses([...current, savedCourse]))
        showToast("Yeni kurs uğurla əlavə edildi!")
      }

      resetModalState()
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
      const response = await fetch(`/api/courses?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })

      if (!response.ok) {
        throw new Error("Kurs silinərkən xəta baş verdi.")
      }

      setCourses((current) =>
        sortCourses(current.filter((course) => course.id !== deleteId)),
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

  const reorderCourses = async (from: number, to: number) => {
    if (reordering) return
    if (from === to || from < 0 || to < 0 || from >= courses.length || to >= courses.length) return

    const previous = courses
    const next = [...courses]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)

    const reordered = next.map((course, index) => ({ ...course, order: index }))

    setCourses(reordered)
    setReordering(true)

    try {
      const response = await fetch("/api/courses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          orders: reordered.map(({ id, order }) => ({ id, order })),
        }),
      })

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null)
        const message =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "Sıralama yadda saxlanmadı."

        throw new Error(message)
      }

      showToast("Sıralama yeniləndi!")
    } catch (error) {
      console.error("reorderCourses:", error)
      setCourses(previous)
      showToast(error instanceof Error ? error.message : "Sıralama xətası.", "error")
    } finally {
      setReordering(false)
    }
  }

  const handleDrop = (targetIndex: number) => {
    if (dragIndex !== null) {
      void reorderCourses(dragIndex, targetIndex)
    }

    setDragIndex(null)
    setOverIndex(null)
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

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

  const deleteTarget = deleteId ? courses.find((course) => course.id === deleteId) : null

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#1e3a47]"
  const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500"

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
                  setToasts((current) => current.filter((item) => item.id !== toast.id))
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
              Kursları, texnologiyaları və sıralamanı idarə et ({courses.length} kurs)
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

        {search.trim() !== "" && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900">
            Axtarış aktivdir, ona görə sıralama müvəqqəti söndürülüb. Yer dəyişmək üçün axtarışı təmizlə.
          </p>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="w-32 px-4 py-3.5">Sıra</th>
                    <th className="px-4 py-3.5">Kurs adı</th>
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
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        Heç bir kurs tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course) => {
                      const index = courses.findIndex((item) => item.id === course.id)

                      return (
                        <tr
                          key={course.id}
                          draggable={canReorder}
                          onDragStart={(event) => {
                            if (!canReorder) return
                            event.dataTransfer.effectAllowed = "move"
                            setDragIndex(index)
                          }}
                          onDragOver={(event) => {
                            if (!canReorder || dragIndex === null) return
                            event.preventDefault()
                            setOverIndex(index)
                          }}
                          onDrop={(event) => {
                            event.preventDefault()
                            handleDrop(index)
                          }}
                          onDragEnd={() => {
                            setDragIndex(null)
                            setOverIndex(null)
                          }}
                          className={`transition-colors hover:bg-slate-50/60 ${
                            dragIndex === index ? "opacity-40" : ""
                          } ${
                            overIndex === index && dragIndex !== null && dragIndex !== index
                              ? "bg-sky-50 outline outline-2 -outline-offset-2 outline-sky-300"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                title={canReorder ? "Sürüşdürmək üçün tut" : undefined}
                                className={`select-none text-base leading-none text-slate-400 ${
                                  canReorder ? "cursor-grab active:cursor-grabbing" : "opacity-30"
                                }`}
                              >
                                ⋮⋮
                              </span>
                              <span className="w-5 text-center text-[11px] font-bold text-slate-500">
                                {index + 1}
                              </span>
                              <button
                                type="button"
                                disabled={!canReorder || index <= 0}
                                onClick={() => void reorderCourses(index, index - 1)}
                                aria-label="Yuxarı daşı"
                                className="rounded-md border border-slate-200 px-1.5 py-1 text-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={!canReorder || index === courses.length - 1}
                                onClick={() => void reorderCourses(index, index + 1)}
                                aria-label="Aşağı daşı"
                                className="rounded-md border border-slate-200 px-1.5 py-1 text-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-4">
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
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Əlavə et / Redaktə modalı */}
      {modal && (
        <div
          className="fixed inset-0 z-[9998] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <form
            onSubmit={handleSave}
            role="dialog"
            aria-modal="true"
            className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1e3a47]">
                {modal === "edit" ? "Kursu redaktə et" : "Yeni kurs əlavə et"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Bağla"
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Kurs adı *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Alt başlıq</label>
                <input
                  type="text"
                  value={form.subtitle ?? ""}
                  onChange={(event) => updateForm("subtitle", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => updateForm("slug", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Kateqoriya *</label>
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Təsvir</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Müddət</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(event) => updateForm("duration", event.target.value)}
                  placeholder="3 ay"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Düymə mətni</label>
                <input
                  type="text"
                  value={form.buttonText ?? ""}
                  onChange={(event) => updateForm("buttonText", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Qiymət</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(event) => updateForm("price", event.target.value)}
                  placeholder="300 AZN"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Endirimli qiymət</label>
                <input
                  type="text"
                  value={form.discountPrice ?? ""}
                  onChange={(event) => updateForm("discountPrice", event.target.value)}
                  placeholder="250 AZN"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Şəkil</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image || "/hero.jpeg"}
                    alt="Kurs şəkli"
                    className="h-20 w-32 shrink-0 rounded-lg border border-slate-200 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(event) => updateForm("image", event.target.value)}
                      className={inputClass}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {uploading && (
                      <span className="text-[11px] font-semibold text-sky-700">Yüklənir...</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Neon rəng</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.neonColor || "#0ea5e9"}
                    onChange={(event) => updateForm("neonColor", event.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={form.neonColor ?? ""}
                    onChange={(event) => updateForm("neonColor", event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Glow gradient</label>
                <input
                  type="text"
                  value={form.glowGradient ?? ""}
                  onChange={(event) => updateForm("glowGradient", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>İkon tipi</label>
                <input
                  type="text"
                  value={form.iconType ?? ""}
                  onChange={(event) => updateForm("iconType", event.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Texnologiyalar</label>
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-[#1e3a47]">
                  {form.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {technology}
                      <button
                        type="button"
                        onClick={() => removeTechnology(technology)}
                        aria-label={`${technology} sil`}
                        className="text-sm leading-none text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(event) => setTechInput(event.target.value)}
                    onKeyDown={handleTechKeyDown}
                    onBlur={() => addTechnologies(techInput)}
                    placeholder="Yaz və Enter bas (vergüllə də olar)"
                    className="min-w-[180px] flex-1 bg-transparent px-1.5 py-1 text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving || uploading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-xl bg-[#1e3a47] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#162c37] disabled:opacity-60"
              >
                {saving ? "Yadda saxlanılır..." : modal === "edit" ? "Yadda saxla" : "Əlavə et"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Silmə təsdiq modalı */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-900/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) setDeleteId(null)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-lg font-black text-slate-900">Kursu sil?</h2>
            <p className="mt-2 text-sm text-slate-600">
              {deleteTarget ? `"${deleteTarget.title}" kursu` : "Bu kurs"} həmişəlik silinəcək. Bu
              əməliyyatı geri qaytarmaq mümkün deyil.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? "Silinir..." : "Bəli, sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
