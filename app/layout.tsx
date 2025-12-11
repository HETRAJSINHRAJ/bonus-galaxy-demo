import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { LanguageProvider } from '@/lib/i18n/language-context';
import { Navbar } from '@/components/navbar';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bonus Galaxy - Das gamifizierte Kunden-Engagement System",
  description: "Sammeln Sie Galaxy Points und entdecken Sie eine neue Dimension des Shoppings. Scannen Sie Rechnungen, spielen Sie Spiele und lösen Sie Belohnungen ein.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: '#1a2942',
          colorInputBackground: 'rgba(255,255,255,0.05)',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: 'rgba(255,255,255,0.7)',
          colorPrimary: '#6366f1',
          colorDanger: '#ef4444',
          colorSuccess: '#10b981',
          colorNeutral: 'rgba(255,255,255,0.6)',
          borderRadius: '0.75rem',
        },
        elements: {
          userButtonPopoverCard: 'bg-[#1a2942] border border-white/10 shadow-xl',
          userButtonPopoverMain: 'bg-[#1a2942]',
          userButtonPopoverActions: 'bg-[#1a2942]',
          userButtonPopoverActionButton: 'text-white/80 hover:bg-white/10 hover:text-white',
          userButtonPopoverActionButtonIcon: 'text-white/60',
          userButtonPopoverActionButtonText: 'text-white/80',
          userButtonPopoverFooter: 'hidden',
          userPreview: 'bg-[#1a2942]',
          userPreviewMainIdentifier: 'text-white font-semibold',
          userPreviewSecondaryIdentifier: 'text-white/60',
          userButtonBox: 'hover:opacity-80',
        },
      }}
    >
      <html lang="de" suppressHydrationWarning>
        <body className={`${spaceGrotesk.className} ${geistMono.variable} antialiased`} suppressHydrationWarning>
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
