import type { Course } from "@/data/courses"

export default function CourseQuickStats({ course }: { course: Course }) {
  const stats = [
    {
      label: "Müddət",
      value: course.duration,
      icon: (
        <svg className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Dərs sayı",
      value: `${course.lessonsCount} saat / dərs`,
      icon: (
        <svg className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Tədris formatı",
      value: course.format,
      icon: (
        <svg className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Səviyyə",
      value: course.level,
      icon: (
        <svg className="h-5 w-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
            {item.icon}
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {item.label}
            </p>
            <p className="text-sm font-bold text-slate-900 sm:text-base">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
