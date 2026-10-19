"use client"

import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes whatsappPulse {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }

          25% {
            opacity: 0.35;
          }

          70% {
            transform: scale(1.08);
            opacity: 0;
          }

          100% {
            transform: scale(1.08);
            opacity: 0;
          }
        }

        @keyframes whatsappOnline {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.45;
            transform: scale(0.75);
          }
        }

        @keyframes whatsappFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes whatsappShine {
          0% {
            transform: translateX(-140%) skewX(-20deg);
          }

          35%,
          100% {
            transform: translateX(240%) skewX(-20deg);
          }
        }

        .whatsapp-pulse {
          animation: whatsappPulse 2.8s ease-out infinite;
        }

        .whatsapp-online {
          animation: whatsappOnline 1.8s ease-in-out infinite;
        }

        .whatsapp-float {
          animation: whatsappFloat 2.5s ease-in-out infinite;
        }

        .whatsapp-shine {
          animation: whatsappShine 3.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .whatsapp-pulse,
          .whatsapp-online,
          .whatsapp-float,
          .whatsapp-shine {
            animation: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-300px]
            h-[600px]
            w-[600px]
            -translate-x-1/2
            rounded-full
            bg-gray-100/70
            blur-[120px]
            animate-hero-glow
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[5%]
            top-[20%]
            hidden
            h-32
            w-32
            rounded-full
            border
            border-gray-200
            lg:block
            animate-hero-float
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[15%]
            left-[5%]
            hidden
            h-20
            w-20
            rounded-full
            border
            border-gray-200
            lg:block
            animate-hero-float-reverse
          "
        />

        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1840px] items-center px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
            <div className="max-w-2xl">
              <div
                className="
                  mb-7
                  flex
                  items-center
                  gap-3
                  animate-hero-fade-up
                "
                style={{
                  animationDelay: "100ms",
                }}
              >
                <span className="h-px w-10 bg-gray-950" />

                <span className="text-sm font-semibold tracking-wide text-gray-800">
                  Təhsil və inkişaf platforması
                </span>
              </div>

              <h1
                className="
                  text-5xl
                  font-semibold
                  leading-[0.98]
                  tracking-[-0.055em]
                  text-gray-950
                  sm:text-6xl
                  lg:text-[clamp(4rem,6vw,6.8rem)]
                  animate-hero-fade-up
                "
                style={{
                  animationDelay: "200ms",
                }}
              >
                Öyrən,
                <br />

                <span className="relative inline-block">
                  İnkişaf et,

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      -bottom-2
                      left-0
                      h-[3px]
                      w-0
                      rounded-full
                      bg-gray-950
                      animate-hero-line
                    "
                    style={{
                      animationDelay: "900ms",
                    }}
                  />
                </span>

                <br />

                <span className="text-gray-950">
                  Gələcəyini qur !
                </span>
              </h1>

              <p
                className="
                  mt-8
                  max-w-xl
                  text-base
                  leading-7
                  text-gray-800
                  sm:text-lg
                  sm:leading-8
                  animate-hero-fade-up
                "
                style={{
                  animationDelay: "350ms",
                }}
              >
                Uğur Şəxsi İnkişaf Mərkəzi olaraq təhsil və inkişaf sahəsində
                yüzlərlə insanın həyatına pozitiv təsir etmişik. Hər yaş və
                peşə qrupuna uyğun kurslarla uğura aparan dəstəyi təqdim
                edirik. Müasir bilik və bacarıqları öyrənərək öz gələcəyini
                qur. Sənin inkişafın üçün lazım olan təhsil burada başlayır.
              </p>

              <div
                className="
                  mt-9
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:flex-wrap
                  animate-hero-fade-up
                "
                style={{
                  animationDelay: "500ms",
                }}
              >
                <Link
                  href="/kurslar"
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-gray-950
                    px-7
                    py-3.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-gray-800
                    hover:shadow-xl
                  "
                >
                  Kurslara bax

                  <span
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </Link>

                <Link
                  href="/haqqimizda"
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    border
                    border-gray-200
                    bg-white/60
                    px-7
                    py-3.5
                    text-sm
                    font-medium
                    text-gray-900
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-gray-400
                    hover:bg-white
                    hover:shadow-lg
                  "
                >
                  Haqqımızda

                  <span
                    className="
                      text-gray-400
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    ↗
                  </span>
                </Link>

                <Link
                  href="https://wa.me/994706703020"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp ilə pulsuz məsləhət al"
                  className="
                    whatsapp-float
                    group
                    relative
                    inline-flex
                    h-[62px]
                    items-center
                    gap-3
                    overflow-visible
                    rounded-full
                    border
                    border-[#e6b000]
                    bg-[#FFC400]
                    pl-2
                    pr-3
                    text-gray-950
                    shadow-[0_10px_30px_rgba(255,196,0,0.25)]
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:scale-[1.035]
                    hover:border-[#d9a900]
                    hover:bg-[#FFD21F]
                    hover:shadow-[0_20px_50px_rgba(255,196,0,0.42)]
                    active:scale-[0.98]
                    sm:min-w-[285px]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      whatsapp-pulse
                      pointer-events-none
                      absolute
                      -inset-2
                      rounded-full
                      bg-[#FFC400]/25
                      blur-md
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -inset-[3px]
                      rounded-full
                      border
                      border-[#FFC400]/50
                      opacity-0
                      transition-all
                      duration-500
                      group-hover:scale-105
                      group-hover:opacity-100
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-full
                    "
                  >
                    <span
                      className="
                        whatsapp-shine
                        absolute
                        left-[-80%]
                        top-0
                        h-full
                        w-[42%]
                        rotate-[20deg]
                        bg-gradient-to-r
                        from-transparent
                        via-white/65
                        to-transparent
                        blur-[2px]
                      "
                    />
                  </span>

                  <span
                    className="
                      relative
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#25D366]
                      shadow-[0_4px_15px_rgba(0,0,0,0.12)]
                      transition-all
                      duration-500
                      group-hover:rotate-[-8deg]
                      group-hover:scale-110
                      group-hover:shadow-[0_7px_24px_rgba(37,211,102,0.35)]
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        whatsapp-online
                        absolute
                        right-0
                        top-0
                        h-3
                        w-3
                        rounded-full
                        bg-[#25D366]
                        ring-2
                        ring-white
                      "
                    />

                    <svg
                      viewBox="0 0 24 24"
                      className="
                        h-6
                        w-6
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.371.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.198 0-.52.075-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.849 1.213 3.047.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M20.52 3.449A11.863 11.863 0 0 0 12.057 0C5.495 0 .15 5.344.15 11.906c0 2.097.547 4.145 1.587 5.953L.048 24l6.29-1.65a11.87 11.87 0 0 0 5.713 1.456h.005c6.56 0 11.905-5.344 11.905-11.906a11.86 11.86 0 0 0-3.441-8.451zM12.058 21.785h-.004a9.87 9.87 0 0 1-5.03-1.378l-.361-.214-3.733.98.996-3.642-.235-.373a9.87 9.87 0 0 1-1.51-5.252c0-5.446 4.43-9.876 9.882-9.876a9.82 9.82 0 0 1 6.99 2.898 9.86 9.86 0 0 1 2.89 6.996c-.002 5.447-4.432 9.875-9.885 9.875z" />
                    </svg>
                  </span>

                  <span className="relative flex min-w-0 flex-1 flex-col items-start leading-none">
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-gray-700/65
                        transition-colors
                        duration-300
                        group-hover:text-gray-950
                      "
                    >
                      <span
                        className="
                          whatsapp-online
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-[#25D366]
                        "
                      />

                      İndi onlaynıq
                    </span>

                    <span
                      className="
                        mt-1.5
                        text-sm
                        font-bold
                        tracking-tight
                        text-gray-950
                      "
                    >
                      Pulsuz məsləhət al
                    </span>
                  </span>

                  <span
                    className="
                      relative
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      bg-gray-950
                      text-white
                      transition-all
                      duration-500
                      group-hover:rotate-[-8deg]
                      group-hover:bg-[#25D366]
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        scale-0
                        rounded-full
                        bg-white/15
                        transition-transform
                        duration-500
                        group-hover:scale-100
                      "
                    />

                    <span
                      className="
                        relative
                        text-base
                        transition-transform
                        duration-500
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </span>
                </Link>
              </div>

              <div
                className="
                  mt-12
                  flex
                  flex-wrap
                  gap-x-10
                  gap-y-6
                  border-t
                  border-gray-100
                  pt-7
                  animate-hero-fade-up
                "
                style={{
                  animationDelay: "650ms",
                }}
              >
                <div className="group">
                  <p className="text-2xl font-semibold tracking-tight text-gray-950 transition-transform duration-300 group-hover:-translate-y-1">
                    10+
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Kurs
                  </p>
                </div>

                <div className="h-10 w-px bg-gray-100" />

                <div className="group">
                  <p className="text-2xl font-semibold tracking-tight text-gray-950 transition-transform duration-300 group-hover:-translate-y-1">
                    1000+
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Tələbə
                  </p>
                </div>

                <div className="h-10 w-px bg-gray-100" />

                <div className="group">
                  <p className="text-2xl font-semibold tracking-tight text-gray-950 transition-transform duration-300 group-hover:-translate-y-1">
                    5+
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    İl təcrübə
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                relative
                flex
                w-full
                items-center
                justify-center
                animate-hero-image
              "
              style={{
                animationDelay: "250ms",
              }}
            >
              <div
                aria-hidden="true"
                className="
                  absolute
                  -right-8
                  -top-8
                  h-24
                  w-24
                  rounded-full
                  border
                  border-gray-200
                  sm:-right-12
                  sm:-top-12
                  sm:h-32
                  sm:w-32
                "
              />

              <div className="relative h-[480px] w-full max-w-[620px] sm:h-[540px]">
                <div
                  className="
                    group
                    absolute
                    bottom-0
                    left-0
                    z-10
                    w-[52%]
                    overflow-hidden
                    rounded-[2rem]
                    border-2
                    border-white
                    bg-gray-100
                    shadow-2xl
                    shadow-gray-300/60
                    transition-transform
                    duration-700
                    hover:-translate-y-2
                    hover:shadow-3xl
                  "
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src="/student_boy.jpg"
                    fill
                    alt="Gülərüz oğlan şagird"
                    sizes="(max-width: 1023px) 50vw, 310px"
                    className="
                      object-cover
                      object-top
                      transition-transform
                      duration-[1200ms]
                      group-hover:scale-[1.04]
                    "
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
                </div>

                <div
                  className="
                    group
                    absolute
                    right-0
                    top-0
                    z-20
                    w-[52%]
                    overflow-hidden
                    rounded-[2rem]
                    border-2
                    border-white
                    bg-gray-100
                    shadow-2xl
                    shadow-gray-300/60
                    transition-transform
                    duration-700
                    hover:-translate-y-2
                    hover:shadow-3xl
                  "
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src="/student_girl.jpg"
                    fill
                    alt="Gülərüz qız şagird"
                    sizes="(max-width: 1023px) 50vw, 310px"
                    className="
                      object-cover
                      object-top
                      transition-transform
                      duration-[1200ms]
                      group-hover:scale-[1.04]
                    "
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
                </div>

                <div
                  className="
                    absolute
                    -bottom-5
                    left-4
                    z-30
                    hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white/95
                    px-5
                    py-3
                    shadow-xl
                    backdrop-blur-md
                    sm:block
                    animate-hero-card
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-950
                        text-sm
                        text-white
                      "
                    >
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-950">
                        1000+ Tələbə
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        Hər il böyüyürük
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    absolute
                    -right-3
                    top-1/2
                    z-30
                    hidden
                    -translate-y-1/2
                    rounded-full
                    border
                    border-gray-100
                    bg-white/95
                    px-4
                    py-2
                    text-xs
                    font-medium
                    text-gray-700
                    shadow-lg
                    backdrop-blur-md
                    sm:block
                  "
                >
                  Gələcəyə doğru →
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gray-100" />

        <div
          className="
            absolute
            bottom-7
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-3
            text-[10px]
            font-medium
            uppercase
            tracking-[0.2em]
            text-gray-300
            lg:flex
          "
        >
          <span className="h-8 w-px bg-gray-200" />
          Scroll
        </div>
      </section>
    </>
  )
}

export default Hero