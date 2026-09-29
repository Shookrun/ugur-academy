import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { galleryItems } from "@/data/gallery"

export const dynamic = "force-dynamic"
export const revalidate = 0

const localDataFilePath = path.join(process.cwd(), "data", "dynamic_gallery.json")
const tmpDataFilePath = path.join(os.tmpdir(), "dynamic_gallery.json")

declare global {
  // eslint-disable-next-line no-var
  var __galleryMemoryStore: any[] | undefined
}

const initialGallery = galleryItems.map((g) => ({
  id: String(g.id),
  src: g.src,
  alt: g.alt,
  title: g.title,
  category: g.category,
  date: g.date,
  featured: g.featured || false,
}))

async function readGallery(): Promise<any[]> {
  // 1. Local file
  try {
    const file = await fs.readFile(localDataFilePath, "utf-8")
    const parsed = JSON.parse(file)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__galleryMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 2. /tmp file
  try {
    const tmp = await fs.readFile(tmpDataFilePath, "utf-8")
    const parsed = JSON.parse(tmp)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__galleryMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 3. Memory store
  if (Array.isArray(globalThis.__galleryMemoryStore) && globalThis.__galleryMemoryStore.length > 0) {
    return globalThis.__galleryMemoryStore
  }

  // 4. Initial fallback
  globalThis.__galleryMemoryStore = [...initialGallery]
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(initialGallery, null, 2), "utf-8")
  } catch {}
  return initialGallery
}

async function writeGallery(data: any[]): Promise<void> {
  globalThis.__galleryMemoryStore = [...data]
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write gallery to local path:", err)
  }
  try {
    await fs.writeFile(tmpDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write gallery to tmp path:", err)
  }
}

export async function GET() {
  try {
    const gallery = await readGallery()
    return NextResponse.json(gallery, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("GET /api/gallery error:", error)
    return NextResponse.json({ error: "Failed to read gallery" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const gallery = await readGallery()
    const newItem = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
      src: body.src || "/gallery_classroom.jpg",
      date: body.date || "2026",
    }
    gallery.push(newItem)
    await writeGallery(gallery)

    try {
      revalidatePath("/admin/qalereya")
      revalidatePath("/galereya")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(newItem, { 
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("POST /api/gallery error:", error)
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const gallery = await readGallery()
    const targetId = String(body.id).trim()
    const index = gallery.findIndex((g: any) => String(g.id).trim() === targetId)
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }
    gallery[index] = { ...gallery[index], ...body, id: targetId }
    await writeGallery(gallery)

    try {
      revalidatePath("/admin/qalereya")
      revalidatePath("/galereya")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(gallery[index], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("PUT /api/gallery error:", error)
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
    const cleanId = String(id).trim()
    let gallery = await readGallery()
    gallery = gallery.filter((g: any) => String(g.id).trim() !== cleanId)
    await writeGallery(gallery)

    try {
      revalidatePath("/admin/qalereya")
      revalidatePath("/galereya")
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("DELETE /api/gallery error:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}

