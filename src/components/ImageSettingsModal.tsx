import React from 'react';
import { X, SlidersHorizontal, Image as ImageIcon, Sparkles, Check, Info } from 'lucide-react';
import { ImageModelType, ImageSizeType, AspectRatioType } from '../types';

interface ImageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageModel: ImageModelType;
  setImageModel: (m: ImageModelType) => void;
  globalImageSize: ImageSizeType;
  setGlobalImageSize: (s: ImageSizeType) => void;
}

const ALL_ASPECT_RATIOS: { ratio: AspectRatioType; label: string; bestFor: string }[] = [
  { ratio: '1:1', label: 'Square (1:1)', bestFor: 'Instagram Feed, LinkedIn Post' },
  { ratio: '16:9', label: 'Landscape Banner (16:9)', bestFor: 'Twitter/X Card, LinkedIn Feed' },
  { ratio: '4:3', label: 'Classic Landscape (4:3)', bestFor: 'Instagram Landscape, Twitter' },
  { ratio: '3:4', label: 'Portrait (3:4)', bestFor: 'Instagram Feed Portrait' },
  { ratio: '9:16', label: 'Full Vertical (9:16)', bestFor: 'Instagram Stories & Reels' },
  { ratio: '3:2', label: 'Standard 35mm (3:2)', bestFor: 'Twitter Card, Editorial Photo' },
  { ratio: '2:3', label: 'Vertical Poster (2:3)', bestFor: 'Pinterest & Mobile Feed' },
  { ratio: '21:9', label: 'Ultra-Wide Cinematic (21:9)', bestFor: 'Panoramic Header' },
];

export const ImageSettingsModal: React.FC<ImageSettingsModalProps> = ({
  isOpen,
  onClose,
  imageModel,
  setImageModel,
  globalImageSize,
  setGlobalImageSize,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Image Engine &amp; Quality Settings</h3>
              <p className="text-xs text-slate-400">
                Configure studio model, resolution affordance, and aspect ratios
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Resolution Affordance (1K, 2K, 4K) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Image Resolution Affordance</span>
              </label>
              <span className="text-[11px] text-slate-400">Supported by gemini-3-pro-image-preview</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as ImageSizeType[]).map((sz) => {
                const isSelected = globalImageSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setGlobalImageSize(sz)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 ring-1 ring-white/30'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span className="block text-lg font-black">{sz}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {sz === '1K' ? '1024px Standard' : sz === '2K' ? '2048px High-Def' : '4096px Ultra-HD'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Affordance */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Generative Image Model</span>
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setImageModel('gemini-3-pro-image-preview')}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                  imageModel === 'gemini-3-pro-image-preview'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">gemini-3-pro-image-preview</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Studio Quality
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    State-of-the-art studio rendering, cinematic lighting, and 1K/2K/4K resolution support.
                  </p>
                </div>
                {imageModel === 'gemini-3-pro-image-preview' && (
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setImageModel('gemini-nano-banana-2.1')}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                  imageModel === 'gemini-nano-banana-2.1'
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">gemini-nano-banana-2.1</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      High Speed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Fast turnaround with full aspect ratio and resolution control.
                  </p>
                </div>
                {imageModel === 'gemini-nano-banana-2.1' && (
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Supported Aspect Ratios Overview */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Full Aspect Ratio Support (Configurable per Platform)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {ALL_ASPECT_RATIOS.map((item) => (
                <div
                  key={item.ratio}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
                >
                  <span className="font-bold text-indigo-300 block">{item.label}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">{item.bestFor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
