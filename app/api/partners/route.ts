import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { partnersData } from "@/data/partners"

const localDataFilePath = path.join(process.cwd(), "data", "dynamic_partners.json")
const tmpDataFilePath = path.join(os.tmpdir(), "dynamic_partners.json")

declare global {
  // eslint-disable-next-line no-var
  var __partnersMemoryStore: any[] | undefined
}

const initialPartners = partnersData.map((p) => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  position: p.position,
  department: p.department,
  specialty: p.specialty,
  isTeacher: true,
  logo: p.logo,
  experienceYears: p.experienceYears,
  studentsCount: p.studentsCount,
  bio: p.bio,
  email: p.email,
  phone: p.phone,
}))

function slugify(text: string): string {
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

async function readPartners(): Promise<any[]> {
  if (globalThis.__partnersMemoryStore && globalThis.__partnersMemoryStore.length > 0) {
    return globalThis.__partnersMemoryStore
  }

  // 1. Try reading from /tmp (writable on Vercel)
  try {
    const tmpContent = await fs.readFile(tmpDataFilePath, "utf-8")
    const parsed = JSON.parse(tmpContent)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__partnersMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 2. Try reading from local project data directory
  try {
    const localContent = await fs.readFile(localDataFilePath, "utf-8")
    const parsed = JSON.parse(localContent)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__partnersMemoryStore = parsed
      return parsed
    }
  } catch {}

  globalThis.__partnersMemoryStore = initialPartners
  return initialPartners
}

async function writePartners(data: any[]): Promise<void> {
  globalThis.__partnersMemoryStore = data

  // Write to /tmp (writable on Vercel)
  try {
    await fs.writeFile(tmpDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write to tmp directory:", err)
  }

  // Write to local data directory (local environment)
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Gracefully ignore on read-only environments like Vercel Lambda
  }
}

export async function GET() {
  try {
    const partners = await readPartners()
    return NextResponse.json(partners)
  } catch (error) {
    console.error("GET /api/partners error:", error)
    return NextResponse.json({ error: "Failed to read partners" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const partners = await readPartners()

    const generatedSlug = body.name ? slugify(body.name) : String(Date.now())
    // ensure slug is unique
    let finalSlug = body.slug || generatedSlug
    if (partners.some((p) => p.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
    }

    const newPartner = {
      ...body,
      id: body.id ? String(body.id) : String(Date.now()),
      slug: finalSlug,
      logo: body.logo || "/Mehman Bayramov.jpg",
      experienceYears: Number(body.experienceYears) || 0,
      studentsCount: body.isTeacher ? Number(body.studentsCount) || 0 : 0,
    }

    partners.push(newPartner)
    await writePartners(partners)
    return NextResponse.json(newPartner, { status: 201 })
  } catch (error) {
    console.error("POST /api/partners error:", error)
    return NextResponse.json({ error: "Failed to add partner" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const partners = await readPartners()
    const index = partners.findIndex((p: { id: string }) => String(p.id) === String(body.id))
    if (index === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    partners[index] = {
      ...partners[index],
      ...body,
      id: String(body.id),
      slug: body.slug || partners[index].slug || (body.name ? slugify(body.name) : String(Date.now())),
      experienceYears: Number(body.experienceYears ?? partners[index].experienceYears) || 0,
      studentsCount: body.isTeacher ? Number(body.studentsCount ?? partners[index].studentsCount) || 0 : 0,
    }

    await writePartners(partners)
    return NextResponse.json(partners[index])
  } catch (error) {
    console.error("PUT /api/partners error:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    let partners = await readPartners()
    partners = partners.filter((p: { id: string }) => String(p.id) !== String(id))
    await writePartners(partners)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/partners error:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
