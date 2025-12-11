"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CrewSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  const crewMembers = [
    {
      name: t.crew.travelingJoe.name,
      role: t.crew.travelingJoe.role,
      description: t.crew.travelingJoe.description,
      image: "/images/traveling-20joe.jpg",
    },
    {
      name: t.crew.motorChrisi.name,
      role: t.crew.motorChrisi.role,
      description: t.crew.motorChrisi.description,
      image: "/images/motor-chrisi.jpg",
    },
    {
      name: t.crew.shoppingLiz.name,
      role: t.crew.shoppingLiz.role,
      description: t.crew.shoppingLiz.description,
      image: "/images/shopping-liz.jpg",
    },
    {
      name: t.crew.blockchainBob.name,
      role: t.crew.blockchainBob.role,
      description: t.crew.blockchainBob.description,
      image: "/images/blockchain-bob.jpg",
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">{t.crew.title}</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 text-balance">{t.crew.meetExplorers}</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{t.crew.joinTeam}</p>
        </div>

        {/* Crew Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {crewMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative rounded-xl overflow-hidden border border-border/50 bg-card transition-all duration-500 hover:border-primary/50 hover:scale-105"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-primary text-xs font-medium uppercase tracking-wider mb-1">{member.role}</p>
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p
                  className={`text-sm text-muted-foreground transition-all duration-300 ${
                    hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  {member.description}
                </p>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-primary/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
