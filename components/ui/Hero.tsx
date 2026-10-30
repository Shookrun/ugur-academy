"use client"

import Image from "next/image"
import Link from "next/link"

const words = ["Təhsil", "İnkişaf", "Uğur", "Gələcək", "Bacarıq", "Karyera"]

const Hero = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes heroShine {
          0% { transform: translateX(-120%); }
          60%, 100% { transform: translateX(120%); }
        }
        @keyframes heroDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 149, 32, 0.45); }
          50% { box-shadow: 0 0 0 8px rgba(201, 149, 32, 0); }
        }
        @keyframes heroSpin {
          to { transform: rotate(360deg); }
        }
        .hero-reveal { opacity: 0; animation: heroFadeUp 0.7s ease forwards; }
        .hero-float { animation: heroFloat 6s ease-in-out infinite; }
        .hero-marquee { animation: heroMarquee 28s linear infinite; }
        .hero-dot { animation: heroDot 2s ease-out infinite; }
        .hero-spin { animation: heroSpin 18s linear infinite; }
        .hero-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.3) 50%, transparent 65%);
          transform: translateX(-120%);
          animation: heroShine 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal { opacity: 1; animation: none !important; }
          .hero-float, .hero-marquee, .hero-dot, .hero-spin, .hero-shine::after {
            animation: none !important;
          }
        }
      `}</style>

      <section className="relative isolate mt-20 overflow-hidden bg-[#fbfcff] text-[#101e3d] sm:mt-24">
        {/* Background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#dceeff]/80 blur-[100px] sm:h-[520px] sm:w-[520px]" />
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#f9edce]/80 blur-[100px] sm:h-[520px] sm:w-[520px]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(#e5eaf1 1px, transparent 1px), linear-gradient(90deg, #e5eaf1 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
            }}
          />
        </div>

        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-14 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-16">
          {/* LEFT */}
          <div className="min-w-0 lg:col-span-7">
            <div
              className="hero-reveal inline-flex items-center gap-2.5 rounded-full border border-[#e5c66d]/70 bg-white/80 px-4 py-2 text-xs font-bold text-[#243451] shadow-sm backdrop-blur sm:text-sm"
              style={{ animationDelay: "50ms" }}
            >
              <span className="hero-dot h-2.5 w-2.5 rounded-full bg-[#c99520]" />
              Uğur Şəxsi İnkişaf Mərkəzi
            </div>

            <h1
              className="hero-reveal mt-6 font-serif text-[clamp(3.2rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.05em]"
              style={{ animationDelay: "150ms" }}
            >
              <span className="relative inline-block">
                Gələcəyini
                <svg
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#c99520]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 9C60 2 130 2 298 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              <span className="italic text-[#c99520]">qur!</span>
            </h1>

            <p
              className="hero-reveal mt-8 max-w-[620px] text-base leading-8 text-[#65738c] xl:text-lg"
              style={{ animationDelay: "250ms" }}
            >
              Təhsil və inkişaf sahəsində yüzlərlə insanın həyatına pozitiv təsir
              etmişik. Hər yaş və peşə qrupuna uyğun kurslarla müasir bilik və
              bacarıqları öyrən, öz gələcəyini qur.
            </p>

            <div
              className="hero-reveal mt-5 flex items-center gap-3"
              style={{ animationDelay: "320ms" }}
            >
              <span className="h-7 w-1 rounded-full bg-[#d5a32d]" />
              <p className="text-sm font-bold text-[#243451] sm:text-base">
                Sənin inkişafın üçün lazım olan təhsil burada başlayır.
              </p>
            </div>

            <div
              className="hero-reveal mt-9 flex flex-col gap-4 min-[480px]:flex-row"
              style={{ animationDelay: "400ms" }}
            >
              <Link
                href="https://wa.me/994706703020"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ilə pulsuz məlumat al"
                className="hero-shine group relative flex min-h-[68px] items-center gap-3 overflow-hidden rounded-full border border-[#c99520] bg-gradient-to-b from-[#243b63] via-[#172b4d] to-[#101e3d] py-3 pl-3 pr-6 text-white shadow-[0_12px_30px_rgba(16,30,61,0.25)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c99520] focus-visible:ring-offset-2"
              >
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .15 5.34.15 11.91c0 2.1.55 4.14 1.59 5.95L.05 24l6.29-1.65a11.9 11.9 0 0 0 5.71 1.46h.01c6.56 0 11.9-5.34 11.9-11.91a11.84 11.84 0 0 0-3.44-8.42ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.22-3.73.98.99-3.64-.24-.37a9.88 9.88 0 0 1-1.51-5.25c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.84 9.84 0 0 1 2.89 6.99c0 5.45-4.43 9.87-9.88 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.85 1.21 3.05c.15.2 2.09 3.2 5.07 4.49.71.3 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                  </svg>
                </span>
                <span className="relative z-10 flex flex-col text-left">
                  <span className="text-base font-extrabold leading-5">Pulsuz məlumat al</span>
                  <span className="text-xs text-white/75">Kurs seçimi üçün bizə yaz</span>
                </span>
                <span className="relative z-10 ml-2 text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href="/haqqimizda"
                className="group flex min-h-[68px] items-center justify-center gap-3 rounded-full border-2 border-[#172746] bg-white/80 px-7 text-base font-bold text-[#172746] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-[#172746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c99520]"
              >
                Haqqımızda
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="hero-reveal relative mx-auto w-full max-w-[520px] min-w-0 lg:col-span-5"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative aspect-square w-full">
              <div className="absolute right-0 top-0 h-[78%] w-[58%] overflow-hidden rounded-t-full rounded-b-[28px] border-[6px] border-white bg-[#e6eff8] shadow-[0_24px_60px_rgba(20,39,72,0.18)]">
                <Image
                  src="/student_girl.jpg"
                  alt="Təhsil alan qız şagird"
                  fill
                  sizes="(max-width: 1023px) 55vw, 320px"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div
                className="hero-float absolute bottom-[2%] left-0 h-[55%] w-[52%] overflow-hidden rounded-[28px] border-[6px] border-white bg-[#e6eff8] shadow-[0_24px_60px_rgba(20,39,72,0.2)]"
                style={{ ["--r" as string]: "-4deg" }}
              >
                <Image
                  src="/student_boy.jpg"
                  alt="Təhsil alan oğlan şagird"
                  fill
                  sizes="(max-width: 1023px) 50vw, 300px"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div
                className="hero-float absolute left-[2%] top-[8%] z-20 rounded-2xl bg-[#101e3d] px-5 py-4 text-white shadow-[0_16px_40px_rgba(16,30,61,0.35)]"
                style={{ ["--r" as string]: "-3deg", animationDelay: "0.8s" }}
              >
                <p className="text-3xl font-extrabold leading-none text-[#e5c66d] sm:text-4xl">1000+</p>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">Tələbə</p>
              </div>

              <div
                className="hero-float absolute bottom-[5%] right-[2%] z-20 rounded-2xl bg-gradient-to-br from-[#e5c66d] to-[#c99520] px-5 py-4 text-[#101e3d] shadow-[0_16px_40px_rgba(201,149,32,0.4)]"
                style={{ ["--r" as string]: "3deg", animationDelay: "1.6s" }}
              >
                <p className="text-3xl font-extrabold leading-none sm:text-4xl">10+</p>
                <p className="mt-1 text-xs font-semibold sm:text-sm">Kurs</p>
              </div>

              <div className="absolute left-[42%] top-[46%] z-30 flex h-24 w-24 items-center justify-center rounded-full border border-[#e5c66d]/60 bg-white shadow-xl sm:h-28 sm:w-28">
                <svg viewBox="0 0 120 120" className="hero-spin absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <path id="heroCircle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" />
                  </defs>
                  <text fill="#243451" fontSize="11" fontWeight="700" letterSpacing="2.4">
                    <textPath href="#heroCircle">İL TƏCRÜBƏ • İL TƏCRÜBƏ • İL TƏCRÜBƏ •</textPath>
                  </text>
                </svg>
                <span className="font-serif text-2xl font-bold text-[#c99520] sm:text-3xl">5+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden border-y border-[#c99520]/40 bg-[#101e3d] py-4" aria-hidden="true">
          <div className="hero-marquee flex w-max items-center">
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center">
                {words.map((w) => (
                  <span key={`${g}-${w}`} className="flex items-center">
                    <span className="px-6 font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">{w}</span>
                    <span className="text-[#e5c66d]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
