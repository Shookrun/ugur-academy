import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getCollection, setCollection } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "reviews"
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" }

type Review = {
  id: string
  name: string
  title: string
  description: string
  youtubeUrl: string
  videoId: string
  isActive: boolean
  order: number
  createdAt: string
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE })
}

async function isAdmin() {
  return Boolean(await auth())
}

async function readReviews(): Promise<Review[]> {
  const reviews = await getCollection<Review>(COLLECTION_KEY)
  return Array.isArray(reviews) ? reviews : []
}

function getYouTubeVideoId(value: string): string | null {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()
    let videoId = ""

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? ""
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? ""
      } else {
        const parts = url.pathname.split("/").filter(Boolean)
        if (["embed", "shorts", "live"].includes(parts[0] ?? "")) videoId = parts[1] ?? ""
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null
  } catch {
    return null
  }
}

function parseReview(body: unknown, current?: Review): Review | null {
  if (!body || typeof body !== "object") return null
  const value = body as Record<string, unknown>
  const name = typeof value.name === "string" ? value.name.trim() : ""
  const title = typeof value.title === "string" ? value.title.trim() : ""
  const description = typeof value.description === "string" ? value.description.trim() : ""
  const youtubeUrl = typeof value.youtubeUrl === "string" ? value.youtubeUrl.trim() : ""
  const videoId = getYouTubeVideoId(youtubeUrl)

  if (!name || !title || !videoId) return null

  const requestedOrder = Number(value.order)

  return {
    id: current?.id ?? (typeof value.id === "string" && value.id.trim() ? value.id.trim() : crypto.randomUUID()),
    name: name.slice(0, 120),
    title: title.slice(0, 160),
    description: description.slice(0, 1000),
    youtubeUrl,
    videoId,
    isActive: typeof value.isActive === "boolean" ? value.isActive : current?.isActive ?? true,
    order: Number.isFinite(requestedOrder) ? Math.max(0, Math.trunc(requestedOrder)) : current?.order ?? 0,
    createdAt: current?.createdAt ?? new Date().toISOString(),
  }
}

function revalidateReviews() {
  revalidatePath("/reyler")
  revalidatePath("/")
  revalidatePath("/admin/reyler")
}

export async function GET() {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const reviews = await readReviews()
    return NextResponse.json(
      reviews.sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt)),
      { headers: NO_STORE }
    )
  } catch (error) {
    console.error("GET /api/reviews/manage error:", error)
    return jsonError("Rəyləri yükləmək mümkün olmadı.", 500)
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const item = parseReview(await request.json().catch(() => null))
    if (!item) return jsonError("Ad, başlıq və düzgün YouTube linki tələb olunur.", 400)

    const reviews = await readReviews()
    reviews.push(item)
    await setCollection(COLLECTION_KEY, reviews)
    revalidateReviews()

    return NextResponse.json(item, { status: 201, headers: NO_STORE })
  } catch (error) {
    console.error("POST /api/reviews/manage error:", error)
    return jsonError("Rəy əlavə edilərkən xəta baş verdi.", 500)
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const body: unknown = await request.json().catch(() => null)
    if (!body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string") {
      return jsonError("Rəy ID-si tələb olunur.", 400)
    }

    const reviews = await readReviews()
    const index = reviews.findIndex((review) => review.id === body.id)
    if (index < 0) return jsonError("Rəy tapılmadı.", 404)

    const item = parseReview(body, reviews[index])
    if (!item) return jsonError("Ad, başlıq və düzgün YouTube linki tələb olunur.", 400)

    reviews[index] = item
    await setCollection(COLLECTION_KEY, reviews)
    revalidateReviews()

    return NextResponse.json(item, { headers: NO_STORE })
  } catch (error) {
    console.error("PUT /api/reviews/manage error:", error)
    return jsonError("Rəy yenilənərkən xəta baş verdi.", 500)
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const id = new URL(request.url).searchParams.get("id")?.trim()
    if (!id) return jsonError("Rəy ID-si tələb olunur.", 400)

    const reviews = await readReviews()
    const updated = reviews.filter((review) => review.id !== id)
    if (updated.length === reviews.length) return jsonError("Rəy tapılmadı.", 404)

    await setCollection(COLLECTION_KEY, updated)
    revalidateReviews()

    return NextResponse.json({ success: true }, { headers: NO_STORE })
  } catch (error) {
    console.error("DELETE /api/reviews/manage error:", error)
    return jsonError("Rəy silinərkən xəta baş verdi.", 500)
  }
}
