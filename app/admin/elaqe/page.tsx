"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../AdminSidebar"

type BranchInfo = {
  id: string
  city: string
  address: string
  phone: string
  instagram: string
  facebook: string
  mapSrc: string
}

const defaultBranches: BranchInfo[] = [
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

export default function AdminElaqePage() {
  const { status } = useSession()
  const router = useRouter()

  const [branches, setBranches] = useState<BranchInfo[]>(defaultBranches)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<BranchInfo>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin")
  }, [status, router])

  useEffect(() => {
    const stored = localStorage.getItem("ugur_admin_contact")
    if (stored) {
      setBranches(JSON.parse(stored))
    }
  }, [])

  const startEdit = (branch: BranchInfo) => {
    setEditId(branch.id)
    setForm({ ...branch })
  }

  const handleSave = () => {
    const updated = branches.map((b) =>
      b.id === editId ? { ...b, ...form } as BranchInfo : b
    )
    setBranches(updated)
    localStorage.setItem("ugur_admin_contact", JSON.stringify(updated))
    setEditId(null)
    setForm({})
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">Əlaqə Məlumatları</h1>
          <p className="mt-1 text-sm text-slate-400">
            Filiallara aid əlaqə məlumatlarını idarə edin
          </p>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            ✓ Məlumatlar uğurla yadda saxlandı!
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <h2 className="font-bold text-white">{branch.city} Filialı</h2>
                {editId !== branch.id ? (
                  <button
                    onClick={() => startEdit(branch)}
                    id={`edit-branch-${branch.id}`}
                    className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    ✏️ Düzəlt
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditId(null); setForm({}) }}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      Ləğv et
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-400"
                    >
                      💾 Saxla
                    </button>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="p-6 space-y-4">
                {([
                  { key: "address", label: "📍 Ünvan" },
                  { key: "phone", label: "📞 Telefon" },
                  { key: "instagram", label: "📸 Instagram Link" },
                  { key: "facebook", label: "👤 Facebook Link" },
                  { key: "mapSrc", label: "🗺️ Google Maps Embed URL", long: true },
                ] as Array<{key: keyof BranchInfo; label: string; long?: boolean}>).map(({ key, label, long }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-400">
                      {label}
                    </label>
                    {editId === branch.id ? (
                      <input
                        type="text"
                        value={(form[key] as string) || ""}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                      />
                    ) : (
                      <p className={`text-sm text-slate-300 ${long ? "truncate" : ""}`}>
                        {branch[key] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <p className="text-sm font-semibold text-amber-400">💡 Məsləhət</p>
          <p className="mt-1 text-xs text-slate-400">
            Google Maps embed URL almaq üçün: maps.google.com → "Paylaş" → "Xəritəni yerləştir" → "HTML kodu"ndakı src="" daxilindəki linki kopyalayın.
          </p>
        </div>
      </main>
    </div>
  )
}
