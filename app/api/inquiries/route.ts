import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "dynamic_inquiries.json")

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

async function readInquiries() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(initialInquiries, null, 2), "utf-8")
    return initialInquiries
  }
}

async function writeInquiries(data: unknown[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const inquiries = await readInquiries()
    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read inquiries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inquiries = await readInquiries()
    const now = new Date()
    const newInquiry = {
      ...body,
      id: body.id || String(Date.now()),
      status: body.status || "Yeni",
      date: body.date || now.toISOString().split("T")[0],
      time: body.time || now.toTimeString().split(" ")[0],
    }
    inquiries.unshift(newInquiry)
    await writeInquiries(inquiries)
    return NextResponse.json(newInquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add inquiry" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const inquiries = await readInquiries()
    const index = inquiries.findIndex((i: { id: string }) => String(i.id) === String(body.id))
    if (index === -1) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }
    inquiries[index] = { ...inquiries[index], ...body }
    await writeInquiries(inquiries)
    return NextResponse.json(inquiries[index])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    let inquiries = await readInquiries()
    inquiries = inquiries.filter((i: { id: string }) => String(i.id) !== String(id))
    await writeInquiries(inquiries)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}
