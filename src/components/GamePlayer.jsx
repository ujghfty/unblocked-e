import React, { useRef, useState } from 'react';
import { ArrowLeft, RotateCw, Maximize, Minimize, ExternalLink, Info } from 'lucide-react';

export const GamePlayer = ({ game, onBack }) => {
  const containerRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Helper to ensure paths work on GitHub Pages subpaths
  const resolveGameUrl = (url) => {
    if (!url) return '';
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url.slice(1) : url.startsWith('./') ? url.slice(2) : url;
    const base = import.meta.env.BASE_URL || './';
    return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
  };

  const gameSrc = resolveGameUrl(game.iframeUrl);

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-2 sm:px-4 py-3 gap-3">
      {/* Top Player Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 shadow-md">
        <div className="flex items-center gap-3">
          <button
            id="player-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Games</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{game.title}</h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {game.category}
              </span>
            </div>
            {game.author && (
              <p className="text-[11px] text-slate-400">By {game.author}</p>
            )}
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="player-info-btn"
            onClick={() => setShowInfo(!showInfo)}
            title="Game Info & Controls"
            className={`p-2 rounded-lg text-xs transition-colors ${
              showInfo ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            id="player-reload-btn"
            onClick={handleReload}
            title="Restart / Reload Game"
            className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <a
            id="player-popout-link"
            href={gameSrc}
            target="_blank"
            rel="noopener noreferrer"
            title="Open game in raw new tab"
            className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            id="player-fullscreen-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Optional Info Dropdown */}
      {showInfo && (
        <div className="bg-slate-900/95 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 flex flex-col gap-2">
          <div className="font-semibold text-white">About {game.title}</div>
          <p className="text-slate-400">{game.description}</p>
          {game.controls && (
            <div className="p-2 bg-slate-800/80 rounded-md border border-slate-700/50">
              <span className="font-semibold text-indigo-300">Controls: </span>
              <span>{game.controls}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Iframe Stage Container */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[580px] w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center"
      >
        <iframe
          key={iframeKey}
          id="active-game-iframe"
          src={gameSrc}
          title={game.title}
          allow="autoplay; fullscreen; gamepad; keyboard"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock"
          className="w-full h-full border-0 absolute inset-0 bg-transparent"
        />
      </div>

      {/* Footer controls quickbar */}
      {game.controls && (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">Keyboard Controls:</span>
            <span className="text-slate-400">{game.controls}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Iframe source: {gameSrc}
          </span>
        </div>
      )}
    </div>
  );
};
