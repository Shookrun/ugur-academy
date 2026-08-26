"use client"

const AnimatedBackground = () => {
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
      {/* Sol üst */}
      <div
        className="
          absolute
          -left-32
          -top-32
          h-[600px]
          w-[600px]
          rounded-full
          bg-blue-200/30
          blur-[120px]
        "
      />

      {/* Sağ üst */}
      <div
        className="
          absolute
          -right-32
          top-[15%]
          h-[700px]
          w-[700px]
          rounded-full
          bg-purple-200/20
          blur-[130px]
        "
      />

      {/* Sol aşağı */}
      
      <div
        className="
          absolute
          -bottom-40
          left-[10%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-pink-200/20
          blur-[130px]
        "
      />

      {/* Sağ aşağı */}
      <div
        className="
          absolute
          -bottom-40
          -right-32
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-200/20
          blur-[130px]
        "
      />
    </div>
  )
}

export default AnimatedBackground