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
  type ReactNode,
} from "react"
import AdminSidebar from "../AdminSidebar"

type Course = {
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  duration: string
  price: string
  discountPrice: string
  image: string
  slug: string
  buttonText: string
  neonColor?: string
  glowGradient?: string
  iconType?: string
}

type CourseForm = {
  title: string
  subtitle: string
  description: string
  category: string
  duration: string
  price: string
  discountPrice: string
  image: string
  slug: string
  buttonText: string
  neonColor: string
  glowGradient: string
  iconType: string
}

type ToastType = "success" | "error" | "info"

type Toast = {
  id: number
  type: ToastType
  message: string
}

type ModalMode = "add" | "edit" | null

const CATEGORIES = [
  "Kompüter & İT",
  "Tibb",
  "Psixologiya",
  "Loqopediya",
  "Baytarlıq",
  "Pedaqogika",
  "MİQ & İmtahan",
  "Digər",
] as const

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
  glowGradient: "rgba(14, 165, 233, 0.8)",
  iconType: "star",
}

function normalizeCourse(value: unknown): Course | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const item = value as Record<string, unknown>

  if (typeof item.id !== "string" && typeof item.id !== "number") {
    return null
  }

  return {
    id: String(item.id),
    title: typeof item.title === "string" ? item.title : "",
    subtitle: typeof item.subtitle === "string" ? item.subtitle : "",
    description: typeof item.description === "string" ? item.description : "",
    category: typeof item.category === "string" ? item.category : "",
    duration: typeof item.duration === "string" ? item.duration : "",
    price: typeof item.price === "string" ? item.price : "",
    discountPrice: typeof item.discountPrice === "string" ? item.discountPrice : "",
    image: typeof item.image === "string" ? item.image : "/hero.jpeg",
    slug: typeof item.slug === "string" ? item.slug : "",
    buttonText: typeof item.buttonText === "string" ? item.buttonText : "Ətraflı məlumat",
    neonColor: typeof item.neonColor === "string" ? item.neonColor : undefined,
    glowGradient: typeof item.glowGradient === "string" ? item.glowGradient : undefined,
    iconType: typeof item.iconType === "string" ? item.iconType : undefined,
  }
}

function courseToForm(course: Course): CourseForm {
  return {
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    duration: course.duration,
    price: course.price,
    discountPrice: course.discountPrice,
    image: course.image,
    slug: course.slug,
    buttonText: course.buttonText,
    neonColor: course.neonColor || DEFAULT_FORM.neonColor,
    glowGradient: course.glowGradient || DEFAULT_FORM.glowGradient,
    iconType: course.iconType || DEFAULT_FORM.iconType,
  }
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("az-AZ")
    .trim()
    .replace(/[əƏ]/g, "e")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[üÜ]/g, "u")
    .replace(/[şŞ]/g, "s")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[&]/g, "ve")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function getErrorMessage(value: unknown, fallback: string): string {
  if (value instanceof Error && value.message) {
    return value.message
  }

  return fallback
}

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function AdminKurslarPage() {
  const { status } = useSession()
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [modal, setModal] = useState<ModalMode>(null)
  const [editItem, setEditItem] = useState<Course | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [form, setForm] = useState<CourseForm>(DEFAULT_FORM)
  const [toasts, setToasts] = useState<Toast[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now() + Math.random()

      setToasts((current) => [...current, { id, message, type }])

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
      }, 4000)
    },
    []
  )

  const fetchCourses = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true)
        }

        const response = await fetch(`/api/courses?t=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        const data: unknown = await response.json().catch(() => null)

        if (!response.ok) {
          const message =
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Kursları yükləmək mümkün olmadı."

          throw new Error(message)
        }

        if (!Array.isArray(data)) {
          throw new Error("Serverdən düzgün kurs məlumatı gəlmədi.")
        }

        const normalizedCourses = data
          .map(normalizeCourse)
          .filter((course): course is Course => course !== null)

        setCourses(normalizedCourses)
      } catch (error) {
        console.error("fetchCourses:", error)
        showToast(
          getErrorMessage(error, "Kursları yükləmək mümkün olmadı."),
          "error"
        )
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [showToast]
  )

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [router, status])

  useEffect(() => {
    if (status === "authenticated") {
      void fetchCourses()
    }
  }, [fetchCourses, status])

  useEffect(() => {
    if (!modal && !deleteId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (modal) {
          closeModal()
        }

        if (deleteId) {
          setDeleteId(null)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [modal, deleteId])

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az-AZ")

    if (!query) {
      return courses
    }

    return courses.filter((course) => {
      const searchableText = [
        course.title,
        course.subtitle,
        course.description,
        course.category,
        course.slug,
        course.duration,
      ]
        .join(" ")
        .toLocaleLowerCase("az-AZ")

      return searchableText.includes(query)
    })
  }, [courses, search])

  const openAdd = () => {
    setEditItem(null)
    setForm({
      ...DEFAULT_FORM,
      image: "/hero.jpeg",
      slug: "",
    })
    setModal("add")
  }

  const openEdit = (course: Course) => {
    setEditItem(course)
    setForm(courseToForm(course))
    setModal("edit")
  }

  const closeModal = () => {
    if (saving || uploading) {
      return
    }

    setModal(null)
    setEditItem(null)
    setForm(DEFAULT_FORM)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const updateForm = <K extends keyof CourseForm>(
    field: K,
    value: CourseForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleTitleChange = (value: string) => {
    setForm((current) => {
      const shouldGenerateSlug =
        !current.slug ||
        current.slug === slugify(current.title)

      return {
        ...current,
        title: value,
        slug: shouldGenerateSlug ? slugify(value) : current.slug,
      }
    })
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (saving || uploading) {
      return
    }

    const title = form.title.trim()
    const category = form.category.trim()
    const slug = slugify(form.slug || form.title)

    if (!title) {
      showToast("Kursun adı daxil edilməlidir.", "error")
      return
    }

    if (!category) {
      showToast("Kateqoriya seçilməlidir.", "error")
      return
    }

    if (!slug) {
      showToast("Kurs üçün düzgün slug daxil edin.", "error")
      return
    }

    setSaving(true)

    const payload: Course = {
      id:
        modal === "edit" && editItem
          ? String(editItem.id).trim()
          : Date.now().toString(),
      title,
      subtitle: form.subtitle.trim(),
      description: form.description.trim() || form.subtitle.trim(),
      category,
      duration: form.duration.trim(),
      price: form.price.trim(),
      discountPrice: form.discountPrice.trim(),
      image: form.image.trim() || "/hero.jpeg",
      slug,
      buttonText: form.buttonText.trim() || "Ətraflı məlumat",
      neonColor: form.neonColor.trim() || DEFAULT_FORM.neonColor,
      glowGradient:
        form.glowGradient.trim() || DEFAULT_FORM.glowGradient,
      iconType: form.iconType.trim() || DEFAULT_FORM.iconType,
    }

    try {
      const isEditing = modal === "edit" && Boolean(editItem)

      const response = await fetch("/api/courses", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(payload),
      })

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : isEditing
              ? "Kurs yenilənərkən xəta baş verdi."
              : "Kurs əlavə edilərkən xəta baş verdi."

        throw new Error(message)
      }

      const normalized = normalizeCourse(data)

      if (!normalized) {
        throw new Error("Serverdən düzgün kurs məlumatı gəlmədi.")
      }

      if (isEditing) {
        setCourses((current) =>
          current.map((course) =>
            course.id === payload.id ? normalized : course
          )
        )

        showToast("Kurs məlumatları uğurla yeniləndi!", "success")
      } else {
        setCourses((current) => [normalized, ...current])
        showToast("Yeni kurs uğurla əlavə edildi!", "success")
      }

      closeModal()
      await fetchCourses(false)
    } catch (error) {
      console.error("handleSave:", error)

      showToast(
        getErrorMessage(error, "Serverlə əlaqə qurulmadı."),
        "error"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId || deleting) {
      return
    }

    const cleanId = String(deleteId).trim()

    setDeleting(true)

    try {
      const response = await fetch(
        `/api/courses?id=${encodeURIComponent(cleanId)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      )

      const data: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Kurs silinərkən xəta baş verdi."

        throw new Error(message)
      }

      setCourses((current) =>
        current.filter((course) => course.id !== cleanId)
      )

      setDeleteId(null)

      showToast("Kurs uğurla silindi!", "success")

      await fetchCourses(false)
    } catch (error) {
      console.error("handleDelete:", error)

      showToast(
        getErrorMessage(error, "Kurs silinərkən xəta baş verdi."),
        "error"
      )
    } finally {
      setDeleting(false)
    }
  }

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ]

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Yalnız JPG, PNG, WEBP və GIF formatları qəbul edilir.",
        "error"
      )

      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Şəkil maksimum 5 MB ola bilər.", "error")

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
        const message =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Şəkil yüklənərkən xəta baş verdi."

        throw new Error(message)
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("url" in data) ||
        typeof data.url !== "string"
      ) {
        throw new Error("Upload serverindən düzgün URL gəlmədi.")
      }

      updateForm("image", data.url)

      showToast("Şəkil uğurla yükləndi!", "success")
    } catch (error) {
      console.error("handleImageUpload:", error)

      showToast(
        getErrorMessage(error, "Şəkil yüklənərkən xəta baş verdi."),
        "error"
      )
    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      closeModal()
    }
  }

  const getCoursePrice = (course: Course) => {
    if (course.discountPrice.trim()) {
      return course.discountPrice
    }

    if (course.price.trim()) {
      return course.price
    }

    return "—"
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Admin panel yüklənir...
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                : toast.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-950"
                  : "border-sky-200 bg-sky-50 text-sky-950"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                toast.type === "success"
                  ? "bg-emerald-600 text-white"
                  : toast.type === "error"
                    ? "bg-rose-600 text-white"
                    : "bg-sky-600 text-white"
              }`}
            >
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                  ? "×"
                  : "i"}
            </div>

            <p className="text-xs font-bold leading-5">
              {toast.message}
            </p>
          </div>
        ))}
      </div>

      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Kurs idarəetməsi
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-[#1e3a47] sm:text-3xl">
                  Kursların İdarə Edilməsi
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                  Saytdakı kursları əlavə edin, redaktə edin, şəkillərini
                  dəyişin və idarə edin.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2.5 sm:flex-row xl:w-auto">
                <div className="relative flex-1 sm:min-w-[260px]">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                    />
                  </Icon>

                  <input
                    ref={searchInputRef}
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Kurs axtar..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("")
                        searchInputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Axtarışı təmizlə"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={openAdd}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1e3a47] px-5 text-xs font-black text-white shadow-sm transition hover:bg-[#162c37] active:scale-[0.98]"
                >
                  <Icon className="h-4 w-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </Icon>
                  Yeni Kurs Əlavə Et
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 shadow-xs">
                <span className="mr-1 text-[#1e3a47]">
                  {courses.length}
                </span>
                ümumi kurs
              </div>

              {search && (
                <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[11px] font-bold text-sky-700">
                  {filteredCourses.length} nəticə
                </div>
              )}
            </div>
          </header>

          {loading ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 shadow-xs">
              <div className="flex min-h-[320px] flex-col items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
                <p className="mt-4 text-xs font-semibold text-slate-500">
                  Kurslar yüklənir...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="border-b border-slate-100 bg-slate-50/80">
                      <tr className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                        <th className="px-6 py-4">Kurs</th>
                        <th className="px-5 py-4">Kateqoriya</th>
                        <th className="px-5 py-4">Müddət</th>
                        <th className="px-5 py-4">Qiymət</th>
                        <th className="px-5 py-4">Slug</th>
                        <th className="px-6 py-4 text-right">
                          Əməliyyatlar
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-20">
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Icon className="h-6 w-6">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                  />
                                </Icon>
                              </div>

                              <h3 className="mt-4 text-sm font-black text-slate-800">
                                Heç bir kurs tapılmadı
                              </h3>

                              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                                Axtarış sözünü dəyişə və ya yeni kurs əlavə
                                edə bilərsiniz.
                              </p>

                              {search && (
                                <button
                                  type="button"
                                  onClick={() => setSearch("")}
                                  className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-200"
                                >
                                  Axtarışı təmizlə
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr
                            key={course.id}
                            className="group transition-colors hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-4">
                              <div className="flex min-w-[300px] items-center gap-3">
                                <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                  <img
                                    src={course.image || "/hero.jpeg"}
                                    alt={course.title}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    onError={(event) => {
                                      event.currentTarget.src = "/hero.jpeg"
                                    }}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-slate-900">
                                    {course.title || "Adsız kurs"}
                                  </p>

                                  <p className="mt-0.5 line-clamp-1 max-w-[360px] text-[11px] font-medium text-slate-400">
                                    {course.subtitle ||
                                      course.description ||
                                      "Təsvir yoxdur"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg border border-sky-200/70 bg-sky-50 px-2.5 py-1.5 text-[10px] font-black text-sky-700">
                                {course.category || "Digər"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-xs font-bold text-slate-600">
                                {course.duration || "—"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">
                                  {getCoursePrice(course)}
                                </span>

                                {course.discountPrice &&
                                  course.price &&
                                  course.discountPrice !==
                                    course.price && (
                                    <span className="text-[10px] font-medium text-slate-400 line-through">
                                      {course.price}
                                    </span>
                                  )}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <code className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                /{course.slug}
                              </code>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEdit(course)}
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                  <Icon className="h-3.5 w-3.5">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.768.768-2.685a4.5 4.5 0 0 1 1.13-1.897l8.964-8.964Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 7.125 16.875 4.5"
                                    />
                                  </Icon>
                                  Redaktə
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeleteId(course.id)}
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50 px-3 text-[11px] font-black text-rose-600 transition hover:border-rose-200 hover:bg-rose-100"
                                >
                                  <Icon className="h-3.5 w-3.5">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C8.91 2.772 8 3.756 8 4.936v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </Icon>
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

              <div className="space-y-3 lg:hidden">
                {filteredCourses.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Icon className="h-6 w-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                        />
                      </Icon>
                    </div>

                    <h3 className="mt-4 text-sm font-black text-slate-800">
                      Heç bir kurs tapılmadı
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Axtarış nəticəsi yoxdur.
                    </p>
                  </div>
                ) : (
                  filteredCourses.map((course) => (
                    <article
                      key={course.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img
                            src={course.image || "/hero.jpeg"}
                            alt={course.title}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = "/hero.jpeg"
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="line-clamp-2 text-sm font-black leading-5 text-slate-900">
                              {course.title}
                            </h2>

                            <span className="shrink-0 rounded-lg bg-sky-50 px-2 py-1 text-[9px] font-black text-sky-700">
                              {course.category}
                            </span>
                          </div>

                          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-400">
                            {course.subtitle ||
                              course.description ||
                              "Təsvir yoxdur"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border-t border-slate-100">
                        <div className="border-r border-slate-100 px-4 py-3">
                          <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Müddət
                          </span>
                          <span className="mt-1 block text-xs font-bold text-slate-700">
                            {course.duration || "—"}
                          </span>
                        </div>

                        <div className="px-4 py-3">
                          <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Qiymət
                          </span>
                          <span className="mt-1 block text-xs font-black text-slate-900">
                            {getCoursePrice(course)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
                        <button
                          type="button"
                          onClick={() => openEdit(course)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          <Icon className="h-4 w-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.768.768-2.685a4.5 4.5 0 0 1 1.13-1.897l8.964-8.964Z"
                            />
                          </Icon>
                          Redaktə
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(course.id)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                        >
                          <Icon className="h-4 w-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C8.91 2.772 8 3.756 8 4.936v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </Icon>
                          Sil
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {modal === "add"
                    ? "Yeni kurs"
                    : "Kurs məlumatları"}
                </p>

                <h2
                  id="course-modal-title"
                  className="mt-1 text-lg font-black tracking-tight text-[#1e3a47]"
                >
                  {modal === "add"
                    ? "Yeni Kurs Əlavə Et"
                    : "Kursu Redaktə Et"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving || uploading}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Modalı bağla"
              >
                <Icon className="h-5 w-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 18 6M6 6l12 12"
                  />
                </Icon>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="max-h-[calc(100vh-180px)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Kursun adı *
                    </label>

                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(event) =>
                        handleTitleChange(event.target.value)
                      }
                      placeholder="Məs: Frontend Development"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Kateqoriya *
                    </label>

                    <select
                      required
                      value={form.category}
                      onChange={(event) =>
                        updateForm("category", event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Slug *
                    </label>

                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(event) =>
                        updateForm(
                          "slug",
                          slugify(event.target.value)
                        )
                      }
                      placeholder="frontend-development"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />

                    <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                      URL: /{form.slug || "kurs-slug"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Qısa təsvir
                    </label>

                    <textarea
                      rows={3}
                      value={form.subtitle}
                      onChange={(event) => {
                        const value = event.target.value

                        setForm((current) => ({
                          ...current,
                          subtitle: value,
                          description: value,
                        }))
                      }}
                      placeholder="Kurs haqqında qısa məlumat..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Kurs şəkli
                    </label>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-28 sm:w-40">
                        <img
                          src={form.image || "/hero.jpeg"}
                          alt="Kurs şəkli önizləmə"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src = "/hero.jpeg"
                          }}
                        />

                        {uploading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
                            <span className="text-[9px] font-black text-[#1e3a47]">
                              Yüklənir...
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-black text-slate-600 transition hover:border-[#1e3a47] hover:bg-slate-100">
                          <Icon className="h-4 w-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 16V4m0 0L8 8m4-4 4 4M4 16.5v1.25A2.25 2.25 0 0 0 6.25 20h11.5A2.25 2.25 0 0 0 20 17.75V16.5"
                            />
                          </Icon>

                          {uploading
                            ? "Şəkil yüklənir..."
                            : "Şəkil yüklə"}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={uploading || saving}
                            onChange={handleImageUpload}
                          />
                        </label>

                        <input
                          type="text"
                          value={form.image}
                          onChange={(event) =>
                            updateForm(
                              "image",
                              event.target.value
                            )
                          }
                          placeholder="/courses/image.jpg"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                        />

                        <p className="text-[10px] font-medium text-slate-400">
                          JPG, PNG, WEBP və GIF · maksimum 5 MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Müddət
                    </label>

                    <input
                      type="text"
                      value={form.duration}
                      onChange={(event) =>
                        updateForm(
                          "duration",
                          event.target.value
                        )
                      }
                      placeholder="3 - 6 ay"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Əsas qiymət
                    </label>

                    <input
                      type="text"
                      value={form.price}
                      onChange={(event) =>
                        updateForm("price", event.target.value)
                      }
                      placeholder="120 AZN / ay"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Endirimli qiymət
                    </label>

                    <input
                      type="text"
                      value={form.discountPrice}
                      onChange={(event) =>
                        updateForm(
                          "discountPrice",
                          event.target.value
                        )
                      }
                      placeholder="99 AZN / ay"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-black text-slate-700">
                      Düymə mətni
                    </label>

                    <input
                      type="text"
                      value={form.buttonText}
                      onChange={(event) =>
                        updateForm(
                          "buttonText",
                          event.target.value
                        )
                      }
                      placeholder="Ətraflı məlumat"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1e3a47] focus:ring-4 focus:ring-[#1e3a47]/5"
                    />
                  </div>

                  <details className="sm:col-span-2">
                    <summary className="cursor-pointer select-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black text-slate-600 transition hover:bg-slate-100">
                      Advanced görünüş parametrləri
                    </summary>

                    <div className="mt-3 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-black text-slate-600">
                          Neon rəng
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={
                              /^#[0-9a-fA-F]{6}$/.test(
                                form.neonColor
                              )
                                ? form.neonColor
                                : "#0ea5e9"
                            }
                            onChange={(event) =>
                              updateForm(
                                "neonColor",
                                event.target.value
                              )
                            }
                            className="h-10 w-11 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                          />

                          <input
                            type="text"
                            value={form.neonColor}
                            onChange={(event) =>
                              updateForm(
                                "neonColor",
                                event.target.value
                              )
                            }
                            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold outline-none focus:border-[#1e3a47]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-black text-slate-600">
                          Glow gradient
                        </label>

                        <input
                          type="text"
                          value={form.glowGradient}
                          onChange={(event) =>
                            updateForm(
                              "glowGradient",
                              event.target.value
                            )
                          }
                          placeholder="rgba(14, 165, 233, 0.8)"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold outline-none focus:border-[#1e3a47]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-black text-slate-600">
                          Icon type
                        </label>

                        <input
                          type="text"
                          value={form.iconType}
                          onChange={(event) =>
                            updateForm(
                              "iconType",
                              event.target.value
                            )
                          }
                          placeholder="star"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold outline-none focus:border-[#1e3a47]"
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploading}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ləğv et
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1e3a47] px-6 text-xs font-black text-white shadow-sm transition hover:bg-[#162c37] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {saving
                    ? "Saxlanılır..."
                    : modal === "add"
                      ? "Kursu Əlavə Et"
                      : "Dəyişiklikləri Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteId(null)
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Icon className="h-6 w-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  />
                </Icon>
              </div>

              <h2
                id="delete-modal-title"
                className="mt-5 text-lg font-black text-slate-900"
              >
                Kursu silmək istəyirsiniz?
              </h2>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Bu əməliyyat kursu idarəetmə sistemindən siləcək və
                geri qaytarılması mümkün olmayacaq.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteId(null)}
                  className="h-11 rounded-xl border border-slate-200 px-5 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ləğv et
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void handleDelete()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-xs font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {deleting ? "Silinir..." : "Bəli, Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}