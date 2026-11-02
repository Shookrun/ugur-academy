"use client"

import { useId, useState, type ChangeEvent, type FormEvent } from "react"

interface Props {
  partnerName: string
}

interface FormState {
  name: string
  phone: string
  topic: string
  message: string
}

const EMPTY_FORM: FormState = { name: "", phone: "", topic: "", message: "" }

const TOPIC_SUGGESTIONS: readonly string[] = [
  "Fərdi konsultasiya",
  "Məşğələyə yazılmaq",
  "Qrup dərsi",
  "Qiymət haqqında",
]

const MESSAGE_LIMIT = 280

/** "+994 50 123 45 67" formatı. Yalnız yerli hissənin 9 rəqəmini saxlayır. */
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "")

  if (digits.startsWith("994")) {
    digits = digits.slice(3)
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1)
  }

  digits = digits.slice(0, 9)
  if (digits.length === 0) return ""

  const groups = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter((part) => part.length > 0)

  return `+994 ${groups.join(" ")}`
}

function isPhoneComplete(phone: string): boolean {
  return phone.replace(/\D/g, "").length === 12
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0].charAt(0)
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""
  return (first + second).toLocaleUpperCase("az")
}

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(15,23,42,0.03)] transition placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700"

export default function PartnerContactForm({ partnerName }: Props) {
  const uid = useId()
  const ids = {
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    topic: `${uid}-topic`,
    message: `${uid}-message`,
    phoneError: `${uid}-phone-error`,
  }

  const [formData, setFormData] = useState<FormState>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [phoneError, setPhoneError] = useState<string>("")

  const updateField =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      let value = e.target.value

      if (field === "phone") {
        value = formatPhone(value)
        if (phoneError) setPhoneError("")
      }
      if (field === "message") {
        value = value.slice(0, MESSAGE_LIMIT)
      }

      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  const pickTopic = (topic: string): void => {
    setFormData((prev) => ({
      ...prev,
      topic: prev.topic === topic ? "" : topic,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!isPhoneComplete(formData.phone)) {
      setPhoneError("Nömrəni tam daxil edin. Məsələn: +994 50 123 45 67")
      return
    }

    setIsSubmitting(true)
    try {
      // Burada real API sorğusunu göndərə bilərsiniz:
      // await fetch("/api/partner-contact", { method: "POST", body: JSON.stringify({ partnerName, ...formData }) })
      await new Promise<void>((resolve) => setTimeout(resolve, 750))
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = (): void => {
    setIsSuccess(false)
    setPhoneError("")
    setFormData(EMPTY_FORM)
  }

  const initials = getInitials(partnerName)

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]">
      {/* Başlıq zolağı */}
      <div className="relative bg-slate-900 px-6 pb-7 pt-6 text-white sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 rounded-full border border-white/10"
        />

        <div className="relative flex items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-slate-900 -rotate-3"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-300">Əlaqə saxlayırsınız</p>
            <p className="truncate text-lg font-semibold leading-tight sm:text-xl">
              {partnerName}
            </p>
          </div>
        </div>

        <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Adətən 1 iş günü ərzində cavab verir
        </div>
      </div>

      {/* Məzmun */}
      <div className="p-6 sm:p-8">
        {isSuccess ? (
          <div role="status" aria-live="polite" className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Müraciətiniz qeydə alındı
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">{partnerName}</span>{" "}
              görüş və ya konsultasiya üçün sizinlə əlaqə saxlayacaq.
            </p>

            <dl className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Ad</dt>
                <dd className="truncate font-medium text-slate-900">{formData.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Nömrə</dt>
                <dd className="font-medium text-slate-900">{formData.phone}</dd>
              </div>
              {formData.topic.trim() !== "" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Mövzu</dt>
                  <dd className="truncate font-medium text-slate-900">{formData.topic}</dd>
                </div>
              )}
            </dl>

            <button
              type="button"
              onClick={resetForm}
              className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
            >
              Yeni müraciət göndər
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Görüş təyin edək
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Məşğələ, konsultasiya və ya suallarınız üçün qısa forma doldurun. Qalanını biz həll edərik.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor={ids.name} className={labelClass}>
                  Adınız və soyadınız <span className="text-amber-600">*</span>
                </label>
                <input
                  id={ids.name}
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Məs: Leyla Əliyeva"
                  value={formData.name}
                  onChange={updateField("name")}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor={ids.phone} className={labelClass}>
                  Əlaqə nömrəniz <span className="text-amber-600">*</span>
                </label>
                <input
                  id={ids.phone}
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="+994 50 123 45 67"
                  value={formData.phone}
                  onChange={updateField("phone")}
                  aria-invalid={phoneError !== ""}
                  aria-describedby={phoneError !== "" ? ids.phoneError : undefined}
                  className={`${fieldClass} ${
                    phoneError !== ""
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : ""
                  }`}
                />
                {phoneError !== "" && (
                  <p id={ids.phoneError} role="alert" className="mt-1.5 text-xs text-rose-600">
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={ids.topic} className={labelClass}>
                  Müraciət mövzusu
                </label>
                <div className="mb-2.5 flex flex-wrap gap-2">
                  {TOPIC_SUGGESTIONS.map((topic) => {
                    const active = formData.topic === topic
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => pickTopic(topic)}
                        aria-pressed={active}
                        className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {topic}
                      </button>
                    )
                  })}
                </div>
                <input
                  id={ids.topic}
                  type="text"
                  placeholder="Və ya öz mövzunuzu yazın"
                  value={formData.topic}
                  onChange={updateField("topic")}
                  className={fieldClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label htmlFor={ids.message} className="text-sm font-medium text-slate-700">
                    Qısa qeydiniz
                  </label>
                  <span
                    className={`text-xs tabular-nums ${
                      formData.message.length >= MESSAGE_LIMIT - 20
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {formData.message.length}/{MESSAGE_LIMIT}
                  </span>
                </div>
                <textarea
                  id={ids.message}
                  rows={3}
                  placeholder="Öyrənmək istədiyiniz məsələni qısaca yazın..."
                  value={formData.message}
                  onChange={updateField("message")}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 motion-safe:animate-spin"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.3} strokeWidth={3} />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
                    </svg>
                    <span>Göndərilir...</span>
                  </>
                ) : (
                  <>
                    <span>Görüş təyin et</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l14-7-5 14-2.5-5.5L5 12z" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Məlumatlarınız yalnız sizinlə əlaqə saxlamaq üçün istifadə olunur.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
