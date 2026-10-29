import React from 'react';
import { Sparkles, History, SlidersHorizontal, Image as ImageIcon, Zap } from 'lucide-react';
import { ImageModelType, ImageSizeType } from '../types';

interface NavbarProps {
  imageModel: ImageModelType;
  setImageModel: (m: ImageModelType) => void;
  globalImageSize: ImageSizeType;
  setGlobalImageSize: (s: ImageSizeType) => void;
  savedCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  imageModel,
  setImageModel,
  globalImageSize,
  setGlobalImageSize,
  savedCount,
  onOpenHistory,
  onOpenSettings,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">OmniPost</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              1-Idea → LinkedIn, Twitter/X &amp; Instagram with Studio AI Images
            </p>
          </div>
        </div>

        {/* Global Controls & Engine Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active Model Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Image Engine:</span>
            <span className="font-medium text-slate-200">
              {imageModel === 'gemini-3-pro-image-preview' ? 'gemini-3-pro (Studio)' : 'gemini-nano-banana-2.1'}
            </span>
            <span className="text-indigo-400 font-bold bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              {globalImageSize}
            </span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
            title="Image Engine & Quality Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Image Settings</span>
          </button>

          {/* Saved Campaigns */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors relative"
            title="Campaign History"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
