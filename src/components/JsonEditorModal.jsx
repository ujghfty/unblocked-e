import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, RotateCcw, FileCode, AlertCircle } from 'lucide-react';

export const JsonEditorModal = ({
  isOpen,
  onClose,
  games,
  onSaveGames,
  onResetDefaults,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(games, null, 2));
      setError('');
    }
  }, [isOpen, games]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root of games.json must be an array of game objects.');
      }
      for (const item of parsed) {
        if (!item.id || !item.title || !item.iframeUrl) {
          throw new Error('Every game must contain "id", "title", and "iframeUrl".');
        }
      }
      onSaveGames(parsed);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid JSON syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">games.json Viewer & Editor</h3>
              <p className="text-[11px] text-slate-400">
                Each game is stored with title, category, and iframe embed URL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Total entries: {games.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Reset to original default games?')) {
                  onResetDefaults();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Editor body */}
        <div className="p-4 flex-1 overflow-hidden flex flex-col bg-slate-950">
          {error && (
            <div className="mb-3 flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full flex-1 bg-slate-950 text-slate-200 font-mono text-xs p-3 border border-slate-800 rounded-lg resize-none focus:outline-none focus:border-indigo-500 overflow-auto"
            rows={16}
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Changes apply instantly to current catalog and local storage.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              Apply JSON Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
