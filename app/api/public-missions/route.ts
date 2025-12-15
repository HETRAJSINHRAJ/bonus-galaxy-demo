import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    const totalNequada = mockMissions
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.reward, 0);

    const completedCount = mockMissions.filter(m => m.completed).length;

    return NextResponse.json({
      success: true,
      data: {
        missions: mockMissions,
        stats: {
          totalNequada,
          completedCount,
          totalCount: mockMissions.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch missions' },
      { status: 500 }
    );
  }
}

// Allow CORS for mobile app
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}