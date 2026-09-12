import React from 'react';
import { Star, Sparkles, LayoutGrid, Puzzle, Swords, History } from 'lucide-react';

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  favoritesCount,
}) => {
  const categories = [
    { id: 'All', label: 'All Games', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'Favorites', label: 'Favorites', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'Arcade', label: 'Arcade', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'Puzzle', label: 'Puzzle', icon: <Puzzle className="w-3.5 h-3.5" /> },
    { id: 'Action', label: 'Action', icon: <Swords className="w-3.5 h-3.5" /> },
    { id: 'Classic', label: 'Classic', icon: <History className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const count = cat.id === 'Favorites' ? favoritesCount : (categoryCounts[cat.id] ?? 0);

        return (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id.toLowerCase()}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-900/60 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
