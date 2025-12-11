"use client"

import { useEffect, useRef } from "react"

const sponsors = [
  {
    name: "Red Bull",
    logo: "/images/sponsors/red-bull.jpg",
    url: "https://www.redbull.com",
  },
  {
    name: "Swarovski",
    logo: "/images/sponsors/swarovski.jpg",
    url: "https://www.swarovski.com",
  },
  {
    name: "Manner",
    logo: "/images/sponsors/manner.jpg",
    url: "https://www.manner.com",
  },
  {
    name: "Julius Meinl",
    logo: "/images/sponsors/julius-meinl.jpg",
    url: "https://www.meinlcoffee.com",
  },
  {
    name: "Almdudler",
    logo: "/images/sponsors/almdudler.jpg",
    url: "https://www.almdudler.com",
  },
  {
    name: "Rauch",
    logo: "/images/sponsors/rauch.jpg",
    url: "https://www.rauch.cc",
  },
  {
    name: "Stiegl",
    logo: "/images/sponsors/stiegl.jpg",
    url: "https://www.stiegl.at",
  },
  {
    name: "Ottakringer",
    logo: "/images/sponsors/ottakringer.jpg",
    url: "https://www.ottakringer.at",
  },
  {
    name: "Palmers",
    logo: "/images/sponsors/palmers.jpg",
    url: "https://www.palmers.at",
  },
  {
    name: "Wienerberger",
    logo: "/images/sponsors/wienerberger.jpg",
    url: "https://www.wienerberger.com",
  },
]

export function SponsorMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.5

    const animate = () => {
      scrollPosition += speed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="relative z-10 w-full max-w-4xl mb-6">
      <div className="relative overflow-hidden rounded-xl border border-border/30 bg-background/20 backdrop-blur-sm py-4">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-3">Proudly Supported By</p>

        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-12 bottom-0 w-16 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-12 bottom-0 w-16 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-hidden px-4 items-center"
          style={{ scrollBehavior: "auto" }}
        >
          {/* Double the sponsors for seamless loop */}
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <a
              key={`${sponsor.name}-${index}`}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                className="h-14 w-auto object-contain max-w-[140px]"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
