"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Rocket, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function JoinSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
    }
  }

  return (
    <section id="join" className="relative py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
            <Rocket className="w-4 h-4" />
            {t.join.launch}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
          {t.join.title} <span className="text-primary">{t.join.titleHighlight}</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{t.join.subtitle}</p>

        {/* Email Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t.join.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {t.join.button}
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-3 p-6 rounded-xl border border-primary/30 bg-primary/5 max-w-md mx-auto">
            <CheckCircle className="w-6 h-6 text-primary" />
            <p className="text-foreground font-medium">
              {t.join.success} {t.join.successDesc}
            </p>
          </div>
        )}

        {/* Trust indicators */}
        <p className="text-sm text-muted-foreground mt-6">{t.join.trustIndicator}</p>
      </div>
    </section>
  )
}
