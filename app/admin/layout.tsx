import type { Metadata } from "next"
import AdminSessionProvider from "./AdminSessionProvider"

export const metadata: Metadata = {
  title: "Admin Panel | Uğur Academy",
  description: "Uğur Academy admin idarəetmə paneli",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminSessionProvider>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased">
        {children}
      </div>
    </AdminSessionProvider>
  )
}
