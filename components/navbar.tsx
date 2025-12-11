"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { Globe, Menu, X } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Navbar() {
  const { locale, setLocale, t } = useLanguage()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleLanguage = () => {
    setLocale(locale === "de" ? "en" : "de")
  }

  const isActive = (path: string) => pathname === path

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 relative z-[110]">
          <img src="/images/bonus-galaxy-logo.png" alt="Bonus Galaxy" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-foreground hidden sm:inline">Bonus Galaxy</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${isActive("/") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${isActive("/about") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
            >
              {t.nav.story}
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${isActive("/contact") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/privacy"
              className={`text-sm transition-colors ${isActive("/privacy") ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
            >
              {t.nav.privacy}
            </Link>
          </div>

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
            <div className="flex items-center gap-3">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  register
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="inline-flex items-center px-5 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20">
                  Start Now
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          {/* User Button - Show when signed in */}
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-5 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          </SignedIn>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-3 relative z-[110]">
          {/* Language Switcher - Mobile */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/50 bg-card/50 hover:bg-card transition-colors text-xs font-medium"
            aria-label="Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="uppercase">{locale}</span>
          </button>

          {/* User Button - Mobile (when signed in) */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-card/50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[57px] bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[57px] right-0 bottom-0 w-full max-w-sm bg-background border-l border-border/30 shadow-2xl z-[70] lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Navigation Links */}
          <div className="flex flex-col gap-1 mb-8">
            <Link
              href="/"
              className={`px-4 py-3 rounded-lg text-base transition-colors ${
                isActive("/")
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-card/50"
              }`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              className={`px-4 py-3 rounded-lg text-base transition-colors ${
                isActive("/about")
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-card/50"
              }`}
            >
              {t.nav.story}
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-3 rounded-lg text-base transition-colors ${
                isActive("/contact")
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-card/50"
              }`}
            >
              {t.nav.contact}
            </Link>
            <Link
              href="/privacy"
              className={`px-4 py-3 rounded-lg text-base transition-colors ${
                isActive("/privacy")
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-card/50"
              }`}
            >
              {t.nav.privacy}
            </Link>
          </div>

          {/* Auth Buttons - Mobile */}
          <div className="mt-auto space-y-3 pt-6 border-t border-border/30">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                  Register
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20">
                  Start Now
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  )
}
