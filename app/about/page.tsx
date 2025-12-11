import { AboutHero } from "@/components/about/about-hero"
import { StorySection } from "@/components/about/story-section"
import { CrewStorySection } from "@/components/about/crew-story-section"
import { NequadaSection } from "@/components/about/nequada-section"
import { Footer } from "@/components/footer-new"

export const metadata = {
  title: "The Story - Bonus Galaxy",
  description:
    "Discover the epic tale of Captain Klaus and his emergency landing on Earth. Help the crew gather Nequada to conquer the Bonus Galaxy treasure.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AboutHero />
      <StorySection />
      <CrewStorySection />
      <NequadaSection />
      <Footer />
    </main>
  )
}
