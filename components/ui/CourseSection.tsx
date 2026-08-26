"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const courses = [
  {
    id: 1,
    title: "Kompüter",
    description:
      "Kompüter bilikləri və müasir rəqəmsal bacarıqlar üzrə tədris proqramları.",
    image: "/hero.jpeg",
    hasChildren: true,
    children: [
      "Kompüter operatoru",
      "Microsoft Office",
      "Qrafik dizayn",
    ],
  },
  {
    id: 2,
    title: "Tibb",
    description:
      "Tibb sahəsində nəzəri və praktiki biliklərin inkişaf etdirilməsi.",
    image: "/hero.jpeg",
    hasChildren: true,
    children: [
      "Tibb bacısı",
      "İlkin tibbi yardım",
      "Tibbi biliklər",
    ],
  },
  {
    id: 3,
    title: "Psixoloq xidməti",
    description:
      "Fərdi inkişaf və psixoloji dəstək üçün peşəkar xidmət.",
    image: "/hero.jpeg",
    hasChildren: false,
  },
  {
    id: 4,
    title: "Loqoped xidməti",
    description:
      "Nitq və danışıq problemlərinin aradan qaldırılması üçün loqoped xidməti.",
    image: "/hero.jpeg",
    hasChildren: false,
  },
  {
    id: 5,
    title: "Baytarlıq",
    description:
      "Heyvan sağlamlığı və baytarlıq sahəsində peşəkar təhsil.",
    image: "/hero.jpeg",
    hasChildren: false,
  },
  {
    id: 6,
    title: "Məktəbəqədər və ibtidai",
    description:
      "Məktəbəqədər və ibtidai təhsil üzrə uşaqların inkişafına yönəlmiş proqramlar.",
    image: "/hero.jpeg",
    hasChildren: false,
  },
  {
    id: 7,
    title: "MİQ",
    description:
      "Müəllimlərin işə qəbulu imtahanına hazırlıq proqramı.",
    image: "/hero.jpeg",
    hasChildren: false,
  },
]

const CourseSection = () => {
  const [openCourse, setOpenCourse] = useState<number | null>(null)

  const toggleCourse = (id: number) => {
    setOpenCourse((current) => (current === id ? null : id))
  }

  return (
    <section className="bg-white px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1840px]">

        {/* Başlıq */}
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-gray-900" />

              <span className="text-sm font-medium tracking-wide text-gray-500">
                Kurslarımız
              </span>
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
              Öyrənmək üçün
              <br />
              <span className="text-gray-400">
                doğru istiqaməti seç.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            Müxtəlif sahələr üzrə hazırladığımız təhsil və xidmət
            proqramlarından sənə uyğun olanı seç və inkişafına başla.
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => {
            const isOpen = openCourse === course.id

            return (
              <div
                key={course.id}
                className="
                  group overflow-hidden
                  rounded-[1.5rem]
                  border border-gray-200
                  bg-white
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:border-gray-300
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                "
              >
                {/* Şəkil */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    priority={course.id <= 3}
                    className="
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-105
                    "
                  />

                  {/* Şəkil üzərində yüngül overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/5" />

                  {/* Nömrə */}
                  <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xs font-semibold text-gray-900 shadow-sm">
                    {String(course.id).padStart(2, "0")}
                  </div>
                </div>

                {/* Məzmun */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold tracking-tight text-gray-950">
                      {course.title}
                    </h3>

                    {course.hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        aria-label={`${course.title} alt istiqamətləri`}
                        aria-expanded={isOpen}
                        className="
                          flex h-9 w-9 shrink-0
                          cursor-pointer
                          items-center justify-center
                          rounded-full
                          border border-gray-200
                          text-gray-900
                          transition-all duration-300
                          hover:bg-gray-950
                          hover:text-white
                        "
                      >
                        <svg
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <span
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-full
                          border border-gray-200
                          text-gray-500
                          transition-all duration-300
                          group-hover:border-gray-900
                          group-hover:bg-gray-950
                          group-hover:text-white
                        "
                      >
                        →
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {course.description}
                  </p>

                  {/* Alt istiqamətlər */}
                  {course.hasChildren && (
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen
                          ? "mt-5 max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                          İstiqamətlər
                        </p>

                        <div className="space-y-2">
                          {course.children?.map((child) => (
                            <Link
                              key={child}
                              href="/kurslar"
                              className="
                                flex cursor-pointer
                                items-center gap-3
                                rounded-lg
                                px-2 py-2
                                text-sm text-gray-700
                                transition-all duration-200
                                hover:translate-x-1
                                hover:bg-gray-50
                                hover:text-gray-950
                              "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                              {child}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aşağı hissə */}
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    {course.hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className="
                          flex w-full
                          cursor-pointer
                          items-center
                          justify-between
                          text-sm font-medium
                          text-gray-950
                        "
                      >
                        <span>
                          {isOpen
                            ? "İstiqamətləri gizlət"
                            : "İstiqamətlərə bax"}
                        </span>

                        <span
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ↓
                        </span>
                      </button>
                    ) : (
                      <Link
                        href="/kurslar"
                        className="
                          flex
                          cursor-pointer
                          items-center
                          justify-between
                          text-sm font-medium
                          text-gray-950
                        "
                      >
                        <span>Ətraflı məlumat</span>

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CourseSection