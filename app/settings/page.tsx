import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { UserProfile } from '@clerk/nextjs';
import { Settings, Shield, Bell, User } from 'lucide-react';

const settingsSections = [
  {
    icon: User,
    title: 'Profil',
    description: 'Verwalte deine persönlichen Informationen',
  },
  {
    icon: Shield,
    title: 'Sicherheit',
    description: 'Passwort und Zwei-Faktor-Authentifizierung',
  },
  {
    icon: Bell,
    title: 'Benachrichtigungen',
    description: 'E-Mail und Push-Benachrichtigungen',
  },
];

export default async function SettingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen dark-pattern pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        <div className="container mx-auto px-4 lg:px-6 py-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Einstellungen</h1>
              <p className="text-sm text-white/70">Verwalte dein Konto und deine Präferenzen</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-6">
        <div className="space-y-6 flex flex-col justify-center items-center">
          {/* Quick Settings Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div 
                  key={index} 
                  className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{section.title}</h3>
                      <p className="text-xs text-white/60 mt-0.5">{section.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clerk User Profile */}
          <div className="overflow-hidden">
            <UserProfile
              routing="hash"
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorBackground: '#0a1628',
                  colorInputBackground: 'rgba(255,255,255,0.05)',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: 'rgba(255,255,255,0.7)',
                  colorPrimary: '#6366f1',
                  colorDanger: '#ef4444',
                  colorSuccess: '#10b981',
                  colorWarning: '#f59e0b',
                  colorNeutral: 'rgba(255,255,255,0.6)',
                  borderRadius: '0.75rem',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none w-full border-0 bg-[#0a1628]',
                  navbar: 'hidden',
                  navbarButton: 'hidden',
                  navbarButtonActive: 'hidden',
                  navbarButtonIcon: 'hidden',
                  pageScrollBox: 'p-6 bg-[#0a1628] w-full',
                  page: 'bg-[#0a1628] w-full',
                  profilePage: 'bg-[#0a1628] w-full max-w-none',
                  profileSection: 'w-full max-w-none',
                  profileSectionItem: 'w-full',
                  profileSectionItemContent: 'w-full',
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                  formFieldInput: 'border-white/20 bg-white/5 text-white placeholder:text-white/40',
                  formFieldLabel: 'text-white/80',
                  badge: 'bg-indigo-500/20 text-indigo-400',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-white/70',
                  profileSectionTitle: 'text-white',
                  profileSectionTitleText: 'text-white',
                  profileSectionContent: 'text-white/80 w-full',
                  profileSectionPrimaryButton: 'text-indigo-400 hover:text-indigo-300',
                  accordionTriggerButton: 'text-white hover:bg-white/5',
                  accordionContent: 'bg-[#0a1628]',
                  avatarBox: 'border-2 border-indigo-500/30',
                  userPreviewMainIdentifier: 'text-white',
                  userPreviewSecondaryIdentifier: 'text-white/60',
                  userButtonPopoverCard: 'bg-[#1a2942] border-white/10',
                  userButtonPopoverActionButton: 'text-white/80 hover:bg-white/10',
                  menuButton: 'text-white/70 hover:text-white hover:bg-white/10',
                  menuList: 'bg-[#1a2942] border-white/10',
                  menuItem: 'text-white/80 hover:bg-white/10',
                  modalContent: 'bg-[#0a1628] border-white/10',
                  modalCloseButton: 'text-white/60 hover:text-white',
                  identityPreview: 'bg-white/5 border-white/10',
                  identityPreviewText: 'text-white',
                  identityPreviewEditButton: 'text-indigo-400 hover:text-indigo-300',
                  formFieldSuccessText: 'text-emerald-400',
                  formFieldErrorText: 'text-red-400',
                  alertText: 'text-white/80',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-white/50',
                  socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10',
                  socialButtonsBlockButtonText: 'text-white',
                  otpCodeFieldInput: 'bg-white/5 border-white/20 text-white',
                  footer: 'hidden',
                  footerAction: 'hidden',
                },
              }}
            />
          </div>

          {/* Info Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Deine Daten sind sicher</h4>
                <p className="text-sm text-white/70">
                  Wir verwenden modernste Verschlüsselung und Sicherheitsmaßnahmen, 
                  um deine persönlichen Daten zu schützen. Deine Privatsphäre hat für uns höchste Priorität.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
