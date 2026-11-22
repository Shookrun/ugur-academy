/**
 * Server tərəfində sadə yaddaş keşi (stale-while-revalidate).
 *
 * - İlk sorğu bazadan oxuyur və nəticəni yadda saxlayır.
 * - Sonrakı sorğular dərhal yaddaşdan cavab verir (millisaniyələr).
 * - Müddət (ttlMs) bitəndə köhnə data qaytarılır, yenisi arxa planda yüklənir.
 * - Data dəyişəndə (əlavə / yenilə / sil) invalidate(key) çağırılmalıdır.
 */

const values = new Map<string, { value: unknown; at: number }>()
const inflight = new Map<string, Promise<unknown>>()

function refresh<T>(key: string, load: () => Promise<T>): Promise<T> {
  const running = inflight.get(key)

  if (running) return running as Promise<T>

  const promise = load()
    .then((value) => {
      values.set(key, { value, at: Date.now() })
      return value
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, promise)

  return promise
}

export async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = values.get(key)

  // Yaddaşda heç nə yoxdur: ilk dəfə gözləməli
  if (!hit) return refresh(key, load)

  // Müddət bitib: köhnəni dərhal qaytar, yenisini arxa planda yüklə
  if (Date.now() - hit.at > ttlMs) {
    void refresh(key, load).catch(() => {})
  }

  return hit.value as T
}

export function invalidate(key: string) {
  values.delete(key)
}
