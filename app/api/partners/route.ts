
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readSeeded } from "@/lib/collection"
import { setCollection } from "@/lib/db"
import { partnersData } from "@/data/partners"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "partners"

type Partner = {
  id: string
  slug?: string
  name: string
  position: string
  department: string
  specialty: string
  isTeacher: boolean
  logo: string
  experienceYears: number
  studentsCount: number
  bio: string
  email: string
  phone: string
  order: number
  [key: string]: unknown
}

const initialPartners: Partner[] = partnersData.map((p, index) => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  position: p.position,
  department: p.department,
  specialty: p.specialty || "",
  isTeacher:
    p.isTeacher !== undefined
      ? Boolean(p.isTeacher)
      : Boolean(p.specialty?.trim()),
  logo: p.logo || "/Mehman Bayramov.jpg",
  experienceYears: Number(p.experienceYears) || 0,
  studentsCount: Number(p.studentsCount) || 0,
  bio: p.bio || "",
  email: p.email || "",
  phone: p.phone || "",
  order: index + 1,
}))

function slugify(text: string): string {
  if (!text || typeof text !== "string") {
    return String(Date.now())
  }

  const azMap: Record<string, string> = {
    ə: "e",
    Ə: "e",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ü: "u",
    Ü: "u",
    ğ: "g",
    Ğ: "g",
    ç: "c",
    Ç: "c",
    ş: "s",
    Ş: "s",
  }

  return text
    .split("")
    .map((char) => azMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function sortPartners(partners: Partner[]): Partner[] {
  return partners
    .map((partner, index) => ({
      ...partner,
      order:
        Number.isFinite(Number(partner.order)) &&
        Number(partner.order) > 0
          ? Math.floor(Number(partner.order))
          : index + 1,
    }))
    .sort((a, b) => a.order - b.order)
}

async function readPartners(): Promise<Partner[]> {
  const data = await readSeeded(
    COLLECTION_KEY,
    "dynamic_partners.json",
    initialPartners,
  )

  if (!Array.isArray(data)) {
    return [...initialPartners]
  }

  return sortPartners(data as Partner[])
}

async function writePartners(data: Partner[]): Promise<void> {
  await setCollection(COLLECTION_KEY, sortPartners(data))
}

function revalidatePartnerPages(): void {
  revalidatePath("/admin/partnyorlar")
  revalidatePath("/emekdaslar")
  revalidatePath("/emekdaslar/[slug]", "page")
  revalidatePath("/haqqimizda")
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
    const partners = await readPartners()

    return NextResponse.json(partners, {
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("GET /api/partners error:", error)

    return NextResponse.json(
      { error: "Əməkdaşları oxumaq mümkün olmadı." },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Əməkdaşın ad və soyadı qeyd olunmalıdır." },
        { status: 400 },
      )
    }

    const partners = await readPartners()
    const generatedSlug = slugify(body.name)
    let finalSlug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : generatedSlug

    if (partners.some((partner) => partner.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
    }

    const isTeacher = Boolean(body.isTeacher)
    const requestedOrder = Number(body.order)
    const order =
      Number.isInteger(requestedOrder) && requestedOrder > 0
        ? requestedOrder
        : Math.max(0, ...partners.map((partner) => partner.order)) + 1

    const newPartner: Partner = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
      slug: finalSlug,
      name: body.name.trim(),
      position:
        typeof body.position === "string" ? body.position.trim() : "",
      department:
        typeof body.department === "string" && body.department.trim()
          ? body.department.trim()
          : "Tədris Şöbəsi",
      isTeacher,
      specialty: isTeacher ? String(body.specialty || "").trim() : "",
      logo:
        typeof body.logo === "string" && body.logo.trim()
          ? body.logo.trim()
          : "/Mehman Bayramov.jpg",
      experienceYears: Math.max(0, Number(body.experienceYears) || 0),
      studentsCount: isTeacher
        ? Math.max(0, Number(body.studentsCount) || 0)
        : 0,
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      bio: String(body.bio || "").trim(),
      order,
    }

    partners.push(newPartner)
    await writePartners(partners)
    revalidatePartnerPages()

    return NextResponse.json(newPartner, {
      status: 201,
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("POST /api/partners error:", error)

    return NextResponse.json(
      { error: "Əməkdaş əlavə edilərkən server xətası baş verdi." },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body || (!body.id && !body.slug && !body.name)) {
      return NextResponse.json(
        { error: "Yenilənmə üçün məlumat tapılmadı." },
        { status: 400 },
      )
    }

    const partners = await readPartners()
    const targetId =
      body.id !== undefined && body.id !== null
        ? String(body.id).trim()
        : ""

    let index = targetId
      ? partners.findIndex(
          (partner) => String(partner.id).trim() === targetId,
        )
      : -1

    if (index === -1 && body.slug) {
      index = partners.findIndex((partner) => partner.slug === body.slug)
    }

    if (index === -1 && body.name) {
      index = partners.findIndex(
        (partner) =>
          partner.name.trim().toLowerCase() ===
          String(body.name).trim().toLowerCase(),
      )
    }

    if (index === -1) {
      return NextResponse.json(
        { error: "Əməkdaş tapılmadı." },
        { status: 404 },
      )
    }

    const current = partners[index]
    const requestedOrder = Number(body.order)
    const order =
      body.order !== undefined &&
      Number.isInteger(requestedOrder) &&
      requestedOrder > 0
        ? requestedOrder
        : current.order

    const isTeacher =
      body.isTeacher !== undefined
        ? Boolean(body.isTeacher)
        : current.isTeacher

    const updatedPartner: Partner = {
      ...current,
      ...body,
      id: String(current.id),
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : current.slug || slugify(String(body.name || current.name)),
      name:
        body.name !== undefined
          ? String(body.name).trim()
          : current.name,
      position:
        body.position !== undefined
          ? String(body.position).trim()
          : current.position,
      department:
        body.department !== undefined
          ? String(body.department).trim() || "Tədris Şöbəsi"
          : current.department || "Tədris Şöbəsi",
      isTeacher,
      specialty: isTeacher
        ? body.specialty !== undefined
          ? String(body.specialty).trim()
          : current.specialty || ""
        : "",
      experienceYears: Math.max(
        0,
        Number(body.experienceYears ?? current.experienceYears) || 0,
      ),
      studentsCount: isTeacher
        ? Math.max(
            0,
            Number(body.studentsCount ?? current.studentsCount) || 0,
          )
        : 0,
      logo:
        typeof body.logo === "string" && body.logo.trim()
          ? body.logo.trim()
          : current.logo || "/Mehman Bayramov.jpg",
      email:
        body.email !== undefined
          ? String(body.email).trim()
          : current.email || "",
      phone:
        body.phone !== undefined
          ? String(body.phone).trim()
          : current.phone || "",
      bio:
        body.bio !== undefined
          ? String(body.bio).trim()
          : current.bio || "",
      order,
    }

    partners[index] = updatedPartner

    await writePartners(partners)
    revalidatePartnerPages()

    return NextResponse.json(updatedPartner, {
      headers: noCacheHeaders(),
    })
  } catch (error) {
    console.error("PUT /api/partners error:", error)

    return NextResponse.json(
      { error: "Əməkdaş məlumatları yenilənərkən server xətası baş verdi." },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Əməkdaşın ID-si tələb olunur." },
        { status: 400 },
      )
    }

    const cleanId = id.trim()
    const partners = await readPartners()
    const remaining = partners.filter(
      (partner) =>
        String(partner.id).trim() !== cleanId &&
        partner.slug !== cleanId,
    )

    if (remaining.length === partners.length) {
      return NextResponse.json(
        { error: "Əməkdaş tapılmadı." },
        { status: 404 },
      )
    }

    await writePartners(remaining)
    revalidatePartnerPages()

    return NextResponse.json(
      { success: true },
      { headers: noCacheHeaders() },
    )
  } catch (error) {
    console.error("DELETE /api/partners error:", error)

    return NextResponse.json(
      { error: "Əməkdaşı silmək mümkün olmadı." },
      { status: 500 },
    )
  }
}
