"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminSidebar from "../AdminSidebar"
import Link from "next/link"

const quickActions = [
  { title: "Kurs əlavə et", href: "/admin/kurslar", icon: "📚", color: "from-blue-500 to-indigo-600" },
  { title: "Şəkil əlavə et", href: "/admin/qalereya", icon: "🖼️", color: "from-purple-500 to-pink-600" },
  { title: "Partnyora bax", href: "/admin/partnyorlar", icon: "🤝", color: "from-green-500 to-teal-600" },
  { title: "Əlaqə yenilə", href: "/admin/elaqe", icon: "📞", color: "from-amber-500 to-orange-600" },
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Xoş gəldiniz, {session?.user?.name} 👋
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Kurslar", value: "10+", icon: "📚", sub: "aktiv kurs" },
            { label: "Tələbələr", value: "1000+", icon: "👨‍🎓", sub: "məzun" },
            { label: "Filialar", value: "2", icon: "🏢", sub: "Hacıqabul + Şirvan" },
            { label: "Partnyorlar", value: "15+", icon: "🤝", sub: "əməkdaşlıq" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-3 text-2xl">{stat.icon}</div>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">{stat.label}</p>
              <p className="text-xs text-slate-600">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
            Sürətli Əməliyyatlar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`
                  group flex flex-col items-center justify-center gap-3
                  rounded-2xl bg-gradient-to-br ${action.color}
                  p-8 text-white shadow-lg transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                `}
              >
                <span className="text-3xl">{action.icon}</span>
                <span className="text-sm font-semibold">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-amber-400">Admin Panel haqqında</p>
              <p className="mt-1 text-sm text-slate-400">
                Bu paneldə saytdakı kurslar, qalereya şəkilləri, partnyorlar və əlaqə
                məlumatlarını idarə edə bilərsiniz. Hər bölmə tam CRUD əməliyyatlarını
                dəstəkləyir.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
