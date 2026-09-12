import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Link2 } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }

    let url = iframeInput.trim();
    if (!url) {
      setError('Please provide an iframe URL or embed code.');
      return;
    }

    // Support extracting src if user pasted a raw <iframe src="..."> tag
    if (url.includes('<iframe') && url.includes('src=')) {
      const match = url.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        url = match[1];
      }
    }

    const id = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);

    const newGame = {
      id,
      title: title.trim(),
      category,
      description: description.trim() || 'Custom iframe unblocked game.',
      iframeUrl: url,
      controls: controls.trim() || 'Mouse & Keyboard controls',
      author: 'Custom Added',
      accentColor: 'violet',
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();
    setTitle('');
    setIframeInput('');
    setDescription('');
    setControls('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Add Unblocked Game Iframe</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Retro Pacman or Slope Runner"
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Arcade">Arcade</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Action">Action</option>
              <option value="Classic">Classic</option>
              <option value="Retro">Retro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Iframe URL or &lt;iframe&gt; Embed Tag *</span>
              <span className="text-[10px] text-slate-500 font-normal">URL or embed snippet</span>
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={iframeInput}
                onChange={(e) => setIframeInput(e.target.value)}
                placeholder="https://example.com/game or <iframe src='...'></iframe>"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Stored as an iframe entry in the games JSON dataset.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief game gameplay description..."
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Controls (Optional)
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to jump"
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
            >
              Save to Games JSON
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
