import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "Fayl tapılmadı" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Yalnız JPG, PNG, WEBP və GIF formatları qəbul edilir" },
        { status: 400 }
      )
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Fayl həcmi 5MB-dan az olmalıdır" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Build safe filename
    const ext = path.extname(file.name) || ".jpg"
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 80)
    const fileName = `${Date.now()}_${baseName}${ext}`

    // Determine save directory inside /public
    try {
      const subDir = folder ? folder.replace(/[^a-zA-Z0-9/_-]/g, "") : "uploads"
      const saveDir = path.join(process.cwd(), "public", subDir)
      await fs.mkdir(saveDir, { recursive: true })

      const savePath = path.join(saveDir, fileName)
      await fs.writeFile(savePath, buffer)

      // Return public URL
      const publicUrl = `/${subDir}/${fileName}`
      return NextResponse.json({ url: publicUrl }, { status: 201 })
    } catch (fsErr) {
      console.warn("Could not save file to disk, falling back to base64 Data URL:", fsErr)
      const mime = file.type || "image/jpeg"
      const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`
      return NextResponse.json({ url: dataUrl }, { status: 201 })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Fayl yüklənərkən xəta baş verdi" }, { status: 500 })
  }
}
