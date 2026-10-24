import { readSeeded } from "@/lib/collection"

export type Campaign = {
  id: string
  slug: string
  title: string
  excerpt: string
  description: string
  image: string
  deadline: string // YYYY-MM-DD, boşdursa müddətsiz
  tags: string[]
  active: boolean
}

export const CAMPAIGNS_KEY = "campaigns"

export const initialCampaigns: Campaign[] = [
  {
    id: "1",
    slug: "aile-endirimi",
    title: "Ailə endirimi",
    excerpt:
      "Bacı-qardaş birlikdə öyrəndikdə həm daha çox həvəslənir, həm də bir-birinə dəstək olur.",
    description:
      "Bacı-qardaş birlikdə öyrəndikdə həm daha çox həvəslənir, həm də bir-birinə dəstək olur.\n\nİki və daha çox övlad eyni vaxtda qeydiyyatdan keçdikdə xüsusi endirim tətbiq olunur. Ətraflı məlumat üçün bizimlə əlaqə saxlayın.",
    image: "",
    deadline: "2026-12-31",
    tags: ["Ailə", "Endirim"],
    active: true,
  },
]

export async function readCampaigns(): Promise<Campaign[]> {
  const data = await readSeeded(
    CAMPAIGNS_KEY,
    "dynamic_campaigns.json",
    initialCampaigns
  )
  return Array.isArray(data) ? (data as Campaign[]) : initialCampaigns
}

export function slugify(text: string): string {
  const map: Record<string, string> = {
    ə: "e", Ə: "e", ı: "i", İ: "i", ö: "o", Ö: "o",
    ü: "u", Ü: "u", ç: "c", Ç: "c", ş: "s", Ş: "s",
    ğ: "g", Ğ: "g",
  }

  return (
    text
      .split("")
      .map((char) => map[char] ?? char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "kampaniya"
  )
}

export function isExpired(deadline: string): boolean {
  if (!deadline) return false
  const end = new Date(`${deadline}T23:59:59`)
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now()
}

export function formatDate(deadline: string): string {
  const [year, month, day] = deadline.split("-")
  return year && month && day ? `${day}.${month}.${year}` : deadline
}

export function sortCampaigns(list: Campaign[]): Campaign[] {
  return [...list].sort((a, b) => {
    const aExpired = isExpired(a.deadline)
    const bExpired = isExpired(b.deadline)
    if (aExpired !== bExpired) return aExpired ? 1 : -1
    if (!a.deadline && !b.deadline) return 0
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return a.deadline.localeCompare(b.deadline)
  })
}
