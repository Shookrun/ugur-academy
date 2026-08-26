"use client"

import { useEffect, useState } from "react"

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        overflow-hidden
      "
    >
      {/* =====================================
          SOFT GRID
      ====================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          [background-size:70px_70px]
        "
      />

      {/* =====================================
          ORB 1
      ====================================== */}

      <div
        className="
          absolute
          -left-40
          -top-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-blue-300/25
          blur-[100px]
          animate-background-one
        "
      />

      {/* =====================================
          ORB 2
      ====================================== */}

      <div
        className="
          absolute
          -right-40
          top-[20%]
          h-[600px]
          w-[600px]
          rounded-full
          bg-violet-300/20
          blur-[110px]
          animate-background-two
        "
      />

      {/* =====================================
          ORB 3
      ====================================== */}

      <div
        className="
          absolute
          bottom-[-180px]
          left-[20%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-300/20
          blur-[110px]
          animate-background-three
        "
      />

      {/* =====================================
          ORB 4
      ====================================== */}

      <div
        className="
          absolute
          bottom-[-150px]
          right-[10%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-pink-300/15
          blur-[110px]
          animate-background-four
        "
      />

      {/* =====================================
          MOVING LIGHT
      ====================================== */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-200/10
          blur-[100px]
          animate-background-center
        "
      />
    </div>
  )
}