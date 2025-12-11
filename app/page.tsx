import { HeroSection } from "@/components/hero-section"
import { CrewSection } from "@/components/crew-section"
import { MissionSection } from "@/components/mission-section"
import { JoinSection } from "@/components/join-section"
import { Footer } from "@/components/footer-new"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroSection />
      <CrewSection />
      <MissionSection />
      <JoinSection />
      <Footer />
    </main>
  )
}
