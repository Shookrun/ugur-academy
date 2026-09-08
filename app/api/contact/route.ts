import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "dynamic_branches.json")

const defaultBranches = [
  {
    id: "haciqabul",
    city: "Hacıqabul",
    address: "Hacıqabul şəhəri, Mərkəzi küçə 12",
    phone: "+994 50 000 00 01",
    instagram: "https://www.instagram.com/ugur.academy",
    facebook: "https://www.facebook.com/ugur.academy",
    mapSrc: "https://maps.google.com/maps?q=Hac%C4%B1qabul&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "sirvan",
    city: "Şirvan",
    address: "Şirvan şəhəri, İstiqlaliyyət küçəsi 7",
    phone: "+994 50 000 00 02",
    instagram: "https://www.instagram.com/ugur.academy.sirvan",
    facebook: "https://www.facebook.com/ugur.academy.sirvan",
    mapSrc: "https://maps.google.com/maps?q=%C5%9Eirvan+Az%C9%99rbaycan&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
]

async function readBranches() {
  try {
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify(defaultBranches, null, 2), "utf-8")
    return defaultBranches
  }
}

async function writeBranches(data: unknown[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  try {
    const branches = await readBranches()
    return NextResponse.json(branches)
  } catch (error) {
    return NextResponse.json({ error: "Failed to read branches" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const branches = await readBranches()
    const newBranch = {
      ...body,
      id: body.id || String(Date.now()),
    }
    branches.push(newBranch)
    await writeBranches(branches)
    return NextResponse.json(newBranch, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add branch" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const branches = await readBranches()
    const index = branches.findIndex((b: { id: string }) => String(b.id) === String(body.id))
    if (index === -1) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 })
    }
    branches[index] = { ...branches[index], ...body }
    await writeBranches(branches)
    return NextResponse.json(branches[index])
  } catch (error) {
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
    let branches = await readBranches()
    branches = branches.filter((b: { id: string }) => String(b.id) !== String(id))
    await writeBranches(branches)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 })
  }
}
