
import { NextRequest, NextResponse } from "next/server"
import { readSeeded } from "@/lib/collection"
import { setCollection } from "@/lib/db"
import { galleryItems } from "@/data/gallery"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "gallery-categories"

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

async function readCategories(): Promise<string[]> {
  return readSeeded(
    COLLECTION_KEY,
    "dynamic_gallery_categories.json",
    defaultCategories
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

    return NextResponse.json(
      { error: "Kateqoriyaları yükləmək mümkün olmadı." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name =
      typeof body.name === "string" ? body.name.trim() : ""

    if (!name) {
      return NextResponse.json(
        { error: "Kateqoriya adı boş ola bilməz." },
        { status: 400 }
      )
    }

    if (name.length > 60) {
      return NextResponse.json(
        { error: "Kateqoriya adı maksimum 60 simvol ola bilər." },
        { status: 400 }
      )
    }

    const categories = await readCategories()

    const existing = categories.find(
      (category) => category.toLocaleLowerCase("az") === name.toLocaleLowerCase("az")
    )

    if (existing) {
      return NextResponse.json(
        { error: "Bu kateqoriya artıq mövcuddur.", category: existing },
        { status: 409 }
      )
    }

    const updatedCategories = [...categories, name]

    await setCollection(COLLECTION_KEY, updatedCategories)

    return NextResponse.json(
      { success: true, category: name, categories: updatedCategories },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("POST /api/gallery/categories error:", error)

    return NextResponse.json(
      { error: "Kateqoriya yaradılarkən xəta baş verdi." },
      { status: 500 }
    )
  }
}
