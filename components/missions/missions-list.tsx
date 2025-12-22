'use client';

import { useEffect, useState } from 'react';
import { MissionCard } from './mission-card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, Target, Trophy, Zap, AlertCircle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  type: string;
  category: string;
  difficulty: string;
  pointsReward: number;
  bonusReward: number;
  requirements: any;
  imageUrl: string | null;
  iconName: string | null;
  isFeatured: boolean;
  maxCompletions: number | null;
  totalLimit: number | null;
  currentCompletions: number;
  partnerName: string | null;
  partnerLogoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  userProgress: any;
  isAvailable: boolean;
}

export function MissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/missions');
      if (!response.ok) throw new Error('Failed to fetch missions');
      
      const data = await response.json();
      setMissions(data.missions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleRefresh = () => {
    fetchMissions();
  };

  // Group missions
  const featuredMissions = missions.filter(m => m.isFeatured);
  const activeMissions = missions.filter(m => !m.isFeatured && m.userProgress?.status === 'in_progress');
  const availableMissions = missions.filter(m => !m.isFeatured && (!m.userProgress || m.userProgress.status === 'not_started'));
  const completedMissions = missions.filter(m => !m.isFeatured && m.userProgress?.status === 'completed');

  // Calculate stats
  const totalPoints = missions.reduce((sum, m) => sum + m.pointsReward + m.bonusReward, 0);
  const completedCount = missions.filter(m => m.userProgress?.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative">
          <div className="w-20 h-20 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-20 h-20 border-[3px] border-purple-500/10 border-t-purple-500 rounded-full animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold text-white mb-2">Mission Control Initialisierung</p>
          <p className="text-white/60 text-sm">Lade verfügbare Missionen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Verbindung fehlgeschlagen</h3>
        <p className="text-white/60 mb-8 text-center max-w-md">{error}</p>
        <Button onClick={handleRefresh} className="btn-gradient px-6 py-3 text-base">
          <RefreshCw className="h-5 w-5 mr-2" />
          Erneut verbinden
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Aktive Missionen</span>
            <Target className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white">{activeMissions.length}</div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Abgeschlossen</span>
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">{completedCount}/{missions.length}</div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Verfügbar</span>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">{availableMissions.length}</div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">Mögliche Punkte</span>
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</div>
        </div>
      </div>

      {/* Featured Missions */}
      {featuredMissions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Featured Missionen</h2>
                <p className="text-sm text-white/60">Premium-Herausforderungen mit maximaler Belohnung</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-white/20 text-white/80 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onUpdate={fetchMissions} />
            ))}
          </div>
        </div>
      )}

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div className="space-y-6">
          {/* <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Aktive Missionen</h2>
              <p className="text-sm text-white/60">Setze deine gestarteten Missionen fort</p>
            </div>
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {activeMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onUpdate={fetchMissions} />
            ))}
          </div>
        </div>
      )}

      {/* Available Missions */}
      {availableMissions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Verfügbare Missionen</h2>
              <p className="text-sm text-white/60">Neue Herausforderungen warten auf dich</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {availableMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onUpdate={fetchMissions} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Abgeschlossene Missionen</h2>
              <p className="text-sm text-white/60">Deine Erfolge und Errungenschaften</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} onUpdate={fetchMissions} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {missions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
            <Trophy className="h-12 w-12 text-white/40" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Keine Missionen verfügbar</h3>
          <p className="text-white/60 mb-8 text-center max-w-md">
            Aktuell gibt es keine aktiven Missionen. Schau später wieder vorbei für neue Herausforderungen.
          </p>
          <Button onClick={handleRefresh} className="btn-gradient px-6 py-3 text-base">
            <RefreshCw className="h-5 w-5 mr-2" />
            Aktualisieren
          </Button>
        </div>
      )}
    </div>
  );
}
