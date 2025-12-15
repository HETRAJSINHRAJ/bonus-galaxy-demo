'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Star, 
  Zap, 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle,
  Lock,
  Coins,
  Gift
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: string;
  completed: boolean;
  locked: boolean;
  category: 'daily' | 'weekly' | 'special' | 'story';
}

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Erste Rechnung scannen',
    description: 'Scanne deine erste Rechnung und sammle Nequada für die Crew',
    reward: 500,
    difficulty: 'easy',
    completed: false,
    locked: false,
    category: 'story'
  },
  {
    id: '2',
    title: 'Täglicher Scanner',
    description: 'Scanne heute 3 Rechnungen',
    reward: 300,
    difficulty: 'medium',
    timeLimit: '23:59',
    completed: false,
    locked: false,
    category: 'daily'
  },
  {
    id: '3',
    title: 'Nequada Sammler',
    description: 'Sammle insgesamt 1000 Nequada Punkte',
    reward: 1000,
    difficulty: 'hard',
    completed: true,
    locked: false,
    category: 'weekly'
  },
  {
    id: '4',
    title: 'Crew Unterstützer',
    description: 'Kaufe deinen ersten Gutschein im Shop',
    reward: 750,
    difficulty: 'medium',
    completed: false,
    locked: true,
    category: 'story'
  },
  {
    id: '5',
    title: 'Galaktischer Explorer',
    description: 'Besuche alle Bereiche der App mindestens einmal',
    reward: 2000,
    difficulty: 'hard',
    completed: false,
    locked: false,
    category: 'special'
  }
];

export function MissionExternalPage() {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMissions = missions.filter(mission => 
    selectedCategory === 'all' || mission.category === selectedCategory
  );

  const totalNequada = missions
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.reward, 0);

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  const getCategoryIcon = (category: Mission['category']) => {
    switch (category) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'story': return <Rocket className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a2942] to-[#0a1628]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/stars.png')] opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Galaktische Missionen</h1>
          </div>
          <p className="text-white/70 text-lg mb-6">
            Erfülle Missionen und sammle Nequada für die Crew der Nebukadneza
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">{totalNequada.toLocaleString()} Nequada</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-semibold">
                {missions.filter(m => m.completed).length}/{missions.length} Abgeschlossen
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'Alle', icon: <Star className="w-4 h-4" /> },
            { key: 'daily', label: 'Täglich', icon: <Clock className="w-4 h-4" /> },
            { key: 'weekly', label: 'Wöchentlich', icon: <Target className="w-4 h-4" /> },
            { key: 'story', label: 'Story', icon: <Rocket className="w-4 h-4" /> },
            { key: 'special', label: 'Spezial', icon: <Gift className="w-4 h-4" /> }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.key
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>

        {/* Missions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                mission.completed
                  ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/10'
                  : mission.locked
                  ? 'bg-white/5 border-white/10 opacity-60'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Status Icons */}
              <div className="absolute top-4 right-4">
                {mission.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : mission.locked ? (
                  <Lock className="w-6 h-6 text-white/40" />
                ) : null}
              </div>

              {/* Category & Difficulty */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-white/80 text-sm">
                  {getCategoryIcon(mission.category)}
                  <span className="capitalize">{mission.category}</span>
                </div>
                <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty.toUpperCase()}
                </div>
              </div>

              {/* Mission Content */}
              <h3 className="text-xl font-semibold text-white mb-2">{mission.title}</h3>
              <p className="text-white/70 mb-4 leading-relaxed">{mission.description}</p>

              {/* Time Limit */}
              {mission.timeLimit && (
                <div className="flex items-center gap-2 mb-4 text-orange-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Endet um {mission.timeLimit}</span>
                </div>
              )}

              {/* Reward */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">{mission.reward.toLocaleString()} Nequada</span>
                </div>
                
                {!mission.completed && !mission.locked && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
                  >
                    Starten
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <span className="text-white/90">
              Neue Missionen werden regelmäßig hinzugefügt. Bleib dran, Commander!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}