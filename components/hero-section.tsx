"use client"

import { StarField } from "./star-field"
import { ChevronDown, Trophy } from "lucide-react"
import { SponsorMarquee } from "./sponsor-marquee"
import { useLanguage } from "@/lib/i18n/language-context"

const LOGO_URL = "/images/bonus-galaxy-logo.png"
const CAPTAIN_KLAUS_URL = "/images/captaion-klaus.jpg"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <StarField />

      <div className="relative z-10 mb-4 w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-amber-900/40 p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent" />
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />

          <div className="relative flex items-center justify-center gap-4 md:gap-8">
            {/* Left Logo */}
            <img
              src={LOGO_URL || "/placeholder.svg"}
              alt="Bonus Galaxy Logo"
              className="hidden md:block w-20 lg:w-28 h-auto flex-shrink-0"
            />

            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-amber-400" />
                <span className="text-amber-400 text-sm md:text-base font-bold uppercase tracking-widest">
                  {t.hero.bigWin}
                </span>
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-amber-400" />
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                <span className="text-amber-400">{t.hero.yearsOf}</span> of
              </h2>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {t.hero.hotelLuxury}
              </h2>
              <div className="flex gap-1 mt-2">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Right Logo */}
            <img
              src={LOGO_URL || "/placeholder.svg"}
              alt="Bonus Galaxy Logo"
              className="hidden md:block w-20 lg:w-28 h-auto flex-shrink-0"
            />
          </div>
        </div>
      </div>

      <SponsorMarquee />

      {/* Logo */}
      <div className="relative z-10 mb-8 animate-float"></div>

      {/* Coming 2026 Badge */}
      <div className="relative z-10 mb-6">
        <span className="inline-block px-6 py-2 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-medium tracking-widest uppercase animate-pulse-glow">
          {t.hero.coming}
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-bold text-center text-balance max-w-5xl mb-6">
        <span className="text-foreground">{t.hero.joinThe}</span>{" "}
        <span className="text-primary">{t.hero.galacticExpedition}</span>
      </h1>

      {/* Subheadline */}
      <p className="relative z-10 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-8 text-pretty">
        {t.hero.subtitle}
      </p>

      {/* Captain Klaus Hero Image */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mt-8">
        <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img
            src={CAPTAIN_KLAUS_URL || "/placeholder.svg"}
            alt="Captain Klaus at the helm of the Nebukadneza"
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <p className="text-sm text-primary font-medium uppercase tracking-wider">{t.hero.missionCommander}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Captain Klaus</h3>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary/60" />
      </div>
    </section>
  )
}
