"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      name: "Sorğular",
      href: "/admin/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      name: "Kurslar",
      href: "/admin/kurslar",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: "Komanda / Əməkdaşlar",
      href: "/admin/partnyorlar",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Qalereya",
      href: "/admin/qalereya",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Əlaqə & Filiallar",
      href: "/admin/elaqe",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const userEmail = session?.user?.email || "admin@ugur.az"

  return (
    <aside
      className={`
        sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sm
        transition-all duration-300 z-50
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Top Header with Brand Logo */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-1">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-[#1e3a47] tracking-tight">
                UĞUR İDARƏ
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900 ml-auto"
          title={isCollapsed ? "Genişləndir" : "Yığcamlaşdır"}
        >
          {isCollapsed ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#1e3a47] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950"
                }
                ${isCollapsed ? "justify-center px-0" : ""}
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <span className={`shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}

        {/* External Link to Public Site */}
        <div className="pt-4 border-t border-slate-100 my-2">
          <Link
            href="/"
            target="_blank"
            className={`
              group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold
              text-sky-600 hover:bg-sky-50 transition-colors
              ${isCollapsed ? "justify-center px-0" : ""}
            `}
            title={isCollapsed ? "Sayta keçid" : undefined}
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!isCollapsed && <span>Sayta keçid</span>}
          </Link>
        </div>
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-slate-100 p-3">
        <div className={`flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-2.5 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1e3a47] text-xs font-bold text-white shadow-xs">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {session?.user?.name || "Admin"}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {userEmail}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className={`
            mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold
            text-rose-600 hover:bg-rose-50 transition-colors
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
          title="Çıxış et"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>Çıxış</span>}
        </button>
      </div>
    </aside>
  )
}
