"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { CourseCard3D } from "./CourseCard3D"

interface TechCardData {
  id: number
  title: string
  subtitle: string
  slug: string
  category: string
  neonColor: string
  glowGradient: string
  buttonText: string
  iconType: "code" | "shield" | "chip" | "brain" | "star" | "pulse" | "voice" | "vet" | "award"
}

// Exactly the 7 academy courses from user reference
const academyCourses: TechCardData[] = [
  {
    id: 1,
    title: "Kompüter",
    subtitle: "Kompüter bilikləri və müasir rəqəmsal bacarıqlar üzrə tədris proqramları.",
    slug: "komputer",
    category: "Kompüter & İT",
    neonColor: "#f43f5e",
    glowGradient: "rgba(244, 63, 94, 0.85)",
    buttonText: "İstiqamətlərə bax",
    iconType: "code",
  },
  {
    id: 2,
    title: "Tibb",
    subtitle: "Tibb sahəsində nəzəri və praktiki biliklərin inkişaf etdirilməsi.",
    slug: "tibb",
    category: "Tibb",
    neonColor: "#e11d48",
    glowGradient: "rgba(225, 29, 72, 0.85)",
    buttonText: "İstiqamətlərə bax",
    iconType: "pulse",
  },
  {
    id: 3,
    title: "Psixoloq xidməti",
    subtitle: "Fərdi inkişaf və psixoloji dəstək üçün peşəkar xidmət.",
    slug: "psixoloq-xidmeti",
    category: "Psixologiya",
    neonColor: "#06b6d4",
    glowGradient: "rgba(6, 182, 212, 0.85)",
    buttonText: "Ətraflı məlumat",
    iconType: "brain",
  },
  {
    id: 4,
    title: "Loqoped xidməti",
    subtitle: "Nitq və danışıq problemlərinin aradan qaldırılması üçün loqoped xidməti.",
    slug: "loqoped-xidmeti",
    category: "Loqopediya",
    neonColor: "#a855f7",
    glowGradient: "rgba(168, 85, 247, 0.85)",
    buttonText: "Ətraflı məlumat",
    iconType: "voice",
  },
  {
    id: 5,
    title: "Baytarlıq",
    subtitle: "Heyvan sağlamlığı və baytarlıq sahəsində peşəkar təhsil.",
    slug: "baytarliq",
    category: "Baytarlıq",
    neonColor: "#10b981",
    glowGradient: "rgba(16, 185, 129, 0.85)",
    buttonText: "Ətraflı məlumat",
    iconType: "vet",
  },
  {
    id: 6,
    title: "Məktəbəqədər və ibtidai",
    subtitle: "Məktəbəqədər və ibtidai təhsil üzrə uşaqların inkişafına yönəlmiş proqramlar.",
    slug: "mektebeqeder-ve-ibtidai",
    category: "Pedaqogika",
    neonColor: "#f59e0b",
    glowGradient: "rgba(245, 158, 11, 0.85)",
    buttonText: "Ətraflı məlumat",
    iconType: "star",
  },
  {
    id: 7,
    title: "MİQ",
    subtitle: "Müəllimlərin işə qəbulu imtahanına hazırlıq proqramı.",
    slug: "miq",
    category: "MİQ & İmtahan",
    neonColor: "#3b82f6",
    glowGradient: "rgba(59, 130, 246, 0.85)",
    buttonText: "Ətraflı məlumat",
    iconType: "award",
  },
]

export default function CourseSection() {
  const [courses, setCourses] = useState<TechCardData[]>(academyCourses)
  const [activeCategory, setActiveCategory] = useState<string>("Hamısı")

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

  const categories = [
    "Hamısı",
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ]

  const filtered =
    activeCategory === "Hamısı"
      ? courses
      : courses.filter((c) => c.category === activeCategory)

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      {/* Subtle background ambient mesh */}
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
                Gələcəyin Texnologiyaları
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              İxtisaslaşdırılmış
              <span className="text-slate-400"> Tədris Həlləri</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Müasir texnologiya, şəbəkə arxitekturası, kibertəhlükəsizlik və süni intellekt üzrə qabaqcıl laboratoriya təlimləri.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm border border-slate-200/80 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Tech Course Cards Grid (Matching Reference Image) */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard3D key={course.id} {...course} />
          ))}
        </div>

        {/* View All Programs Footer Banner */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-[2.2rem] border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-md sm:flex-row sm:p-10">
          <div>
            <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
              Digər tədris sahələri ilə maraqlanırsınız?
            </h3>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Tibb, Psixologiya, Loqopediya və MİQ daxil olmaqla bütün kurslarımızla tanış olun.
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