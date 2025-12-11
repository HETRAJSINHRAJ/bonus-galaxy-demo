"use client"

import { StarField } from "../star-field"
import { useLanguage } from "@/lib/i18n/language-context"

const CAPTAIN_KLAUS_URL = "/images/captaion-klaus.jpg"

export function AboutHero() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 pt-28">
      <StarField />

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-medium tracking-widest uppercase mb-6">
          {t.about.originStory}
        </span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          <span className="text-foreground">{t.about.heroTitle}</span>
          <br />
          <span className="text-primary">{t.about.heroTitleHighlight}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{t.about.heroSubtitle}</p>
      </div>

      {/* Captain Klaus image with glow effect */}
      <div className="relative z-10 mt-12 w-full max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
        <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20">
          <img
            src={CAPTAIN_KLAUS_URL || "/placeholder.svg"}
            alt="Captain Klaus"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}
