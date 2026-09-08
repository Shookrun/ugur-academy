import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { galleryItems } from "@/data/gallery"

const dataFilePath = path.join(process.cwd(), "data", "dynamic_gallery.json")

const initialGallery = galleryItems.map((g) => ({
  id: String(g.id),
  src: g.src,
  alt: g.alt,
  title: g.title,
  category: g.category,
  date: g.date,
  featured: g.featured || false,
}))

async function readGallery() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(initialGallery, null, 2), "utf-8")
    return initialGallery
  }
}

async function writeGallery(data: unknown[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const gallery = await readGallery()
    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read gallery" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const gallery = await readGallery()
    const newItem = {
      ...body,
      id: body.id || String(Date.now()),
      src: body.src || "/gallery_classroom.jpg",
      date: body.date || "2026",
    }
    gallery.push(newItem)
    await writeGallery(gallery)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const gallery = await readGallery()
    const index = gallery.findIndex((g: { id: string }) => String(g.id) === String(body.id))
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }
    gallery[index] = { ...gallery[index], ...body }
    await writeGallery(gallery)
    return NextResponse.json(gallery[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    let gallery = await readGallery()
    gallery = gallery.filter((g: { id: string }) => String(g.id) !== String(id))
    await writeGallery(gallery)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
