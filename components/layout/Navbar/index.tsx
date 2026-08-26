"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navItems = [
  { name: "Əsas", href: "/" },
  { name: "Kurslarımız", href: "/" },
  { name: "Xəbərlər", href: "/" },
  { name: "Haqqımızda", href: "/" },
  { name: "Əlaqə", href: "/" },
  { name: "Media", href: "/" },
  { name: "Arxiv", href: "/" },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        className="
          mx-auto flex max-w-[1840px] items-center justify-between
          rounded-2xl border border-white/10
          px-4 py-3
          backdrop-blur-xl
          transition-all duration-300
          sm:px-6
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="
            group relative flex shrink-0 cursor-pointer items-center
            transition-transform duration-300
            hover:scale-105
          "
        >
          <div
            className="
              absolute inset-0 -z-10
              rounded-full
              opacity-0 blur-xl
              transition-all duration-500
              group-hover:opacity-100
            "
          />

          <Image
            src="/logo.png"
            width={190}
            height={190}
            alt="Logo"
            priority
            className="
              h-20 w-20 object-contain
              transition-transform duration-500
              group-hover:rotate-3
              sm:h-26 sm:w-26
            "
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="
                group relative cursor-pointer overflow-hidden
                rounded-xl px-4 py-3
                text-sm font-medium
                text-black/75
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-white/5
                hover:text-black
              "
            >
              <span className="relative z-10">
                {item.name}
              </span>

              {/* Underline */}
              <span
                className="
                  absolute bottom-0 left-1/2
                  h-[2px] w-0
                  -translate-x-1/2
                  rounded-full
                  bg-black
                  transition-all duration-300
                  group-hover:w-1/2
                "
              />
            </Link>
          ))}

          {/* Online İmtahan */}
          <Link
            href="/"
            className="
              ml-2 cursor-pointer
              rounded-2xl border-2
              border-blue-950
              px-4 py-3
              text-blue-950
              transition-all duration-200
              hover:bg-blue-950
              hover:text-white
            "
          >
            Online İmtahan
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Menyu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="
            relative flex h-11 w-11
            cursor-pointer
            items-center justify-center
            rounded-xl
            border border-gray-200
            bg-white
            transition-all duration-300
            hover:bg-gray-100
            lg:hidden
          "
        >
          <div className="relative flex h-5 w-5 flex-col justify-between">
            {/* Top */}
            <span
              className={`
                h-[2px] w-5 rounded-full bg-black
                transition-all duration-300
                ${isOpen ? "translate-y-[9px] rotate-45" : ""}
              `}
            />

            {/* Middle */}
            <span
              className={`
                h-[2px] w-5 rounded-full bg-black
                transition-all duration-300
                ${isOpen ? "scale-x-0 opacity-0" : ""}
              `}
            />

            {/* Bottom */}
            <span
              className={`
                h-[2px] w-5 rounded-full bg-black
                transition-all duration-300
                ${isOpen ? "-translate-y-[9px] -rotate-45" : ""}
              `}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          mx-auto mt-2 max-w-7xl overflow-hidden
          rounded-2xl border border-gray-200
          bg-white
          shadow-[0_20px_50px_rgba(0,0,0,0.12)]
          backdrop-blur-xl
          transition-all duration-500
          lg:hidden
          ${
            isOpen
              ? "max-h-[700px] translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
          }
        `}
      >
        <div className="flex flex-col p-3">

          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="
                group flex cursor-pointer items-center
                rounded-xl px-4 py-3.5
                text-base font-medium
                text-gray-700
                transition-all duration-300
                hover:translate-x-2
                hover:bg-gray-50
                hover:text-black
              "
              style={{
                transitionDelay: isOpen
                  ? `${index * 40}ms`
                  : "0ms",
              }}
            >
              <span
                className="
                  mr-3 h-1.5 w-1.5
                  rounded-full bg-gray-300
                  transition-all duration-300
                  group-hover:scale-150
                  group-hover:bg-black
                "
              />

              {item.name}
            </Link>
          ))}

          {/* Mobile Online İmtahan */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="
              mt-2
              flex cursor-pointer
              items-center justify-center
              rounded-xl
              border-2 border-blue-950
              px-4 py-3.5
              text-sm font-semibold
              text-blue-950
              transition-all duration-300
              hover:bg-blue-950
              hover:text-white
            "
          >
            Online İmtahan
          </Link>

        </div>
      </div>
    </header>
  )
}

export default Navbar