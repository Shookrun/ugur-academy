import { coursesData, type Course } from "@/data/courses"
import { getCollection } from "@/lib/db"

// Fields editable from the admin panel; everything else on the detail page comes from data/courses.ts.
const ADMIN_FIELDS = ["title", "subtitle", "category", "description", "duration", "price", "discountPrice", "image"] as const

export async function getLiveCourses(): Promise<any[]> {
  try {
    const stored = await getCollection("courses")
    return stored && stored.length > 0 ? stored : coursesData
  } catch {
    return coursesData
  }
}

function mergeCourse(base: Course | undefined, live: any): Course {
  const merged: any = base
    ? { ...base }
    : {
        id: Number(live.id) || 0,
        slug: String(live.slug),
        fullDescription: live.description || "",
        lessonsCount: 0,
        level: "Bütün səviyyələr",
        format: "Əyani və Onlayn",
        language: "Azərbaycan dili",
        certificate: "Sertifikat verilir",
        hasChildren: false,
        tags: [],
        whatYouWillLearn: [],
        requirements: [],
        targetAudience: [],
        careerOpportunities: [],
        syllabus: [],
        instructor: null,
        faq: [],
      }

  for (const field of ADMIN_FIELDS) {
    if (live[field] !== undefined) merged[field] = live[field]
  }
  if (!merged.price) merged.price = ""
  if (live.discountPrice === "") merged.discountPrice = undefined
  return merged as Course
}

export async function getMergedCourseBySlug(slug: string): Promise<Course | undefined> {
  const live = (await getLiveCourses()).find((c: any) => c.slug === slug)
  if (!live) return undefined
  return mergeCourse(coursesData.find((c) => c.slug === slug), live)
}

export async function getMergedCourses(): Promise<Course[]> {
  const live = await getLiveCourses()
  return live.map((l: any) => mergeCourse(coursesData.find((c) => c.slug === l.slug), l))
}
