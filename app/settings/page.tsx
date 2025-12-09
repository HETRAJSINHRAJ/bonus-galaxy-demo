import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card } from '@/components/ui/card';
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
    <div className="min-h-screen bg-[#f9fafb] pb-24 lg:pb-8">
      <Navigation />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Einstellungen</h1>
                <p className="text-muted-foreground">
                  Verwalte dein Konto und deine Präferenzen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quick Settings Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={index} 
                  className="p-4 bg-white border border-border card-hover cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{section.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Clerk User Profile */}
          <Card className="overflow-hidden bg-white border border-border">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none w-full border-0',
                  navbar: 'border-r border-border',
                  navbarButton: 'text-muted-foreground hover:text-foreground hover:bg-[#6366f1]/5',
                  navbarButtonActive: 'text-[#6366f1] bg-[#6366f1]/10',
                  pageScrollBox: 'p-6',
                  formButtonPrimary: 'bg-[#6366f1] hover:bg-[#4f46e5]',
                  formFieldInput: 'border-border focus:border-[#6366f1] focus:ring-[#6366f1]/20',
                  badge: 'bg-[#6366f1]/10 text-[#6366f1]',
                },
              }}
            />
          </Card>

          {/* Info Card */}
          <Card className="p-6 bg-gradient-to-br from-[#6366f1]/5 to-[#8b5cf6]/5 border-[#6366f1]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6366f1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-[#6366f1]" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Deine Daten sind sicher</h4>
                <p className="text-sm text-muted-foreground">
                  Wir verwenden modernste Verschlüsselung und Sicherheitsmaßnahmen, 
                  um deine persönlichen Daten zu schützen. Deine Privatsphäre hat für uns höchste Priorität.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
