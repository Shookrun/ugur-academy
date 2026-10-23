```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type FormEvent } from "react"

const footerLinks = [
  { name: "Əsas", href: "/" },
  { name: "Kurslarımız", href: "/kurslar" },
  { name: "Xəbərlər", href: "/xeberler" },
  { name: "Haqqımızda", href: "/haqqimizda" },
  { name: "Əlaqə", href: "/elaqe" },
  { name: "Arxiv", href: "/arxiv" },
]

const services = [
  "Təhsil proqramları",
  "Peşəkar inkişaf",
  "Kurslar",
  "Fərdi inkişaf",
]

const socialLinkClass =
  "group flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-gray-950 hover:bg-gray-950 hover:text-white"

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) return

    setSubmitted(true)
    setEmail("")

    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  return (
    <footer className="relative overflow-hidden">
      <div className="h-px w-full bg-gray-100" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[350px] w-[350px] rounded-full bg-gray-100/70 blur-[100px] transition-transform duration-1000"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-gray-100/80 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1840px] px-6 sm:px-8 lg:px-10">
        <div className="grid gap-14 py-20 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1.2fr] lg:gap-16 lg:py-24">
          <div className="max-w-md">
            <Link href="/" className="group inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-2 group-hover:shadow-lg">
                <img
                  src="/logo.png"
                  alt="Uğur Şəxsi İnkişaf Mərkəzi"
                  className="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div>
                <span className="block text-xs tracking-wide text-gray-400">
                  Təhsil və inkişaf platforması
                </span>
              </div>
            </Link>

            <p className="mt-7 max-w-sm text-sm leading-7 text-gray-500">
              Öyrənmək, inkişaf etmək və gələcəyə hazırlaşmaq
              üçün müasir təhsil imkanlarını bir araya gətiririk.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialLinkClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2H6.8v3.2h2.8V21h3.9Z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/haciqabul_shexsi_inkishaf?psln=MXZoNWd3OTFwejI2bA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Hacı Qabul"
                title="Hacı Qabul Şəxsi İnkişaf"
                className={socialLinkClass}
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.instagram.com/shirvan_shexsi_inkishaf?psln=MXZoNWd3OTFwejI2bA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Şirvan"
                title="Şirvan Şəxsi İnkişaf"
                className={socialLinkClass}
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.tiktok.com/@ugur.kurs?_r=1&_t=ZS-9Ak4GjnU320"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={socialLinkClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-4.22-4.22V2h-3.45v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1 0-5.8c.3 0 .6.05.87.14V9.39a6.3 6.3 0 0 0-.87-.06 6.35 6.35 0 1 0 6.35 6.34V8.7a8.2 8.2 0 0 0 4.8 1.55V6.8a4.8 4.8 0 0 1-.58-.11Z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@ugur_shexsi_inkishaf?si=DcrFrpJAVMxn8W49"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={socialLinkClass}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 bg-black" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Keçidlər
              </h3>
            </div>

            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-sm text-gray-500 transition-all duration-300 hover:translate-x-1 hover:text-gray-950"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-300 transition-all duration-300 group-hover:w-3 group-hover:bg-gray-950" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 bg-black" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                İmkanlar
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <div
                  key={service}
                  className="group flex items-center gap-3 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-950"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-[9px] text-gray-400 transition-all duration-300 group-hover:border-gray-950 group-hover:bg-gray-950 group-hover:text-white">
                    →
                  </span>
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-6 bg-black" />
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Yeniliklər
              </h3>
            </div>

            <h3 className="max-w-sm text-2xl font-semibold leading-tight tracking-[-0.03em] text-gray-950">
              Yeniliklərdən
              <br />
              xəbərdar ol.
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Yeni kurslar və yeniliklər haqqında məlumat
              almaq üçün e-poçt ünvanını qeyd et.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="group flex overflow-hidden rounded-2xl border border-gray-200 p-1 transition-all duration-300 focus-within:border-gray-400 focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="E-poçt ünvanınız"
                  required
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                <button
                  type="submit"
                  aria-label="Abunə ol"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white transition-all duration-300 hover:bg-gray-700 active:scale-95"
                >
                  →
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  submitted
                    ? "mt-3 max-h-10 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-xs font-medium text-gray-500">
                  ✓ Uğurla göndərildi.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 px-7 py-8 sm:px-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                Gələcəyə birlikdə
              </p>

              <p className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                Öyrən. İnkişaf et. Gələcəyini qur.
              </p>
            </div>

            <Link
              href="/kurslar"
              className="group inline-flex w-fit items-center gap-4 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(255,255,255,0.15)]"
            >
              Kurslara bax
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium tracking-wide text-gray-400">
            © {new Date().getFullYear()} Uğur Şəxsi İnkişaf Mərkəzi. Bütün hüquqlar qorunur.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/mexfilik"
              className="text-xs text-gray-400 transition-colors duration-300 hover:text-gray-950"
            >
              Məxfilik
            </Link>

            <Link
              href="/sertler"
              className="text-xs text-gray-400 transition-colors duration-300 hover:text-gray-950"
            >
              Şərtlər
            </Link>

            <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />

            <span className="text-xs font-medium text-gray-300">
              Azerbaijan
            </span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gray-100" />
    </footer>
  )
}
```
