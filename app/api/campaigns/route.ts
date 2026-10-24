import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { setCollection } from "@/lib/db"
import {
  CAMPAIGNS_KEY,
  readCampaigns,
  slugify,
  type Campaign,
} from "@/lib/campaigns"

export const dynamic = "force-dynamic"
export const revalidate = 0

const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" }

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE })
}

async function isAdmin() {
  const session = await auth()
  return Boolean(session)
}

function revalidateAll() {
  try {
    revalidatePath("/kampaniyalar")
    revalidatePath("/admin/kampaniyalar")
    revalidatePath("/")
  } catch {}
}

function parseCampaign(body: unknown): Omit<Campaign, "slug"> | null {
  if (!body || typeof body !== "object") return null
  const b = body as Record<string, unknown>

  const title = typeof b.title === "string" ? b.title.trim() : ""
  if (!title) return null

  const tags = Array.isArray(b.tags)
    ? b.tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8)
    : []

  const deadline =
    typeof b.deadline === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.deadline)
      ? b.deadline
      : ""

  return {
    id: b.id ? String(b.id).trim() : String(Date.now()),
    title: title.slice(0, 160),
    excerpt: typeof b.excerpt === "string" ? b.excerpt.trim().slice(0, 300) : "",
    description:
      typeof b.description === "string" ? b.description.trim().slice(0, 8000) : "",
    image: typeof b.image === "string" ? b.image.trim() : "",
    deadline,
    tags,
    active: b.active !== false,
  }
}

function uniqueSlug(base: string, list: Campaign[], ignoreId?: string) {
  let slug = base
  let n = 2
  while (list.some((c) => c.slug === slug && c.id !== ignoreId)) {
    slug = `${base}-${n++}`
  }
  return slug
}

export async function GET() {
  try {
    return NextResponse.json(await readCampaigns(), { headers: NO_STORE })
  } catch (error) {
    console.error("GET /api/campaigns error:", error)
    return jsonError("Kampaniyaları oxumaq mümkün olmadı.", 500)
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const data = parseCampaign(await req.json().catch(() => null))
    if (!data) return jsonError("Kampaniya başlığı tələb olunur.", 400)

    const list = await readCampaigns()
    const item: Campaign = {
      ...data,
      id: String(Date.now()),
      slug: uniqueSlug(slugify(data.title), list),
    }

    await setCollection(CAMPAIGNS_KEY, [...list, item])
    revalidateAll()

    return NextResponse.json(item, { status: 201, headers: NO_STORE })
  } catch (error) {
    console.error("POST /api/campaigns error:", error)
    return jsonError("Kampaniya əlavə edilərkən xəta baş verdi.", 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const data = parseCampaign(await req.json().catch(() => null))
    if (!data) return jsonError("Kampaniya başlığı tələb olunur.", 400)

    const list = await readCampaigns()
    const index = list.findIndex((c) => c.id === data.id)
    if (index === -1) return jsonError("Kampaniya tapılmadı.", 404)

    // Slug dəyişmir ki, köhnə linklər işləməyə davam etsin
    list[index] = { ...list[index], ...data, slug: list[index].slug }

    await setCollection(CAMPAIGNS_KEY, list)
    revalidateAll()

    return NextResponse.json(list[index], { headers: NO_STORE })
  } catch (error) {
    console.error("PUT /api/campaigns error:", error)
    return jsonError("Kampaniya yenilənərkən xəta baş verdi.", 500)
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const id = new URL(req.url).searchParams.get("id")?.trim()
    if (!id) return jsonError("ID tələb olunur.", 400)

    const list = await readCampaigns()
    const updated = list.filter((c) => c.id !== id)
    if (updated.length === list.length) return jsonError("Kampaniya tapılmadı.", 404)

    await setCollection(CAMPAIGNS_KEY, updated)
    revalidateAll()

    return NextResponse.json({ success: true }, { headers: NO_STORE })
  } catch (error) {
    console.error("DELETE /api/campaigns error:", error)
    return jsonError("Kampaniya silinərkən xəta baş verdi.", 500)
  }
}
