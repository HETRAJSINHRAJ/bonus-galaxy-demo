"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoucherImageCarouselProps {
  images: string[]
  alt: string
}

export function VoucherImageCarousel({ images, alt }: VoucherImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
        <div className="text-white/40 text-sm">Kein Bild verfügbar</div>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 overflow-hidden group">
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - Bild ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Navigation arrows - only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:scale-110"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80 hover:scale-110"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-8 bg-white shadow-lg"
                    : "w-2 bg-white/60 hover:bg-white/90"
                )}
                aria-label={`Zu Bild ${index + 1} wechseln`}
              />
            ))}
          </div>

          {/* Image counter */}
          <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
