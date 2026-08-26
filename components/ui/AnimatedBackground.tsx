"use client"

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Sol üst */}
      <div
        className="
          absolute
          -left-32
          -top-32
          h-[700px]
          w-[700px]
          rounded-full
          bg-blue-200/40
          blur-[120px]
          animate-pulse
        "
      />

      {/* Sağ üst */}
      <div
        className="
          absolute
          -right-32
          top-[15%]
          h-[950px]
          w-[950px]
          rounded-full
          bg-purple-200/30
          blur-[120px]
          animate-pulse
        "
      />

      {/* Sol aşağı */}
      <div
        className="
          absolute
          -bottom-40
          left-[15%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-pink-200/25
          blur-[130px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -right-32
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-200/30
          blur-[130px]
          animate-pulse
        "
      />
    </div>
  )
}

export default AnimatedBackground