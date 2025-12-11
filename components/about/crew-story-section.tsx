"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function CrewStorySection() {
  const { t } = useLanguage()

  const crewMembers = [
    {
      name: t.crew.travelingJoe.name,
      role: t.crew.travelingJoe.role,
      image: "/images/traveling-20joe.jpg",
      story: t.about.crewStory.travelingJoe,
    },
    {
      name: t.crew.motorChrisi.name,
      role: t.crew.motorChrisi.role,
      image: "/images/motor-chrisi.jpg",
      story: t.about.crewStory.motorChrisi,
    },
    {
      name: t.crew.shoppingLiz.name,
      role: t.crew.shoppingLiz.role,
      image: "/images/shopping-liz.jpg",
      story: t.about.crewStory.shoppingLiz,
    },
    {
      name: t.crew.blockchainBob.name,
      role: t.crew.blockchainBob.role,
      image: "/images/blockchain-bob.jpg",
      story: t.about.crewStory.blockchainBob,
    },
  ]

  return (
    <section className="relative py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-foreground">{t.about.crewStory.title}</span>{" "}
          <span className="text-primary">{t.about.crewStory.titleHighlight}</span>
        </h2>

        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">{t.about.crewStory.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-8">
          {crewMembers.map((member) => (
            <div
              key={member.name}
              className="group relative bg-card/50 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden sm:block" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-primary text-sm font-medium uppercase tracking-wider">{member.role}</span>
                  <h3 className="text-xl font-bold text-foreground mt-1 mb-3">{member.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.story}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
