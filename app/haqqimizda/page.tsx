import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Haqqımızda | Uğur Şəxsi İnkişaf Mərkəzi",
  description:
    "Uğur Şəxsi İnkişaf Mərkəzi haqqında — missiyamız, dəyərlərimiz, komandamız və tarixçəmiz.",
}

const stats = [
  { value: "10+", label: "Aktiv Kurs" },
  { value: "1000+", label: "Məzun Tələbə" },
  { value: "5+", label: "İl Təcrübə" },
  { value: "2", label: "Filial" },
]

const values = [
  {
    icon: "🎯",
    title: "Keyfiyyətli Təhsil",
    desc: "Hər kursumuz müasir standartlara uyğun hazırlanmış, praktik biliklər üzərindədir.",
  },
  {
    icon: "🤝",
    title: "Fərdi Yanaşma",
    desc: "Hər tələbəyə fərdi diqqət ayırır, güclü tərəflərini inkişaf etdiririk.",
  },
  {
    icon: "🚀",
    title: "İnkişaf Ruhiyəsi",
    desc: "Daim öyrənmək, böyümək və irəliləmək bizim əsas dəyərimizdir.",
  },
  {
    icon: "🌟",
    title: "Uğura Dəstək",
    desc: "Tələbələrimizin uğuru bizim uğurumuzdur — bitirdikdən sonra da yanlarındayıq.",
  },
]

const teamMembers = [
  { name: "Aynur Ələkbərova", role: "Kurikulum Direktoru", image: "/Aynur Ələkbərova.jpg" },
  { name: "Fidan Məmmədli", role: "Tədris Koordinatoru", image: "/Fidan Məmmədli.jpg" },
  { name: "Gülnaz Cəfərova", role: "Psixoloq", image: "/Gülnaz Cəfərova.jpg" },
  { name: "Günay Məmmədova", role: "Metodist", image: "/Günay Məmmədova.jpg" },
  { name: "Könül Əsədova", role: "İT Müəllim", image: "/Könül Əsədova.jpg" },
  { name: "Mehman Bayramov", role: "Proqramlaşdırma Müəllimi", image: "/Mehman Bayramov.jpg" },
  { name: "Səkinə Babayeva", role: "Riyaziyyat Müəllimi", image: "/Səkinə Babayeva.jpg" },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-24 sm:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">

        {/* ─── Hero Section ─── */}
        <div className="mb-20 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-950" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Haqqımızda
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Uğura gedən yol
              <br />
              <span className="text-slate-400">buradan başlayır.</span>
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-500 sm:text-lg">
              Uğur Şəxsi İnkişaf Mərkəzi 2019-cu ildən bəri Hacıqabul və Şirvan şəhərlərindəki
              tələbələrə müasir, keyfiyyətli və əlçatan təhsil imkanı təqdim edir.
              Məqsədimiz — hər bir tələbənin potensialını üzə çıxarmaq və onları
              gələcəyə hazırlamaqdır.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kurslar"
                className="
                  group inline-flex items-center gap-3 rounded-full
                  bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white
                  transition-all duration-300 hover:-translate-y-0.5
                  hover:bg-slate-800 hover:shadow-xl
                "
              >
                Kurslara bax
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/elaqe"
                className="
                  group inline-flex items-center gap-3 rounded-full
                  border border-slate-200 bg-white/60 px-6 py-3.5
                  text-sm font-semibold text-slate-900 backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-0.5
                  hover:border-slate-400 hover:bg-white hover:shadow-lg
                "
              >
                Əlaqə saxla ↗
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  group flex flex-col items-center justify-center
                  rounded-[2rem] border border-slate-100
                  bg-white/80 p-8 shadow-sm backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                "
              >
                <span className="text-4xl font-extrabold tracking-tight text-slate-950 transition-transform duration-300 group-hover:-translate-y-1 sm:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs font-medium text-slate-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Mission ─── */}
        <div className="mb-20 overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-14 sm:px-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Missiyamız
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              &ldquo;Hər bir tələbə layiqli təhsil almaq hüququna malikdir.&rdquo;
            </h2>
            <p className="mt-6 text-base leading-8 text-white/60">
              Biz müasir bilik, texnologiya və humanist yanaşmanı birləşdirərək
              tələbələrimizə həm akademik, həm də şəxsi inkişaf üçün lazım olan
              bütün alətləri veririk. Hər gün daha yaxşı olmağa çalışırıq.
            </p>
          </div>
        </div>

        {/* ─── Values ─── */}
        <div className="mb-20">
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-slate-950" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dəyərlərimiz
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val) => (
              <div
                key={val.title}
                className="
                  group rounded-[2rem] border border-slate-100
                  bg-white/80 p-7 shadow-sm backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                "
              >
                <div className="mb-4 text-3xl">{val.icon}</div>
                <h3 className="mb-2 text-base font-bold text-slate-950">
                  {val.title}
                </h3>
                <p className="text-sm leading-6 text-slate-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Team ─── */}
        <div>
          <div className="mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-slate-950" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Komandamız
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="
                  group flex flex-col items-center overflow-hidden
                  rounded-[2rem] border border-slate-100
                  bg-white/80 p-6 shadow-sm backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                "
              >
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-slate-100 shadow-md">
                  <Image
                    src={member.image}
                    fill
                    alt={member.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                </div>
                <p className="text-center text-sm font-bold text-slate-950">
                  {member.name}
                </p>
                <p className="mt-1 text-center text-xs text-slate-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
