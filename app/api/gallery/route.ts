import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { readSeeded } from "@/lib/collection"
import { setCollection } from "@/lib/db"
import { galleryItems } from "@/data/gallery"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "gallery"
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" }

type GalleryItem = {
  id: string
  src: string
  alt: string
  title: string
  category: string
  date: string
  featured?: boolean
}

const initialGallery: GalleryItem[] = galleryItems.map((g) => ({
  id: String(g.id),
  src: g.src,
  alt: g.alt,
  title: g.title,
  category: g.category,
  date: g.date,
  featured: Boolean(g.featured),
}))

async function readGallery(): Promise<GalleryItem[]> {
  const data = await readSeeded(COLLECTION_KEY, "dynamic_gallery.json", initialGallery)
  return Array.isArray(data) ? (data as GalleryItem[]) : initialGallery
}

async function writeGallery(data: GalleryItem[]): Promise<void> {
  await setCollection(COLLECTION_KEY, data)
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE })
}

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return Boolean(session)
}

function revalidateAll() {
  try {
    revalidatePath("/admin/qalereya")
    revalidatePath("/galereya")
    revalidatePath("/")
  } catch {}
}

function parseItem(body: unknown): GalleryItem | null {
  if (!body || typeof body !== "object") return null
  const b = body as Record<string, unknown>

  const title = typeof b.title === "string" ? b.title.trim() : ""
  const src = typeof b.src === "string" ? b.src.trim() : ""
  const category = typeof b.category === "string" ? b.category.trim() : ""

  if (!title || !src || !category) return null

  return {
    id: b.id ? String(b.id).trim() : String(Date.now()),
    title,
    src,
    category,
    alt: typeof b.alt === "string" && b.alt.trim() ? b.alt.trim() : title,
    date: typeof b.date === "string" && b.date.trim() ? b.date.trim() : "2026",
    featured: Boolean(b.featured),
  }
}

export async function GET() {
  try {
    const gallery = await readGallery()
    return NextResponse.json(gallery, { headers: NO_STORE })
  } catch (error) {
    console.error("GET /api/gallery error:", error)
    return jsonError("Qalereyanı oxumaq mümkün olmadı.", 500)
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const item = parseItem(await req.json().catch(() => null))
    if (!item) return jsonError("Başlıq, şəkil yolu və kateqoriya tələb olunur.", 400)

    const gallery = await readGallery()
    gallery.push(item)
    await writeGallery(gallery)
    revalidateAll()

    return NextResponse.json(item, { status: 201, headers: NO_STORE })
  } catch (error) {
    console.error("POST /api/gallery error:", error)
    return jsonError("Şəkil əlavə edilərkən xəta baş verdi.", 500)
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const item = parseItem(await req.json().catch(() => null))
    if (!item) return jsonError("Başlıq, şəkil yolu və kateqoriya tələb olunur.", 400)

    const gallery = await readGallery()
    const index = gallery.findIndex((g) => String(g.id).trim() === item.id)
    if (index === -1) return jsonError("Şəkil tapılmadı.", 404)

    gallery[index] = { ...gallery[index], ...item }
    await writeGallery(gallery)
    revalidateAll()

    return NextResponse.json(gallery[index], { headers: NO_STORE })
  } catch (error) {
    console.error("PUT /api/gallery error:", error)
    return jsonError("Şəkil yenilənərkən xəta baş verdi.", 500)
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return jsonError("İcazə yoxdur.", 401)

  try {
    const id = new URL(req.url).searchParams.get("id")?.trim()
    if (!id) return jsonError("ID tələb olunur.", 400)

    const gallery = await readGallery()
    const updated = gallery.filter((g) => String(g.id).trim() !== id)

    if (updated.length === gallery.length) return jsonError("Şəkil tapılmadı.", 404)

    await writeGallery(updated)
    revalidateAll()

    return NextResponse.json({ success: true }, { headers: NO_STORE })
  } catch (error) {
    console.error("DELETE /api/gallery error:", error)
    return jsonError("Şəkil silinərkən xəta baş verdi.", 500)
  }
}
