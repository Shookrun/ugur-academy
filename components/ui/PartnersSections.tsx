
"use client"

import { useState, type FormEvent } from "react"

interface Props {
  partnerName: string
}

interface FormData {
  name: string
  phone: string
  topic: string
  message: string
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  topic: "",
  message: "",
}

export default function PartnerContactForm({ partnerName }: Props) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    window.setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 750)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setIsSuccess(false)
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.22)]">

      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative">

        {isSuccess ? (
          <div className="flex min-h-[510px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">

            <div className="relative mb-7">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-50" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-10 w-10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>
            </div>

            <span className="mb-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Müraciət tamamlandı
            </span>

            <h3 className="max-w-md text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Təşəkkür edirik!
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
              Müraciətiniz qeydə alındı.{" "}
              <span className="font-bold text-slate-800">
                {partnerName}
              </span>{" "}
              ilə görüş və ya konsultasiya üçün sizinlə əlaqə saxlanılacaq.
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-700/20 active:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Yeni müraciət
            </button>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 pb-9 pt-8 sm:px-9 sm:pt-10">

              <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full border border-white/[0.07]" />
              <div className="pointer-events-none absolute -right-1 -top-9 h-44 w-44 rounded-full border border-white/[0.07]" />
              <div className="pointer-events-none absolute bottom-0 right-20 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
                      Fərdi konsultasiya
                    </span>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-indigo-200 backdrop-blur-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-6 w-6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="10" cy="7" r="4" />
                      <path d="M20 8v6m-3-3h6" />
                    </svg>
                  </div>
                </div>

                <h3 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                  Doğru addım,
                  <span className="block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                    fərdi yanaşma.
                  </span>
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                  Mütəxəssislə birbaşa əlaqə yaradın. Müraciətinizi
                  göndərin, sizə uyğun həll yolunu birlikdə müəyyənləşdirək.
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
                    {partnerName.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Müraciət etdiyiniz mütəxəssis
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-white">
                      {partnerName}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-300">
                      Əlaqə
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-5 px-6 py-7 sm:px-9 sm:py-8">

              <div className="mb-1">
                <h4 className="text-base font-extrabold text-slate-900">
                  Müraciət məlumatları
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Zəhmət olmasa, aşağıdakı məlumatları daxil edin.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pName"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Ad və soyad <span className="text-rose-500">*</span>
                  </label>

                  <div className="group relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                    </svg>

                    <input
                      id="pName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={3}
                      maxLength={100}
                      placeholder="Məsələn, Leyla Əliyeva"
                      value={formData.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pPhone"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Əlaqə nömrəsi <span className="text-rose-500">*</span>
                  </label>

                  <div className="group relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69a2 2 0 0 1 1.74 2.04z" />
                    </svg>

                    <input
                      id="pPhone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={25}
                      placeholder="+994 50 000 00 00"
                      value={formData.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pTopic"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Müraciət mövzusu
                    <span className="ml-1 font-normal text-slate-400">
                      (İstəyə bağlı)
                    </span>
                  </label>

                  <div className="group relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 6h13M8 12h13M8 18h13" />
                      <path d="M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>

                    <input
                      id="pTopic"
                      name="topic"
                      type="text"
                      maxLength={150}
                      placeholder="Məsələn, fərdi konsultasiya"
                      value={formData.topic}
                      onChange={(event) => handleChange("topic", event.target.value)}
                      className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label
                      htmlFor="pMsg"
                      className="text-xs font-bold text-slate-700"
                    >
                      Əlavə qeydiniz
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formData.message.length}/500
                    </span>
                  </div>

                  <textarea
                    id="pMsg"
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder="Maraqlandığınız məsələni qısaca qeyd edə bilərsiniz..."
                    value={formData.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex min-h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-900 px-6 py-4 text-sm font-bold text-white shadow-[0_10px_25px_-10px_rgba(49,46,129,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.45)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {isSubmitting ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative h-5 w-5 animate-spin"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="relative">Göndərilir...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">Görüş üçün müraciət et</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-slate-400"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <p className="text-[10px] leading-5 text-slate-400 sm:text-xs">
                  Məlumatlarınız yalnız müraciətinizlə əlaqədar istifadə olunur.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
