"use client"

import { Fuel, Gift, Trophy, Gamepad2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function MissionSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Fuel,
      title: t.mission.collectNequada,
      description: t.mission.collectNequadaDesc,
    },
    {
      icon: Gift,
      title: t.mission.redeemRewards,
      description: t.mission.redeemRewardsDesc,
    },
    {
      icon: Trophy,
      title: t.mission.winBig,
      description: t.mission.winBigDesc,
    },
    {
      icon: Gamepad2,
      title: t.mission.playEarn,
      description: t.mission.playEarnDesc,
    },
  ]

  const stats = [
    { value: "200K+", label: t.mission.stats.weeklyViewers },
    { value: "30", label: t.mission.stats.yearsOfPrizes },
    { value: "4", label: t.mission.stats.partnerSectors },
    { value: "∞", label: t.mission.stats.adventures },
  ]

  return (
    <section className="relative py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">{t.mission.title}</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-balance">
            {t.mission.sectionTitle} <span className="text-primary">{t.mission.sectionTitleHighlight}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">{t.mission.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
