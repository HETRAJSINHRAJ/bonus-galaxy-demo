"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Navbar() {
  const { locale, setLocale, t } = useLanguage()
  const pathname = usePathname()

  const toggleLanguage = () => {
    setLocale(locale === "de" ? "en" : "de")
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/bonus-galaxy-logo.png" alt="Bonus Galaxy" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-foreground hidden sm:inline">Bonus Galaxy</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-4">
          <Link
            href="/"
            className={`text-sm transition-colors hidden lg:inline ${isActive("/") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/about"
            className={`text-sm transition-colors hidden lg:inline ${isActive("/about") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
          >
            {t.nav.story}
          </Link>
          <Link
            href="/contact"
            className={`text-sm transition-colors hidden lg:inline ${isActive("/contact") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
          >
            {t.nav.contact}
          </Link>
          <Link
            href="/privacy"
            className={`text-sm transition-colors hidden xl:inline ${isActive("/privacy") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
          >
            {t.nav.privacy}
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-card/50 hover:bg-card transition-colors text-sm font-medium"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* Auth Buttons - Show when signed out */}
          <SignedOut>
            {/* Register Button */}
            <SignUpButton mode="modal">
              <button className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                Register
              </button>
            </SignUpButton>

            {/* Start Now Button */}
            <SignInButton mode="modal">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20">
                Start Now
              </button>
            </SignInButton>
          </SignedOut>

          {/* User Button - Show when signed in */}
          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
