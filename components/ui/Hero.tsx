
"use client"

import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <>
      <style jsx global>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes heroWhatsAppIcon {
          0%, 88%, 100% {
            transform: rotate(0deg);
          }
          92% {
            transform: rotate(-7deg);
          }
          96% {
            transform: rotate(7deg);
          }
        }

        @keyframes heroWhatsAppPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.25);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(37, 211, 102, 0);
          }
        }

        @keyframes heroGoldGlow {
          0%, 100% {
            box-shadow: 0 4px 0 #bd8508, 0 8px 18px rgba(214, 160, 29, 0.18);
          }
          50% {
            box-shadow: 0 4px 0 #bd8508, 0 10px 24px rgba(214, 160, 29, 0.3);
          }
        }

        .hero-reveal {
          opacity: 0;
          animation: heroFadeUp 0.7s ease forwards;
        }

        .hero-float {
          animation: heroFloat 6s ease-in-out infinite;
        }

        .hero-whatsapp-icon {
          animation: heroWhatsAppIcon 6s ease-in-out infinite;
        }

        .hero-whatsapp-status {
          animation: heroWhatsAppPulse 2.4s ease-out infinite;
        }

        .hero-whatsapp-button {
          animation: heroGoldGlow 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-reveal,
          .hero-float,
          .hero-whatsapp-icon,
          .hero-whatsapp-status,
          .hero-whatsapp-button {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <section className="relative isolate overflow-hidden bg-[#fbfcff] text-[#101e3d]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#dceeff]/70 blur-[85px] sm:-left-40 sm:h-[480px] sm:w-[480px] sm:blur-[110px]" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#f9edce]/65 blur-[85px] sm:-right-40 sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
          <div className="absolute bottom-[-150px] left-[20%] h-72 w-72 rounded-full bg-[#e5efff]/70 blur-[90px] sm:bottom-[-220px] sm:left-[30%] sm:h-[420px] sm:w-[420px] sm:blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                "radial-gradient(#c9a54d 0.8px, transparent 0.8px)",
              backgroundSize: "17px 17px",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="grid min-w-0 grid-cols-1 items-center gap-10 rounded-[24px] border border-white/80 bg-white/55 px-4 py-7 shadow-[0_20px_80px_rgba(35,57,92,0.045)] backdrop-blur-sm sm:gap-12 sm:rounded-[28px] sm:px-7 sm:py-10 md:px-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7 lg:px-8 lg:py-10 xl:gap-12 xl:px-12 xl:py-14">
            <div className="min-w-0">
              <div
                className="hero-reveal mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#d8bd7c] bg-white/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#a77a1b] sm:mb-7 sm:px-5 sm:text-sm sm:tracking-[0.12em]"
                style={{ animationDelay: "100ms" }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#c99b31]" />
                <span>Uğur — Şəxsi İnkişaf Mərkəzi</span>
              </div>

              <h1
                className="hero-reveal max-w-full break-words font-serif text-[clamp(2.8rem,9.2vw,6.8rem)] font-bold leading-[1.02] tracking-[-0.055em] text-[#101e3d] sm:text-[clamp(3.5rem,7vw,6rem)] lg:text-[clamp(3.3rem,5.2vw,5.6rem)] xl:text-[clamp(4rem,5.7vw,6.8rem)]"
                style={{ animationDelay: "200ms" }}
              >
                Gələcəyini{" "}
                <span className="text-[#c99520]">qur!</span>
              </h1>

              <p
                className="hero-reveal mt-5 max-w-[680px] text-sm leading-7 text-[#65738c] sm:mt-7 sm:text-base sm:leading-8 lg:text-[17px] xl:text-xl xl:leading-9"
                style={{ animationDelay: "300ms" }}
              >
                Uğur Şəxsi İnkişaf Mərkəzi olaraq təhsil və inkişaf sahəsində
                yüzlərlə insanın həyatına pozitiv təsir etmişik. Hər yaş və
                peşə qrupuna uyğun kurslarla uğura aparan dəstəyi təqdim
                edirik. Müasir bilik və bacarıqları öyrənərək öz gələcəyini
                qur.
              </p>

              <div
                className="hero-reveal mt-4 flex items-start gap-3"
                style={{ animationDelay: "380ms" }}
              >
                <span className="mt-1 h-7 w-1 shrink-0 rounded-full bg-[#d5a32d] sm:h-8" />
                <p className="text-sm font-bold leading-6 text-[#243451] sm:text-base sm:leading-7 lg:text-lg">
                  Sənin inkişafın üçün lazım olan təhsil burada başlayır.
                </p>
              </div>

              <div
                className="hero-reveal mt-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:mt-8 sm:gap-4"
                style={{ animationDelay: "450ms" }}
              >
                <Link
                  href="/haqqimizda"
                  className="group flex min-h-[64px] min-w-0 items-center justify-between gap-3 rounded-[20px] border-2 border-[#172746] bg-white/90 px-4 py-3 text-sm font-bold text-[#172746] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(16,30,61,0.1)] sm:min-h-[70px] sm:rounded-[23px] sm:px-5 sm:text-base"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <svg
                      viewBox="0 0 32 32"
                      className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 8.5C8 6.3 12 6.8 16 9.5V26C12 23.3 8 22.8 4 25V8.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M28 8.5C24 6.3 20 6.8 16 9.5V26C20 23.3 24 22.8 28 25V8.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12L12 13.5M8 16L12 17.5M20 13.5L24 12M20 17.5L24 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="truncate">Haqqımızda</span>
                  </span>
                  <span className="shrink-0 text-xl transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                    →
                  </span>
                </Link>

                <Link
                  href="https://wa.me/994706703020"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp ilə pulsuz məlumat al"
                  className="hero-whatsapp-button group flex min-h-[72px] min-w-0 items-center gap-3 rounded-[20px] border border-[#f6dc83] bg-gradient-to-b from-[#ffe98b] via-[#ffd94f] to-[#ffc72c] px-3 py-3 text-[#132344] transition-[filter,transform] duration-300 hover:-translate-y-1 hover:brightness-[1.035] active:translate-y-1 sm:min-h-[76px] sm:gap-3 sm:rounded-[23px] sm:px-4"
                >
                  <span className="hero-whatsapp-status flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white sm:h-[50px] sm:w-[50px]">
                    <svg
                      viewBox="0 0 24 24"
                      className="hero-whatsapp-icon h-6 w-6 sm:h-7 sm:w-7"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .15 5.34.15 11.91c0 2.1.55 4.14 1.59 5.95L.05 24l6.29-1.65a11.9 11.9 0 0 0 5.71 1.46h.01c6.56 0 11.9-5.34 11.9-11.91a11.84 11.84 0 0 0-3.44-8.42ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.22-3.73.98.99-3.64-.24-.37a9.88 9.88 0 0 1-1.51-5.25c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.84 9.84 0 0 1 2.89 6.99c0 5.45-4.43 9.87-9.88 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.85 1.21 3.05c.15.2 2.09 3.2 5.07 4.49.71.3 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                    </svg>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col text-left">
                    <span className="text-sm font-extrabold leading-5 tracking-tight sm:text-base lg:text-[15px] xl:text-base">
                      Pulsuz məlumat al
                    </span>
                    <span className="mt-1 text-[10px] leading-4 text-[#72591e] min-[380px]:text-xs sm:text-xs">
                      Kurs seçimi üçün bizə yaz
                    </span>
                  </span>

                  <span className="shrink-0 text-xl transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                    →
                  </span>
                </Link>
              </div>

              <div
                className="hero-reveal mt-9 grid grid-cols-3 border-t border-[#e5eaf1] pt-6 sm:mt-12 sm:pt-7 lg:mt-10 xl:mt-12"
                style={{ animationDelay: "550ms" }}
              >
                <div className="min-w-0 border-r border-[#e1e6ed] pr-2 sm:pr-4">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <svg
                      viewBox="0 0 40 40"
                      className="hidden h-8 w-8 shrink-0 text-[#c99a2c] min-[430px]:block sm:h-9 sm:w-9 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10C9 7 14 8 20 12V34C14 30 9 29 4 32V10Z"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M36 10C31 7 26 8 20 12V34C26 30 31 29 36 32V10Z"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 15L15 17M8 20L15 22M25 17L32 15M25 22L32 20"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xl font-extrabold tracking-tight text-[#132344] min-[380px]:text-2xl sm:text-3xl xl:text-4xl">
                        10+
                      </p>
                      <p className="mt-1 text-[11px] text-[#78859a] sm:text-sm xl:text-base">
                        Kurs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 border-r border-[#e1e6ed] px-2 sm:px-4">
                  <div className="flex min-w-0 items-center justify-center gap-2 sm:gap-3">
                    <svg
                      viewBox="0 0 40 40"
                      className="hidden h-8 w-8 shrink-0 text-[#c99a2c] min-[430px]:block sm:h-9 sm:w-9 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="20"
                        cy="11"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="2.3"
                      />
                      <path
                        d="M8 34V30C8 24.5 13 21 20 21C27 21 32 24.5 32 30V34H8Z"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 14C3.5 15 3 20 6 22M33 14C36.5 15 37 20 34 22"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xl font-extrabold tracking-tight text-[#132344] min-[380px]:text-2xl sm:text-3xl xl:text-4xl">
                        1000+
                      </p>
                      <p className="mt-1 text-[11px] text-[#78859a] sm:text-sm xl:text-base">
                        Tələbə
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 pl-2 sm:pl-4">
                  <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
                    <svg
                      viewBox="0 0 40 40"
                      className="hidden h-8 w-8 shrink-0 text-[#c99a2c] min-[430px]:block sm:h-9 sm:w-9 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 34H37"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 29V22H13V29M18 29V15H24V29M29 29V7H35V29"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 17L17 10L23 12L34 3M27 3H34V10"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xl font-extrabold tracking-tight text-[#132344] min-[380px]:text-2xl sm:text-3xl xl:text-4xl">
                        5+
                      </p>
                      <p className="mt-1 text-[11px] text-[#78859a] sm:text-sm xl:text-base">
                        İl təcrübə
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-reveal relative mx-auto w-full min-w-0 max-w-[560px] lg:max-w-none"
              style={{ animationDelay: "250ms" }}
            >
              <div
                aria-hidden="true"
                className="hero-float pointer-events-none absolute right-1 top-1 z-0 h-16 w-16 rounded-full border border-[#e5c66d]/60 sm:right-2 sm:top-2 sm:h-24 sm:w-24 lg:-right-1 lg:h-28 lg:w-28"
              />

              <div
                aria-hidden="true"
                className="hero-float pointer-events-none absolute bottom-1 left-1 z-0 h-14 w-14 rounded-full border border-[#b9d7f4] sm:bottom-2 sm:left-2 sm:h-20 sm:w-20 lg:-left-1 lg:h-24 lg:w-24"
                style={{ animationDelay: "1.5s" }}
              />

              <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[510px]">
                <div className="absolute right-[3%] top-[2%] h-[76%] w-[63%] overflow-hidden rounded-[42%_42%_22px_22px] border-4 border-white bg-[#e6eff8] shadow-[0_20px_55px_rgba(20,39,72,0.12)] sm:border-[6px] sm:rounded-[44%_44%_28px_28px]">
                  <Image
                    src="/student_girl.jpg"
                    alt="Təhsil alan qız şagird"
                    fill
                    sizes="(max-width: 639px) 55vw, (max-width: 1023px) 45vw, 340px"
                    className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                  />
                </div>

                <div className="absolute bottom-[3%] left-[2%] z-10 h-[66%] w-[60%] overflow-hidden rounded-[22px] border-4 border-white bg-[#e6eff8] shadow-[0_20px_55px_rgba(20,39,72,0.16)] sm:rounded-[28px] sm:border-[6px]">
                  <Image
                    src="/student_boy.jpg"
                    alt="Təhsil alan oğlan şagird"
                    fill
                    sizes="(max-width: 639px) 53vw, (max-width: 1023px) 42vw, 320px"
                    className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                  />
                </div>

                <div className="absolute right-0 top-[42%] z-20 max-w-[68%] rounded-xl border border-white/90 bg-white/95 px-3 py-2.5 shadow-[0_12px_35px_rgba(20,39,72,0.12)] backdrop-blur-md sm:right-0 sm:max-w-none sm:rounded-2xl sm:px-4 sm:py-3 lg:right-[-1%] xl:right-[-2%] xl:px-5 xl:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4d7] text-[#bd8c1f] sm:h-10 sm:w-10 sm:rounded-xl">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold leading-5 text-[#132344] sm:text-sm lg:text-base">
                        İnkişafına başla
                      </p>
                      <p className="mt-0.5 text-[10px] leading-4 text-[#78859a] sm:text-xs">
                        Gələcəyin üçün bu gün
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-[8%] top-[5%] z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white bg-white/95 text-[#c99a2c] shadow-lg backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-2xl lg:h-16 lg:w-16">
                  <svg
                    viewBox="0 0 40 40"
                    className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 15L20 7L35 15L20 23L5 15Z"
                      fill="currentColor"
                      fillOpacity=".15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 19V26C16 30 24 30 29 26V19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M35 15V25"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="35" cy="28" r="2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
