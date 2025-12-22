'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Play,
  Loader2,
  Trophy,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface MissionCardProps {
  mission: Mission;
  onUpdate: () => void;
}

export function MissionCard({ mission, onUpdate }: MissionCardProps) {
  const [loading, setLoading] = useState(false);

  const isCompleted = mission.userProgress?.status === 'completed';
  const isInProgress = mission.userProgress?.status === 'in_progress';
  const isNotStarted = !mission.userProgress || mission.userProgress.status === 'not_started';

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping': return '🛍️';
      case 'social': return '👥';
      case 'engagement': return '🎯';
      case 'partner': return '🤝';
      case 'special': return '⭐';
      default: return '🎯';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Täglich';
      case 'weekly': return 'Wöchentlich';
      case 'monthly': return 'Monatlich';
      case 'one-time': return 'Einmalig';
      case 'recurring': return 'Wiederkehrend';
      default: return type;
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/missions/${mission.id}/start`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start mission');
      
      onUpdate();
    } catch (error) {
      console.error('Error starting mission:', error);
      alert('Fehler beim Starten der Mission. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      className={cn(
        'relative p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] group',
        mission.isFeatured
          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10'
          : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20'
      )}
    >
      {/* Featured Badge */}
      {mission.isFeatured && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 btn-gradient text-white border-0 px-3 py-0.5 text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}

      {/* Status Badge */}
      {isCompleted && (
        <Badge className="absolute -top-2.5 right-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-0.5 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Abgeschlossen
        </Badge>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-3xl">{getCategoryIcon(mission.category)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{mission.title}</h3>
              <p className="text-sm text-white/70 line-clamp-2">
                {mission.shortDescription || mission.description}
              </p>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs border-white/20 text-white/70">
            {getTypeLabel(mission.type)}
          </Badge>
          <Badge variant="outline" className={cn('text-xs', getDifficultyColor(mission.difficulty))}>
            {mission.difficulty === 'easy' && '⭐ Einfach'}
            {mission.difficulty === 'medium' && '⭐⭐ Mittel'}
            {mission.difficulty === 'hard' && '⭐⭐⭐ Schwer'}
          </Badge>
          {mission.partnerName && (
            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
              🤝 {mission.partnerName}
            </Badge>
          )}
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <div>
              <div className="text-lg font-bold text-white">{mission.pointsReward.toLocaleString()}</div>
              <div className="text-xs text-white/60">Nequada</div>
            </div>
          </div>
          {mission.bonusReward > 0 && (
            <>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-lg font-bold text-purple-400">+{mission.bonusReward}</div>
                  <div className="text-xs text-white/60">Bonus</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress (if in progress) */}
        {isInProgress && mission.userProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Fortschritt</span>
              <span>
                {mission.userProgress.currentStep || 0} / {mission.userProgress.totalSteps || 1}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${((mission.userProgress.currentStep || 0) / (mission.userProgress.totalSteps || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Dates */}
        {(mission.startDate || mission.endDate) && (
          <div className="flex items-center gap-4 text-xs text-white/60">
            {mission.endDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Endet: {formatDate(mission.endDate)}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleStart}
          disabled={loading || isCompleted || !mission.isAvailable}
          className={cn(
            'w-full',
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
              : mission.isFeatured
              ? 'btn-gradient'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lädt...
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Abgeschlossen
            </>
          ) : isInProgress ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Fortsetzen
            </>
          ) : !mission.isAvailable ? (
            'Nicht verfügbar'
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Mission starten
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
