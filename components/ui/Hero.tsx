import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden ">
      <div className="mx-auto flex min-h-screen max-w-[1840px] items-center justify-between px-6 py-32 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2 lg:gap-24">

          <div className="max-w-2xl">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-black" />

              <span className="text-sm font-medium tracking-wide text-gray-500">
                Təhsil və inkişaf platforması
              </span>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-gray-950 sm:text-6xl lg:text-7xl">
              Öyrən.
              <br />
              İnkişaf et.
              <br />
              <span className="text-gray-400">
                Gələcəyini qur.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              Müasir bilik və bacarıqları öyrənərək öz gələcəyini
              qur. Sənin inkişafın üçün lazım olan təhsil burada
              başlayır.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/kurslar"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-gray-950
                  px-7 py-3.5
                  text-sm font-medium text-white
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-gray-800
                "
              >
                Kurslara bax
              </Link>

              <Link
                href="/haqqimizda"
                className="
                  inline-flex items-center justify-center
                  rounded-full border border-gray-200
                  px-7 py-3.5
                  text-sm font-medium text-gray-900
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:border-gray-400
                  hover:bg-gray-50
                "
              >
                Haqqımızda
              </Link>

            </div>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-gray-100 pt-7">

              <div>
                <p className="text-xl font-semibold tracking-tight text-gray-950">
                  10+
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Kurs
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold tracking-tight text-gray-950">
                  1000+
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Tələbə
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold tracking-tight text-gray-950">
                  5+
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  İl təcrübə
                </p>
              </div>

            </div>
          </div>

          {/* Sağ tərəf */}
          <div className="flex w-full items-center justify-center">

            {/* Şəkil konteyneri */}
            <div
              className="
                relative
                w-full
                max-w-[560px]
                overflow-hidden
                rounded-[2rem]
                border
                border-gray-100
                bg-gray-50
                shadow-sm
                transition-transform
                duration-500
                hover:scale-[1.01]
              "
            >

              {/* Şəkil */}
              <Image
                src="/hero.jpeg"
                width={1200}
                height={900}
                alt="Gələcəyə doğru inkişaf"
                priority
                className="
                  block
                  h-auto
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-[1.03]
                "
              />

              {/* Üst dekorativ xətt */}
              <div className="absolute left-7 top-7 h-14 w-14 border-l border-t border-white/70" />

              {/* Aşağı dekorativ xətt */}
              <div className="absolute bottom-7 right-7 h-14 w-14 border-b border-r border-white/70" />

           
              <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-white" />

            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gray-100" />
    </section>
  )
}

export default Hero