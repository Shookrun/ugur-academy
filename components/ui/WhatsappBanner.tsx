"use client"

import Link from "next/link"

const WhatsappBanner = () => {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="relative mx-auto max-w-[1840px] overflow-hidden rounded-[2rem] bg-[#082653] shadow-[0_20px_60px_rgba(8,38,83,0.16)]">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#25D366]/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#FFC400]/10 blur-3xl"
        />

        <div className="relative flex min-h-[190px] flex-col items-center justify-between gap-8 px-6 py-8 sm:px-10 lg:min-h-[210px] lg:flex-row lg:px-16 lg:py-10">
          <div className="max-w-xl text-center lg:text-left">
            <p className="mb-2 text-sm font-semibold text-[#FFC400] sm:text-base">
              Sən hələ də düşünürsən?
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Uğura ilk addımı at!
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
              Hansı kursun sənə uyğun olduğunu bilmirsən? Bizə yaz, sənin üçün
              düzgün istiqaməti birlikdə seçək.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row">
            <Link
              href="https://wa.me/994706703020"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                inline-flex
                items-center
                gap-3
                overflow-hidden
                rounded-full
                bg-[#25D366]
                px-6
                py-4
                font-semibold
                text-white
                shadow-[0_10px_35px_rgba(37,211,102,0.3)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:bg-[#20bd5b]
                hover:shadow-[0_15px_45px_rgba(37,211,102,0.45)]
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.849 1.213 3.047.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M20.52 3.449A11.863 11.863 0 0 0 12.057 0C5.495 0 .15 5.344.15 11.906c0 2.097.547 4.145 1.587 5.953L.048 24l6.29-1.65a11.87 11.87 0 0 0 5.713 1.456h.005c6.56 0 11.905-5.344 11.905-11.906a11.86 11.86 0 0 0-3.441-8.451zM12.058 21.785h-.004a9.87 9.87 0 0 1-5.03-1.378l-.361-.214-3.733.98.996-3.642-.235-.373a9.87 9.87 0 0 1-1.51-5.252c0-5.446 4.43-9.876 9.882-9.876a9.82 9.82 0 0 1 6.99 2.898 9.86 9.86 0 0 1 2.89 6.996c-.002 5.447-4.432 9.875-9.885 9.875z" />
                </svg>
              </span>

              <span className="relative">
                <span className="block text-xs font-medium text-white/70">
                  Bizə yaz
                </span>

                <span className="block text-sm sm:text-base">
                  WhatsApp-da əlaqə saxla
                </span>
              </span>

              <span className="relative text-xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <div className="hidden text-center sm:block lg:text-left">
              <p className="text-xs text-white/50">
                Birbaşa əlaqə
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                070 670 30 20
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatsappBanner