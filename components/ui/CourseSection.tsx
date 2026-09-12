"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

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
}

const academyCourses: CourseData[] = [
  {
    id: 1,
    title: "Kompüter",
    subtitle: "Müasir rəqəmsal bacarıqlar, ofis proqramları və praktiki texnologiya tədrisi",
    description: "Kompüter bilikləri və müasir rəqəmsal bacarıqlar üzrə hərtərəfli tədris proqramları.",
    slug: "komputer",
    category: "İT və Texnologiya",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    price: "120 AZN / ay",
    discountPrice: "99 AZN / ay",
    hasChildren: true,
    children: ["Kompüter operatoru", "Microsoft Office", "Qrafik dizayn"],
  },
  {
    id: 2,
    title: "Tibb",
    subtitle: "Tibb bacısı işi, ilkin tibbi yardım və praktiki klinik biliklər",
    description: "Tibb sahəsində nəzəri və praktiki biliklərin yüksək standartlarla inkişaf etdirilməsi.",
    slug: "tibb",
    category: "Səhiyyə və Tibb",
    image: "/hero.jpeg",
    duration: "4 - 8 ay",
    price: "150 AZN / ay",
    discountPrice: "125 AZN / ay",
  },
  {
    id: 3,
    title: "Psixoloq xidməti",
    subtitle: "Fərdi inkişaf, emosional balans və peşəkar psixoloji dəstək xidmətləri",
    description: "Fərdi inkişaf, stress idarəetməsi və psixoloji dəstək üçün peşəkar xidmət və təlimlər.",
    slug: "psixoloq-xidmeti",
    category: "Psixologiya və İnkişaf",
    image: "/hero.jpeg",
    duration: "2 - 4 ay",
    price: "140 AZN / ay",
    discountPrice: "115 AZN / ay",
  },
  {
    id: 4,
    title: "Loqoped xidməti",
    subtitle: "Nitq qüsurlarının aradan qaldırılması, artikulyasiya və defektoloji dəstək",
    description: "Nitq və danışıq problemlərinin aradan qaldırılması üçün loqoped xidməti və təlimləri.",
    slug: "loqoped-xidmeti",
    category: "Loqopediya və Defektologiya",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    price: "160 AZN / ay",
    discountPrice: "135 AZN / ay",
  },
  {
    id: 5,
    title: "Baytarlıq",
    subtitle: "Heyvan sağlamlığı, baytarlıq təbabəti və kliniki qulluq prinsipləri",
    description: "Heyvan sağlamlığı, diaqnostika və baytarlıq sahəsində peşəkar təhsil proqramı.",
    slug: "baytarliq",
    category: "Heyvandarlıq və Baytarlıq",
    image: "/hero.jpeg",
    duration: "4 - 6 ay",
    price: "150 AZN / ay",
    discountPrice: "120 AZN / ay",
  },
  {
    id: 6,
    title: "Məktəbəqədər və ibtidai",
    subtitle: "Uşaqların erkən inkişafı, məktəbə hazırlıq və müasir pedaqoji metodikalar",
    description: "Məktəbəqədər və ibtidai təhsil üzrə uşaqların hərtərəfli inkişafına yönəlmiş peşəkar proqramlar.",
    slug: "mektebeqeder-ve-ibtidai",
    category: "Pedaqogika və Təhsil",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    price: "130 AZN / ay",
    discountPrice: "105 AZN / ay",
  },
  {
    id: 7,
    title: "MİQ",
    subtitle: "Müəllimlərin İşə Qəbulu imtahanına hərtərəfli və zəmanətli hazırlıq proqramı",
    description: "Müəllimlərin işə qəbulu və sertifikasiya imtahanlarına yüksək ballı peşəkar hazırlıq.",
    slug: "miq",
    category: "İmtahana Hazırlıq",
    image: "/hero.jpeg",
    duration: "4 - 8 ay",
    price: "140 AZN / ay",
    discountPrice: "110 AZN / ay",
  },
  {
    id: 8,
    title: "Dövlət Qulluğu",
    subtitle: "Dövlət qulluğuna qəbul imtahanına peşəkar hazırlıq — qanunvericilik, iqtisadiyyat, Azərbaycan tarixi",
    description: "Dövlət qulluqçusu imtahanına kompleks hazırlıq: hüquq, tarix, iqtisadiyyat, ümumi bilik.",
    slug: "dovlet-qullugu",
    category: "İmtahana Hazırlıq",
    image: "/hero.jpeg",
    duration: "3 - 6 ay",
    price: "130 AZN / ay",
    discountPrice: "105 AZN / ay",
    hasChildren: true,
    children: ["Qanunvericilik", "Azərbaycan tarixi", "İqtisadiyyat", "Ümumi bilik"],
  },
  {
    id: 9,
    title: "Magistr Hazırlığı",
    subtitle: "Ali məktəblərə magistratura qəbul imtahanına dərindən hazırlıq proqramı",
    description: "Magistratura qəbul imtahanları üzrə peşəkar hazırlıq: ixtisas fənləri, test strategiyası, yazı bacarıqları.",
    slug: "magistr-hazirligi",
    category: "İmtahana Hazırlıq",
    image: "/hero.jpeg",
    duration: "4 - 8 ay",
    price: "145 AZN / ay",
    discountPrice: "120 AZN / ay",
    hasChildren: true,
    children: ["Azərbaycan dili", "İngilis dili", "İxtisas fənləri", "Test strategiyası"],
  },
  {
    id: 10,
    title: "İT Proqramlaşdırma",
    subtitle: "Web inkişafı, mobil tətbiqlər və müasir proqramlaşdırma texnologiyaları üzrə peşəkar kurs",
    description: "Sıfırdan başlayaraq proqramçı olmaq istəyənlər üçün intensiv və praktiki İT proqramlaşdırma kursu.",
    slug: "it-proqramlasdirma",
    category: "İT və Texnologiya",
    image: "/hero.jpeg",
    duration: "6 - 12 ay",
    price: "160 AZN / ay",
    discountPrice: "135 AZN / ay",
    hasChildren: true,
    children: ["HTML & CSS", "JavaScript", "Python", "React", "Mobile App", "Backend"],
  },
]

export default function CourseSection() {
  const [courses, setCourses] = useState<CourseData[]>(academyCourses)

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCourses(data)
        }
      })
      .catch(() => {})
  }, [])

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

        {/* Course Cards Grid — identical to /kurslar page */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course, idx) => (
            <article
              key={course.id}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={course.image || "/hero.jpeg"}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Number badge */}
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-900 backdrop-blur-md shadow">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                {/* Category badge */}
                <div className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                  {course.category}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                  {course.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm line-clamp-3">
                  {course.description || course.subtitle}
                </p>

                {/* Sub-course tags */}
                {course.hasChildren && course.children && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                    {course.children.map((ch: string) => (
                      <span
                        key={ch}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-semibold text-slate-400">
                      Müddət:{" "}
                      <strong className="text-slate-700">{course.duration || "—"}</strong>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {course.discountPrice || course.price || ""}
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
