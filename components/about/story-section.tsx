"use client"

import { Rocket, AlertTriangle, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function StorySection() {
  const { t } = useLanguage()

  const chapters = [
    {
      icon: Rocket,
      chapter: t.about.chapters.journey.chapter,
      title: t.about.chapters.journey.title,
      content: t.about.chapters.journey.content,
    },
    {
      icon: AlertTriangle,
      chapter: t.about.chapters.crash.chapter,
      title: t.about.chapters.crash.title,
      content: t.about.chapters.crash.content,
    },
    {
      icon: Globe,
      chapter: t.about.chapters.newMission.chapter,
      title: t.about.chapters.newMission.title,
      content: t.about.chapters.newMission.content,
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-foreground">{t.about.howItBegan}</span>{" "}
          <span className="text-primary">{t.about.howItBeganHighlight}</span>
        </h2>

        <div className="space-y-12">
          {chapters.map((chapter) => (
            <div key={chapter.title} className="relative pl-8 md:pl-12 border-l-2 border-primary/30">
              {/* Timeline dot */}
              <div className="absolute -left-4 md:-left-5 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <chapter.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>

              {/* Chapter number */}
              <span className="text-primary/50 text-sm font-medium uppercase tracking-wider">{chapter.chapter}</span>

              <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">{chapter.title}</h3>

              <p className="text-muted-foreground text-lg leading-relaxed">{chapter.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
