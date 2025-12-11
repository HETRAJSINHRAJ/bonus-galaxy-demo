"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { sendContactEmail } from "@/app/actions/contact"
import { useLanguage } from "@/lib/i18n/language-context"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || t.contact.form.error)
      }
    } catch (err) {
      setError(t.contact.form.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t.contact.form.success}</h3>
        <p className="text-muted-foreground">{t.contact.form.successDesc}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.contact.form.name} *</Label>
          <Input
            id="name"
            name="name"
            placeholder={t.contact.form.namePlaceholder}
            required
            className="bg-background/50 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.contact.form.email} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t.contact.form.emailPlaceholder}
            required
            className="bg-background/50 border-border/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t.contact.form.subject} *</Label>
        <Input
          id="subject"
          name="subject"
          placeholder={t.contact.form.subjectPlaceholder}
          required
          className="bg-background/50 border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.contact.form.message} *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t.contact.form.messagePlaceholder}
          rows={5}
          required
          className="bg-background/50 border-border/50 resize-none"
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t.contact.form.sending}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t.contact.form.send}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t.contact.form.privacyConsent}{" "}
        <a href="/privacy" className="text-primary hover:underline">
          {t.contact.form.privacyLink}
        </a>{" "}
        {t.contact.form.privacyConsentEnd}
      </p>
    </form>
  )
}
