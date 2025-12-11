'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ScanLine, 
  ShoppingBag, 
  Gamepad2, 
  TrendingUp, 
  Gift,
  Zap,
  Users,
  Award,
  Sparkles,
  Check,
  ArrowRight,
  Star,
  Download,
  Shield,
  Smartphone,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { ParallaxContainer } from '@/components/parallax-container';
import DecryptedText from '@/components/decrypted-text';
import SplitText from '@/components/split-text';
import BlurText from '@/components/blur-text';
import { VideoModal } from '@/components/video-modal';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const features = [
  {
    icon: ScanLine,
    title: 'Einfaches Scannen',
    description: 'Scannen Sie beliebige Einkaufsrechnungen und sammeln Sie automatisch Galaxy Points',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    description: 'Spielen Sie Geschicklichkeitsspiele und erhöhen Sie Ihren Punktestand',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Gift,
    title: 'Exklusive Belohnungen',
    description: 'Lösen Sie Ihre Punkte für attraktive Rabatte und Angebote ein',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Werden Sie Teil einer aktiven Community von Millionen Nutzern',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Personalisierung',
    description: 'Erhalten Sie maßgeschneiderte Angebote basierend auf Ihrem Kaufverhalten',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Sofortige Belohnungen',
    description: 'Keine Wartezeiten - Ihre Belohnungen sind sofort verfügbar',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'App herunterladen',
    description: 'Laden Sie die Bonus Galaxy App herunter und erstellen Sie Ihr kostenloses Konto in weniger als 2 Minuten.',
    icon: Smartphone,
  },
  {
    number: '02',
    title: 'Rechnungen scannen',
    description: 'Scannen Sie beliebige Einkaufsrechnungen mit der Kamera Ihres Smartphones. Automatische Erkennung.',
    icon: ScanLine,
  },
  {
    number: '03',
    title: 'Belohnungen einlösen',
    description: 'Tauschen Sie Ihre gesammelten Punkte gegen attraktive Belohnungen und Gutscheine ein.',
    icon: Gift,
  },
];

const stats = [
  { value: '2.3M+', label: 'Aktive Nutzer' },
  { value: '85%', label: 'Engagement Rate' },
  { value: '€12M+', label: 'Ausgezahlte Rewards' },
  { value: '4.9/5', label: 'App Rating' },
];

const testimonials = [
  {
    quote: 'Bonus Galaxy hat die Art und Weise verändert, wie ich einkaufe. Ich sammle bei jedem Einkauf Punkte!',
    author: 'Sarah M.',
    role: 'Power User',
    avatar: '👩‍💼',
  },
  {
    quote: 'Die App ist super einfach zu bedienen und die Belohnungen sind wirklich wertvoll.',
    author: 'Michael K.',
    role: 'Early Adopter',
    avatar: '👨‍💻',
  },
  {
    quote: 'Endlich eine Loyalty-App, die wirklich funktioniert. Kann ich nur empfehlen!',
    author: 'Lisa W.',
    role: 'Community Member',
    avatar: '👩‍🎨',
  },
];

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen dark-pattern">
      <Navigation />
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoSrc="/watch-demo.MP4" 
      />
      
      {/* Hero Section - BonusGalaxy Style with Gradient */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
        {/* Colorful Gradient Background - Purple to Blue */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900" />
        
        {/* Decorative Elements with Parallax - Hidden on mobile for performance */}
        <ParallaxContainer speed={1.5} className="hidden sm:flex absolute top-20 right-10 md:right-20 lg:right-32 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-orange-400 items-center justify-center shadow-2xl animate-float">
          <Gift className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
        </ParallaxContainer>
        
        <ParallaxContainer speed={2} className="hidden sm:flex absolute top-1/2 right-16 md:right-32 lg:right-48 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-cyan-400 items-center justify-center shadow-2xl animate-float-slow">
          <Star className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white fill-white" />
        </ParallaxContainer>
        
        {/* Large circular background element */}
        <ParallaxContainer speed={0.5} className="absolute top-1/4 -right-20 sm:right-0 lg:right-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br from-indigo-600/30 to-blue-800/30 blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
                <SplitText
                  text="Welcome to the"
                  className="block text-white"
                  tag="span"
                  delay={30}
                  duration={0.5}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  textAlign="left"
                />
                <SplitText
                  text="Bonus Galaxy"
                  className="block"
                  charClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300"
                  tag="span"
                  delay={40}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 50, scale: 0.9 }}
                  to={{ opacity: 1, y: 0, scale: 1 }}
                  threshold={0.1}
                  textAlign="left"
                  startDelay={800}
                />
              </h1>
              
              <BlurText
                text="The gamified customer engagement system that turns everyday purchases into valuable rewards. Collect Galaxy Points and discover a new dimension of shopping."
                className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed"
                delay={50}
                animateBy="words"
                direction="bottom"
                threshold={0.1}
                stepDuration={0.3}
              />
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/api/download" download="BonusGalaxy.exe" className="inline-block">
                  <Button size="lg" className="btn-gradient text-base px-6 sm:px-8 h-12 sm:h-14 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold w-full">
                    Download the app
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </a>
                <Button 
                  size="lg" 
                  onClick={() => setIsVideoOpen(true)}
                  className="text-base px-6 sm:px-8 h-12 sm:h-14 border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Watch demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4">
                <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs sm:text-sm font-medium">2.3M+ active users</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  <span className="text-xs sm:text-sm font-medium">85% Engagement Rate</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - App Preview - Responsive */}
            <div className="relative hidden md:flex items-center justify-center mt-8 lg:mt-0">
              <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl flex items-center justify-center border-4 border-white/10 animate-float">
                <div className="text-center space-y-2 lg:space-y-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <div className="text-white font-bold text-lg lg:text-xl">BONUS</div>
                  <div className="text-white/80 text-xs lg:text-sm">GALAXY</div>
                  <div className="text-white/60 text-[10px] lg:text-xs">SHOPPING VOUCHERS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax and Decrypted Text */}
      <section className="relative py-12 sm:py-16 border-y border-white/10 bg-[#0a1628] overflow-hidden">
        <ParallaxContainer speed={0.5} className="hidden sm:block absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <ParallaxContainer
                key={index}
                speed={0.3 + (index * 0.1)}
                className="text-center group cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">
                  <DecryptedText
                    text={stat.value}
                    speed={30}
                    maxIterations={15}
                    sequential={true}
                    revealDirection="start"
                    animateOn="view"
                    className="text-white"
                    encryptedClassName="text-white/40"
                  />
                </div>
                <div className="text-xs sm:text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors">
                  {stat.label}
                </div>
              </ParallaxContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style with Parallax */}
      <section id="features" className="relative py-16 sm:py-24 lg:py-32 bg-[#0a1628] overflow-hidden">
        {/* Parallax background elements - Hidden on mobile */}
        <ParallaxContainer speed={0.3} className="hidden sm:block absolute top-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl" />
        <ParallaxContainer speed={0.5} className="hidden sm:block absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-4">
              Kernfunktionen
            </div>
            <SplitText
              text="Alles, was Sie brauchen"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
              tag="h2"
              delay={30}
              duration={0.5}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              textAlign="center"
            />
            <p className="text-base sm:text-lg lg:text-xl text-white/60">
              Eine Plattform, unzählige Möglichkeiten
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ParallaxContainer
                  key={index}
                  speed={0.2 + (index * 0.1)}
                  className="group relative p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2 sm:p-2.5 mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <Icon className="h-full w-full text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-white/60 leading-relaxed">{feature.description}</p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white/40" />
                  </div>
                </ParallaxContainer>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced Timeline Style */}
      <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 bg-[#0f1f35] overflow-hidden">
        {/* Floating background elements - Hidden on mobile */}
        <ParallaxContainer speed={0.4} className="hidden sm:block absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl" />
        <ParallaxContainer speed={0.6} className="hidden sm:block absolute bottom-20 right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-pulse-glow">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              Schnell & Einfach
            </div>
            <SplitText
              text="So einfach geht's"
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
              tag="h2"
              delay={30}
              duration={0.5}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              textAlign="center"
            />
            <p className="text-base sm:text-lg lg:text-xl text-white/70 leading-relaxed px-4">
              In nur drei einfachen Schritten zu Ihren ersten Rewards. Keine komplizierten Prozesse, keine versteckten Gebühren.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative group">
                    {/* Connector Line with Animation - Desktop only */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-20 left-full w-full h-1 -translate-x-1/2 z-0">
                        <div className="h-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-transparent rounded-full" />
                        <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: '30%' }} />
                      </div>
                    )}
                    
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
                      
                      <div className="relative z-10">
                        {/* Number Badge with enhanced styling */}
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl btn-gradient text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                          {step.number}
                        </div>
                        
                        {/* Icon with background */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:rotate-6 transition-transform duration-300">
                          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-300" />
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-indigo-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                          {step.description}
                        </p>
                        
                        {/* Progress indicator */}
                        <div className="mt-4 sm:mt-6 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${(index + 1) * 33}%` }} />
                          </div>
                          <span className="text-xs text-white/50 font-medium whitespace-nowrap">Schritt {index + 1}/3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Call to action below steps */}
            <div className="mt-12 sm:mt-16 text-center px-4">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 max-w-2xl">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">Bereit loszulegen?</p>
                    <p className="text-white/60 text-xs sm:text-sm">Starten Sie jetzt und sammeln Sie Ihre ersten Punkte</p>
                  </div>
                </div>
                <Button className="btn-gradient px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all whitespace-nowrap hover:scale-105 text-sm sm:text-base">
                  Jetzt starten
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Parallax */}
      <section id="advantages" className="relative py-16 sm:py-24 lg:py-32 bg-[#0a1628] overflow-hidden">
        <ParallaxContainer speed={0.4} className="hidden sm:block absolute top-1/4 left-0 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <ParallaxContainer speed={0.3} className="hidden sm:block absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-300" />
              Kundenbewertungen
            </div>
            <SplitText
              text="Was unsere Nutzer sagen"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
              tag="h2"
              delay={30}
              duration={0.5}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              textAlign="center"
            />
            <p className="text-base sm:text-lg lg:text-xl text-white/60">
              Tausende zufriedene Kunden weltweit
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ParallaxContainer
                key={index}
                speed={0.2 + (index * 0.15)}
                className="group p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                  ))}
                </div>
                <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm sm:text-base">{testimonial.author}</div>
                    <div className="text-xs sm:text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
              </ParallaxContainer>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-[#0a1628] overflow-hidden">
        <ParallaxContainer speed={0.5} className="hidden sm:block absolute top-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <ParallaxContainer speed={0.7} className="hidden sm:block absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ParallaxContainer speed={0.3}>
            <div className="max-w-3xl mx-auto relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl shadow-purple-500/20">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-orange-500/30 animate-pulse" style={{ animationDuration: '4s' }} />
              
              {/* Floating Orbs - Smaller */}
              <div className="absolute top-5 left-5 w-20 h-20 rounded-full bg-white/10 blur-2xl animate-float" />
              <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 blur-2xl animate-float-slow" />
              <div className="absolute bottom-5 left-1/3 w-16 h-16 rounded-full bg-white/10 blur-2xl animate-float" style={{ animationDelay: '1s' }} />
              
              {/* Content - Reduced padding and spacing */}
              <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-center space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg animate-pulse-glow">
                  <Sparkles className="h-3 w-3 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xs font-bold text-white">Get started now</span>
                </div>
                
                {/* Headline - Smaller */}
                <SplitText
                  text="Ready for the Bonus Galaxy?"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight"
                  tag="h2"
                  delay={35}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30, scale: 0.95 }}
                  to={{ opacity: 1, y: 0, scale: 1 }}
                  threshold={0.2}
                  textAlign="center"
                />
                
                {/* Subheadline - Smaller */}
                <p className="text-sm sm:text-base lg:text-lg text-white/95 max-w-xl mx-auto leading-relaxed">
                  Join millions of users and turn your purchases into valuable rewards.
                </p>
                
                {/* CTA Buttons - Smaller */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a href="/api/download" download="BonusGalaxy.exe" className="inline-block">
                    <Button 
                      size="default" 
                      className="group text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 bg-white text-indigo-600 hover:bg-gray-50 shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 font-bold rounded-lg w-full"
                    >
                      <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                      Start now
                    </Button>
                  </a>
                  <Button 
                    size="default"
                    onClick={() => setIsVideoOpen(true)}
                    className="group text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 hover:border-white hover:scale-105 transition-all duration-300 font-bold rounded-lg shadow-lg"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                {/* Trust Badges - Smaller */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">100% Safe</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">2.3M+ users</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </ParallaxContainer>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-[#0a1628]">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-white">
                  BonusGalaxy
                </span>
              </Link>
              <p className="text-white/60 mb-6 max-w-sm">
                Your portal to the best bonuses in the universe. Explore, compare, and claim.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white">
                  <span className="sr-only">Twitter</span>
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white">
                  <span className="sr-only">Discord</span>
                  💬
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Bonus Guides</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            {/* Categories */}
            <div>
              <h4 className="font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Casino Bonuses</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Sports Betting</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Free Spins</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">No Deposit</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Responsible Gaming</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              © 2025 BonusGalaxy. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Help</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
