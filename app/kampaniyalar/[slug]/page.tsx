import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate, isExpired, readCampaigns } from "@/lib/campaigns"

export const dynamic = "force-dynamic"
export const revalidate = 0

type PageProps = {
  params: Promise<{ slug: string }>
}

async function findCampaign(slug: string) {
  const all = await readCampaigns()
  return all.find((c) => c.slug === slug && c.active)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const campaign = await findCampaign(slug)

  if (!campaign) return { title: "Kampaniya tapılmadı" }

  return {
    title: `${campaign.title} — Kampaniyalar`,
    description: campaign.excerpt || campaign.title,
  }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params
  const campaign = await findCampaign(slug)

  if (!campaign) notFound()

  const expired = isExpired(campaign.deadline)

  return (
    <main className="min-h-screen bg-[#fbfcff] pb-20 pt-32 text-[#101e3d] sm:pt-40">
      <article className="mx-auto w-full max-w-[860px] px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-[#78859a]">
          <Link href="/" className="hover:text-[#101e3d]">
            Ana Səhifə
          </Link>
          <span className="mx-2">›</span>
          <Link href="/kampaniyalar" className="hover:text-[#101e3d]">
            Kampaniyalar
          </Link>
          <span className="mx-2">›</span>
          <span className="font-semibold text-[#243451]">{campaign.title}</span>
        </nav>

        <h1 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {campaign.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {campaign.deadline && (
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold text-white ${
                expired ? "bg-slate-700" : "bg-[#d5a32d]"
              }`}
            >
              {expired
                ? "Müddəti bitib"
                : `Son tarix ${formatDate(campaign.deadline)}`}
            </span>
          )}
          {campaign.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f1f5fb] px-2.5 py-1 text-xs font-semibold text-[#4a5a78]"
            >
              {tag}
            </span>
          ))}
        </div>

        {campaign.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-[#e5eaf1] bg-[#e6eff8] shadow-[0_18px_45px_rgba(16,30,61,0.1)]">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              priority
              unoptimized={campaign.image.startsWith("http")}
              sizes="(max-width: 900px) 100vw, 860px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8 whitespace-pre-line text-base leading-8 text-[#3b4a66] sm:text-lg">
          {campaign.description || campaign.excerpt}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {!expired && (
            <a
              href="https://wa.me/994706703020"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#243b63] to-[#101e3d] px-6 text-sm font-bold text-white shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c99520] focus-visible:ring-offset-2 sm:text-base"
            >
              WhatsApp ilə müraciət et →
            </a>
          )}
          <Link
            href="/kampaniyalar"
            className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-[#172746] bg-white px-6 text-sm font-bold text-[#172746] transition hover:-translate-y-0.5 sm:text-base"
          >
            ← Bütün kampaniyalar
          </Link>
        </div>
      </article>
    </main>
  )
}
