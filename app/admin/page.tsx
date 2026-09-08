"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function AdminLoginPage() {
  const { status } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/dashboard")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("İstifadəçi adı və ya şifrə yanlışdır.")
    } else {
      router.replace("/admin/dashboard")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e3a47] border-t-transparent" />
      </div>
    )
  }

  if (status === "authenticated") return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
      {/* Background brand ambient glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(30,58,71,0.2) 0%, rgba(14,165,233,0.1) 40%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 p-2 shadow-sm">
              <Image src="/logo.png" alt="Uğur Academy" width={48} height={48} className="object-contain" priority />
            </div>
            <h1 className="text-xl font-black text-[#1e3a47]">Uğur İdarəetmə</h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Admin Giriş Portalı
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                İstifadəçi adı
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="
                  w-full rounded-xl border border-slate-200 bg-slate-50/50
                  px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400
                  outline-hidden transition-all duration-200
                  focus:border-[#1e3a47] focus:bg-white focus:ring-2 focus:ring-[#1e3a47]/15
                "
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Şifrə
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="
                  w-full rounded-xl border border-slate-200 bg-slate-50/50
                  px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400
                  outline-hidden transition-all duration-200
                  focus:border-[#1e3a47] focus:bg-white focus:ring-2 focus:ring-[#1e3a47]/15
                "
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="admin-login-btn"
              className="
                group relative w-full overflow-hidden rounded-xl
                bg-[#1e3a47] px-6 py-3.5 text-sm font-bold text-white
                shadow-sm transition-all duration-300
                hover:bg-[#162c37] active:scale-98
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Giriş edilir...
                </span>
              ) : (
                "Daxil ol →"
              )}
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
              Giriş: admin / Ugur@2024!
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
