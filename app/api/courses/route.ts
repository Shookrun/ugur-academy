
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

type CourseRecord = Record<string, unknown> & {
  id: string
  title: string
  slug: string
  technologies: string[]
}

function normalizeTechnologies(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

function normalizeCourse(value: unknown): CourseRecord {
  const course =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {}

  return {
    ...course,
    id: String(course.id ?? ""),
    title: String(course.title ?? ""),
    slug: String(course.slug ?? ""),
    technologies: normalizeTechnologies(course.technologies),
  }
}

const initialCourses: CourseRecord[] = coursesData.map((course) =>
  normalizeCourse({
    id: String(course.id),
    title: course.title,
    subtitle: course.subtitle || course.description,
    description: course.description,
    category: course.category,
    duration: course.duration,
    price: course.price,
    discountPrice: course.discountPrice || "",
    image: course.image || "/hero.jpeg",
    slug: course.slug,
    technologies: [],
    buttonText:
      course.slug === "komputer" || course.slug === "tibb"
        ? "İstiqamətlərə bax"
        : "Ətraflı məlumat",
    neonColor:
      course.slug === "komputer"
        ? "#f43f5e"
        : course.slug === "tibb"
          ? "#e11d48"
          : course.slug === "psixoloq-xidmeti"
            ? "#06b6d4"
            : course.slug === "loqoped-xidmeti"
              ? "#a855f7"
              : course.slug === "baytarliq"
                ? "#10b981"
                : course.slug === "mektebeqeder-ve-ibtidai"
                  ? "#f59e0b"
                  : "#3b82f6",
    glowGradient:
      course.slug === "komputer"
        ? "rgba(244, 63, 94, 0.85)"
        : course.slug === "tibb"
          ? "rgba(225, 29, 72, 0.85)"
          : course.slug === "psixoloq-xidmeti"
            ? "rgba(6, 182, 212, 0.85)"
            : course.slug === "loqoped-xidmeti"
              ? "rgba(168, 85, 247, 0.85)"
              : course.slug === "baytarliq"
                ? "rgba(16, 185, 129, 0.85)"
                : course.slug === "mektebeqeder-ve-ibtidai"
                  ? "rgba(245, 158, 11, 0.85)"
                  : "rgba(59, 130, 246, 0.85)",
    iconType:
      course.slug === "komputer"
        ? "code"
        : course.slug === "tibb"
          ? "pulse"
          : course.slug === "psixoloq-xidmeti"
            ? "brain"
            : course.slug === "loqoped-xidmeti"
              ? "voice"
              : course.slug === "baytarliq"
                ? "vet"
                : course.slug === "mektebeqeder-ve-ibtidai"
                  ? "star"
                  : "award",
  }),
)

async function readCourses(): Promise<CourseRecord[]> {
  const stored = await getCollection(COLLECTION_KEY)

  if (Array.isArray(stored)) {
    return stored.map(normalizeCourse)
  }

  let seed: CourseRecord[] = initialCourses

  try {
    const parsed: unknown = JSON.parse(
      await fs.readFile(seedFilePath, "utf-8"),
    )

    if (Array.isArray(parsed) && parsed.length > 0) {
      seed = parsed.map(normalizeCourse)
    }
  } catch {}

  await setCollection(COLLECTION_KEY, seed)

  return seed
}

async function writeCourses(data: CourseRecord[]): Promise<void> {
  await setCollection(COLLECTION_KEY, data)
}

function revalidateCoursePages(): void {
  revalidatePath("/admin/kurslar")
  revalidatePath("/kurslar")
  revalidatePath("/courses")
  revalidatePath("/")
}

function noCacheHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  }
}

export async function GET() {
  try {
    const courses = await readCourses()

    return NextResponse.json(courses, {
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("GET /api/courses error:", error)

    return NextResponse.json(
      { error: "Failed to read courses" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 },
      )
    }

    const input = body as Record<string, unknown>
    const courses = await readCourses()
    const timestamp = String(Date.now())

    const newCourse = normalizeCourse({
      ...input,
      id: input.id ? String(input.id).trim() : timestamp,
      slug: input.slug ? String(input.slug).trim() : timestamp,
      technologies: normalizeTechnologies(input.technologies),
      neonColor: input.neonColor || "#0ea5e9",
      glowGradient: input.glowGradient || "rgba(14, 165, 233, 0.8)",
      iconType: input.iconType || "star",
      buttonText: input.buttonText || "Ətraflı məlumat",
    })

    if (!newCourse.title.trim() || !newCourse.slug.trim()) {
      return NextResponse.json(
        { error: "Course title and slug are required" },
        { status: 400 },
      )
    }

    if (courses.some((course) => course.id === newCourse.id)) {
      return NextResponse.json(
        { error: "Course ID already exists" },
        { status: 409 },
      )
    }

    courses.push(newCourse)
    await writeCourses(courses)
    revalidateCoursePages()

    return NextResponse.json(newCourse, {
      status: 201,
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("POST /api/courses error:", error)

    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: unknown = await req.json()

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 },
      )
    }

    const input = body as Record<string, unknown>

    if (input.id === undefined || input.id === null || !String(input.id).trim()) {
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 },
      )
    }

    const targetId = String(input.id).trim()
    const courses = await readCourses()
    const index = courses.findIndex((course) => course.id === targetId)

    if (index === -1) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 },
      )
    }

    const existingCourse = courses[index]
    const updatedCourse = normalizeCourse({
      ...existingCourse,
      ...input,
      id: targetId,
      technologies:
        input.technologies === undefined
          ? existingCourse.technologies
          : normalizeTechnologies(input.technologies),
    })

    if (!updatedCourse.title.trim() || !updatedCourse.slug.trim()) {
      return NextResponse.json(
        { error: "Course title and slug are required" },
        { status: 400 },
      )
    }

    const duplicateSlug = courses.some(
      (course, courseIndex) =>
        courseIndex !== index && course.slug === updatedCourse.slug,
    )

    if (duplicateSlug) {
      return NextResponse.json(
        { error: "Course slug already exists" },
        { status: 409 },
      )
    }

    courses[index] = updatedCourse
    await writeCourses(courses)
    revalidateCoursePages()

    return NextResponse.json(updatedCourse, {
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("PUT /api/courses error:", error)

    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "ID required" },
        { status: 400 },
      )
    }

    const cleanId = id.trim()
    const courses = await readCourses()
    const filteredCourses = courses.filter(
      (course) => course.id !== cleanId,
    )

    if (filteredCourses.length === courses.length) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 },
      )
    }

    await writeCourses(filteredCourses)
    revalidateCoursePages()

    return NextResponse.json(
      { success: true },
      { headers: noCacheHeaders() },
    )
  } catch (error) {
    console.error("DELETE /api/courses error:", error)

    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    )
  }
}
