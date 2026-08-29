import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { coursesData, getCourseBySlug, getAllCourseSlugs } from "@/data/courses"
import CourseSyllabusAccordion from "@/components/courses/CourseSyllabusAccordion"
import CourseEnrollmentForm from "@/components/courses/CourseEnrollmentForm"
import CourseFaqAccordion from "@/components/courses/CourseFaqAccordion"
import CourseQuickStats from "@/components/courses/CourseQuickStats"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllCourseSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return {
      title: "Kurs tapılmadı | Uğur Şəxsi İnkişaf Mərkəzi",
      description: "Axtardığınız kurs mövcud deyil.",
    }
  }

  return {
    title: `${course.title} Kursu - ${course.subtitle} | Uğur Şəxsi İnkişaf Mərkəzi`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const relatedCourses = coursesData.filter((c) => c.slug !== course.slug).slice(0, 3)

  return (
    <div className="relative min-h-screen pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-[1840px] px-6 sm:px-8 lg:px-10">
        {/* ===================================================
            BREADCRUMBS
        ==================================================== */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <Link href="/" className="transition hover:text-slate-900">
            Əsas səhifə
          </Link>
          <span>/</span>
          <Link href="/kurslar" className="transition hover:text-slate-900">
            Kurslarımız
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{course.title}</span>
        </nav>

        {/* ===================================================
            HERO / TOP HEADER SECTION
        ==================================================== */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
          <div>
            {/* Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-slate-950 px-3.5 py-1 text-xs font-semibold tracking-wide text-white">
                {course.category}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                ★ 4.9 (120+ Rəy)
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
                {course.certificate}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>
            <p className="mt-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              {course.subtitle}
            </p>

            {/* Sub-Tracks / Children Tags */}
            {course.hasChildren && course.children && (
              <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-sm sm:p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Bu istiqamətə daxil olan alt proqramlar:
                </p>
                <div className="flex flex-wrap gap-2">
                  {course.children.map((child) => (
                    <span
                      key={child}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                      {child}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick stats cards */}
            <div className="mt-8">
              <CourseQuickStats course={course} />
            </div>

            {/* Overview / Full Description */}
            <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Kurs haqqında ümumi məlumat
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                {course.fullDescription}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ===================================================
                WHAT YOU WILL LEARN
            ==================================================== */}
            <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tədris Nəticələri
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Bu kursda nələri öyrənəcəksiniz?
              </h2>

              <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-100/80"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="text-sm font-medium leading-relaxed text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===================================================
                SYLLABUS / MODULES
            ==================================================== */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-slate-950" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tədris Planı
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    Modul strukturu və mövzular
                  </h2>
                </div>
                <span className="hidden rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-600 sm:inline-block">
                  {course.syllabus.length} Modul
                </span>
              </div>

              <CourseSyllabusAccordion syllabus={course.syllabus} />
            </div>

            {/* ===================================================
                CAREER & REQUIREMENTS
            ==================================================== */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {/* Career Opportunities */}
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  💼 Karyera və İş İmkanları
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Kursu bitirdikdən sonra işləyə biləcəyiniz sahələr:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {course.careerOpportunities.map((op, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                      <span>{op}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  📋 İlkin Tələblər
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Kursa qoşulmaq üçün lazım olan meyarlar:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ===================================================
                INSTRUCTOR CARD
            ==================================================== */}
            <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Təlimçi
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Kursun rəhbəri və aparıcı mütəxəssisi
              </h2>

              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-950 sm:text-xl">
                    {course.instructor.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 sm:text-sm">
                    {course.instructor.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {course.instructor.bio}
                  </p>

                  <Link
                    href={`/emekdaslar/${course.instructor.slug}`}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-950 transition hover:underline"
                  >
                    <span>Mütəxəssisin tam profilinə bax</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ===================================================
                FAQ
            ==================================================== */}
            <div className="mt-10">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-slate-950" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Suallar & Cavablar
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Tez-tez verilən suallar
                </h2>
              </div>

              <CourseFaqAccordion faqList={course.faq} />
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDEBAR: ENROLLMENT FORM & PRICING
          ==================================================== */}
          <div className="sticky top-24 space-y-6">
            {/* Price badge card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Aylıq ödəniş
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-950">
                      {course.discountPrice || course.price}
                    </span>
                    {course.discountPrice && (
                      <span className="text-sm font-medium text-slate-400 line-through">
                        {course.price}
                      </span>
                    )}
                  </div>
                </div>

                {course.discountPrice && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
                    Xüsusi Təklif
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Dərs cədvəli:</span>
                  <span className="font-semibold text-slate-900">Həftədə 2-3 dəfə</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Öyrənmə zəmanəti:</span>
                  <span className="font-semibold text-slate-900">100% Praktiki</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sertifikat:</span>
                  <span className="font-semibold text-slate-900">Rəsmi verilir</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <CourseEnrollmentForm courseTitle={course.title} />

            {/* Help Callout */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-center backdrop-blur-sm">
              <p className="text-xs text-slate-500">
                Sualınız var və ya birbaşa danışmaq istəyirsiniz?
              </p>
              <a
                href="tel:+994500000000"
                className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition hover:underline"
              >
                <span>📞 +994 50 000 00 00</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================
            RELATED COURSES
        ==================================================== */}
        <div className="mt-24 border-t border-slate-200/80 pt-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tövsiyə olunanlar
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Digər kurslarımız
              </h2>
            </div>
            <Link
              href="/kurslar"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:underline sm:text-sm"
            >
              Bütün kurslar →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCourses.map((rc) => (
              <Link
                key={rc.id}
                href={`/kurslar/${rc.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>{rc.category}</span>
                  <span>{rc.duration}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900 transition">
                  {rc.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm line-clamp-2">
                  {rc.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-900">
                  <span>{rc.discountPrice || rc.price}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    Ətraflı →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
