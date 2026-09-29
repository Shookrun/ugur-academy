import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import os from "os"

export const dynamic = "force-dynamic"
export const revalidate = 0

const localDataFilePath = path.join(process.cwd(), "data", "dynamic_branches.json")
const tmpDataFilePath = path.join(os.tmpdir(), "dynamic_branches.json")

declare global {
  // eslint-disable-next-line no-var
  var __branchesMemoryStore: any[] | undefined
}

const defaultBranches = [
  {
    id: "sirvan",
    city: "Şirvan",
    address: "Şirvan şəhəri, İstiqlaliyyət küçəsi 7",
    phone: "070 670 30 20",
    phoneRaw: "+994706703020",
    whatsapp: "https://wa.me/994706703020",
    instagram: "https://www.instagram.com/ugur.academy.sirvan",
    facebook: "https://www.facebook.com/ugur.academy.sirvan",
    mapSrc: "https://maps.google.com/maps?q=%C5%9Eirvan+Az%C9%99rbaycan&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "haciqabul",
    city: "Hacıqabul",
    address: "Hacıqabul şəhəri, Mərkəzi küçə 12",
    phone: "070 671 30 20",
    phoneRaw: "+994706713020",
    whatsapp: "https://wa.me/994706713020",
    instagram: "https://www.instagram.com/ugur.academy",
    facebook: "https://www.facebook.com/ugur.academy",
    mapSrc: "https://maps.google.com/maps?q=Hac%C4%B1qabul&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
]

async function readBranches(): Promise<any[]> {
  // 1. Local file
  try {
    const file = await fs.readFile(localDataFilePath, "utf-8")
    const parsed = JSON.parse(file)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__branchesMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 2. /tmp file
  try {
    const tmp = await fs.readFile(tmpDataFilePath, "utf-8")
    const parsed = JSON.parse(tmp)
    if (Array.isArray(parsed) && parsed.length > 0) {
      globalThis.__branchesMemoryStore = parsed
      return parsed
    }
  } catch {}

  // 3. Memory store
  if (Array.isArray(globalThis.__branchesMemoryStore) && globalThis.__branchesMemoryStore.length > 0) {
    return globalThis.__branchesMemoryStore
  }

  // 4. Initial fallback
  globalThis.__branchesMemoryStore = [...defaultBranches]
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(defaultBranches, null, 2), "utf-8")
  } catch {}
  return defaultBranches
}

async function writeBranches(data: any[]): Promise<void> {
  globalThis.__branchesMemoryStore = [...data]
  try {
    await fs.writeFile(localDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write branches to local path:", err)
  }
  try {
    await fs.writeFile(tmpDataFilePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Could not write branches to tmp path:", err)
  }
}

export async function GET() {
  try {
    const branches = await readBranches()
    return NextResponse.json(branches, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("GET /api/contact error:", error)
    return NextResponse.json({ error: "Failed to read branches" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const branches = await readBranches()
    const newBranch = {
      ...body,
      id: body.id ? String(body.id).trim() : String(Date.now()),
    }
    branches.push(newBranch)
    await writeBranches(branches)

    try {
      revalidatePath("/admin/elaqe")
      revalidatePath("/elaqe")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(newBranch, { 
      status: 201,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("POST /api/contact error:", error)
    return NextResponse.json({ error: "Failed to add branch" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const branches = await readBranches()
    const targetId = String(body.id).trim()
    const index = branches.findIndex((b: any) => String(b.id).trim() === targetId)
    if (index === -1) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }
    branches[index] = { ...branches[index], ...body, id: targetId }
    await writeBranches(branches)

    try {
      revalidatePath("/admin/elaqe")
      revalidatePath("/elaqe")
      revalidatePath("/")
    } catch {}

    return NextResponse.json(branches[index], {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("PUT /api/contact error:", error)
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 })
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
    let branches = await readBranches()
    branches = branches.filter((b: any) => String(b.id).trim() !== cleanId)
    await writeBranches(branches)

    try {
      revalidatePath("/admin/elaqe")
      revalidatePath("/elaqe")
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("DELETE /api/contact error:", error)
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 })
  }
}

