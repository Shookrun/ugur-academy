"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { PointerEvent } from "react"

type Partner = {
  name: string
  position: string
  logo: string
  slug?: string
}

const partnerSlugMap: Record<string, string> = {
  "Mehman Bayramov": "mehman-bayramov",
  "Aynur Ələkbərova": "aynur-elekberova",
  "Könül Əsədova": "konul-esedova",
  "Gülnaz Cəfərova": "gulnaz-ceferova",
  "Səkinə Babayeva": "sekine-babayeva",
  "Fidan Məmmədli": "fidan-memmedli",
  "Günay Məmmədova": "gunay-memmedova",
}

const partners: Partner[] = [
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
  const [partnerList, setPartnerList] = useState<Partner[]>(partners)
  const [dragging, setDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const startX = useRef(0)
  const startScrollLeft = useRef(0)
  const activePointerId = useRef<number | null>(null)

  useEffect(() => {
    fetch(
      `/api/partners?t=${Date.now()}&_nonce=${Math.random()
        .toString(36)
        .slice(2)}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (!Array.isArray(data) || data.length === 0) {
          return
        }

        const validPartners = data.filter(
          (item): item is Partner =>
            typeof item === "object" &&
            item !== null &&
            "name" in item &&
            "position" in item &&
            "logo" in item &&
            typeof item.name === "string" &&
            typeof item.position === "string" &&
            typeof item.logo === "string"
        )

        if (validPartners.length > 0) {
          setPartnerList(validPartners)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

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

  const nextSlide = () => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

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

  const previousSlide = () => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    const amount = getScrollAmount()

    slider.scrollTo({
      left: Math.max(0, slider.scrollLeft - amount),
      behavior: "smooth",
    })
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

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
    hasMoved.current = false

    setDragging(false)
  }

  const handleLostPointerCapture = () => {
    if (!isDragging.current) {
      return
    }

    isDragging.current = false
    activePointerId.current = null
    hasMoved.current = false

    setDragging(false)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
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

              <span className="text-sm font-medium tracking-wide text-gray-500">
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

        <div
          className={`
            relative
            mt-14
            flex
            flex-col
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
            {partnerList.map((partner, index) => {
              const slug =
                partner.slug ||
                partnerSlugMap[partner.name]

              return (
                <article
                  key={partner.name}
                  data-partner-card
                  className={`
                    group
                    relative
                    w-[78vw]
                    max-w-[300px]
                    shrink-0
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-gray-100
                    bg-white
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
                  <div
                    className="
                      relative
                      h-[300px]
                      overflow-hidden
                      bg-gray-100
                      min-[420px]:h-[340px]
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

                    <div
                      className="
                        absolute
                        right-7
                        top-7
                        h-2
                        w-2
                        rounded-full
                        bg-white
                        shadow
                      "
                    />
                  </div>

                  <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                    <div className="mb-3 flex items-center gap-3 sm:mb-5">
                      <span className="h-px w-8 bg-black" />

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
                        mt-4
                        flex
                        items-center
                        justify-between
                        border-t
                        border-gray-100
                        pt-4
                        sm:mt-6
                        sm:pt-5
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
                        href={
                          slug
                            ? `/emekdaslar/${slug}`
                            : "/emekdaslar"
                        }
                        onClick={(event) => {
                          if (hasMoved.current) {
                            event.preventDefault()
                          }
                        }}
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
              )
            })}
          </div>

          <div
            className={`
              mt-6
              max-sm:order-first
              max-sm:mb-1
              max-sm:mt-0
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
            <p className="hidden text-xs font-medium tracking-wide text-gray-400 sm:block">
              Kartları sürüşdürərək bax
            </p>

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
                  bg-white
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
      </div>

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