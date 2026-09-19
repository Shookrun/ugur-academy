import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { partnersData, getPartnerBySlug, getAllPartnerSlugs, type Partner } from "@/data/partners"
import PartnerContactForm from "@/components/partners/PartnerContactForm"
import fs from "fs/promises"
import path from "path"
import os from "os"

interface Props {
  params: Promise<{ slug: string }>
}

function formatPartnerData(p: any): Partner {
  return {
    id: typeof p.id === "number" ? p.id : Number(p.id) || 999,
    slug: p.slug,
    name: p.name,
    position: p.position,
    department: p.department || "Uğur Şəxsi İnkişaf Mərkəzi",
    specialty: p.specialty || "",
    isTeacher: p.isTeacher !== undefined ? p.isTeacher : Boolean(p.specialty && p.specialty.trim() !== ""),
    logo: p.logo || "/Mehman Bayramov.jpg",
    experienceYears: Number(p.experienceYears) || 1,
    studentsCount: Number(p.studentsCount) || 0,
    coursesCount: Number(p.coursesCount) || (Array.isArray(p.taughtCourses) ? p.taughtCourses.length : 0),
    rating: Number(p.rating) || 5.0,
    bio: p.bio || "Uğur Şəxsi İnkişaf Mərkəzinin əməkdaşı.",
    detailedAbout: p.detailedAbout || p.bio || "Mütəxəssisimiz haqqında ətraflı məlumat tezliklə təqdim ediləcək.",
    motto: p.motto || "Uğura gedən yolda birlikdə!",
    email: p.email || "info@ugur.az",
    phone: p.phone || "+994 50 000 00 00",
    skills: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : (p.specialty ? [p.specialty] : ["Peşəkar yanaşma"]),
    education: Array.isArray(p.education) ? p.education : [],
    experience: Array.isArray(p.experience) ? p.experience : [],
    certificates: Array.isArray(p.certificates) ? p.certificates : [],
    taughtCourses: Array.isArray(p.taughtCourses) ? p.taughtCourses : [],
    consultationTopics: Array.isArray(p.consultationTopics) ? p.consultationTopics : [],
  }
}

async function findLivePartner(slug: string): Promise<Partner | undefined> {
  // 1. In-memory
  const mem = (globalThis as any).__partnersMemoryStore
  if (Array.isArray(mem) && mem.length > 0) {
    const found = mem.find((p: any) => p.slug === slug || String(p.id) === slug)
    if (found) return formatPartnerData(found)
  }

  // 2. /tmp
  try {
    const tmp = await fs.readFile(path.join(os.tmpdir(), "dynamic_partners.json"), "utf-8")
    const list = JSON.parse(tmp)
    const found = list.find((p: any) => p.slug === slug || String(p.id) === slug)
    if (found) return formatPartnerData(found)
  } catch {}

  // 3. local dynamic_partners.json
  try {
    const local = await fs.readFile(path.join(process.cwd(), "data", "dynamic_partners.json"), "utf-8")
    const list = JSON.parse(local)
    const found = list.find((p: any) => p.slug === slug || String(p.id) === slug)
    if (found) return formatPartnerData(found)
  } catch {}

  // 4. static fallback
  const staticP = getPartnerBySlug(slug)
  if (staticP) return formatPartnerData(staticP)

  return undefined
}

export async function generateStaticParams() {
  const slugs = getAllPartnerSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const partner = await findLivePartner(slug)

  if (!partner) {
    return {
      title: "Əməkdaş tapılmadı | Uğur Şəxsi İnkişaf Mərkəzi",
      description: "Axtardığınız əməkdaş profili mövcud deyil.",
    }
  }

  return {
    title: `${partner.name} - ${partner.position} | Uğur Şəxsi İnkişaf Mərkəzi`,
    description: `${partner.name}: ${partner.bio}`,
  }
}

export default async function PartnerDetailPage({ params }: Props) {
  const { slug } = await params
  const partner = await findLivePartner(slug)

  if (!partner) {
    notFound()
  }

  const otherPartners = partnersData.filter((p) => p.slug !== partner.slug).slice(0, 3)

  return (
    <div className="relative min-h-screen pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-[1840px] px-6 sm:px-8 lg:px-10">
        {/* ===================================================
            BREADCRUMB
        ==================================================== */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <Link href="/" className="transition hover:text-slate-900">
            Əsas səhifə
          </Link>
          <span>/</span>
          <Link href="/emekdaslar" className="transition hover:text-slate-900">
            Əməkdaşlarımız
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{partner.name}</span>
        </nav>

        {/* ===================================================
            PROFILE HERO BANNER
        ==================================================== */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur-md sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14 lg:items-center">
            {/* Portrait Image */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-3xl border border-slate-200 shadow-md lg:mx-0 lg:max-w-none">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
                  Uğur Şəxsi İnkişaf Mərkəzi
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-bold text-slate-950 backdrop-blur-md">
                  ★ {partner.rating}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {partner.department}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800">
                  ✓ Rəsmi Mütəxəssis
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {partner.name}
              </h1>

              <p className="mt-2 text-base font-semibold text-slate-700 sm:text-lg">
                {partner.position}
                {partner.specialty ? ` • ${partner.specialty}` : ""}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                {partner.bio}
              </p>

              {/* Motto quote */}
              {partner.motto && (
                <div className="mt-6 border-l-2 border-slate-900 bg-slate-50 py-3 pl-4 pr-4 rounded-r-xl italic text-xs text-slate-700 sm:text-sm">
                  &ldquo;{partner.motto}&rdquo;
                </div>
              )}

              {/* Stats row */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50/80 p-3.5 text-center">
                  <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    {partner.experienceYears}+
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    İl Təcrübə
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3.5 text-center">
                  <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    {partner.studentsCount}+
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Tələbə Sayı
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3.5 text-center">
                  <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    {partner.taughtCourses.length}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Tədris Sahəsi
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/80 p-3.5 text-center">
                  <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    {partner.rating} / 5.0
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Müştəri Rəyi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            DETAILED SECTIONS & SIDEBAR
        ==================================================== */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div className="space-y-10">
            {/* Detailed About */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tərcümeyi-hal
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                Peşəkar fəaliyyət və yanaşma
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                {partner.detailedAbout}
              </p>
            </div>

            {/* Skills & Expertise */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Bacarıqlar
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                İxtisaslaşdığı əsas sahələr
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {partner.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Career & Education Timeline */}
            {(partner.experience.length > 0 || partner.education.length > 0) && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-slate-950" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Təcrübə & Təhsil
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Karyera və Təhsil Xronologiyası
                </h2>

                <div className="mt-6 space-y-6">
                  {partner.experience.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        İş Təcrübəsi
                      </h3>
                      <div className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4">
                        {partner.experience.map((exp, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-950" />
                            <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                            <p className="text-xs font-semibold text-slate-700">
                              {exp.organization} • {exp.period}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {partner.education.length > 0 && (
                    <div className={partner.experience.length > 0 ? "border-t border-slate-100 pt-6" : ""}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Ali Təhsil
                      </h3>
                      <div className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4">
                        {partner.education.map((edu, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-950" />
                            <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                            <p className="text-xs font-semibold text-slate-600">
                              {edu.institution} ({edu.year})
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Taught Courses */}
            {partner.taughtCourses.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-slate-950" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tədris
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  Rəhbərlik etdiyi kurs və xidmət proqramları
                </h2>

                <div className="mt-5 space-y-3">
                  {partner.taughtCourses.map((tc) => (
                    <Link
                      key={tc.slug}
                      href={`/kurslar/${tc.slug}`}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-300 hover:border-slate-950 hover:bg-white hover:shadow-md"
                    >
                      <div>
                        <h4 className="text-base font-bold text-slate-950 transition">
                          {tc.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {tc.description}
                        </p>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all duration-300 group-hover:bg-slate-950 group-hover:text-white">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              RIGHT SIDEBAR: CONSULTATION FORM & CERTIFICATES
          ==================================================== */}
          <div className="sticky top-24 space-y-6">
            {/* Booking Form */}
            <PartnerContactForm partnerName={partner.name} />

            {/* Certificates Card */}
            {partner.certificates.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  📜 Sertifikatlar və Nailiyyətlər
                </h3>
                <ul className="mt-3.5 space-y-2.5">
                  {partner.certificates.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm">
                      <span className="mt-0.5 text-slate-900 font-bold">★</span>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Consultation Topics */}
            {partner.consultationTopics.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  💡 Fərdi Məsləhət Mövzuları
                </h3>
                <ul className="mt-3.5 space-y-2 text-xs text-slate-600 sm:text-sm">
                  {partner.consultationTopics.map((top, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{top}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            OTHER TEAM MEMBERS
        ==================================================== */}
        <div className="mt-24 border-t border-slate-200/80 pt-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-slate-950" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Komandamız
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Digər əməkdaşlarımız
              </h2>
            </div>
            <Link
              href="/emekdaslar"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:underline sm:text-sm"
            >
              Bütün əməkdaşlar →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPartners.map((op) => (
              <Link
                key={op.id}
                href={`/emekdaslar/${op.slug}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                  <Image
                    src={op.logo}
                    alt={op.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {op.department}
                  </span>
                  <h3 className="text-base font-bold text-slate-950 transition">
                    {op.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{op.position}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
