"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { PointerEvent } from "react"

const partnerSlugMap: Record<string, string> = {
  "Mehman Bayramov": "mehman-bayramov",
  "Aynur Ələkbərova": "aynur-elekberova",
  "Könül Əsədova": "konul-esedova",
  "Gülnaz Cəfərova": "gulnaz-ceferova",
  "Səkinə Babayeva": "sekine-babayeva",
  "Fidan Məmmədli": "fidan-memmedli",
  "Günay Məmmədova": "gunay-memmedova",
}

const partners = [
  {
    name: "Mehman Bayramov",
    position: "Əməkdaş",
    logo: "/Mehman Bayramov.jpg",
  },
  {
    name: "Aynur Ələkbərova",
    position: "Əməkdaş",
    logo: "/Aynur Ələkbərova.jpg",
  },
  {
    name: "Könül Əsədova",
    position: "Əməkdaş",
    logo: "/Könül Əsədova.jpg",
  },
  {
    name: "Gülnaz Cəfərova",
    position: "Əməkdaş",
    logo: "/Gülnaz Cəfərova.jpg",
  },
  {
    name: "Səkinə Babayeva",
    position: "Əməkdaş",
    logo: "/Səkinə Babayeva.jpg",
  },
  {
    name: "Fidan Məmmədli",
    position: "Əməkdaş",
    logo: "/Fidan Məmmədli.jpg",
  },
  {
    name: "Günay Məmmədova",
    position: "Əməkdaş",
    logo: "/Günay Məmmədova.jpg",
  },
]

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const activePointerId = useRef<number | null>(null)

  const [dragging, setDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  /* =========================================================
     SECTION SCROLL ANIMATION
  ========================================================= */

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -80px 0px",
      }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  /* =========================================================
     KART + GAP ÖLÇÜSÜ
  ========================================================= */

  const getScrollAmount = () => {
    const slider = sliderRef.current

    if (!slider) {
      return 398
    }

    const card = slider.querySelector(
      "[data-partner-card]"
    ) as HTMLElement | null

    if (!card) {
      return 398
    }

    const styles = window.getComputedStyle(slider)

    const gap =
      parseFloat(styles.columnGap || styles.gap || "0") || 0

    return card.offsetWidth + gap
  }

  /* =========================================================
     NEXT
  ========================================================= */

  const nextSlide = () => {
    const slider = sliderRef.current

    if (!slider) return

    const amount = getScrollAmount()

    const maxScroll =
      slider.scrollWidth - slider.clientWidth

    const nextPosition = Math.min(
      slider.scrollLeft + amount,
      maxScroll
    )

    slider.scrollTo({
      left: nextPosition,
      behavior: "smooth",
    })
  }

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previousSlide = () => {
    const slider = sliderRef.current

    if (!slider) return

    const amount = getScrollAmount()

    slider.scrollTo({
      left: Math.max(
        0,
        slider.scrollLeft - amount
      ),
      behavior: "smooth",
    })
  }

  /* =========================================================
     POINTER DOWN
  ========================================================= */

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const slider = sliderRef.current

    if (!slider) return

    const target = event.target as HTMLElement

    if (
      target.closest("button") ||
      target.closest("a")
    ) {
      return
    }

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return
    }

    isDragging.current = true
    hasMoved.current = false

    activePointerId.current = event.pointerId

    startX.current = event.clientX
    startScrollLeft.current = slider.scrollLeft

    setDragging(true)

    try {
      slider.setPointerCapture(event.pointerId)
    } catch {}
  }

  /* =========================================================
     POINTER MOVE
  ========================================================= */

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const slider = sliderRef.current

    if (
      !slider ||
      !isDragging.current ||
      activePointerId.current !== event.pointerId
    ) {
      return
    }

    const distance =
      event.clientX - startX.current

    if (Math.abs(distance) > 5) {
      hasMoved.current = true
    }

    if (!hasMoved.current) {
      return
    }

    slider.scrollLeft =
      startScrollLeft.current - distance

    if (event.pointerType === "mouse") {
      event.preventDefault()
    }
  }

  /* =========================================================
     STOP DRAGGING
  ========================================================= */

  const stopDragging = (
    event?: PointerEvent<HTMLDivElement>
  ) => {
    const slider = sliderRef.current

    if (!isDragging.current) {
      return
    }

    if (
      slider &&
      event &&
      activePointerId.current === event.pointerId
    ) {
      try {
        if (
          slider.hasPointerCapture(event.pointerId)
        ) {
          slider.releasePointerCapture(
            event.pointerId
          )
        }
      } catch {}
    }

    isDragging.current = false
    activePointerId.current = null

    setDragging(false)

    window.setTimeout(() => {
      hasMoved.current = false
    }, 0)
  }

  /* =========================================================
     POINTER CANCEL
  ========================================================= */

  const handlePointerCancel = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const slider = sliderRef.current

    if (
      slider &&
      activePointerId.current === event.pointerId
    ) {
      try {
        if (
          slider.hasPointerCapture(event.pointerId)
        ) {
          slider.releasePointerCapture(
            event.pointerId
          )
        }
      } catch {}
    }

    isDragging.current = false
    activePointerId.current = null

    setDragging(false)
    hasMoved.current = false
  }

  /* =========================================================
     LOST POINTER CAPTURE
  ========================================================= */

  const handleLostPointerCapture = () => {
    if (!isDragging.current) {
      return
    }

    isDragging.current = false
    activePointerId.current = null

    setDragging(false)

    window.setTimeout(() => {
      hasMoved.current = false
    }, 0)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden "
    >
      <div
        className="
          mx-auto
          max-w-full
          px-6
          py-24
          sm:px-8
          lg:px-10
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          {/* LEFT */}

          <div
            className={`
              max-w-2xl
              transform
              transition-all
              duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }
            `}
          >
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`
                  h-px
                  bg-black
                  transition-all
                  duration-700
                  ${
                    isVisible
                      ? "w-8 opacity-100"
                      : "w-0 opacity-0"
                  }
                `}
              />

              <span
                className="
                  text-sm
                  font-medium
                  tracking-wide
                  text-gray-500
                "
              >
                Əməkdaşlarımız
              </span>
            </div>

            <h2
              className="
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-[-0.04em]
                text-gray-950
                sm:text-5xl
                lg:text-6xl
              "
            >
              Birlikdə
              <br />
              daha güclüyük.
            </h2>
          </div>

          {/* RIGHT */}

          <div
            className={`
              max-w-xl
              lg:ml-auto
              transform
              transition-all
              delay-150
              duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }
            `}
          >
            <p
              className="
                text-base
                leading-7
                text-gray-500
                sm:text-lg
                sm:leading-8
              "
            >
              Layihəmizin inkişafında bizimlə birlikdə çalışan
              dəyərli və peşəkar əməkdaşlarımız.
            </p>
          </div>
        </div>

        {/* =====================================================
            SLIDER
        ====================================================== */}

        <div
          className={`
            relative
            mt-14
            transform
            transition-all
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }
          `}
        >


          

          <div
            ref={sliderRef}
            className={`
              flex
              gap-7
              overflow-x-auto
              overflow-y-hidden
              py-6
              select-none
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              ${
                dragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
              }
            `}
            style={{
              touchAction: "pan-y",
              WebkitOverflowScrolling: "touch",
              userSelect: "none",
              scrollbarWidth: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={handlePointerCancel}
            onLostPointerCapture={
              handleLostPointerCapture
            }
          >
            {partners.map((partner, index) => (
              <article
                key={partner.name}
                data-partner-card
                className={`
                  group
                  relative
                  w-[300px]
                  shrink-0
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-gray-100
                  
                  shadow-sm

                  transform

                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  hover:-translate-y-2
                  hover:shadow-xl

                  ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: isVisible
                    ? `${250 + index * 100}ms`
                    : "0ms",
                }}
              >
                {/* =================================================
                    IMAGE
                ================================================== */}

                <div
                  className="
                    relative
                    h-[390px]
                    overflow-hidden
                    bg-gray-100
                    sm:h-[430px]
                    lg:h-[450px]
                  "
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    draggable={false}
                    sizes="
                      (max-width: 639px) 300px,
                      (max-width: 1023px) 350px,
                      380px
                    "
                    className="
                      pointer-events-none
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/40
                      via-black/0
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* NUMBER */}

                  <div
                    className="
                      absolute
                      left-6
                      top-6
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/50
                      bg-black/20
                      text-xs
                      font-medium
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* DOT */}

                  <div
                    className="
                      absolute
                      right-7
                      top-7
                      h-2
                      w-2
                      rounded-full
                      
                      shadow
                    "
                  />
                </div>

                {/* =================================================
                    INFO
                ================================================== */}

                <div
                  className="
                    px-7
                    pb-7
                    pt-6
                  "
                >
                  <div
                    className="
                      mb-5
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-px
                        w-8
                        bg-black
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-gray-400
                      "
                    >
                      Əməkdaş
                    </span>
                  </div>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      tracking-[-0.025em]
                      text-gray-950
                      sm:text-2xl
                    "
                  >
                    {partner.name}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    {partner.position}
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      items-center
                      justify-between
                      border-t
                      border-gray-100
                      pt-5
                    "
                  >
                    <span
                      className="
                        text-xs
                        font-medium
                        tracking-wide
                        text-gray-400
                      "
                    >
                      Uğur Şəxsi İnkişaf Mərkəzi
                    </span>

                    <Link
                      href={`/emekdaslar/${partnerSlugMap[partner.name]}`}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gray-200
                        text-sm
                        text-gray-500
                        transition-all
                        duration-300
                        group-hover:border-black
                        group-hover:bg-black
                        group-hover:text-white
                      "
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* =====================================================
              CONTROLS
          ====================================================== */}

          <div
            className={`
              mt-6
              flex
              items-center
              justify-between
              transform
              transition-all
              delay-700
              duration-700
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >
            <div className="hidden items-center gap-3 sm:flex">
              <span
                className="
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                Sürüşdürərək baxın
              </span>

              <span
                className="
                  h-px
                  w-8
                  bg-gray-200
                "
              />

              <span
                className="
                  text-xs
                  text-gray-300
                "
              >
                {partners.length} əməkdaş
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Əvvəlki əməkdaş"
                onClick={previousSlide}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  
                  text-lg
                  text-gray-950
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-x-1
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                  active:scale-95
                "
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Növbəti əməkdaş"
                onClick={nextSlide}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-lg
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:translate-x-1
                  hover:bg-gray-800
                  active:scale-95
                "
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div
          className={`
            mt-12
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            pt-6

            transform
            transition-all
            delay-700
            duration-700

            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <p
            className="
              text-xs
              font-medium
              tracking-wide
              text-gray-400
            "
          >
            Komandamız
          </p>

          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-8
                rounded-full
                bg-black
              "
            />

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-gray-200
              "
            />

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-gray-200
              "
            />
          </div>
        </div>
      </div>

      {/* SECTION LINE */}

      <div
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          bg-gray-100
        "
      />
    </section>
  )
}