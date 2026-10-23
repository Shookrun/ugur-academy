
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readSeeded } from "@/lib/collection"
import { setCollection } from "@/lib/db"
import { galleryItems } from "@/data/gallery"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "gallery-categories"
const GALLERY_KEY = "gallery"

type GalleryItem = {
  id: string
  src: string
  alt: string
  title: string
  category: string
  date: string
  featured?: boolean
}

const defaultCategories = Array.from(
  new Set([
    "Dərslər",
    "Mərasimlər",
    "Seminarlar",
    "Komanda",
    "Hadisələr",
    "Mentorluq",
    ...galleryItems.map((item) => item.category).filter(Boolean),
  ])
)

const initialGallery: GalleryItem[] = galleryItems.map((item) => ({
  id: String(item.id),
  src: item.src,
  alt: item.alt,
  title: item.title,
  category: item.category,
  date: item.date,
  featured: Boolean(item.featured),
}))

async function readCategories(): Promise<string[]> {
  const categories = await readSeeded(
    COLLECTION_KEY,
    "dynamic_gallery_categories.json",
    defaultCategories
  )

  return Array.isArray(categories)
    ? categories.filter(
        (category): category is string =>
          typeof category === "string" && category.trim().length > 0
      )
    : defaultCategories
}

async function readGallery(): Promise<GalleryItem[]> {
  const gallery = await readSeeded(
    GALLERY_KEY,
    "dynamic_gallery.json",
    initialGallery
  )

  return Array.isArray(gallery) ? gallery : initialGallery
}

function revalidateGalleryPaths() {
  revalidatePath("/admin/qalereya")
  revalidatePath("/galereya")
  revalidatePath("/")
}

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  )
}

export async function GET() {
  try {
    const categories = await readCategories()

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("GET /api/gallery/categories error:", error)

    return jsonError("Kateqoriyaları yükləmək mümkün olmadı.", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json().catch(() => null)

    if (!body || typeof body !== "object" || !("name" in body)) {
      return jsonError("Kateqoriya adı tələb olunur.", 400)
    }

    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (!name) {
      return jsonError("Kateqoriya adı boş ola bilməz.", 400)
    }

    if (name.length > 60) {
      return jsonError("Kateqoriya adı maksimum 60 simvol ola bilər.", 400)
    }

    const categories = await readCategories()

    const existing = categories.find(
      (category) =>
        category.toLocaleLowerCase("az") === name.toLocaleLowerCase("az")
    )

    if (existing) {
      return NextResponse.json(
        {
          error: "Bu kateqoriya artıq mövcuddur.",
          category: existing,
        },
        { status: 409 }
      )
    }

    const updatedCategories = [...categories, name]

    await setCollection(COLLECTION_KEY, updatedCategories)

    revalidateGalleryPaths()

    return NextResponse.json(
      {
        success: true,
        category: name,
        categories: updatedCategories,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("POST /api/gallery/categories error:", error)

    return jsonError("Kateqoriya yaradılarkən xəta baş verdi.", 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body: unknown = await req.json().catch(() => null)

    if (!body || typeof body !== "object" || !("name" in body)) {
      return jsonError("Silinəcək kateqoriya adı tələb olunur.", 400)
    }

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const moveTo = "moveTo" in body && typeof body.moveTo === "string"
      ? body.moveTo.trim()
      : ""

    if (!name) {
      return jsonError("Kateqoriya adı boş ola bilməz.", 400)
    }

    const categories = await readCategories()

    const existing = categories.find(
      (category) =>
        category.toLocaleLowerCase("az") === name.toLocaleLowerCase("az")
    )

    if (!existing) {
      return jsonError("Kateqoriya tapılmadı.", 404)
    }

    const gallery = await readGallery()

    const affectedItems = gallery.filter(
      (item) => item.category === existing
    )

    if (affectedItems.length > 0) {
      if (!moveTo) {
        return jsonError(
          "Bu kateqoriyada şəkillər var. Əvvəlcə onların köçürüləcəyi kateqoriyanı seçin.",
          400
        )
      }

      const targetCategory = categories.find(
        (category) =>
          category.toLocaleLowerCase("az") === moveTo.toLocaleLowerCase("az")
      )

      if (!targetCategory) {
        return jsonError("Köçürüləcək kateqoriya tapılmadı.", 400)
      }

      if (targetCategory === existing) {
        return jsonError(
          "Şəkilləri silinən kateqoriyanın özünə köçürmək olmaz.",
          400
        )
      }

      const updatedGallery = gallery.map((item) =>
        item.category === existing
          ? { ...item, category: targetCategory }
          : item
      )

      await setCollection(GALLERY_KEY, updatedGallery)
    }

    const updatedCategories = categories.filter(
      (category) => category !== existing
    )

    await setCollection(COLLECTION_KEY, updatedCategories)

    revalidateGalleryPaths()

    return NextResponse.json(
      {
        success: true,
        deletedCategory: existing,
        movedImages: affectedItems.length,
        categories: updatedCategories,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("DELETE /api/gallery/categories error:", error)

    return jsonError("Kateqoriya silinərkən xəta baş verdi.", 500)
  }
}
