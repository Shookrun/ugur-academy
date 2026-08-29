import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { coursesData } from "@/data/courses"

export const metadata: Metadata = {
  title: "Bütün Kurslarımız | Uğur Şəxsi İnkişaf Mərkəzi",
  description: "Uğur Şəxsi İnkişaf Mərkəzinin peşəkar İT, tibb, psixologiya, loqopediya, pedaqogika və MİQ hazırlıq kursları.",
}

export default function CoursesCatalogPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 sm:pt-32">
      <div className="mx-auto max-w-[1840px] px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-slate-950" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tədris Proqramları
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Bütün Kurslarımız
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Müasir və tələb olunan peşə istiqamətləri üzrə dərslərimizlə gələcəyinizi qurun.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coursesData.map((course, idx) => (
            <article
              key={course.id}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-900 backdrop-blur-md shadow">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                  {course.category}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-950 transition">
                  {course.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm line-clamp-3">
                  {course.description}
                </p>

                {course.hasChildren && course.children && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                    {course.children.map((ch) => (
                      <span
                        key={ch}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-semibold text-slate-400">
                      Müddət: <strong className="text-slate-700">{course.duration}</strong>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {course.discountPrice || course.price}
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
          ))}
        </div>
      </div>
    </div>
  )
}
