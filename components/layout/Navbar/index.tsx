"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  { name: "Əsas", href: "/" },
  { name: "Kurslarımız", href: "/kurslar" },
  { name: "Xəbərlər", href: "/#xeberler" },
  { name: "Haqqımızda", href: "/haqqimizda" },
  { name: "Galereya", href: "/galereya" },
  { name: "Əlaqə", href: "/elaqe" },
  { name: "Media", href: "/#media" },
  { name: "Arxiv", href: "/#arxiv" },
]

const Navbar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  if (pathname?.startsWith("/admin")) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <header
      className={`
        fixed
        left-0
        top-0
        z-[100]
        w-full
        px-3
        pt-3
        transition-all
        duration-500
        sm:px-5
        sm:pt-4
        lg:px-8
        ${isScrolled
          ? "pt-2 sm:pt-3"
          : ""
        }
      `}
    >
      <nav
        className={`
          relative
          mx-auto
          flex
          max-w-[1840px]
          items-center
          justify-between
          overflow-hidden
          rounded-[1.4rem]
          border
          px-3
          transition-all
          duration-500
          sm:px-5
          ${isScrolled
            ? `
                border-slate-200/70
                bg-white/80
                py-2
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                backdrop-blur-md
              `
            : `
                border-transparent
                bg-transparent
                py-2.5
                shadow-none
              `
          }
        `}
      >
        {/* Decorative shine when scrolled */}
        <div
          className={`
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-slate-200/70
            to-transparent
            transition-opacity
            duration-500
            ${isScrolled ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* =========================================
            LOGO
        ========================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Uğur Şəxsi İnkişaf Mərkəzi ana səhifə"
          className="
            group
            relative
            z-10
            flex
            shrink-0
            items-center
          "
        >
          {/* Logo glow */}
          <span
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-12
              w-12
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-slate-200/40
              opacity-0
              blur-2xl
              transition-all
              duration-500
              group-hover:h-24
              group-hover:w-24
              group-hover:opacity-100
            "
          />

          <Image
            src="/logo.png"
            width={220}
            height={220}
            alt="Uğur Şəxsi İnkişaf Mərkəzi"
            priority
            className={`
              relative
              h-[102px]
              w-[102px]
              object-contain
              transition-all
              duration-500
              group-hover:scale-105
              group-hover:rotate-2
              sm:h-[114px]
              sm:w-[114px]
              ${isScrolled
                ? "lg:h-[102px] lg:w-[102px]"
                : "lg:h-[118px] lg:w-[118px]"
              }
            `}
          />
        </Link>

        {/* =========================================
            DESKTOP MENU
        ========================================== */}

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                text-gray-700
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-gray-950/[0.04]
                hover:text-gray-950
              "
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <span className="relative z-10">
                {item.name}
              </span>

              {/* Hover background */}
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-x-2
                  bottom-0
                  h-full
                  -translate-y-full
                  rounded-xl
                  bg-gray-950/[0.04]
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              />

              {/* Animated underline */}
              <span
                className="
                  absolute
                  bottom-1.5
                  left-1/2
                  h-[2px]
                  w-0
                  -translate-x-1/2
                  rounded-full
                  bg-gray-950
                  transition-all
                  duration-300
                  group-hover:w-6
                "
              />
            </Link>
          ))}

          {/* =====================================
              RFO BUTTON (Özəl & Diqqətçəkən Dizayn)
          ====================================== */}

          <Link
            href="/rfo"
            aria-label="Şirvan Regional RFO - Respublika Fənn Olimpiadaları Mərkəzi"
            className="
              group
              relative
              ml-2
              flex
              items-center
              gap-2.5
              overflow-hidden
              rounded-2xl
              border
              border-blue-300/70
              bg-gradient-to-r
              from-blue-50/95
              via-white
              to-sky-50/95
              p-1
              pr-3
              shadow-[0_4px_16px_rgba(30,120,255,0.15)]
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-blue-500
              hover:shadow-[0_8px_25px_rgba(30,120,255,0.3)]
              hover:from-blue-100/90
              hover:to-sky-100/90
              active:scale-95
            "
          >
            {/* Shimmer light sweep */}
            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-16
                w-10
                -skew-x-12
                bg-gradient-to-r
                from-transparent
                via-white/80
                to-transparent
                transition-all
                duration-1000
                group-hover:left-[130%]
              "
            />

            {/* RFO Image inside styled frame */}
            <div
              className="
                relative
                flex
                h-8
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                p-0.5
                shadow-sm
                ring-1
                ring-blue-100
                transition-transform
                duration-300
                group-hover:scale-105
              "
            >
              <Image
                src="/rfo-emblem.png"
                alt="RFO"
                width={56}
                height={34}
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </div>

            {/* Attention-grabbing text & pulse badge */}
            <div className="flex flex-col text-left leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                  RFO
                </span>

              </div>
              <span className="text-[9.5px] font-semibold text-slate-500 mt-0.5">
                Olimpiada Mərkəzi
              </span>
            </div>

            {/* Arrow */}
            <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-xs font-bold ml-0.5">
              →
            </span>
          </Link>

          {/* =====================================
              ONLINE İMTAHAN
          ====================================== */}

          <Link
            href="/"
            className="
              group
              relative
              ml-1.5
              flex
              items-center
              gap-1.5
              overflow-hidden
              rounded-lg
              bg-gray-950
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-800
              hover:shadow-md
            "
          >
            {/* shine */}
            <span
              className="
                absolute
                inset-y-0
                -left-10
                w-6
                -skew-x-12
                bg-white/20
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            <span className="relative z-10 text-[11px] sm:text-xs">
              Online İmtahan
            </span>

            <span
              className="
                relative
                z-10
                flex
                h-3.5
                w-3.5
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-[9px]
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* =========================================
            MOBILE BUTTON
        ========================================== */}

        <button
          type="button"
          aria-label={isOpen ? "Menyunu bağla" : "Menyunu aç"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="
            relative
            z-[110]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200/80
            bg-white/80
            shadow-sm
            transition-all
            duration-300
            hover:scale-105
            hover:bg-white
            active:scale-95
            lg:hidden
          "
        >
          <span className="relative block h-5 w-5">
            {/* TOP */}
            <span
              className={`
                absolute
                left-0
                top-[3px]
                h-[2px]
                w-5
                rounded-full
                bg-gray-950
                transition-all
                duration-300
                ${isOpen
                  ? "top-[9px] rotate-45"
                  : ""
                }
              `}
            />

            {/* MIDDLE */}
            <span
              className={`
                absolute
                left-0
                top-[9px]
                h-[2px]
                w-5
                rounded-full
                bg-gray-950
                transition-all
                duration-300
                ${isOpen
                  ? "scale-x-0 opacity-0"
                  : ""
                }
              `}
            />

            {/* BOTTOM */}
            <span
              className={`
                absolute
                left-0
                top-[15px]
                h-[2px]
                w-5
                rounded-full
                bg-gray-950
                transition-all
                duration-300
                ${isOpen
                  ? "top-[9px] -rotate-45"
                  : ""
                }
              `}
            />
          </span>
        </button>
      </nav>

      {/* ===========================================
          MOBILE MENU BACKDROP
      =========================================== */}

      <div
        onClick={closeMenu}
        className={`
          fixed
          inset-0
          z-[90]
          bg-black/10
          backdrop-blur-[2px]
          transition-all
          duration-500
          lg:hidden
          ${isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ===========================================
          MOBILE MENU
      =========================================== */}

      <div
        className={`
          relative
          z-[100]
          mx-auto
          mt-2
          max-w-7xl
          overflow-hidden
          rounded-[1.5rem]
          border
          border-gray-200/80
          bg-white/95
          shadow-[0_25px_70px_rgba(0,0,0,0.14)]
          backdrop-blur-2xl
          transition-all
          duration-500
          lg:hidden
          ${isOpen
            ? "max-h-[800px] translate-y-0 scale-100 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-4 scale-[0.98] opacity-0"
          }
        `}
      >
        {/* Menu top decoration */}
        <div
          className="
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-gray-300
            to-transparent
          "
        />

        <div className="p-3">
          {/* Mobile nav links */}

          <div className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`
                  group
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3.5
                  text-base
                  font-medium
                  text-gray-700
                  transition-all
                  duration-300
                  hover:translate-x-1
                  hover:bg-gray-50
                  hover:text-gray-950
                  ${isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: isOpen
                    ? `${index * 55 + 80}ms`
                    : "0ms",
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-gray-300
                      transition-all
                      duration-300
                      group-hover:scale-150
                      group-hover:bg-gray-950
                    "
                  />

                  {item.name}
                </span>

                <span
                  className="
                    text-gray-300
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:text-gray-950
                  "
                >
                  →
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}

          <div
            className={`
              my-3
              h-px
              bg-gray-100
              transition-all
              duration-500
              ${isOpen
                ? "opacity-100"
                : "opacity-0"
              }
            `}
          />

          {/* Mobile RFO button (Özəl & Diqqətçəkən) */}

          <Link
            href="/rfo"
            onClick={closeMenu}
            aria-label="Şirvan Regional RFO"
            className={`
              group
              relative
              mb-3
              flex
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              border
              border-blue-300/80
              bg-gradient-to-r
              from-blue-50
              via-white
              to-sky-50
              p-2.5
              shadow-[0_4px_16px_rgba(30,120,255,0.12)]
              transition-all
              duration-300
              hover:border-blue-500
              hover:shadow-lg
              ${isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
              }
            `}
            style={{
              transitionDelay: isOpen ? "450ms" : "0ms",
            }}
          >
            <div className="relative flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-blue-100">
              <Image
                src="/rfo-emblem.png"
                alt="RFO"
                width={65}
                height={40}
                className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  RFO
                </span>
                <span className="flex items-center gap-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Özəl
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                Respublika Fənn Olimpiadaları Mərkəzi
              </span>
            </div>

            <span className="ml-auto text-sm text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all font-bold pr-1">
              →
            </span>
          </Link>

          {/* Mobile exam button */}

          <Link
            href="/"
            onClick={closeMenu}
            className={`
              group
              flex
              items-center
              justify-between
              rounded-xl
              bg-gray-950
              px-4
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-gray-800
              ${isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
              }
            `}
            style={{
              transitionDelay: isOpen
                ? "510ms"
                : "0ms",
            }}
          >
            <span>
              Online İmtahan
            </span>

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-white/10
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar