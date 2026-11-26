import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Rəylər | Uğur Şəxsi İnkişaf Mərkəzi",
  description: "Uğur Academy haqqında ümumi video rəylər və təcrübə paylaşımları.",
}

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
