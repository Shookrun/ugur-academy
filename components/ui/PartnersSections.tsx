
"use client"

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"

interface Props {
  partnerName?: string
}

interface FormData {
  name: string
  phone: string
  topic: string
  message: string
}

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  topic: "",
  message: "",
}

const INPUT_CLASS =
  "w-full rounded-2xl border border-white/15 bg-white/[0.055] px-5 py-4 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-500 hover:border-indigo-300/40 hover:bg-white/[0.08] focus:border-violet-400/70 focus:bg-white/[0.09] focus:ring-4 focus:ring-violet-500/10"

export default function PartnerContactForm({
  partnerName = "Uğur Academy mütəxəssisi",
}: Props) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (
      name === "name" ||
      name === "phone" ||
      name === "topic" ||
      name === "message"
    ) {
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }))
    }
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
    setFormData({ ...INITIAL_FORM })
    setIsSuccess(false)
  }

  return (
    <section className="relative isolate w-full overflow-hidden rounded-[32px] border border-white/15 bg-[#080b1a] text-white shadow-[0_35px_100px_-35px_rgba(49,46,129,0.65)]">
      <style jsx>{`
        @keyframes glassFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(0, -14px, 0) rotate(4deg);
          }
        }

        @keyframes glassPulse {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        @keyframes glassReveal {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes glassShine {
          0% {
            transform: translateX(-150%) skewX(-20deg);
          }
          100% {
            transform: translateX(250%) skewX(-20deg);
          }
        }

        @keyframes glassSuccess {
          0% {
            transform: scale(0.5) rotate(-25deg);
            opacity: 0;
          }
          70% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }

        .glass-float {
          animation: glassFloat 7s ease-in-out infinite;
        }

        .glass-float-delayed {
          animation: glassFloat 9s ease-in-out infinite reverse;
        }

        .glass-reveal {
          animation: glassReveal 0.65s ease both;
        }

        .glass-success-icon {
          animation: glassSuccess 0.65s cubic-bezier(.2,.8,.2,1) both;
        }

        .glass-submit:hover .glass-shine {
          animation: glassShine 0.85s ease;
        }

        .glass-orb {
          animation: glassPulse 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .glass-float,
          .glass-float-delayed,
          .glass-orb,
          .glass-reveal,
          .glass-success-icon {
            animation: none !important;
          }

          .glass-submit:hover .glass-shine {
            animation: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(99,102,241,0.20),transparent_40%),radial-gradient(ellipse_at_90%_80%,rgba(168,85,247,0.16),transparent_40%),linear-gradient(135deg,#0b1024,#080b1a_60%,#101027)]" />

      <div className="glass-orb pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-[90px]" />

      <div className="glass-orb pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />

      <div className="pointer-events-none absolute right-8 top-8 hidden opacity-20 sm:block">
        <svg viewBox="0 0 180 180" className="h-36 w-36" fill="none">
          <path
            d="M90 0V180M0 90H180M26 26L154 154M154 26L26 154"
            stroke="white"
            strokeWidth=".7"
          />
          <circle cx="90" cy="90" r="65" stroke="white" strokeWidth=".7" />
          <circle cx="90" cy="90" r="40" stroke="white" strokeWidth=".7" />
        </svg>
      </div>

      <div className="relative grid lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative flex min-h-[340px] flex-col justify-between overflow-hidden border-b border-white/10 px-7 py-9 sm:px-10 sm:py-11 lg:min-h-[760px] lg:border-b-0 lg:border-r">
          <div className="glass-float absolute right-[-35px] top-[140px] h-52 w-52 rounded-full border border-white/[0.07]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-300/20 bg-emerald-400/[0.08] px-4 py-2 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                Open for consultation
              </span>
            </div>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.3em] text-indigo-300">
              UGUR ACADEMY / CONNECT
            </p>

            <h2 className="mt-5 max-w-sm text-[42px] font-black leading-[1.05] tracking-[-0.055em] sm:text-[52px] lg:text-[58px]">
              Let&apos;s
              <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                create
              </span>
              <span className="block">something</span>
              <span className="block text-white/40">great.</span>
            </h2>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
              Fikirləriniz, suallarınız və hədəfləriniz üçün doğru
              mütəxəssislə birbaşa əlaqə qurun.
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="glass-float relative max-w-[330px] rounded-[26px] border border-white/15 bg-white/[0.075] p-5 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                  <path d="M20 8v6m-3-3h6" />
                </svg>
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Your specialist
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-400/30 to-fuchsia-500/30 text-2xl font-black text-white shadow-inner">
                  {partnerName.trim().charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-extrabold text-white">
                    {partnerName}
                  </h3>
                  <p className="mt-1 text-xs text-indigo-300">
                    Personal consultation
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-medium tracking-wide text-slate-400">
                  UGUR ACADEMY
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-violet-300">
                  01 / 01
                </span>
              </div>
            </div>

            <div className="glass-float-delayed absolute -bottom-5 right-0 hidden rounded-2xl border border-white/15 bg-white/[0.08] p-3 backdrop-blur-2xl sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white">
                    Your next step
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Starts with a message
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          {isSuccess ? (
            <div className="glass-reveal flex flex-col items-start justify-center py-12">
              <div className="glass-success-icon flex h-24 w-24 items-center justify-center rounded-[30px] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/20 to-teal-500/10 shadow-[0_0_60px_rgba(16,185,129,0.15)] backdrop-blur-2xl">
                <svg
                  viewBox="0 0 24 24"
                  className="h-12 w-12 text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              <p className="mt-9 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Successfully submitted
              </p>

              <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                You&apos;re
                <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  on the list.
                </span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Təşəkkür edirik! Müraciətiniz qeydə alındı.
                <span className="font-bold text-white">
                  {" "}{partnerName}
                </span>
                {" "}ilə əlaqə üçün sizinlə geri dönüş ediləcək.
              </p>

              <button
                type="button"
                onClick={resetForm}
                className="mt-9 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-4 text-sm font-bold text-white backdrop-blur-xl transition-all hover:border-indigo-400/50 hover:bg-indigo-500/15"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Yeni müraciət yarat
              </button>
            </div>
          ) : (
            <div className="glass-reveal">
              <div className="mb-9 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300">
                    GET IN TOUCH
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Start a
                    <span className="ml-2 bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                      conversation.
                    </span>
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm">
                    Məlumatlarınızı daxil edin, sizinlə əlaqə saxlayaq.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl font-black text-white/30 sm:flex">
                  01
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="pName"
                      className="mb-2.5 block text-xs font-bold text-slate-300"
                    >
                      Ad və soyad <span className="text-fuchsia-400">*</span>
                    </label>
                    <input
                      id="pName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={3}
                      maxLength={100}
                      placeholder="Adınız və soyadınız"
                      value={formData.name}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pPhone"
                      className="mb-2.5 block text-xs font-bold text-slate-300"
                    >
                      Telefon <span className="text-fuchsia-400">*</span>
                    </label>
                    <input
                      id="pPhone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={25}
                      placeholder="+994 50 000 00 00"
                      value={formData.phone}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="pTopic"
                    className="mb-2.5 block text-xs font-bold text-slate-300"
                  >
                    Müraciət mövzusu
                  </label>
                  <input
                    id="pTopic"
                    name="topic"
                    type="text"
                    maxLength={150}
                    placeholder="Nə barədə danışmaq istəyirsiniz?"
                    value={formData.topic}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      htmlFor="pMsg"
                      className="text-xs font-bold text-slate-300"
                    >
                      Mesajınız
                    </label>
                    <span className="text-[10px] tabular-nums text-slate-500">
                      {formData.message.length} / 500
                    </span>
                  </div>

                  <textarea
                    id="pMsg"
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder="Fikirlərinizi bizimlə bölüşün..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`${INPUT_CLASS} min-h-[125px] resize-none leading-6`}
                  />
                </div>

                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/15 blur-3xl" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-submit group relative flex min-h-[60px] w-full items-center justify-between overflow-hidden rounded-[16px] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_35px_-12px_rgba(139,92,246,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-12px_rgba(139,92,246,0.9)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="glass-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                    <span className="relative flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5 animate-spin"
                            fill="none"
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
                          Müraciət göndərilir...
                        </>
                      ) : (
                        <>
                          Görüş üçün müraciət et
                          <span className="text-lg">↗</span>
                        </>
                      )}
                    </span>

                    <span className="relative hidden rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold tracking-wider sm:inline-flex">
                      SEND
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 shrink-0 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="text-center text-[10px] leading-5 text-slate-500">
                    Şəxsi məlumatlarınızın məxfiliyi qorunur.
                  </p>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </section>
  )
}
