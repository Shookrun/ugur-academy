"use client"

const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden"
    >
      {/* Sol üst - Qızılı/Qəhvəyi Qızılı ton (Gold/Amber) */}
      <div
        className="
          absolute -left-20 -top-20
          h-[500px] w-[500px]
          rounded-full bg-amber-400/35
          blur-[100px]
          will-change-transform transform-gpu
          animate-blob
        "
      />

      {/* Sağ üst - Tünd Göy/Səma göyü tonu (Navy/Indigo) */}
      <div
        className="
          absolute -right-20 top-[10%]
          h-[600px] w-[600px]
          rounded-full bg-indigo-600/30
          blur-[100px]
          will-change-transform transform-gpu
          animate-blob [animation-delay:2s]
        "
      />

      {/* Sol aşağı - Parlaq Qızılı Sarı ton (Warm Yellow) */}
      <div
        className="
          absolute -bottom-20 left-[15%]
          h-[500px] w-[500px]
          rounded-full bg-yellow-500/30
          blur-[100px]
          will-change-transform transform-gpu
          animate-blob [animation-delay:4s]
        "
      />

      {/* Sağ aşağı - Açıq Göy ton (Sky Blue) */}
      <div
        className="
          absolute -bottom-20 -right-20
          h-[500px] w-[500px]
          rounded-full bg-sky-500/25
          blur-[100px]
          will-change-transform transform-gpu
          animate-blob [animation-delay:6s]
        "
      />
    </div>
  )
}

export default AnimatedBackground