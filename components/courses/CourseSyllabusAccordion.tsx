"use client"

import { useState } from "react"
import type { Course } from "@/data/courses"

export default function CourseSyllabusAccordion({ syllabus }: { syllabus: Course["syllabus"] }) {
  const [openModule, setOpenModule] = useState<number | null>(1)

  const toggle = (num: number) => {
    setOpenModule((prev) => (prev === num ? null : num))
  }

  return (
    <div className="space-y-4">
      {syllabus.map((mod) => {
        const isOpen = openModule === mod.number

        return (
          <div
            key={mod.number}
            className={`
              overflow-hidden rounded-2xl border transition-all duration-300
              ${isOpen ? "border-slate-300 bg-white shadow-md" : "border-slate-200/80 bg-white/70 hover:border-slate-300"}
            `}
          >
            <button
              type="button"
              onClick={() => toggle(mod.number)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors
                    ${isOpen ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}
                  `}
                >
                  {String(mod.number).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {mod.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400">
                    Müddət: {mod.duration}
                  </span>
                </div>
              </div>

              <div
                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-transform duration-300
                  ${isOpen ? "rotate-180 bg-slate-100" : ""}
                `}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tədris olunacaq mövzular və praktika:
                </p>
                <ul className="space-y-2.5">
                  {mod.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
