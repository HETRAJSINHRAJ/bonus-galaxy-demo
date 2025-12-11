"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-12 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/images/bonus-galaxy-logo.png" alt="Bonus Galaxy" className="w-12 h-12 object-contain" />
            <span className="font-bold text-foreground">Bonus Galaxy</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.about}
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.contact}
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.privacy}
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
        </div>

        {/* Tagline */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
