"use client"

import { Sparkles, Zap, Gift, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function NequadaSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Nequada crystal visual */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-50 animate-pulse" />
          <div className="relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-400 to-primary rounded-2xl rotate-45 animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-br from-primary/80 via-cyan-300 to-primary/80 rounded-xl rotate-45" />
              <div className="absolute inset-4 bg-gradient-to-br from-primary/60 via-white to-primary/60 rounded-lg rotate-45" />
              <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-background rotate-0" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          <span className="text-foreground">{t.about.nequada.title}</span>{" "}
          <span className="text-primary">{t.about.nequada.titleHighlight}</span>
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty">
          {t.about.nequada.subtitle}
        </p>

        {/* How to earn Nequada */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t.about.nequada.shopEarn}</h3>
            <p className="text-muted-foreground text-sm">{t.about.nequada.shopEarnDesc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t.about.nequada.completeMissions}</h3>
            <p className="text-muted-foreground text-sm">{t.about.nequada.completeMissionsDesc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t.about.nequada.unlockTreasure}</h3>
            <p className="text-muted-foreground text-sm">{t.about.nequada.unlockTreasureDesc}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">{t.about.nequada.cta}</h3>
          <Link href="/#join">
            <Button size="lg" className="gap-2 mt-4">
              {t.about.nequada.joinExpedition}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
