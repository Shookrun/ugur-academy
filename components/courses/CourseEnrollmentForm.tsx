"use client"

import { useState } from "react"

interface Props {
  courseTitle: string
}

export default function CourseEnrollmentForm({ courseTitle }: Props) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredFormat: "Əyani",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate async submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 800)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8">
      {isSuccess ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-900">
            ✓
          </div>
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Müraciətiniz qəbul olundu!
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Təşəkkür edirik, <span className="font-semibold text-slate-700">{formData.fullName}</span>. Təhsil məsləhətçimiz ən qısa zamanda sizinlə əlaqə saxlayacaq.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false)
              setFormData({ fullName: "", phone: "", email: "", preferredFormat: "Əyani", notes: "" })
            }}
            className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Yeni müraciət göndər
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
              Qeydiyyat & Konsultasiya
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Kursa qeydiyyatdan keçin
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Formu doldurun, təlim koordinatorumuz proqram barədə sizə ətraflı məlumat versin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Ad və Soyad *
              </label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="Məs: Əli Məmmədov"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Telefon nömrəsi *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+994 50 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  E-poçt ünvanı
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="numune@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Tədris formatı seçimi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Əyani", "Onlayn"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredFormat: fmt })}
                    className={`
                      cursor-pointer rounded-xl border py-2.5 text-center text-xs font-semibold transition
                      ${
                        formData.preferredFormat === fmt
                          ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                          : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300"
                      }
                    `}
                  >
                    {fmt} təhsil
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Əlavə qeyd və ya sualınız
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Dərslərlə bağlı hər hansı xüsusi istəyiniz..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Göndərilir...</span>
              ) : (
                <>
                  <span>Müraciəti təsdiqlə</span>
                  <span>→</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Məlumatlarınızın məxfiliyinə tam zəmanət verilir.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
