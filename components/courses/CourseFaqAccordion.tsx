"use client"

import { useState } from "react"

interface Props {
  faqList: {
    question: string
    answer: string
  }[]
}

export default function CourseFaqAccordion({ faqList }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="space-y-3">
      {faqList.map((item, idx) => {
        const isOpen = openIndex === idx

        return (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm transition"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50/50"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.question}
              </span>
              <span
                className={`
                  flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-600 transition-transform duration-300
                  ${isOpen ? "rotate-180 bg-slate-900 text-white" : ""}
                `}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 bg-slate-50/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
