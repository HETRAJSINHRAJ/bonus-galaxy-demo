"use client"

import { StarField } from "@/components/star-field"
import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin } from "lucide-react"
import { Footer } from "@/components/footer-new"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden pt-20">
      <StarField />

      {/* Contact Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.contact.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.contact.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">{t.contact.contactData}</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{t.contact.address}</h3>
                      <p className="text-muted-foreground">
                        Bonus Galaxy
                        <br />
                        Klaus J. Kohlmayr
                        <br />
                        Mauerbach 2/5
                        <br />
                        5550 Radstadt
                        <br />
                        Österreich
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{t.contact.email}</h3>
                      <a href="mailto:office@bonus-galaxy.com" className="text-primary hover:underline">
                        office@bonus-galaxy.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Quote */}
              <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/30 rounded-2xl p-8">
                <blockquote className="text-lg italic text-muted-foreground">"{t.contact.quote}"</blockquote>
                <p className="mt-4 text-sm text-primary font-semibold">— Captain Klaus</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t.contact.sendMessage}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
