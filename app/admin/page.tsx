"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLoginPage() {
  const { data: session, status } = useSession()
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (status === "authenticated") return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(245,158,11,0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="border-b border-slate-800 bg-slate-950 px-8 py-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-3xl font-black text-white shadow-lg shadow-amber-500/30">
              U
            </div>
            <h1 className="text-xl font-bold text-white">Uğur Academy</h1>
            <p className="mt-1 text-sm text-slate-400">Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
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
                  w-full rounded-xl border border-slate-700 bg-slate-800
                  px-4 py-3 text-sm text-white placeholder:text-slate-500
                  outline-none transition-all duration-200
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                "
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
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
                  w-full rounded-xl border border-slate-700 bg-slate-800
                  px-4 py-3 text-sm text-white placeholder:text-slate-500
                  outline-none transition-all duration-200
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                "
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="admin-login-btn"
              className="
                group relative w-full overflow-hidden rounded-xl
                bg-amber-500 px-6 py-3.5 text-sm font-bold text-white
                shadow-lg shadow-amber-500/30 transition-all duration-300
                hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl
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

            <p className="text-center text-xs text-slate-500">
              Default: admin / Ugur@2024!
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
