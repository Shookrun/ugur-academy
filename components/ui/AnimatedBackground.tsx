"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize, { passive: true })

    // Mouse interactive coords
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true })

    // Particle nodes configuration
    const isMobile = width < 768
    const particleCount = isMobile ? 30 : 55
    const maxDistance = isMobile ? 85 : 120

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseAlpha: number
      alpha: number
      color: string
    }

    const colors = [
      "rgba(148, 163, 184, ", // slate-400
      "rgba(100, 116, 139, ", // slate-500
      "rgba(203, 213, 225, ", // slate-300
    ]

    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const baseAlpha = Math.random() * 0.3 + 0.1
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 0.8,
        baseAlpha,
        alpha: baseAlpha,
        color,
      }
    })

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        // Wrap around bounds smoothly
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // Mouse proximity reaction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distToMouse = Math.sqrt(dx * dx + dy * dy)

        if (distToMouse < mouse.radius) {
          const force = (1 - distToMouse / mouse.radius) * 0.8
          p.x -= (dx / distToMouse) * force * 1.2
          p.y -= (dy / distToMouse) * force * 1.2
          p.alpha = Math.min(0.8, p.baseAlpha + 0.3)
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05
        }

        // Draw node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y)

          if (distNodes < maxDistance) {
            const lineAlpha = (1 - distNodes / maxDistance) * 0.08
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden bg-slate-50 select-none"
    >
      {/* 1. Subtle Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.8) 1px, transparent 0)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 2. Soft Neutral Ambient Lighting Orbs */}
      <div className="absolute inset-0 overflow-hidden blur-[120px]">
        {/* Orb 1 - Top Left */}
        <div
          className="
            absolute -left-20 -top-20
            h-[500px] w-[500px]
            rounded-full
            bg-slate-200/50
            transform-gpu will-change-transform
            animate-ambient-flow-1
          "
        />

        {/* Orb 2 - Top Right */}
        <div
          className="
            absolute -right-24 top-[15%]
            h-[550px] w-[550px]
            rounded-full
            bg-slate-300/40
            transform-gpu will-change-transform
            animate-ambient-flow-2
          "
        />

        {/* Orb 3 - Bottom Left */}
        <div
          className="
            absolute -bottom-28 left-[10%]
            h-[500px] w-[500px]
            rounded-full
            bg-slate-200/45
            transform-gpu will-change-transform
            animate-ambient-flow-3
          "
        />

        {/* Orb 4 - Bottom Right */}
        <div
          className="
            absolute -bottom-24 -right-24
            h-[500px] w-[500px]
            rounded-full
            bg-slate-300/40
            transform-gpu will-change-transform
            animate-ambient-flow-4
          "
        />
      </div>

      {/* 3. Interactive Subtle Stardust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-70"
      />
    </div>
  )
}