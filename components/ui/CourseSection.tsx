"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getCourseTags } from "@/lib/courseTags"

interface CourseData {
  id: string | number
  title: string
  subtitle?: string
  description?: string
  slug: string
  category: string
  image?: string
  duration?: string
  price?: string
  discountPrice?: string
  hasChildren?: boolean
  children?: string[]
  technologies?: string[]
  order?: number
}

type Status = "loading" | "ready" | "error"

const CACHE_KEY = "ugur-courses-v4"
const FETCH_TIMEOUT_MS = 15000
const REQUEST_REUSE_MS = 20000
const SKELETON_COUNT = 8

/** order-ə görə düzür; order olmayan kurslar öz yerini saxlayır. */
function sortByOrder(list: CourseData[]): CourseData[] {
  return [...list].sort(
    (a, b) =>
      (typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER) -
      (typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER),
  )
}

/** Yalnız düzgün formalı kursları saxlayır (title və slug mütləqdir). */
function cleanCourses(data: unknown): CourseData[] | null {
  if (!Array.isArray(data)) return null

  const valid = data.filter(
    (item): item is CourseData =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as CourseData).title === "string" &&
      typeof (item as CourseData).slug === "string" &&
      (item as CourseData).title.trim().length > 0 &&
      (item as CourseData).slug.trim().length > 0,
  )

  return valid.length > 0 ? valid : null
}

function readCache(): CourseData[] | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    return raw ? cleanCourses(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function writeCache(list: CourseData[]) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    // yaddaş doludur və ya bağlıdır — vacib deyil
  }
}

/** Kurs etiketləri xəta versə, bütün bölmə çökməsin. */
function safeTags(course: CourseData): string[] {
  try {
    const tags = getCourseTags(course)
    return Array.isArray(tags) ? tags : []
  } catch {
    return []
  }
}

/** Yerli şəkillər Next optimizasiyasından keçir; kənar və data: şəkillər keçmir. */
function isLocalImage(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//")
}

/* ------------------------------------------------------------------ */
/* Sorğu React qalxmamışdan başlayır: JS yüklənən kimi gedir           */
/* ------------------------------------------------------------------ */

let courseRequest: Promise<CourseData[] | null> | null = null
let courseRequestAt = 0

function requestCourses(force = false): Promise<CourseData[] | null> {
  const reusable =
    !force && courseRequest && Date.now() - courseRequestAt < REQUEST_REUSE_MS

  if (reusable && courseRequest) return courseRequest

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  courseRequestAt = Date.now()
  courseRequest = fetch("/api/courses", {
    cache: "no-store",
    signal: controller.signal,
  })
    .then((response) => (response.ok ? response.json() : null))
    .then(cleanCourses)
    .catch(() => null)
    .then((data) => {
      window.clearTimeout(timer)

      // Uğursuz nəticə saxlanmasın: növbəti cəhd yenidən sorğu göndərsin
      if (!data) courseRequest = null

      return data
    })

  return courseRequest
}

if (typeof window !== "undefined") {
  void requestCourses()
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-sm"
    >
      <div className="aspect-[16/10] w-full bg-slate-100" />
      <div className="flex flex-1 flex-col p-6">
        <div className="h-5 w-2/3 rounded bg-slate-100" />
        <div className="mt-3 h-3 w-full rounded bg-slate-100" />
        <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
        <div className="mt-4 flex gap-1.5 border-t border-slate-100 pt-3">
          <div className="h-5 w-16 rounded-md bg-slate-100" />
          <div className="h-5 w-20 rounded-md bg-slate-100" />
        </div>
        <div className="mt-8 h-3 w-1/3 rounded bg-slate-100" />
        <div className="mt-4 h-10 w-full rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}

export default function CourseSection() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [status, setStatus] = useState<Status>("loading")

  const load = useCallback((force: boolean, isCancelled: () => boolean) => {
    void requestCourses(force).then((fresh) => {
      if (isCancelled()) return

      if (fresh) {
        const next = sortByOrder(fresh)

        setCourses((current) =>
          JSON.stringify(current) === JSON.stringify(next) ? current : next,
        )
        setStatus("ready")
        writeCache(fresh)
        return
      }

      // Server cavab vermədi: yaddaşdan göstərilən kurs yoxdursa, xəta mesajı
      setStatus((current) => (current === "ready" ? current : "error"))
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    // Əvvəlki səfərdən qalan real data varsa, dərhal göstər
    const cached = readCache()

    if (cached) {
      setCourses(sortByOrder(cached))
      setStatus("ready")
    }

    load(false, () => cancelled)

    return () => {
      cancelled = true
    }
  }, [load])

  const retry = () => {
    setStatus("loading")
    load(true, () => false)
  }

  const cards = useMemo(
    () => courses.map((course) => ({ course, tags: safeTags(course) })),
    [courses],
  )

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      {/* Subtle background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-slate-200/20 blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-[1840px]">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-900" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Tədris Proqramları
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Bütün{" "}
              <span className="text-slate-400">Kurslarımız</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Müasir və tələb olunan peşə istiqamətləri üzrə dərslərimizlə gələcəyinizi qurun.
            </p>
          </div>

          <Link
            href="/kurslar"
            className="inline-flex shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-950 hover:text-white hover:shadow-lg"
          >
            <span>Bütün Kataloq</span>
            <span>→</span>
          </Link>
        </div>

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-slate-200/80 bg-white/80 p-10 text-center shadow-sm">
            <p className="text-sm text-slate-600 sm:text-base">
              Kurslar yüklənmədi. İnternet bağlantısını yoxlayıb yenidən cəhd et.
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Yenidən yüklə
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        {status !== "error" && (
          <div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-busy={status === "loading"}
          >
            {status === "loading"
              ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <SkeletonCard key={index} />
                ))
              : cards.map(({ course, tags }, idx) => {
                  const imageSrc = course.image || "/hero.jpeg"

                  return (
                    <article
                      key={`${course.id}-${course.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={imageSrc}
                          alt={course.title}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          priority={idx < 4}
                          unoptimized={!isLocalImage(imageSrc)}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Number badge */}
                        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-900 backdrop-blur-md shadow">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-bold tracking-tight text-slate-950">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm line-clamp-3">
                          {course.description || course.subtitle}
                        </p>

                        {/* Sub-course tags */}
                        {tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto pt-6">
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                            <span className="font-semibold text-slate-400">
                              Müddət:{" "}
                              <strong className="text-slate-700">
                                {course.duration || "—"}
                              </strong>
                            </span>
                          </div>

                          <Link
                            href={`/kurslar/${course.slug}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                          >
                            <span>Ətraflı tanış ol</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
          </div>
        )}

        {/* Footer Banner */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-[2.2rem] border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-md sm:flex-row sm:p-10">
          <div>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
              Digər tədris sahələri ilə maraqlanırsınız?
            </h3>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Tibb, Psixologiya, Loqopediya, Dövlət Qulluğu, Magistr hazırlığı və daha çoxu.
            </p>
          </div>
          <Link
            href="/kurslar"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-lg active:scale-95"
          >
            <span>Bütün Kurslar Kataloqu</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
