'use client';

import { useState } from 'react';

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

export function PublicMissionPage() {
  const [missions] = useState<Mission[]>(mockMissions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMissions = missions.filter(mission => 
    selectedCategory === 'all' || mission.category === selectedCategory
  );

  const totalNequada = missions
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.reward, 0);

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
      case 'medium': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
      case 'hard': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
    }
  };

  const getCategoryIcon = (category: Mission['category']) => {
    switch (category) {
      case 'daily': return '⏰';
      case 'weekly': return '🎯';
      case 'special': return '⭐';
      case 'story': return '🚀';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a2942 50%, #0a1628 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '8px',
          height: '8px',
          backgroundColor: '#60a5fa',
          borderRadius: '50%',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '75%',
          right: '33%',
          width: '4px',
          height: '4px',
          backgroundColor: '#a855f7',
          borderRadius: '50%',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          animationDelay: '1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '50%',
          width: '6px',
          height: '6px',
          backgroundColor: '#6366f1',
          borderRadius: '50%',
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🚀
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>Galaktische Missionen</h1>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px', marginBottom: '24px' }}>
            Erfülle Missionen und sammle Nequada für die Crew der Nebukadneza
          </p>
          
          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ fontSize: '20px' }}>💰</span>
              <span style={{ fontWeight: '600' }}>{totalNequada.toLocaleString()} Nequada</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ fontSize: '20px' }}>🏆</span>
              <span style={{ fontWeight: '600' }}>
                {missions.filter(m => m.completed).length}/{missions.length} Abgeschlossen
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {[
            { key: 'all', label: 'Alle', icon: '⭐' },
            { key: 'daily', label: 'Täglich', icon: '⏰' },
            { key: 'weekly', label: 'Wöchentlich', icon: '🎯' },
            { key: 'story', label: 'Story', icon: '🚀' },
            { key: 'special', label: 'Spezial', icon: '🎁' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ...(selectedCategory === category.key
                  ? {
                      backgroundColor: '#6366f1',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }
                  : {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    })
              }}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Missions Grid */}
        <div style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
          {filteredMissions.map((mission) => {
            const difficultyStyle = getDifficultyColor(mission.difficulty);
            return (
              <div
                key={mission.id}
                style={{
                  position: 'relative',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  ...(mission.completed
                    ? {
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)'
                      }
                    : mission.locked
                    ? {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        opacity: 0.6
                      }
                    : {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      })
                }}
                onMouseEnter={(e) => {
                  if (!mission.locked) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = mission.completed 
                    ? 'rgba(16, 185, 129, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Status Icons */}
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  {mission.completed ? (
                    <span style={{ fontSize: '24px', color: '#10b981' }}>✅</span>
                  ) : mission.locked ? (
                    <span style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.4)' }}>🔒</span>
                  ) : null}
                </div>

                {/* Category & Difficulty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px'
                  }}>
                    <span>{getCategoryIcon(mission.category)}</span>
                    <span style={{ textTransform: 'capitalize' }}>{mission.category}</span>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${difficultyStyle.border}`,
                    fontSize: '10px',
                    fontWeight: '500',
                    color: difficultyStyle.color,
                    backgroundColor: difficultyStyle.bg,
                    textTransform: 'uppercase'
                  }}>
                    {mission.difficulty}
                  </div>
                </div>

                {/* Mission Content */}
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{mission.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px', lineHeight: '1.5' }}>
                  {mission.description}
                </p>

                {/* Time Limit */}
                {mission.timeLimit && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    color: '#f59e0b',
                    fontSize: '14px'
                  }}>
                    <span>⏰</span>
                    <span>Endet um {mission.timeLimit}</span>
                  </div>
                )}

                {/* Reward */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>⚡</span>
                    <span style={{ fontWeight: '600' }}>{mission.reward.toLocaleString()} Nequada</span>
                  </div>
                  
                  {!mission.completed && !mission.locked && (
                    <button style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      Starten
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: '20px' }}>🚀</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Neue Missionen werden regelmäßig hinzugefügt. Bleib dran, Commander!
            </span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
}