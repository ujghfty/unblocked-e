import React from 'react';
import { Play, Star, Trash2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onDeleteCustom,
}) => {
  const getGradient = (accent) => {
    switch (accent) {
      case 'emerald':
        return 'from-emerald-600 to-teal-900 border-emerald-500/30';
      case 'blue':
        return 'from-blue-600 to-indigo-900 border-blue-500/30';
      case 'amber':
        return 'from-amber-600 to-orange-950 border-amber-500/30';
      case 'cyan':
        return 'from-cyan-600 to-slate-900 border-cyan-500/30';
      case 'rose':
        return 'from-rose-600 to-pink-950 border-rose-500/30';
      case 'yellow':
        return 'from-yellow-600 to-amber-950 border-yellow-500/30';
      case 'violet':
        return 'from-violet-600 to-purple-950 border-violet-500/30';
      case 'indigo':
        return 'from-indigo-600 to-slate-900 border-indigo-500/30';
      default:
        return 'from-slate-700 to-slate-900 border-slate-700';
    }
  };

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top Banner / Graphic Header */}
      <div
        className={`h-28 w-full bg-gradient-to-br ${getGradient(
          game.accentColor
        )} p-4 flex flex-col justify-between relative overflow-hidden`}
      >
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-black/40 text-slate-200 backdrop-blur-xs border border-white/10">
            {game.category}
          </span>
          <div className="flex items-center gap-1">
            {game.isCustom && onDeleteCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCustom(game.id);
                }}
                title="Delete custom game"
                className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-500/80 text-slate-300 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id={`fav-btn-${game.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(game.id);
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title inside card preview */}
        <div className="z-10">
          <h3 className="text-base font-bold text-white tracking-tight drop-shadow-sm line-clamp-1">
            {game.title}
          </h3>
          <p className="text-[11px] text-slate-300 line-clamp-1">
            {game.author || 'HTML5 Unblocked'}
          </p>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {game.controls && (
          <div className="text-[11px] text-slate-500 bg-slate-800/60 px-2.5 py-1.5 rounded-md border border-slate-800 line-clamp-1">
            <span className="text-slate-400 font-medium">Controls: </span>
            {game.controls}
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
            iframe: {game.iframeUrl.replace('/games/', '').replace('/index.html', '')}
          </span>
          <button
            id={`play-btn-${game.id}`}
            onClick={() => onPlay(game)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};
