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
  specialty: p.specialty || "",
  isTeacher: p.isTeacher !== undefined ? Boolean(p.isTeacher) : Boolean(p.specialty && p.specialty.trim() !== ""),
  logo: p.logo || "/Mehman Bayramov.jpg",
  experienceYears: Number(p.experienceYears) || 0,
  studentsCount: Number(p.studentsCount) || 0,
  bio: p.bio || "",
  email: p.email || "",
  phone: p.phone || "",
}))

function slugify(text: string): string {
  if (!text || typeof text !== "string") return String(Date.now())
  const azMap: Record<string, string> = {
    ə: "e", Ə: "e",
    ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o",
    ü: "u", Ü: "u",
    ğ: "g", Ğ: "g",
    ç: "c", Ç: "c",
    ş: "s", Ş: "s",
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
  // 1. In-memory store
  if (Array.isArray(globalThis.__partnersMemoryStore) && globalThis.__partnersMemoryStore.length > 0) {
    return globalThis.__partnersMemoryStore
  }

  // 2. Try reading from /tmp (writable in all serverless/container environments)
  try {
    const tmpContent = await fs.readFile(tmpDataFilePath, "utf-8")
    const parsed = JSON.parse(tmpContent)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__partnersMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 3. Try reading from local project data directory
  try {
    const localContent = await fs.readFile(localDataFilePath, "utf-8")
    const parsed = JSON.parse(localContent)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__partnersMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 4. Fallback to initial static seed data
  globalThis.__partnersMemoryStore = [...initialPartners]
  try {
    await fs.writeFile(tmpDataFilePath, JSON.stringify(initialPartners, null, 2), "utf-8")
  } catch {}
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(initialPartners, null, 2), "utf-8")
  } catch {}

  return initialPartners
}

async function writePartners(data: any[]): Promise<void> {
  // 1. Always keep current state in-memory
  globalThis.__partnersMemoryStore = data

  // 2. Write to /tmp (guaranteed writable on Vercel / Linux / Windows)
  try {
    await fs.writeFile(tmpDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write to tmp directory:", err)
  }

  // 3. Write to local project directory (local development)
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
    if (!body || !body.name) {
      return NextResponse.json({ error: "Əməkdaşın ad və soyadı qeyd olunmalıdır" }, { status: 400 })
    }

    const partners = await readPartners()

    const generatedSlug = slugify(body.name)
    let finalSlug = body.slug || generatedSlug
    if (partners.some((p) => p.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`
    }

    const isTeacher = Boolean(body.isTeacher)
    const newPartner = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
      slug: finalSlug,
      name: String(body.name).trim(),
      position: body.position ? String(body.position).trim() : "",
      department: body.department ? String(body.department).trim() : "Tədris Şöbəsi",
      isTeacher,
      specialty: isTeacher ? (body.specialty?.trim() || "") : "",
      logo: body.logo?.trim() || "/Mehman Bayramov.jpg",
      experienceYears: Number(body.experienceYears) || 0,
      studentsCount: isTeacher ? (Number(body.studentsCount) || 0) : 0,
      email: body.email?.trim() || "",
      phone: body.phone?.trim() || "",
      bio: body.bio?.trim() || "",
    }

    partners.push(newPartner)
    await writePartners(partners)
    return NextResponse.json(newPartner, { status: 201 })
  } catch (error) {
    console.error("POST /api/partners error:", error)
    return NextResponse.json({ error: "Əməkdaş əlavə edilərkən server xətası baş verdi" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || (!body.id && !body.slug && !body.name)) {
      return NextResponse.json({ error: "Yenilənmə üçün məlumat tapılmadı" }, { status: 400 })
    }

    const partners = await readPartners()

    // Robust matching: find by ID, or fallback to slug or name
    const targetId = body.id !== undefined && body.id !== null ? String(body.id).trim() : ""
    let index = -1

    if (targetId) {
      index = partners.findIndex((p: any) => String(p.id).trim() === targetId)
    }
    if (index === -1 && body.slug) {
      index = partners.findIndex((p: any) => p.slug === body.slug)
    }
    if (index === -1 && body.name) {
      index = partners.findIndex((p: any) => p.name === body.name)
    }

    if (index === -1) {
      return NextResponse.json({ error: "Əməkdaş tapılmadı" }, { status: 404 })
    }

    const current = partners[index]
    const finalId = targetId || String(current.id)
    const finalSlug = body.slug || current.slug || (body.name ? slugify(body.name) : String(Date.now()))
    const isTeacher = body.isTeacher !== undefined ? Boolean(body.isTeacher) : Boolean(current.isTeacher)

    partners[index] = {
      ...current,
      ...body,
      id: finalId,
      slug: finalSlug,
      name: body.name !== undefined ? String(body.name).trim() : current.name,
      position: body.position !== undefined ? String(body.position).trim() : current.position,
      department: body.department !== undefined ? String(body.department).trim() : (current.department || "Tədris Şöbəsi"),
      isTeacher,
      specialty: isTeacher ? (body.specialty !== undefined ? String(body.specialty).trim() : (current.specialty || "")) : "",
      experienceYears: Number(body.experienceYears ?? current.experienceYears) || 0,
      studentsCount: isTeacher ? (Number(body.studentsCount ?? current.studentsCount) || 0) : 0,
      logo: body.logo !== undefined && String(body.logo).trim() ? String(body.logo).trim() : (current.logo || "/Mehman Bayramov.jpg"),
      email: body.email !== undefined ? String(body.email).trim() : (current.email || ""),
      phone: body.phone !== undefined ? String(body.phone).trim() : (current.phone || ""),
      bio: body.bio !== undefined ? String(body.bio).trim() : (current.bio || ""),
    }

    await writePartners(partners)
    return NextResponse.json(partners[index])
  } catch (error) {
    console.error("PUT /api/partners error:", error)
    return NextResponse.json({ error: "Əməkdaş məlumatları yenilənərkən server xətası baş verdi" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    const cleanId = id.trim()
    let partners = await readPartners()
    partners = partners.filter((p: any) => String(p.id).trim() !== cleanId && p.slug !== cleanId)
    await writePartners(partners)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/partners error:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
