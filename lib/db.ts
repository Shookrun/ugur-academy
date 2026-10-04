import { neon } from "@neondatabase/serverless"

// Each admin collection (courses, gallery, ...) is stored as one JSON row in `app_data`.

let sqlClient: ReturnType<typeof neon> | null = null
let tableReady: Promise<void> | null = null

function getSql() {
  if (!sqlClient) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    sqlClient = neon(url)
  }
  return sqlClient
}

function ensureTable(): Promise<void> {
  if (!tableReady) {
    const sql = getSql()
    tableReady = sql`
      CREATE TABLE IF NOT EXISTS app_data (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `.then(() => undefined)
    tableReady.catch(() => {
      tableReady = null
    })
  }
  return tableReady
}

// Returns null when the collection has never been saved (caller decides how to seed it).
export async function getCollection<T = any>(key: string): Promise<T[] | null> {
  await ensureTable()
  const sql = getSql()
  const rows = (await sql`SELECT value FROM app_data WHERE key = ${key}`) as { value: T[] }[]
  if (rows.length === 0) return null
  return Array.isArray(rows[0].value) ? rows[0].value : null
}

export async function setCollection<T = any>(key: string, data: T[]): Promise<void> {
  await ensureTable()
  const sql = getSql()
  await sql`
    INSERT INTO app_data (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `
}
