"use client"

import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

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

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1840px] items-center px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_0.9fr] lg:gap-24">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="max-w-2xl">

            {/* Eyebrow */}

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

              <span className="text-sm font-medium tracking-wide text-gray-500">
                Təhsil və inkişaf platforması
              </span>
            </div>

            {/* Heading */}

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
              Öyrən.
              <br />

              <span className="relative inline-block">
                İnkişaf et.

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

              <span className="text-gray-400">
                Gələcəyini qur.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-8
                max-w-xl
                text-base
                leading-7
                text-gray-500
                sm:text-lg
                sm:leading-8
                animate-hero-fade-up
              "
              style={{
                animationDelay: "350ms",
              }}
            >
              Müasir bilik və bacarıqları öyrənərək öz gələcəyini
              qur. Sənin inkişafın üçün lazım olan təhsil burada
              başlayır.
            </p>

            {/* Buttons */}

            <div
              className="
                mt-9
                flex
                flex-col
                gap-3
                sm:flex-row
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
            </div>

            {/* Statistics */}

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

          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

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

            {/* Decorative circle */}

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

            {/* Two students layout */}

            <div className="relative w-full max-w-[620px] h-[480px] sm:h-[540px]">

              {/* BOY STUDENT — left, slightly lower */}
              <div
                className="
                  group
                  absolute
                  left-0
                  bottom-0
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
                {/* overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
              </div>

              {/* GIRL STUDENT — right, slightly higher */}
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
                {/* overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5" />
              </div>

              {/* Floating badge — bottom left */}
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

              {/* Floating label — right */}
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

      {/* =====================================================
          BOTTOM LINE
      ====================================================== */}

      <div className="absolute bottom-0 left-0 h-px w-full bg-gray-100" />

      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

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
  )
}

export default Hero