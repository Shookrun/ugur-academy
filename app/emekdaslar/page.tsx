import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { partnersData } from "@/data/partners"

export const metadata: Metadata = {
  title: "Əməkdaşlarımız və Müəllim Heyəti | Uğur Şəxsi İnkişaf Mərkəzi",
  description: "Uğur Şəxsi İnkişaf Mərkəzinin peşəkar əməkdaşları və təlimçiləri ilə tanış olun.",
}

export default function PartnersCatalogPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 sm:pt-32">
      <div className="mx-auto max-w-[1840px] px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-slate-950" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Komandamız
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Dəyərli Əməkdaşlarımız
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Hər biri öz sahəsində illərin təcrübəsinə malik, tələbələrimizin inkişafına ürəkdən dəstək olan peşəkar komandamız.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partnersData.map((partner, idx) => (
            <article
              key={partner.id}
              className="group relative flex flex-col overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-slate-900 backdrop-blur-md shadow">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                  ★ {partner.rating}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {partner.department}
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-950 transition">
                  {partner.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {partner.position}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {partner.bio}
                </p>

                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                    <span>Təcrübə: {partner.experienceYears} il</span>
                    <span>{partner.studentsCount}+ Tələbə</span>
                  </div>

                  <Link
                    href={`/emekdaslar/${partner.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <span>Profilə və Detallara Bax</span>
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
