import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Rəylər | Uğur Şəxsi İnkişaf Mərkəzi",
  description: "Uğur Academy tələbə və valideynlərinin video rəyləri və uğur hekayələri.",
}

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
