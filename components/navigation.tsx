'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { 
  LayoutDashboard, 
  ScanLine, 
  ShoppingBag, 
  Coins, 
  Settings,
  Sparkles,
  Menu,
  X,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const publicNavItems = [
  { label: 'Features', href: '#features' },
  { label: "Here's how it works", href: '#how-it-works' },
  { label: 'Advantages', href: '#advantages' },
  { label: 'Contact', href: '#contact' },
];

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Scannen', href: '/scan', icon: ScanLine },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
  { label: 'Gutscheine', href: '/vouchers', icon: Ticket },
  { label: 'Punkte', href: '/points', icon: Coins },
  { label: 'Einstellungen', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a1628]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group">
              <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-white hidden sm:inline">
                BonusGalaxy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <SignedOut>
              {isHomePage && (
                <nav className="hidden lg:flex items-center gap-6">
                  {publicNavItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </SignedOut>
            
            <SignedIn>
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'btn-gradient text-white shadow-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SignedIn>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <SignedOut>
                {isHomePage && (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-white/90 hover:text-white hover:bg-white/10">
                        Register
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="btn-gradient shadow-lg rounded-lg px-6">
                        Start now
                      </Button>
                    </SignUpButton>
                  </>
                )}
                {!isHomePage && (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-white/70 hover:text-white hover:bg-white/10">
                        Anmelden
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="btn-gradient shadow-sm">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </SignedOut>
              
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 ring-2 ring-white/20 hover:ring-indigo-400 transition-all"
                    }
                  }}
                />
                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <SignedIn>
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 bg-[#0a1628]">
              <nav className="container mx-auto px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'btn-gradient text-white shadow-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </SignedIn>
      </header>

      {/* Mobile Bottom Navigation */}
      <SignedIn>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a1628]/95 backdrop-blur-xl safe-area-pb">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[70px]',
                    isActive
                      ? 'text-indigo-400'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg transition-all',
                    isActive && 'bg-indigo-500/20'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </SignedIn>
    </>
  );
}
