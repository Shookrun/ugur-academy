import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import { coursesData } from "@/data/courses"
import { getCollection, setCollection } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "courses"
const seedFilePath = path.join(process.cwd(), "data", "dynamic_courses.json")

// Seed array with the exact 7 academy courses
const initialCourses = coursesData.map((c) => ({
  id: String(c.id),
  title: c.title,
  subtitle: c.subtitle || c.description,
  description: c.description,
  category: c.category,
  duration: c.duration,
  price: c.price,
  discountPrice: c.discountPrice || "",
  image: c.image || "/hero.jpeg",
  slug: c.slug,
  buttonText: c.slug === "komputer" || c.slug === "tibb" ? "İstiqamətlərə bax" : "Ətraflı məlumat",
  neonColor:
    c.slug === "komputer"
      ? "#f43f5e"
      : c.slug === "tibb"
      ? "#e11d48"
      : c.slug === "psixoloq-xidmeti"
      ? "#06b6d4"
      : c.slug === "loqoped-xidmeti"
      ? "#a855f7"
      : c.slug === "baytarliq"
      ? "#10b981"
      : c.slug === "mektebeqeder-ve-ibtidai"
      ? "#f59e0b"
      : "#3b82f6",
  glowGradient:
    c.slug === "komputer"
      ? "rgba(244, 63, 94, 0.85)"
      : c.slug === "tibb"
      ? "rgba(225, 29, 72, 0.85)"
      : c.slug === "psixoloq-xidmeti"
      ? "rgba(6, 182, 212, 0.85)"
      : c.slug === "loqoped-xidmeti"
      ? "rgba(168, 85, 247, 0.85)"
      : c.slug === "baytarliq"
      ? "rgba(16, 185, 129, 0.85)"
      : c.slug === "mektebeqeder-ve-ibtidai"
      ? "rgba(245, 158, 11, 0.85)"
      : "rgba(59, 130, 246, 0.85)",
  iconType:
    c.slug === "komputer"
      ? "code"
      : c.slug === "tibb"
      ? "pulse"
      : c.slug === "psixoloq-xidmeti"
      ? "brain"
      : c.slug === "loqoped-xidmeti"
      ? "voice"
      : c.slug === "baytarliq"
      ? "vet"
      : c.slug === "mektebeqeder-ve-ibtidai"
      ? "star"
      : "award",
}))

async function readCourses(): Promise<any[]> {
  const stored = await getCollection(COLLECTION_KEY)
  if (stored) return stored

  // First run: seed Neon from the committed JSON file, else from the built-in defaults.
  let seed: any[] = initialCourses
  try {
    const parsed = JSON.parse(await fs.readFile(seedFilePath, "utf-8"))
    if (Array.isArray(parsed) && parsed.length > 0) seed = parsed
  } catch {}
  await setCollection(COLLECTION_KEY, seed)
  return seed
}

async function writeCourses(data: any[]): Promise<void> {
  await setCollection(COLLECTION_KEY, data)
}

export async function GET() {
  try {
    const courses = await readCourses()
    return NextResponse.json(courses, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("GET /api/courses error:", error)
    return NextResponse.json({ error: "Failed to read courses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const courses = await readCourses()
    const newCourse = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
      slug: body.slug ? String(body.slug).trim() : String(Date.now()),
      neonColor: body.neonColor || "#0ea5e9",
      glowGradient: body.glowGradient || "rgba(14, 165, 233, 0.8)",
      iconType: body.iconType || "star",
      buttonText: body.buttonText || "Ətraflı məlumat",
    }
    courses.push(newCourse)
    await writeCourses(courses)

    try {
      revalidatePath("/admin/kurslar")
      revalidatePath("/kurslar")
      revalidatePath("/courses")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(newCourse, { 
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("POST /api/courses error:", error)
    return NextResponse.json({ error: "Failed to add course" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const courses = await readCourses()
    const targetId = String(body.id).trim()
    const index = courses.findIndex((c: any) => String(c.id).trim() === targetId)
    if (index === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    courses[index] = { ...courses[index], ...body, id: targetId }
    await writeCourses(courses)

    try {
      revalidatePath("/admin/kurslar")
      revalidatePath("/kurslar")
      revalidatePath("/courses")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(courses[index], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("PUT /api/courses error:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    const cleanId = String(id).trim()
    let courses = await readCourses()
    courses = courses.filter((c: any) => String(c.id).trim() !== cleanId)
    await writeCourses(courses)

    try {
      revalidatePath("/admin/kurslar")
      revalidatePath("/kurslar")
      revalidatePath("/courses")
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("DELETE /api/courses error:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}

