"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Kurslar", href: "/admin/kurslar", icon: "📚" },
  { name: "Qalereya", href: "/admin/qalereya", icon: "🖼️" },
  { name: "Partnyorlar", href: "/admin/partnyorlar", icon: "🤝" },
  { name: "Əlaqə Məlumatları", href: "/admin/elaqe", icon: "📞" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-xl font-bold text-white">
          U
        </div>
        <div>
          <p className="text-sm font-bold text-white">Uğur Academy</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          🌐 Saytı Gör
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          🚪 Çıxış
        </button>
      </div>
    </aside>
  )
}
