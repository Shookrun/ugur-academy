import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "RFO | Respublika Fənn Olimpiadaları Mərkəzi",
  description:
    "Şirvan Regional Respublika Fənn Olimpiadaları Mərkəzi (RFO). Olimpiadalara peşəkar hazırlıq, fənn tədrisi və inkişaf proqramları.",
}

const subjects = [
  { name: "Riyaziyyat", icon: "📐", desc: "Məntiqi təfəkkür, olimpiada tipli məsələlər və dərin analiz" },
  { name: "Fizika", icon: "⚡", desc: "Nəzəriyyə, eksperimental təcrübələr və qabaqcıl fizika qanunları" },
  { name: "Kimya", icon: "🧪", desc: "Maddələrin quruluşu, laboratoriya tədqiqatları və kimyəvi reaksiyalar" },
  { name: "Biologiya", icon: "🧬", desc: "Genetika, anatomiya, ekologiya və müasir bioloji tədqiqatlar" },
  { name: "İnformatika", icon: "💻", desc: "Alqoritmlər, C++, proqramlaşdırma və olimpiada tapşırıqları" },
  { name: "Azərbaycan dili", icon: "📚", desc: "Qrammatika, dil qaydaları, mətn üzərində analitik iş" },
]

export default function RfoPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-24 sm:pt-36">
      {/* Background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-32 h-[350px] w-[350px] rounded-full bg-sky-100/50 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Əsas
          </Link>
          <span>/</span>
          <span className="text-blue-600">RFO</span>
        </div>

        {/* Hero Section */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-4 py-1.5 text-xs font-bold text-blue-700 backdrop-blur-sm">
              <span>🏆</span>
              <span>Respublika Fənn Olimpiadaları Mərkəzi</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              <span className="text-blue-600">RFO</span> Mərkəzi
            </h1>

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Respublika və beynəlxalq fənn olimpiadalarına ən yüksək səviyyədə
              hazırlıq! Təcrübəli müəllim heyəti, xüsusi metodika və qalibiyyət
              hədəfi ilə istedadlı şagirdlərin yanındayıq.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+994706703020"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_15px_30px_rgba(37,99,235,0.45)]"
              >
                📞 Şirvan: 070 670 30 20
              </a>
              <a
                href="tel:+994706713020"
                className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                📞 Hacıqabul: 070 671 30 20
              </a>
            </div>
          </div>

          {/* RFO Visual Showcase */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white/90 p-8 shadow-[0_20px_60px_rgba(30,120,255,0.12)] backdrop-blur-md">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-sky-50/50" />
              <Image
                src="/rfo-logo.png"
                alt="RFO"
                width={800}
                height={560}
                priority
                className="relative z-10 w-full h-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="mt-24">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Olimpiada Fənləri
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Hansı fənlər üzrə hazırlıq aparılır?
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Hər fənn üzrə xüsusi proqramlar, test bazası və olimpiada mərhələlərinə uyğun sınaqlar təşkil olunur.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subj) => (
              <div
                key={subj.name}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(30,120,255,0.1)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {subj.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-950">{subj.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{subj.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Contact Info */}
        <div className="mt-24 overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-12 text-white sm:px-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Qeydiyyat və Məlumat
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Olimpiada hazırlığına qoşulun!
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                Övladınızın istedadını kəşf edin və Respublika səviyyəsində nailiyyətlərə imza atın. Ətraflı məlumat üçün filiallarımızla əlaqə saxlayın:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <a
                href="tel:+994706703020"
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 hover:shadow-lg"
              >
                <span>🏛 Şirvan:</span>
                <span className="text-blue-400 font-extrabold">070 670 30 20</span>
              </a>

              <a
                href="tel:+994706713020"
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 hover:shadow-lg"
              >
                <span>🏙️ Hacıqabul:</span>
                <span className="text-blue-400 font-extrabold">070 671 30 20</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
