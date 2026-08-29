"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const courseSlugMap: Record<number, string> = {
  1: "komputer",
  2: "tibb",
  3: "psixoloq-xidmeti",
  4: "loqoped-xidmeti",
  5: "baytarliq",
  6: "mektebeqeder-ve-ibtidai",
  7: "miq",
}

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
    <section className="relative overflow-hidden bg-transparent px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-20
          h-[500px]
          w-[500px]
          rounded-full
          bg-gray-100/60
          blur-[120px]
          animate-course-glow
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
          h-[450px]
          w-[450px]
          rounded-full
          bg-gray-100/50
          blur-[120px]
          animate-course-glow-reverse
        "
      />

      <div className="relative z-10 mx-auto max-w-[1840px]">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-end">

          <div
            className="
              animate-course-header
            "
          >
            {/* Label */}

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-gray-950" />

              <span className="text-sm font-medium tracking-wide text-gray-500">
                Kurslarımız
              </span>
            </div>

            {/* Title */}

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-gray-950 sm:text-5xl lg:text-6xl">
              Öyrənmək üçün
              <br />

              <span className="relative text-gray-400">
                doğru istiqaməti seç.

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-[2px]
                    w-full
                    origin-left
                    scale-x-0
                    rounded-full
                    bg-gray-300
                    animate-course-title-line
                  "
                />
              </span>
            </h2>
          </div>

          {/* Description */}

          <p
            className="
              max-w-md
              text-sm
              leading-7
              text-gray-500
              sm:text-base
              animate-course-description
            "
          >
            Müxtəlif sahələr üzrə hazırladığımız təhsil və xidmət
            proqramlarından sənə uyğun olanı seç və inkişafına başla.
          </p>
        </div>

        {/* ===================================================
            COURSE GRID
        ==================================================== */}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course, index) => {
            const isOpen = openCourse === course.id

            return (
              <article
                key={course.id}
                className="
                  course-card
                  group
                  relative
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-gray-200/80
                  bg-white/90
                  shadow-sm
                  backdrop-blur-sm
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-gray-300
                  hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)]
                "
                style={{
                  animationDelay: `${250 + index * 100}ms`,
                }}
              >

                {/* =================================================
                    IMAGE
                ================================================== */}

                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">

                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1280px) 50vw,
                      25vw
                    "
                    loading="lazy"
                    className="
                      object-cover
                      transition-transform
                      duration-[1000ms]
                      ease-out
                      group-hover:scale-110
                    "
                  />

                  {/* Dark overlay */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/20
                      via-transparent
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* Number */}

                  <div
                    className="
                      absolute
                      left-5
                      top-5
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/40
                      bg-white/90
                      text-xs
                      font-semibold
                      text-gray-900
                      shadow-lg
                      backdrop-blur-md
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:bg-gray-950
                      group-hover:text-white
                    "
                  >
                    {String(course.id).padStart(2, "0")}
                  </div>

                  {/* Top right dot */}

                  <span
                    className="
                      absolute
                      right-6
                      top-6
                      h-2
                      w-2
                      rounded-full
                     
                      opacity-70
                      shadow
                      transition-transform
                      duration-500
                      group-hover:scale-150
                    "
                  />

                  {/* Image corner */}

                  <span
                    className="
                      absolute
                      bottom-5
                      right-5
                      h-8
                      w-8
                      border-b
                      border-r
                      border-white/70
                      opacity-0
                      transition-all
                      duration-500
                      group-hover:opacity-100
                    "
                  />
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-xl font-semibold tracking-[-0.025em] text-gray-950 sm:text-[22px]">
                      {course.title}
                    </h3>

                    {/* CHILD BUTTON */}

                    {course.hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        aria-label={`${course.title} alt istiqamətləri`}
                        aria-expanded={isOpen}
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          cursor-pointer
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-200
                          text-gray-900
                          transition-all
                          duration-300
                          hover:border-gray-950
                          hover:bg-gray-950
                          hover:text-white
                          active:scale-90
                        "
                      >
                        <svg
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
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
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-200
                          text-gray-500
                          transition-all
                          duration-300
                          group-hover:border-gray-950
                          group-hover:bg-gray-950
                          group-hover:text-white
                        "
                      >
                        →
                      </span>
                    )}
                  </div>

                  {/* Description */}

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {course.description}
                  </p>

                  {/* =================================================
                      CHILDREN
                  ================================================== */}

                  {course.hasChildren && (
                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        isOpen
                          ? "mt-5 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">

                        <div className="border-t border-gray-100 pt-4">

                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            İstiqamətlər
                          </p>

                          <div className="space-y-1.5">
                            {course.children?.map((child) => (
                              <Link
                                key={child}
                                href={`/kurslar/${courseSlugMap[course.id]}`}
                                className="
                                  group/child
                                  flex
                                  items-center
                                  gap-3
                                  rounded-xl
                                  px-2
                                  py-2.5
                                  text-sm
                                  text-gray-700
                                  transition-all
                                  duration-200
                                  hover:translate-x-1
                                  hover:bg-gray-50
                                  hover:text-gray-950
                                "
                              >
                                <span
                                  className="
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full
                                    bg-gray-300
                                    transition-colors
                                    duration-200
                                    group-hover/child:bg-gray-950
                                  "
                                />

                                {child}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      FOOTER
                  ================================================== */}

                  <div className="mt-6 border-t border-gray-100 pt-5">

                    {course.hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className="
                          flex
                          w-full
                          cursor-pointer
                          items-center
                          justify-between
                          text-sm
                          font-medium
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
                            isOpen
                              ? "rotate-180"
                              : "group-hover:translate-x-1"
                          }`}
                        >
                          →
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={`/kurslar/${courseSlugMap[course.id]}`}
                        className="
                          flex
                          items-center
                          justify-between
                          text-sm
                          font-medium
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

                {/* Hover line */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-gray-950
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </article>
            )
          })}
        </div>

        {/* ===================================================
            BOTTOM
        ==================================================== */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            pt-6
            animate-course-bottom
          "
        >
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-gray-300">
            Təhsil • İnkişaf • Gələcək
          </span>

          <Link
            href="/kurslar"
            className="
              group
              flex
              items-center
              gap-2
              text-xs
              font-medium
              text-gray-500
              transition-colors
              hover:text-gray-950
            "
          >
            Bütün kurslar

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CourseSection