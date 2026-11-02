
"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { PointerEvent } from "react"

type Partner = {
  id?: string
  name: string
  position: string
  logo: string
  slug?: string
  order?: number
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
    order: 1,
  },
  {
    name: "Aynur Ələkbərova",
    position: "Əməkdaş",
    logo: "/Aynur Ələkbərova.jpg",
    order: 2,
  },
  {
    name: "Könül Əsədova",
    position: "Əməkdaş",
    logo: "/Könül Əsədova.jpg",
    order: 3,
  },
  {
    name: "Gülnaz Cəfərova",
    position: "Əməkdaş",
    logo: "/Gülnaz Cəfərova.jpg",
    order: 4,
  },
  {
    name: "Səkinə Babayeva",
    position: "Əməkdaş",
    logo: "/Səkinə Babayeva.jpg",
    order: 5,
  },
  {
    name: "Fidan Məmmədli",
    position: "Əməkdaş",
    logo: "/Fidan Məmmədli.jpg",
    order: 6,
  },
  {
    name: "Günay Məmmədova",
    position: "Əməkdaş",
    logo: "/Günay Məmmədova.jpg",
    order: 7,
  },
]

const sortPartners = (items: Partner[]): Partner[] =>
  items
    .map((partner, index) => ({
      partner: {
        ...partner,
        order:
          Number.isInteger(Number(partner.order)) &&
          Number(partner.order) > 0
            ? Number(partner.order)
            : index + 1,
      },
      index,
    }))
    .sort(
      (a, b) =>
        (a.partner.order ?? 0) - (b.partner.order ?? 0) ||
        a.index - b.index
    )
    .map(({ partner }) => partner)

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
    const controller = new AbortController()

    const loadPartners = async () => {
      try {
        const response = await fetch(`/api/partners?t=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        if (!response.ok) return

        const data: unknown = await response.json()
        if (!Array.isArray(data) || data.length === 0) return

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
          setPartnerList(sortPartners(validPartners))
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Əməkdaşları yükləmək mümkün olmadı.", error)
        }
      }
    }

    void loadPartners()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
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
    if (!slider) return 398

    const card = slider.querySelector(
      "[data-partner-card]"
    ) as HTMLElement | null

    if (!card) return 398

    const styles = window.getComputedStyle(slider)
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0

    return card.offsetWidth + gap
  }

  const nextSlide = () => {
    const slider = sliderRef.current
    if (!slider) return

    const maxScroll = slider.scrollWidth - slider.clientWidth

    slider.scrollTo({
      left: Math.min(slider.scrollLeft + getScrollAmount(), maxScroll),
      behavior: "smooth",
    })
  }

  const previousSlide = () => {
    const slider = sliderRef.current
    if (!slider) return

    slider.scrollTo({
      left: Math.max(0, slider.scrollLeft - getScrollAmount()),
      behavior: "smooth",
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current
    if (!slider) return

    const target = event.target as HTMLElement

    if (target.closest("button")) return

    if (event.pointerType === "mouse" && event.button !== 0) return

    isDragging.current = true
    hasMoved.current = false
    activePointerId.current = event.pointerId
    startX.current = event.clientX
    startScrollLeft.current = slider.scrollLeft
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current

    if (
      !slider ||
      !isDragging.current ||
      activePointerId.current !== event.pointerId
    ) {
      return
    }

    const distance = event.clientX - startX.current

    if (!hasMoved.current && Math.abs(distance) > 5) {
      hasMoved.current = true
      setDragging(true)

      try {
        slider.setPointerCapture(event.pointerId)
      } catch {}
    }

    if (!hasMoved.current) return

    slider.scrollLeft = startScrollLeft.current - distance

    if (event.pointerType === "mouse") {
      event.preventDefault()
    }
  }

  const stopDragging = (event?: PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current

    if (!isDragging.current) return

    if (
      slider &&
      event &&
      activePointerId.current === event.pointerId
    ) {
      try {
        if (slider.hasPointerCapture(event.pointerId)) {
          slider.releasePointerCapture(event.pointerId)
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

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current

    if (
      slider &&
      activePointerId.current === event.pointerId
    ) {
      try {
        if (slider.hasPointerCapture(event.pointerId)) {
          slider.releasePointerCapture(event.pointerId)
        }
      } catch {}
    }

    isDragging.current = false
    activePointerId.current = null
    hasMoved.current = false
    setDragging(false)
  }

  const handleLostPointerCapture = () => {
    if (!isDragging.current) return

    isDragging.current = false
    activePointerId.current = null
    hasMoved.current = false
    setDragging(false)
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="mx-auto max-w-full px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div
            className={`max-w-2xl transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`h-px bg-black transition-all duration-700 ${
                  isVisible ? "w-8 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <span className="text-sm font-medium tracking-wide text-gray-500">
                Əməkdaşlarımız
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
              Birlikdə
              <br />
              daha güclüyük.
            </h2>
          </div>

          <div
            className={`max-w-xl transform transition-all delay-150 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:ml-auto ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <p className="text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              Layihəmizin inkişafında bizimlə birlikdə çalışan
              dəyərli və peşəkar əməkdaşlarımız.
            </p>
          </div>
        </div>

        <div
          className={`relative mt-14 flex flex-col transform transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >
          <div
            ref={sliderRef}
            className={`flex gap-7 overflow-x-auto overflow-y-hidden pb-16 pt-6 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
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
            onLostPointerCapture={handleLostPointerCapture}
          >
            {partnerList.map((partner, index) => {
              const slug = partner.slug || partnerSlugMap[partner.name]

              return (
                <article
                  key={partner.id || partner.slug || partner.name}
                  data-partner-card
                  className={`group relative w-[78vw] max-w-[300px] shrink-0 transform transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    index % 2 === 1 ? "sm:mt-12" : ""
                  } ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isVisible
                      ? `${250 + index * 100}ms`
                      : "0ms",
                  }}
                >
                  <Link
                    href={slug ? `/emekdaslar/${slug}` : "/emekdaslar"}
                    draggable={false}
                    aria-label={`${partner.name} profilinə bax`}
                    onClick={(event) => {
                      if (hasMoved.current) event.preventDefault()
                    }}
                    className="relative block h-[390px] overflow-hidden rounded-[2rem] bg-gray-200 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 min-[420px]:h-[430px] sm:h-[480px] lg:h-[500px]"
                  >
                    <Image
                      src={partner.logo}
                      alt=""
                      fill
                      draggable={false}
                      sizes="(max-width: 639px) 300px, (max-width: 1023px) 350px, 380px"
                      className="pointer-events-none object-cover grayscale-[0.35] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

                    <div className="absolute left-5 top-5 flex h-11 items-center gap-2 rounded-full border border-white/40 bg-black/20 pl-4 pr-4 text-xs font-medium text-white backdrop-blur-md">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-3 bg-white/60 transition-all duration-500 group-hover:w-6" />
                    </div>

                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-base text-gray-950 shadow-lg transition-all duration-500 group-hover:rotate-45 group-hover:scale-110">
                      ↗
                    </div>

                    <div className="absolute inset-x-3 bottom-3 rounded-[1.5rem] border border-white/25 bg-white/10 p-5 backdrop-blur-xl transition-all duration-500 group-hover:border-white group-hover:bg-white">
                      <p className="mb-3 flex items-center gap-2 text-xs font-medium text-white/70 transition-colors duration-500 group-hover:text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {partner.position}
                      </p>

                      <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-white transition-colors duration-500 group-hover:text-gray-950 sm:text-2xl">
                        {partner.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 transition-colors duration-500 group-hover:border-gray-200">
                        <span className="text-xs text-white/70 transition-colors duration-500 group-hover:text-gray-500">
                          Uğur Şəxsi İnkişaf Mərkəzi
                        </span>
                        <span className="text-xs font-semibold text-white transition-all duration-500 group-hover:translate-x-1 group-hover:text-gray-950">
                          Profilə bax
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>

          <div
            className={`mt-6 flex items-center justify-between transform transition-all delay-700 duration-700 max-sm:order-first max-sm:mb-1 max-sm:mt-0 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="hidden text-xs font-medium tracking-wide text-gray-400 sm:block">
              Kartları sürüşdürərək bax
            </p>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Əvvəlki əməkdaş"
                onClick={previousSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-950 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-black hover:bg-black hover:text-white active:scale-95"
              >
                ←
              </button>

              <button
                type="button"
                aria-label="Növbəti əməkdaş"
                onClick={nextSlide}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg text-white shadow-sm transition-all duration-300 hover:translate-x-1 hover:bg-gray-800 active:scale-95"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gray-100" />
    </section>
  )
}