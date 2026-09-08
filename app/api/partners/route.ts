import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { partnersData } from "@/data/partners"

const dataFilePath = path.join(process.cwd(), "data", "dynamic_partners.json")

const initialPartners = partnersData.map((p) => ({
  id: String(p.id),
  slug: p.slug,
  name: p.name,
  position: p.position,
  department: p.department,
  specialty: p.specialty,
  logo: p.logo,
  experienceYears: p.experienceYears,
  studentsCount: p.studentsCount,
  bio: p.bio,
  email: p.email,
  phone: p.phone,
}))

async function readPartners() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(initialPartners, null, 2), "utf-8")
    return initialPartners
  }
}

async function writePartners(data: unknown[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const partners = await readPartners()
    return NextResponse.json(partners)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read partners" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const partners = await readPartners()
    const newPartner = {
      ...body,
      id: body.id || String(Date.now()),
      slug: body.slug || String(Date.now()),
      logo: body.logo || "/Mehman Bayramov.jpg",
    }
    partners.push(newPartner)
    await writePartners(partners)
    return NextResponse.json(newPartner, { status: 201 })
  } catch (error) {
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
    partners[index] = { ...partners[index], ...body }
    await writePartners(partners)
    return NextResponse.json(partners[index])
  } catch (error) {
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
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
