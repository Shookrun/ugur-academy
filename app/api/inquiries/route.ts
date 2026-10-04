import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { readSeeded } from "@/lib/collection"
import { setCollection } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

const COLLECTION_KEY = "inquiries"

const initialInquiries = [
  {
    id: "1",
    fullName: "Aysən Orucova",
    contact: "0508776267",
    childInfo: {
      age: 14,
      language: "Azərbaycan dili",
    },
    status: "Baxılıb",
    date: "2026-08-25",
    time: "19:45:54",
    courseApplied: "Kompüter Kursu",
    notes: "Valideyn həftəsonu qrupu ilə maraqlanır.",
  },
  {
    id: "2",
    fullName: "Yusif Əliyev",
    contact: "0518120293",
    childInfo: {
      age: 18,
      language: "Azərbaycan dili",
    },
    status: "Baxılıb",
    date: "2026-08-25",
    time: "00:02:46",
    courseApplied: "Tibb və İlkin Yardım Kursu",
    notes: "Tibb bacısı sertifikasiyası istəyir.",
  },
  {
    id: "3",
    fullName: "Məsumə Quluzadə",
    contact: "0554068396",
    childInfo: {
      age: 6,
      language: "Azərbaycan dili",
    },
    status: "Yeni",
    date: "2026-08-28",
    time: "14:20:10",
    courseApplied: "Loqoped xidməti",
    notes: "Uşaqda səs qüsuru ilə bağlı ilkin müayinə istənilir.",
  },
  {
    id: "4",
    fullName: "Kamran Nəcəfov",
    contact: "0503332211",
    childInfo: {
      age: 23,
      language: "Azərbaycan dili",
    },
    status: "Gözləmədə",
    date: "2026-08-29",
    time: "11:15:30",
    courseApplied: "MİQ Hazırlıq Kursu",
    notes: "Riyaziyyat ixtisası üzrə kurikulum dərsləri.",
  },
]

async function readInquiries(): Promise<any[]> {
  return readSeeded(COLLECTION_KEY, "dynamic_inquiries.json", initialInquiries)
}

async function writeInquiries(data: any[]): Promise<void> {
  await setCollection(COLLECTION_KEY, data)
}

export async function GET() {
  try {
    const inquiries = await readInquiries()
    return NextResponse.json(inquiries, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("GET /api/inquiries error:", error)
    return NextResponse.json({ error: "Failed to read inquiries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || !body.fullName || !body.contact) {
      return NextResponse.json({ error: "Ad, soyad və əlaqə nömrəsi tələb olunur" }, { status: 400 })
    }

    const inquiries = await readInquiries()
    const now = new Date()
    const newInquiry = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
      fullName: String(body.fullName).trim(),
      contact: String(body.contact).trim(),
      courseApplied: body.courseApplied ? String(body.courseApplied).trim() : "Ümumi",
      notes: body.notes ? String(body.notes).trim() : "",
      status: body.status || "Yeni",
      date: body.date || now.toISOString().split("T")[0],
      time: body.time || now.toTimeString().split(" ")[0].slice(0, 5),
    }

    inquiries.unshift(newInquiry)
    await writeInquiries(inquiries)

    try {
      revalidatePath("/admin/dashboard")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(newInquiry, {
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("POST /api/inquiries error:", error)
    return NextResponse.json({ error: "Failed to add inquiry" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body || !body.id) {
      return NextResponse.json({ error: "ID tələb olunur" }, { status: 400 })
    }

    const inquiries = await readInquiries()
    const targetId = String(body.id).trim()
    const index = inquiries.findIndex((i: any) => String(i.id).trim() === targetId)

    if (index === -1) {
      return NextResponse.json({ error: "Müraciət tapılmadı" }, { status: 404 })
    }

    inquiries[index] = {
      ...inquiries[index],
      ...body,
      id: targetId,
      fullName: body.fullName !== undefined ? String(body.fullName).trim() : inquiries[index].fullName,
      contact: body.contact !== undefined ? String(body.contact).trim() : inquiries[index].contact,
      courseApplied: body.courseApplied !== undefined ? String(body.courseApplied).trim() : inquiries[index].courseApplied,
      notes: body.notes !== undefined ? String(body.notes).trim() : inquiries[index].notes,
      status: body.status !== undefined ? body.status : inquiries[index].status,
    }

    await writeInquiries(inquiries)

    try {
      revalidatePath("/admin/dashboard")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(inquiries[index], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("PUT /api/inquiries error:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID tələb olunur" }, { status: 400 })
    }
    const cleanId = String(id).trim()
    let inquiries = await readInquiries()
    inquiries = inquiries.filter((i: any) => String(i.id).trim() !== cleanId)
    await writeInquiries(inquiries)

    try {
      revalidatePath("/admin/dashboard")
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("DELETE /api/inquiries error:", error)
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}

