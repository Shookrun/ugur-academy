"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out after 1.5s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500)
    // Remove from DOM after fade completes
    const removeTimer = setTimeout(() => setVisible(false), 2100)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-label="Yüklənir..."
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div
        style={{
          animation: "loader-logo-pulse 1.6s ease-in-out infinite",
          marginBottom: "2rem",
        }}
      >
        <Image
          src="/logo.png"
          alt="Uğur Akademiyası"
          width={100}
          height={100}
          priority
          style={{ objectFit: "contain", filter: "drop-shadow(0 0 32px rgba(129,140,248,0.6))" }}
        />
      </div>

      {/* Spinner ring */}
      <div style={{ position: "relative", width: 64, height: 64 }}>
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.08)",
          }}
        />
        {/* Spinning arc */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#818cf8",
            borderRightColor: "#a78bfa",
            animation: "loader-spin 0.9s linear infinite",
          }}
        />
        {/* Inner dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
            animation: "loader-logo-pulse 1.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Text */}
      <p
        style={{
          marginTop: "1.5rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.8rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "var(--font-geist-sans), sans-serif",
          animation: "loader-fade-text 1.6s ease-in-out infinite",
        }}
      >
        Yüklənir...
      </p>

      <style>{`
        @keyframes loader-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes loader-logo-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes loader-fade-text {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
