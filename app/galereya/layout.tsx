import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Galereya | Uğur Şəxsi İnkişaf Mərkəzi",
  description:
    "Uğur Şəxsi İnkişaf Mərkəzinin tədris prosesi, mərasimləri, seminarları və akademiya həyatından ən gözəl anlar.",
}

export default function GalereyaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

