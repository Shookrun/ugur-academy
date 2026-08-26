"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const navItems = [
  { name: "Əsas", href: "/" },
  { name: "Kurslarımız", href: "/#kurslar" },
  { name: "Xəbərlər", href: "/#xeberler" },
  { name: "Haqqımızda", href: "/#haqqimizda" },
  { name: "Əlaqə", href: "/#elaqe" },
  { name: "Media", href: "/#media" },
  { name: "Arxiv", href: "/#arxiv" },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
        ${
          isScrolled
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
          ${
            isScrolled
              ? `
                border-gray-200/70
                bg-white/80
                py-2
                shadow-[0_12px_40px_rgba(0,0,0,0.08)]
                backdrop-blur-2xl
              `
              : `
                border-white/30
                bg-white/45
                py-2.5
                backdrop-blur-xl
              `
          }
        `}
      >
        {/* Decorative shine */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white
            to-transparent
            opacity-80
          "
        />

        {/* =========================================
            LOGO
        ========================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          aria-label="JestDili ana səhifə"
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
              bg-blue-400/20
              opacity-0
              blur-2xl
              transition-all
              duration-500
              group-hover:h-20
              group-hover:w-20
              group-hover:opacity-100
            "
          />

          <Image
            src="/logo.png"
            width={190}
            height={190}
            alt="JestDili"
            priority
            className={`
              relative
              h-[68px]
              w-[68px]
              object-contain
              transition-all
              duration-500
              group-hover:scale-105
              group-hover:rotate-2
              sm:h-[76px]
              sm:w-[76px]
              ${
                isScrolled
                  ? "lg:h-[68px] lg:w-[68px]"
                  : "lg:h-[78px] lg:w-[78px]"
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
              ONLINE İMTAHAN
          ====================================== */}

          <Link
            href="/"
            className="
              group
              relative
              ml-2
              flex
              items-center
              gap-2
              overflow-hidden
              rounded-xl
              bg-gray-950
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-800
              hover:shadow-[0_10px_25px_rgba(0,0,0,0.16)]
            "
          >
            {/* shine */}
            <span
              className="
                absolute
                inset-y-0
                -left-10
                w-8
                -skew-x-12
                bg-white/20
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            <span className="relative z-10">
              Online İmtahan
            </span>

            <span
              className="
                relative
                z-10
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-[11px]
                transition-transform
                duration-300
                group-hover:translate-x-1
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
                ${
                  isOpen
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
                ${
                  isOpen
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
                ${
                  isOpen
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
          ${
            isOpen
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
          ${
            isOpen
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
                  ${
                    isOpen
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
              ${
                isOpen
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          />

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
              py-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-gray-800
              ${
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }
            `}
            style={{
              transitionDelay: isOpen
                ? "480ms"
                : "0ms",
            }}
          >
            <span>
              Online İmtahan
            </span>

            <span
              className="
                flex
                h-8
                w-8
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