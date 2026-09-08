import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { coursesData } from "@/data/courses"

const dataFilePath = path.join(process.cwd(), "data", "dynamic_courses.json")

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

async function readCourses() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(initialCourses, null, 2), "utf-8")
    return initialCourses
  }
}

async function writeCourses(data: unknown[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const courses = await readCourses()
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read courses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const courses = await readCourses()
    const newCourse = {
      ...body,
      id: body.id || String(Date.now()),
      slug: body.slug || String(Date.now()),
      neonColor: body.neonColor || "#0ea5e9",
      glowGradient: body.glowGradient || "rgba(14, 165, 233, 0.8)",
      iconType: body.iconType || "star",
      buttonText: body.buttonText || "Ətraflı məlumat",
    }
    courses.push(newCourse)
    await writeCourses(courses)
    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add course" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const courses = await readCourses()
    const index = courses.findIndex((c: { id: string }) => String(c.id) === String(body.id))
    if (index === -1) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    courses[index] = { ...courses[index], ...body }
    await writeCourses(courses)
    return NextResponse.json(courses[index])
  } catch (error) {
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
    let courses = await readCourses()
    courses = courses.filter((c: { id: string }) => String(c.id) !== String(id))
    await writeCourses(courses)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
