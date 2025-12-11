"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Locale, type TranslationKeys } from "./translations"

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("de")

  useEffect(() => {
    // Check browser language on mount
    const browserLang = navigator.language.split("-")[0]
    const savedLang = localStorage.getItem("bonus-galaxy-lang") as Locale | null

    if (savedLang && (savedLang === "de" || savedLang === "en")) {
      setLocale(savedLang)
    } else if (browserLang === "en") {
      setLocale("en")
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("bonus-galaxy-lang", newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
