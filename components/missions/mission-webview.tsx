'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

const MISSIONS_URL = process.env.NEXT_PUBLIC_MISSIONS_URL || 'https://missions.bonus-galaxy.com/';

export function MissionWebView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleRefresh = () => {
    setError(false);
    setLoading(true);
    // Reload the iframe
    const iframe = document.getElementById('missions-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(MISSIONS_URL, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Mission Control</h2>
          <p className="text-sm text-white/60">
            Lade Missionen von {MISSIONS_URL}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="border-white/20 text-white/80 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openInNewTab}
            className="border-white/20 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Neuer Tab
          </Button>
        </div>
      </div>

      {/* WebView Container */}
      <div className="relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628] z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/80 font-medium">Lade Missionen...</p>
              <p className="text-white/60 text-sm mt-1">Verbinde mit Mission Control</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628] z-10">
            <div className="text-center max-w-md px-6">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Verbindung fehlgeschlagen</h3>
              <p className="text-white/60 mb-6">
                Konnte keine Verbindung zu {MISSIONS_URL} herstellen. 
                Überprüfe deine Internetverbindung oder versuche es später erneut.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleRefresh}
                  className="btn-gradient"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Erneut versuchen
                </Button>
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  className="border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Extern öffnen
                </Button>
              </div>
            </div>
          </div>
        )}

        <iframe
          id="missions-iframe"
          src={MISSIONS_URL}
          className="w-full h-[600px] lg:h-[700px] border-0"
          onLoad={handleLoad}
          onError={handleError}
          title="Bonus Galaxy Missions"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Mission System</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Das Mission System lädt Inhalte direkt von unserem Mission Control Server. 
              Hier findest du tägliche Herausforderungen, spezielle Events und Belohnungen 
              für die Crew der Nebukadneza.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}