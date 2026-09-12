import type { Metadata } from "next"
import fs from "fs/promises"
import path from "path"

export const metadata: Metadata = {
  title: "Əlaqə | Uğur Şəxsi İnkişaf Mərkəzi",
  description:
    "Hacıqabul və Şirvan filiallarımızla əlaqə saxlayın. Ünvanlar, telefon nömrələri, Google Xəritə.",
}

const defaultBranches = [
  {
    id: "haciqabul",
    city: "Hacıqabul",
    emoji: "🏙️",
    address: "Hacıqabul şəhəri, Mərkəzi küçə 12",
    phone: "+994 50 000 00 01",
    phoneRaw: "+994500000001",
    whatsapp: "https://wa.me/994500000001",
    instagram: "https://www.instagram.com/ugur.academy",
    facebook: "https://www.facebook.com/ugur.academy",
    mapSrc:
      "https://maps.google.com/maps?q=Hac%C4%B1qabul&t=&z=13&ie=UTF8&iwloc=&output=embed",
    colorFrom: "#f0fdf4",
    colorTo: "#ecfdf5",
    accent: "#16a34a",
    borderColor: "#bbf7d0",
  },
  {
    id: "sirvan",
    city: "Şirvan",
    emoji: "🌆",
    address: "Şirvan şəhəri, İstiqlaliyyət küçəsi 7",
    phone: "+994 50 000 00 02",
    phoneRaw: "+994500000002",
    whatsapp: "https://wa.me/994500000002",
    instagram: "https://www.instagram.com/ugur.academy.sirvan",
    facebook: "https://www.facebook.com/ugur.academy.sirvan",
    mapSrc:
      "https://maps.google.com/maps?q=%C5%9Eirvan+Az%C9%99rbaycan&t=&z=13&ie=UTF8&iwloc=&output=embed",
    colorFrom: "#faf5ff",
    colorTo: "#ede9fe",
    accent: "#7c3aed",
    borderColor: "#ddd6fe",
  },
]

async function getLiveBranches() {
  try {
    const dataFilePath = path.join(process.cwd(), "data", "dynamic_branches.json")
    const file = await fs.readFile(dataFilePath, "utf-8")
    return JSON.parse(file)
  } catch {
    return defaultBranches
  }
}

export default async function ContactPage() {
  const branches = await getLiveBranches()
  return (
    <div className="relative min-h-screen pt-28 pb-24 sm:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-slate-950" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Əlaqə
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Bizimlə əlaqə
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
            Hacıqabul və Şirvan filiallarımızdan hər hansı birinə müraciət edə
            bilərsiniz.
          </p>
        </div>

        {/* Branch Cards */}
        <div className="grid gap-10 lg:grid-cols-2">
          {branches.map((branch: any) => (
            <div
              key={branch.id}
              id={branch.id}
              className="group relative overflow-hidden rounded-[2.5rem] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${branch.colorFrom}, ${branch.colorTo})`,
                border: `1px solid ${branch.borderColor}`,
              }}
            >
              {/* Accent top bar */}
              <div
                className="h-1 w-full"
                style={{ background: branch.accent }}
              />

              <div className="p-8 sm:p-10">

                {/* City header */}
                <div className="mb-6 flex items-center gap-4">

                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                      {branch.city}
                    </h2>
                    <p className="text-sm text-slate-500">Filialımız</p>
                  </div>
                </div>

                {/* Google Map */}
                <div className="mb-7 overflow-hidden rounded-2xl border border-white shadow-md">
                  <iframe
                    title={`${branch.city} xəritə`}
                    src={branch.mapSrc}
                    width="100%"
                    height="260"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Info rows */}
                <div className="space-y-4">

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                      style={{ background: "rgba(0,0,0,0.06)" }}
                    >
                      📍
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Ünvan
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                      style={{ background: "rgba(0,0,0,0.06)" }}
                    >
                      📞
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Mobil nömrə
                      </p>
                      <a
                        href={`tel:${branch.phoneRaw}`}
                        className="mt-0.5 block text-sm font-bold text-slate-900 transition-colors hover:text-amber-600"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                </div>

                {/* Social + map buttons */}
                <div className="mt-7 flex flex-wrap items-center gap-3">

                  {/* WhatsApp */}
                  <a
                    href={branch.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${branch.city} WhatsApp`}
                    className="
                      flex items-center gap-2 rounded-xl border border-slate-200
                      bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700
                      shadow-sm backdrop-blur-sm transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-[#25D366] hover:border-transparent
                      hover:text-white hover:shadow-md
                    "
                  >
                    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>

                  {/* Instagram */}
                  <a
                    href={branch.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${branch.city} Instagram`}
                    className="
                      flex items-center gap-2 rounded-xl border border-slate-200
                      bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700
                      shadow-sm backdrop-blur-sm transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-pink-500
                      hover:to-purple-600 hover:border-transparent hover:text-white hover:shadow-md
                    "
                  >
                    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>

                  {/* Facebook */}
                  <a
                    href={branch.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${branch.city} Facebook`}
                    className="
                      flex items-center gap-2 rounded-xl border border-slate-200
                      bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700
                      shadow-sm backdrop-blur-sm transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-blue-600 hover:border-transparent
                      hover:text-white hover:shadow-md
                    "
                  >
                    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>

                  {/* Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${branch.city} Google Xəritə`}
                    className="
                      flex items-center gap-2 rounded-xl border border-slate-200
                      bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700
                      shadow-sm backdrop-blur-sm transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-green-600 hover:border-transparent
                      hover:text-white hover:shadow-md
                    "
                  >
                    🗺️ Xəritədə aç
                  </a>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-10 sm:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Hər zaman buradayıq
              </p>
              <p className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                Sualınız var? Bizimlə əlaqə saxlayın.
              </p>
            </div>
            <a
              href="tel:+994500000001"
              className="
                group inline-flex w-fit items-center gap-3 rounded-full
                border border-white/20 bg-white/10 px-6 py-3.5
                text-sm font-semibold text-white backdrop-blur-sm
                transition-all duration-300 hover:-translate-y-0.5
                hover:bg-white hover:text-slate-950
                hover:shadow-[0_15px_35px_rgba(255,255,255,0.2)]
              "
            >
              📞 Zəng edin
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
