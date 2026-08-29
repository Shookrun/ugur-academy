"use client"

import { useState } from "react"

interface Props {
  partnerName: string
}

export default function PartnerContactForm({ partnerName }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    topic: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 750)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8">
      {isSuccess ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-900">
            ✓
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Müraciətiniz qeydə alındı!
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500 sm:text-sm">
            Təşəkkür edirik. <span className="font-semibold text-slate-700">{partnerName}</span> ilə görüş və ya konsultasiya üçün sizinlə əlaqə saxlanılacaq.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false)
              setFormData({ name: "", phone: "", topic: "", message: "" })
            }}
            className="mt-5 inline-flex cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Yenidən göndər
          </button>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
              Fərdi Görüş & Konsultasiya
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Mütəxəssislə əlaqə saxlayın
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Məşğələ, konsultasiya və ya suallarınız üçün formu doldurun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="pName" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Adınız və Soyadınız *
              </label>
              <input
                id="pName"
                type="text"
                required
                placeholder="Məs: Leyla Əliyeva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label htmlFor="pPhone" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Əlaqə nömrəniz *
              </label>
              <input
                id="pPhone"
                type="tel"
                required
                placeholder="+994 50 000 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label htmlFor="pTopic" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Müraciət mövzusu
              </label>
              <input
                id="pTopic"
                type="text"
                placeholder="Məs: Fərdi konsultasiya saatı"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label htmlFor="pMsg" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Qısa qeydiniz
              </label>
              <textarea
                id="pMsg"
                rows={2}
                placeholder="Öyrənmək istədiyiniz məsələ..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                  <span>Görüş təyin et</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
