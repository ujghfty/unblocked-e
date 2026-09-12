import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { Header } from './components/Header.jsx';
import { CategoryFilter } from './components/CategoryFilter.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonEditorModal } from './components/JsonEditorModal.jsx';
import { Gamepad2, SearchX, Plus, FileCode2 } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('unblocked_games_custom');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the cached list has the old pre-loaded sample games, clear them
          const hasOldSamples = parsed.some(
            (g) => g.id === 'snake' && (g.iframeUrl?.includes('snake') || g.title?.includes('Snake'))
          );
          if (hasOldSamples) {
            localStorage.removeItem('unblocked_games_custom');
            return [];
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved games:', e);
      }
    }
    return DEFAULT_GAMES;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    try {
      const favs = localStorage.getItem('unblocked_games_favs');
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Fetch games from games.json on initial load if no custom data
  useEffect(() => {
    const jsonUrl = import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL}games.json` : './games.json';
    fetch(jsonUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not fetch ${jsonUrl}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const savedCustom = localStorage.getItem('unblocked_games_custom');
          if (!savedCustom) {
            setGames(data);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load games.json:', err);
      });
  }, []);

  // Clear any legacy default games in local storage
  useEffect(() => {
    const saved = localStorage.getItem('unblocked_games_custom');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((g) => g.id === 'snake')) {
          localStorage.removeItem('unblocked_games_custom');
          localStorage.removeItem('unblocked_games_favs');
          setGames([]);
          setFavorites([]);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('unblocked_games_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Save games list to localStorage
  const persistGames = (newGamesList) => {
    setGames(newGamesList);
    localStorage.setItem('unblocked_games_custom', JSON.stringify(newGamesList));
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    persistGames(updated);
  };

  const handleDeleteCustomGame = (id) => {
    const updated = games.filter((g) => g.id !== id);
    persistGames(updated);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('unblocked_games_custom');
    localStorage.removeItem('unblocked_games_favs');
    setGames([]);
    setFavorites([]);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Category match
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (game.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = game.title?.toLowerCase().includes(q);
        const matchDesc = game.description?.toLowerCase().includes(q);
        const matchCat = game.category?.toLowerCase().includes(q);
        const matchControls = game.controls?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat || matchControls;
      }

      return true;
    });
  }, [games, selectedCategory, favorites, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        favoriteCount={favorites.length}
        totalGames={games.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {activeGame ? (
          /* Iframe Game Player View */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
          />
        ) : (
          /* Game Catalog & Lobby View */
          <div className="flex flex-col gap-6">
            {/* Category Filter Pills */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              favoritesCount={favorites.length}
            />

            {/* Games Grid or Empty State */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPlay={(g) => setActiveGame(g)}
                    onDeleteCustom={handleDeleteCustomGame}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 border border-slate-800/60 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {games.length === 0 ? 'No Games In Catalog' : 'No Games Found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                  {games.length === 0
                    ? 'All default games have been removed. Add custom iframe games or paste your games JSON to build your catalog.'
                    : searchQuery
                    ? `No games matched "${searchQuery}". Try a different search term or select another category.`
                    : 'No games in this category yet.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors border border-slate-700"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Game Iframe</span>
                  </button>
                  <button
                    onClick={() => setIsJsonModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    <FileCode2 className="w-4 h-4 text-slate-400" />
                    <span>Open games.json Editor</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-auto bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-500" />
            <span>Unblocked Games • Static JSON + HTML/JS/CSS Iframe Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              View games.json
            </button>
            <span>•</span>
            <button
              onClick={handleResetDefaults}
              className="hover:text-slate-300 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonEditorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onSaveGames={persistGames}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
