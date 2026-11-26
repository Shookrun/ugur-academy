import Image from "next/image"
import Link from "next/link"
import { getCollection } from "@/lib/db"
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

const COLLECTION_KEY = "courses"
const CACHE_TTL_MS = 15_000
const SERVER_WAIT_MS = 3_000

/** order-ə görə düzür; order olmayan kurslar öz yerini saxlayır. */
function sortByOrder(list: CourseData[]): CourseData[] {
  return [...list].sort(
    (a, b) =>
      (typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER) -
      (typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER),
  )
}

/** Yalnız düzgün formalı kursları saxlayır (title və slug mütləqdir). */
function cleanCourses(data: unknown[]): CourseData[] {
  return data.filter(
    (item): item is CourseData =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as CourseData).title === "string" &&
      typeof (item as CourseData).slug === "string" &&
      (item as CourseData).title.trim().length > 0 &&
      (item as CourseData).slug.trim().length > 0,
  )
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
/* Server keşi: bazaya hər ziyarətçi üçün yox, 15 saniyədən bir gedir   */
/* ------------------------------------------------------------------ */

type CacheState = {
  entry?: { value: CourseData[]; at: number }
  inflight?: Promise<CourseData[]>
}

const globalRef = globalThis as typeof globalThis & {
  __ugurHomeCourses?: CacheState
}

const cacheState: CacheState =
  globalRef.__ugurHomeCourses ?? (globalRef.__ugurHomeCourses = {})

async function loadCourses(): Promise<CourseData[]> {
  const stored: unknown = await getCollection(COLLECTION_KEY)

  if (!Array.isArray(stored)) {
    throw new Error("courses collection is not available")
  }

  return sortByOrder(cleanCourses(stored))
}

function refreshCourses(): Promise<CourseData[]> {
  if (cacheState.inflight) return cacheState.inflight

  const promise = loadCourses()
    .then((value) => {
      cacheState.entry = { value, at: Date.now() }
      return value
    })
    .finally(() => {
      cacheState.inflight = undefined
    })

  cacheState.inflight = promise

  return promise
}

function timeout(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms))
}

/** Keş doludursa dərhal qaytarır; boşdursa ən çox 3 saniyə gözləyir. */
async function getCourses(): Promise<CourseData[] | null> {
  const entry = cacheState.entry

  if (entry) {
    // Müddət bitib: köhnəni dərhal göstər, yenisini arxa planda yüklə
    if (Date.now() - entry.at > CACHE_TTL_MS) {
      void refreshCourses().catch(() => {})
    }

    return entry.value
  }

  const pending = refreshCourses()

  // Gözləmə bitəndən sonra gələ biləcək xəta işlənməmiş qalmasın
  pending.catch(() => {})

  try {
    return await Promise.race([pending, timeout(SERVER_WAIT_MS)])
  } catch (error) {
    console.error("CourseSection read failed:", error)
    return null
  }
}

export default async function CourseSection() {
  const courses = await getCourses()

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

        {/* Error state: baza cavab vermədi */}
        {courses === null && (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-slate-200/80 bg-white/80 p-10 text-center shadow-sm">
            <p className="text-sm text-slate-600 sm:text-base">
              Kurslar yüklənmədi. Bir neçə saniyə sonra səhifəni yeniləyin.
            </p>
            <a
              href="/"
              className="rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Səhifəni yenilə
            </a>
          </div>
        )}

        {/* Empty state */}
        {courses !== null && courses.length === 0 && (
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-10 text-center text-sm text-slate-600 shadow-sm sm:text-base">
            Hələ kurs əlavə edilməyib.
          </div>
        )}

        {/* Course Cards Grid */}
        {courses !== null && courses.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course, idx) => {
              const tags = safeTags(course)
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
