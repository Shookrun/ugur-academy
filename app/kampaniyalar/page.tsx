import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  formatDate,
  isExpired,
  readCampaigns,
  sortCampaigns,
} from "@/lib/campaigns"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Kampaniyalar — Xüsusi Təkliflər",
  description:
    "Uğur Şəxsi İnkişaf Mərkəzinin aktual endirimləri, kampaniyaları və xüsusi təklifləri.",
}

export default async function CampaignsPage() {
  const all = await readCampaigns()
  const campaigns = sortCampaigns(all.filter((c) => c.active))

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfcff] pb-20 pt-32 text-[#101e3d] sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#dceeff]/70 blur-[85px] sm:h-[420px] sm:w-[420px]" />
        <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-[#f9edce]/65 blur-[85px] sm:h-[420px] sm:w-[420px]" />
      </div>

      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-sm text-[#78859a]">
          <Link href="/" className="hover:text-[#101e3d]">
            Ana Səhifə
          </Link>
          <span className="mx-2">›</span>
          <span className="font-semibold text-[#243451]">Kampaniyalar</span>
        </nav>

        <header className="mt-5">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Kampaniyalar
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[#65738c] sm:text-lg">
            Xüsusi təkliflər və endirim kampaniyaları ilə tanış olun
          </p>
        </header>

        {campaigns.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-[#d9e0ea] bg-white p-12 text-center text-[#78859a]">
            Hazırda aktiv kampaniya yoxdur. Tezliklə yeni təkliflər əlavə olunacaq.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const expired = isExpired(campaign.deadline)

              return (
                <Link
                  key={campaign.id}
                  href={`/kampaniyalar/${campaign.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#e5eaf1] bg-white shadow-[0_8px_30px_rgba(16,30,61,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(16,30,61,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c99520]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#dceeff] to-[#f9edce]">
                    {campaign.image ? (
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        fill
                        unoptimized={campaign.image.startsWith("http")}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-5xl">
                        🎁
                      </span>
                    )}

                    {campaign.deadline && (
                      <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-md ${
                          expired
                            ? "bg-slate-800/85 text-white"
                            : "bg-[#d5a32d] text-white"
                        }`}
                      >
                        {expired
                          ? "Müddəti bitib"
                          : `Son tarix ${formatDate(campaign.deadline)}`}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-extrabold leading-snug text-[#132344]">
                      {campaign.title}
                    </h2>

                    {campaign.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#65738c]">
                        {campaign.excerpt}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#c99520]">
                      Daha çox oxu
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>

                    {campaign.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eef1f6] pt-4">
                        {campaign.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f1f5fb] px-2.5 py-1 text-[11px] font-semibold text-[#4a5a78]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
