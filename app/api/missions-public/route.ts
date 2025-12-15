import { NextResponse } from 'next/server';

export async function GET() {
  const missionPageHTML = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galactic Missions - Bonus Galaxy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a1628 0%, #1a2942 50%, #0a1628 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.8;
            margin-bottom: 2rem;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
        }
        
        .filters {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .filter-btn.active {
            background: #6366f1;
            border-color: #6366f1;
        }
        
        .filter-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .missions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .mission-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .mission-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }
        
        .mission-card.completed {
            background: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.3);
        }
        
        .mission-card.locked {
            opacity: 0.6;
        }
        
        .mission-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .mission-badges {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .badge {
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge.easy {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .badge.medium {
            background: rgba(251, 191, 36, 0.1);
            color: #fbbf24;
            border: 1px solid rgba(251, 191, 36, 0.2);
        }
        
        .badge.hard {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .mission-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .mission-description {
            opacity: 0.8;
            line-height: 1.5;
            margin-bottom: 1rem;
        }
        
        .mission-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .reward {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        }
        
        .start-btn {
            padding: 0.5rem 1rem;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
            border: none;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .start-btn:hover {
            transform: scale(1.05);
        }
        
        .status-icon {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 1.5rem;
            height: 1.5rem;
        }
        
        .footer-info {
            text-align: center;
            padding: 2rem;
            background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 1rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .stats {
                gap: 1rem;
            }
            
            .missions-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Galaktische Missionen</h1>
            <p>Erfülle Missionen und sammle Nequada für die Crew der Nebukadneza</p>
            
            <div class="stats">
                <div class="stat">
                    <span>🪙</span>
                    <span><strong>1,000 Nequada</strong></span>
                </div>
                <div class="stat">
                    <span>🏆</span>
                    <span><strong>1/5 Abgeschlossen</strong></span>
                </div>
            </div>
        </div>

        <div class="filters">
            <button class="filter-btn active">⭐ Alle</button>
            <button class="filter-btn">🕐 Täglich</button>
            <button class="filter-btn">🎯 Wöchentlich</button>
            <button class="filter-btn">🚀 Story</button>
            <button class="filter-btn">🎁 Spezial</button>
        </div>

        <div class="missions-grid">
            <div class="mission-card">
                <div class="mission-header">
                    <div class="mission-badges">
                        <span class="badge easy">Easy</span>
                        <span class="badge">Story</span>
                    </div>
                </div>
                <h3 class="mission-title">Erste Rechnung scannen</h3>
                <p class="mission-description">Scanne deine erste Rechnung und sammle Nequada für die Crew</p>
                <div class="mission-footer">
                    <div class="reward">
                        <span>⚡</span>
                        <span>500 Nequada</span>
                    </div>
                    <button class="start-btn">Starten</button>
                </div>
            </div>

            <div class="mission-card">
                <div class="mission-header">
                    <div class="mission-badges">
                        <span class="badge medium">Medium</span>
                        <span class="badge">Daily</span>
                    </div>
                </div>
                <h3 class="mission-title">Täglicher Scanner</h3>
                <p class="mission-description">Scanne heute 3 Rechnungen</p>
                <div class="mission-footer">
                    <div class="reward">
                        <span>⚡</span>
                        <span>300 Nequada</span>
                    </div>
                    <button class="start-btn">Starten</button>
                </div>
            </div>

            <div class="mission-card completed">
                <div class="mission-header">
                    <div class="mission-badges">
                        <span class="badge hard">Hard</span>
                        <span class="badge">Weekly</span>
                    </div>
                </div>
                <h3 class="mission-title">Nequada Sammler</h3>
                <p class="mission-description">Sammle insgesamt 1000 Nequada Punkte</p>
                <div class="mission-footer">
                    <div class="reward">
                        <span>⚡</span>
                        <span>1,000 Nequada</span>
                    </div>
                    <span style="color: #22c55e;">✅ Abgeschlossen</span>
                </div>
                <div class="status-icon">✅</div>
            </div>

            <div class="mission-card locked">
                <div class="mission-header">
                    <div class="mission-badges">
                        <span class="badge medium">Medium</span>
                        <span class="badge">Story</span>
                    </div>
                </div>
                <h3 class="mission-title">Crew Unterstützer</h3>
                <p class="mission-description">Kaufe deinen ersten Gutschein im Shop</p>
                <div class="mission-footer">
                    <div class="reward">
                        <span>⚡</span>
                        <span>750 Nequada</span>
                    </div>
                    <span style="opacity: 0.6;">🔒 Gesperrt</span>
                </div>
                <div class="status-icon">🔒</div>
            </div>

            <div class="mission-card">
                <div class="mission-header">
                    <div class="mission-badges">
                        <span class="badge hard">Hard</span>
                        <span class="badge">Special</span>
                    </div>
                </div>
                <h3 class="mission-title">Galaktischer Explorer</h3>
                <p class="mission-description">Besuche alle Bereiche der App mindestens einmal</p>
                <div class="mission-footer">
                    <div class="reward">
                        <span>⚡</span>
                        <span>2,000 Nequada</span>
                    </div>
                    <button class="start-btn">Starten</button>
                </div>
            </div>
        </div>

        <div class="footer-info">
            <p>🚀 Neue Missionen werden regelmäßig hinzugefügt. Bleib dran, Commander!</p>
        </div>
    </div>

    <script>
        // Simple filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Simple start button functionality
        document.querySelectorAll('.start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                alert('Mission gestartet! 🚀');
            });
        });
    </script>
</body>
</html>
  `;

  return new NextResponse(missionPageHTML, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'ALLOWALL',
      'Access-Control-Allow-Origin': '*',
    },
  });
}