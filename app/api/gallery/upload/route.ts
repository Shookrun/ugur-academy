import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BYTES = 4 * 1024 * 1024
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" }
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: NO_STORE })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return jsonError("İcazə yoxdur.", 401)

  try {
    const form = await req.formData().catch(() => null)
    const file = form?.get("file")

    if (!(file instanceof File)) return jsonError("Fayl göndərilməyib.", 400)
    if (!ALLOWED_TYPES.has(file.type)) {
      return jsonError("Yalnız JPG, PNG, WEBP, GIF və AVIF qəbul olunur.", 400)
    }
    if (file.size > MAX_BYTES) {
      return jsonError("Şəkil 4MB-dan böyükdür.", 413)
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64")

    return NextResponse.json(
      { url: `data:${file.type};base64,${base64}` },
      { status: 201, headers: NO_STORE }
    )
  } catch (error) {
    console.error("POST /api/gallery/upload error:", error)
    return jsonError("Şəkil yüklənərkən xəta baş verdi.", 500)
  }
}