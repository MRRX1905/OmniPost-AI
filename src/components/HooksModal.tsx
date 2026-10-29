import React from 'react';
import { X, Sparkles, Check, ArrowRight, Lightbulb } from 'lucide-react';
import { PlatformType } from '../types';

export interface HookItem {
  style: string;
  hookText: string;
}

interface HooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  hooks: HookItem[];
  isLoading: boolean;
  platform: PlatformType;
  onApplyHook: (newHook: string) => void;
}

export const HooksModal: React.FC<HooksModalProps> = ({
  isOpen,
  onClose,
  hooks,
  isLoading,
  platform,
  onApplyHook,
}) => {
  if (!isOpen) return null;

  const platformTitle =
    platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'Twitter / 𝕏' : 'Instagram';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>5 Scroll-Stopping Hooks for {platformTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  gemini-3.1-flash-lite
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click "Apply" to instantly swap the opening hook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-white">
                Brainstorming 5 high-converting hooks with Gemini 3.1 Flash-Lite...
              </p>
            </div>
          ) : hooks.length > 0 ? (
            hooks.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 inline-block">
                    {item.style}
                  </span>
                  <p className="text-sm text-slate-100 font-medium leading-relaxed group-hover:text-white">
                    "{item.hookText}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    onApplyHook(item.hookText);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No hook variations generated yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
