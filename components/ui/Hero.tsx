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

            {/* Image */}

            <div
              className="
                group
                relative
                w-full
                max-w-[620px]
                overflow-visible
              "
            >

              {/* Image shadow/background */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-5
                  rounded-[2.5rem]
                  bg-gray-200/50
                  blur-2xl
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* Image container */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[2.5rem]
                  border
                  border-white
                  bg-gray-100
                  shadow-2xl
                  shadow-gray-200/60
                  transition-transform
                  duration-700
                  group-hover:-translate-y-2
                "
              >
                <Image
                  src="/hero.jpeg"
                  width={1200}
                  height={900}
                  alt="Gələcəyə doğru inkişaf"
                  priority
                  sizes="
                    (max-width: 1023px) 100vw,
                    620px
                  "
                  className="
                    block
                    h-auto
                    w-full
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    group-hover:scale-[1.04]
                  "
                />

                {/* Image overlay */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    via-transparent
                    to-white/10
                  "
                />

                {/* Top corner */}

                <div
                  className="
                    absolute
                    left-7
                    top-7
                    h-14
                    w-14
                    border-l
                    border-t
                    border-white/80
                    transition-all
                    duration-500
                    group-hover:left-9
                    group-hover:top-9
                  "
                />

                {/* Bottom corner */}

                <div
                  className="
                    absolute
                    bottom-7
                    right-7
                    h-14
                    w-14
                    border-b
                    border-r
                    border-white/80
                    transition-all
                    duration-500
                    group-hover:bottom-9
                    group-hover:right-9
                  "
                />

                {/* Dot */}

                <div
                  className="
                    absolute
                    right-8
                    top-8
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-white
                    shadow-lg
                    animate-hero-dot
                  "
                />
              </div>

              {/* =================================================
                  FLOATING CARD
              ================================================= */}

              <div
                className="
                  absolute
                  -bottom-7
                  -left-5
                  z-10
                  hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white/95
                  px-5
                  py-4
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
                      h-10
                      w-10
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
                      İnkişaf burada başlayır
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Öyrən • İnkişaf et
                    </p>
                  </div>

                </div>
              </div>

              {/* =================================================
                  TOP LABEL
              ================================================= */}

              <div
                className="
                  absolute
                  -right-4
                  bottom-16
                  z-10
                  hidden
                  rounded-full
                  border
                  border-gray-100
                  bg-white/95
                  px-4
                  py-2.5
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