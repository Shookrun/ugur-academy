import fs from "fs/promises"
import path from "path"
import { getCollection, setCollection } from "@/lib/db"

// Reads a collection from Neon. On first run (nothing stored yet) it seeds Neon from the
// committed data/<seedFile> if present, otherwise from the built-in defaults.
export async function readSeeded<T = any>(key: string, seedFile: string, defaults: T[]): Promise<T[]> {
  const stored = await getCollection<T>(key)
  if (stored) return stored

  let seed: T[] = defaults
  try {
    const parsed = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", seedFile), "utf-8"))
    if (Array.isArray(parsed) && parsed.length > 0) seed = parsed
  } catch {}
  await setCollection(key, seed)
  return seed
}

// Same as readSeeded, but never throws: falls back to the committed file / defaults without writing.
export async function readSeededSafe<T = any>(key: string, seedFile: string, defaults: T[]): Promise<T[]> {
  try {
    return await readSeeded<T>(key, seedFile, defaults)
  } catch {
    try {
      const parsed = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", seedFile), "utf-8"))
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
    return defaults
  }
}
