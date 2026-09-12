import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, PlusCircle, FileCode, Shield, ShieldCheck } from 'lucide-react';

export const Header = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenJsonModal,
  favoriteCount,
  totalGames,
}) => {
  const [isCloaked, setIsCloaked] = useState(false);

  useEffect(() => {
    if (isCloaked) {
      document.title = 'Classes - Google Classroom';
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
    } else {
      document.title = 'Unblocked Games';
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = '/favicon.ico';
      }
    }
  }, [isCloaked]);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">Unblocked Games</h1>
              <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {totalGames} Games
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">JSON-powered HTML5 Iframe Portal</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="game-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search games or categories..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Stealth Cloak Button */}
          <button
            id="cloak-tab-btn"
            onClick={() => setIsCloaked(!isCloaked)}
            title={isCloaked ? "Cloak active: disguised as Google Classroom. Click to uncloak." : "Stealth mode: Disguise browser tab as Google Classroom"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isCloaked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {isCloaked ? <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> : <Shield className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden md:inline">{isCloaked ? 'Cloaked' : 'Tab Cloak'}</span>
          </button>

          {/* JSON File Manager */}
          <button
            id="view-json-btn"
            onClick={onOpenJsonModal}
            title="Inspect and edit games.json"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">games.json</span>
          </button>

          {/* Add Game */}
          <button
            id="add-game-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
