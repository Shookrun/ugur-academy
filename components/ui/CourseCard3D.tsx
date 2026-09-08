"use client"

import Link from "next/link"
import React, { useState } from "react"

export interface CourseCard3DProps {
  id: number
  title: string
  subtitle: string
  slug: string
  category: string
  neonColor: string
  glowGradient: string
  buttonText?: string
  iconType: "code" | "shield" | "chip" | "brain" | "star" | "pulse" | "voice" | "vet" | "award"
}

export function CourseCard3D({
  id,
  title,
  subtitle,
  slug,
  category,
  neonColor,
  glowGradient,
  buttonText = "Kursa başla",
  iconType,
}: CourseCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Unique IDs for SVG gradients
  const chromeGradId = `chrome-g-${id}`
  const chromeGradRightId = `chrome-gr-${id}`
  const frontFaceGradId = `front-face-${id}`
  const sideFaceGradId = `side-face-${id}`
  const bottomFaceGradId = `bottom-face-${id}`
  const neonGlowFilterId = `neon-glow-${id}`

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        group relative flex min-h-[540px] flex-col justify-between overflow-hidden
        rounded-[2.6rem] border border-white/[0.09] bg-[#0c0d12] p-8 sm:p-9
        shadow-[0_20px_60px_rgba(0,0,0,0.65)] transition-all duration-500
        hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_35px_80px_rgba(0,0,0,0.85)]
      "
    >
      {/* 1. Signature Bottom Neon Radiant Halo (Exact match of reference image) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-60 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 110% 75% at 50% 120%, ${neonColor} 0%, ${neonColor}bb 28%, ${neonColor}33 55%, transparent 75%)`,
          opacity: isHovered ? 1 : 0.88,
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Subtle bottom glass rim highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 h-px transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)`,
          opacity: isHovered ? 0.9 : 0.6,
        }}
      />

      {/* 2. Top Content: Title & Subtitle */}
      <div className="relative z-10">
        <h3 className="text-[25px] font-bold tracking-tight text-white sm:text-[27px]">
          {title}
        </h3>
        <p className="mt-2.5 text-sm font-normal leading-relaxed text-slate-400 sm:text-[15px]">
          {subtitle}
        </p>
      </div>

      {/* 3. Center 3D Isometric Artwork (Speech-badge, Extruded depth, Metallic gears, Crossing wires) */}
      <div className="relative z-10 my-4 flex h-60 w-full items-center justify-center">
        <svg
          viewBox="0 0 320 230"
          className="h-full w-full select-none overflow-visible transition-transform duration-500 ease-out"
          style={{
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))",
            transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
          }}
        >
          <defs>
            {/* Front Face Porcelain Gradient */}
            <linearGradient id={frontFaceGradId} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            {/* Extruded Right-Side Face (Shadow + Metallic neon rim) */}
            <linearGradient id={sideFaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="35%" stopColor="#64748b" />
              <stop offset="70%" stopColor={neonColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={neonColor} />
            </linearGradient>

            {/* Extruded Bottom Face (Darker ambient depth) */}
            <linearGradient id={bottomFaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor={neonColor} stopOpacity="0.9" />
            </linearGradient>

            {/* Left Large Chrome Gear Gradient */}
            <linearGradient id={chromeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#94a3b8" />
              <stop offset="45%" stopColor="#f1f5f9" />
              <stop offset="75%" stopColor="#475569" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Right Small Chrome Gear Gradient with Neon Tint */}
            <linearGradient id={chromeGradRightId} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#e2e8f0" />
              <stop offset="65%" stopColor="#64748b" />
              <stop offset="100%" stopColor={neonColor} stopOpacity="0.75" />
            </linearGradient>

            {/* Wire Chrome Gradient */}
            <linearGradient id={`wire-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor={neonColor} stopOpacity="0.6" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id={neonGlowFilterId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========================================================
              LAYER 1: CROSSING METALLIC WIRES (Behind badge)
          ======================================================== */}
          {/* Wire 1: Curving from bottom-left to upper-right */}
          <path
            d="M 15 130 C 90 90, 190 145, 305 110"
            stroke={`url(#wire-grad-${id})`}
            strokeWidth="1.8"
            fill="none"
          />

          {/* Wire 2: Curving from upper-left to lower-right */}
          <path
            d="M 25 80 C 110 135, 200 70, 295 155"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.6"
            fill="none"
          />

          {/* ========================================================
              LAYER 2: FLOATING CHROME SPHERES (Beads on wire)
          ======================================================== */}
          {/* Left chrome bead */}
          <g transform="translate(68, 102)">
            <circle cx="0" cy="0" r="4.5" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
            <circle cx="-1.5" cy="-1.5" r="1.5" fill="#ffffff" />
          </g>

          {/* Center-left chrome bead */}
          <g transform="translate(118, 86)">
            <circle cx="0" cy="0" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
            <circle cx="-1.2" cy="-1.2" r="1.2" fill="#ffffff" />
          </g>

          {/* Right wire bead with neon rim */}
          <g transform="translate(255, 128)">
            <circle cx="0" cy="0" r="4.5" fill="#ffffff" stroke={neonColor} strokeWidth="1.2" />
            <circle cx="-1.2" cy="-1.2" r="1.2" fill="#ffffff" />
          </g>

          {/* ========================================================
              LAYER 3: METALLIC CHROME GEARS
          ======================================================== */}
          {/* Left Large 3D Gear */}
          <g
            className="transition-transform duration-700 ease-out"
            style={{
              transformOrigin: "48px 142px",
              transform: isHovered ? "rotate(40deg)" : "rotate(0deg)",
            }}
          >
            {/* Gear Body */}
            <g fill={`url(#${chromeGradId})`}>
              <circle cx="48" cy="142" r="28" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <rect
                  key={ang}
                  x="42"
                  y="105"
                  width="12"
                  height="16"
                  rx="3"
                  transform={`rotate(${ang} 48 142)`}
                />
              ))}
            </g>
            {/* Inner beveled ring */}
            <circle cx="48" cy="142" r="18" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Center axle bore */}
            <circle cx="48" cy="142" r="9" fill="#0c0d12" stroke="#64748b" strokeWidth="2" />
            {/* Metallic glint highlight */}
            <circle cx="45" cy="139" r="2" fill="#ffffff" opacity="0.8" />
          </g>

          {/* Upper Right Metallic Gear */}
          <g
            className="transition-transform duration-700 ease-out"
            style={{
              transformOrigin: "278 72",
              transform: isHovered ? "rotate(-45deg)" : "rotate(0deg)",
            }}
          >
            <g fill={`url(#${chromeGradRightId})`}>
              <circle cx="278" cy="72" r="21" />
              {[0, 60, 120, 180, 240, 300].map((ang) => (
                <rect
                  key={ang}
                  x="273"
                  y="46"
                  width="10"
                  height="14"
                  rx="2.5"
                  transform={`rotate(${ang} 278 72)`}
                />
              ))}
            </g>
            <circle cx="278" cy="72" r="12" fill="#1e293b" stroke={neonColor} strokeWidth="1.5" />
            <circle cx="278" cy="72" r="6" fill="#0c0d12" stroke="#94a3b8" strokeWidth="1.5" />
          </g>

          {/* ========================================================
              LAYER 4: 3D ISOMETRIC EXTRUDED PORCELAIN BADGE
          ======================================================== */}
          {/* Group with subtle floating animation */}
          <g
            className="transition-all duration-500 ease-out"
            style={{
              transform: isHovered ? "translate(3px, -4px)" : "translate(0, 0)",
            }}
          >
            {/* 4A. Extruded Depth Side & Bottom Polygons (True 3D physical thickness) */}
            {/* Right Extruded Thickness */}
            <path
              d="
                M 248 58
                L 264 68
                Q 270 73 268 85
                L 254 163
                Q 252 173 242 175
                L 226 166
                Q 234 162 236 152
                L 250 74
                Q 252 64 248 58
                Z
              "
              fill={`url(#${sideFaceGradId})`}
            />

            {/* Bottom-Right Speech Bubble Tail Extrusion */}
            <path
              d="
                M 226 166
                L 242 175
                L 236 186
                L 220 178
                Z
              "
              fill={`url(#${bottomFaceGradId})`}
            />

            {/* Bottom Edge Extrusion */}
            <path
              d="
                M 152 142
                L 164 152
                L 226 166
                L 214 156
                Z
              "
              fill={`url(#${bottomFaceGradId})`}
              opacity="0.85"
            />

            {/* 4B. Front Isometric Face (Porcelain white squircle + bottom-right tail) */}
            <path
              d="
                M 166 42
                C 176 38, 236 50, 244 54
                C 252 58, 252 66, 250 76
                L 238 144
                C 236 154, 230 158, 222 160
                L 220 174
                C 219 178, 214 176, 212 170
                L 210 158
                C 202 156, 158 146, 150 142
                C 142 138, 140 130, 142 120
                L 154 52
                C 156 44, 160 40, 166 42
                Z
              "
              fill={`url(#${frontFaceGradId})`}
              stroke="rgba(255,255,255,0.95)"
              strokeWidth="2.5"
              style={{
                filter: "drop-shadow(-4px 8px 16px rgba(0,0,0,0.35))",
              }}
            />

            {/* Inner Glaze Bevel Line */}
            <path
              d="
                M 168 46
                L 242 58
                L 234 142
                L 210 154
                L 152 138
                Z
              "
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.2"
              opacity="0.7"
            />

            {/* ========================================================
                LAYER 5: EMBOSSED 3D NEON ICON ON FRONT FACE
            ======================================================== */}
            {/* Render tailored 3D neon icons */}
            {iconType === "code" && (
              /* Telecom & IT: 3D Bold Magenta Chevron Brackets <> (Exact match of reference) */
              <g
                transform="translate(197, 102) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                {/* Left Chevron < */}
                <path
                  d="M -10 -22 L -26 -2 L -10 18 L -3 14 L -17 -2 L -3 -18 Z"
                  fill={neonColor}
                />
                {/* Right Chevron > */}
                <path
                  d="M 10 -22 L 26 -2 L 10 18 L 3 14 L 17 -2 L 3 -18 Z"
                  fill={neonColor}
                />
                {/* Subtle specular glint */}
                <path
                  d="M -10 -22 L -16 -14 L -12 -12 L -7 -20 Z"
                  fill="#ffffff"
                  opacity="0.6"
                />
                <path
                  d="M 10 -22 L 16 -14 L 12 -12 L 7 -20 Z"
                  fill="#ffffff"
                  opacity="0.6"
                />
              </g>
            )}

            {iconType === "shield" && (
              /* Cybersecurity: 3D Cyber Shield with glowing keyhole */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                <path
                  d="M 0 -24 L 20 -15 L 20 5 C 20 18, 10 26, 0 30 C -10 26, -20 18, -20 5 L -20 -15 Z"
                  fill={neonColor}
                  fillOpacity="0.2"
                  stroke={neonColor}
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {/* Inner glowing lock / core */}
                <circle cx="0" cy="2" r="5" fill={neonColor} />
                <path d="M 0 6 L 0 14" stroke={neonColor} strokeWidth="3.5" strokeLinecap="round" />
                <path d="M -8 -4 C -8 -10, 8 -10, 8 -4" stroke={neonColor} strokeWidth="3" fill="none" />
              </g>
            )}

            {iconType === "chip" && (
              /* Robotics & IoT: 3D Microchip */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                <rect
                  x="-18"
                  y="-18"
                  width="36"
                  height="36"
                  rx="6"
                  fill={neonColor}
                  fillOpacity="0.25"
                  stroke={neonColor}
                  strokeWidth="3.5"
                />
                <circle cx="0" cy="0" r="7" fill={neonColor} />
                {/* Pins */}
                <path
                  d="
                    M 0 -26 L 0 -18 M -10 -26 L -10 -18 M 10 -26 L 10 -18
                    M 0 18 L 0 26 M -10 18 L -10 26 M 10 18 L 10 26
                    M -26 0 L -18 0 M -26 -10 L -18 -10 M -26 10 L -18 10
                    M 18 0 L 26 0 M 18 -10 L 26 -10 M 18 10 L 26 10
                  "
                  stroke={neonColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </g>
            )}

            {iconType === "brain" && (
              /* AI & ML: 3D Neural Synapse Core */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                <circle cx="0" cy="0" r="10" fill={neonColor} />
                <circle cx="-16" cy="-12" r="5" fill={neonColor} />
                <circle cx="16" cy="-12" r="5" fill={neonColor} />
                <circle cx="-14" cy="14" r="5" fill={neonColor} />
                <circle cx="14" cy="14" r="5" fill={neonColor} />
                {/* Synapse Lines */}
                <path
                  d="
                    M 0 0 L -16 -12
                    M 0 0 L 16 -12
                    M 0 0 L -14 14
                    M 0 0 L 14 14
                    M -16 -12 L 16 -12
                  "
                  stroke={neonColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {iconType === "star" && (
              /* Leadership & Soft Skills: 3D Diamond Star */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                <path
                  d="M 0 -24 L 6 -8 L 22 -4 L 10 8 L 14 24 L 0 16 L -14 24 L -10 8 L -22 -4 L -6 -8 Z"
                  fill={neonColor}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
              </g>
            )}

            {iconType === "pulse" && (
              /* Medicine & Health: 3D EKG Pulse Wave & Medical Cross */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                {/* Medical Cross */}
                <rect x="-16" y="-5" width="32" height="10" rx="3" fill={neonColor} opacity="0.3" />
                <rect x="-5" y="-16" width="10" height="32" rx="3" fill={neonColor} opacity="0.3" />
                {/* EKG Wave line */}
                <path
                  d="M -24 0 L -12 0 L -7 -14 L -2 16 L 3 -10 L 7 4 L 12 0 L 24 0"
                  stroke={neonColor}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            )}

            {iconType === "voice" && (
              /* Loqoped xidməti: 3D Speech & Dynamic Voice Soundwave */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                {/* Speech Bubble Contour */}
                <path
                  d="M -20 -15 C -20 -23, 20 -23, 20 -15 C 20 -5, 10 5, 4 7 L 8 16 L -4 9 C -14 9, -20 3, -20 -15 Z"
                  fill={neonColor}
                  fillOpacity="0.2"
                  stroke={neonColor}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Audio Soundwaves */}
                <line x1="-12" y1="-14" x2="-12" y2="-6" stroke={neonColor} strokeWidth="3" strokeLinecap="round" />
                <line x1="-6" y1="-18" x2="-6" y2="-2" stroke={neonColor} strokeWidth="3.5" strokeLinecap="round" />
                <line x1="0" y1="-22" x2="0" y2="2" stroke={neonColor} strokeWidth="4" strokeLinecap="round" />
                <line x1="6" y1="-18" x2="6" y2="-2" stroke={neonColor} strokeWidth="3.5" strokeLinecap="round" />
                <line x1="12" y1="-14" x2="12" y2="-6" stroke={neonColor} strokeWidth="3" strokeLinecap="round" />
              </g>
            )}

            {iconType === "vet" && (
              /* Baytarlıq: 3D Animal Health Paw & Protection Care */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                {/* Main Paw Pad */}
                <path
                  d="M 0 0 C -12 0, -14 16, 0 16 C 14 16, 12 0, 0 0 Z"
                  fill={neonColor}
                />
                {/* 4 Toe Pads */}
                <circle cx="-13" cy="-6" r="4.5" fill={neonColor} />
                <circle cx="-5" cy="-14" r="5" fill={neonColor} />
                <circle cx="5" cy="-14" r="5" fill={neonColor} />
                <circle cx="13" cy="-6" r="4.5" fill={neonColor} />
                {/* Cross Plus Accent */}
                <path
                  d="M -16 6 H -10 M -13 3 V 9"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {iconType === "award" && (
              /* MİQ: 3D Achievement Medal / Exam Graduation Laurel */
              <g
                transform="translate(197, 100) rotate(6)"
                filter={`url(#${neonGlowFilterId})`}
              >
                {/* Medal Ribbon */}
                <path
                  d="M -10 10 L -16 26 L -7 22 L 0 26 L 0 10 Z"
                  fill={neonColor}
                  opacity="0.8"
                />
                <path
                  d="M 10 10 L 16 26 L 7 22 L 0 26 L 0 10 Z"
                  fill={neonColor}
                  opacity="0.6"
                />
                {/* Central Star Medal */}
                <circle cx="0" cy="0" r="18" fill={neonColor} fillOpacity="0.25" stroke={neonColor} strokeWidth="3.5" />
                <polygon
                  points="0,-12 3.5,-3 12,-3 5,3 8,11 0,6 -8,11 -5,3 -12,-3 -3.5,-3"
                  fill={neonColor}
                />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* 4. Bottom Action Pill Button (Exact match of reference image) */}
      <div className="relative z-10 mt-2">
        <Link
          href={`/kurslar/${slug}`}
          className="
            flex w-full items-center justify-center rounded-full bg-white
            py-3.5 sm:py-4 px-6 text-center text-[15px] font-bold text-slate-950
            shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-all duration-300
            hover:bg-slate-50 hover:shadow-[0_15px_35px_rgba(255,255,255,0.25)] hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          <span>{buttonText}</span>
        </Link>
      </div>
    </div>
  )
}
