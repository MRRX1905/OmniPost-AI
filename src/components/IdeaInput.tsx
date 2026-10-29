import React, { useState } from 'react';
import {
  Sparkles,
  Briefcase,
  Laugh,
  Flame,
  Lightbulb,
  Compass,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Wand2,
  Sliders,
  Layers,
} from 'lucide-react';
import { ToneType, ImageSizeType, ImageModelType } from '../types';

interface IdeaInputProps {
  idea: string;
  setIdea: (val: string) => void;
  tone: ToneType;
  setTone: (val: ToneType) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  industry: string;
  setIndustry: (val: string) => void;
  globalImageSize: ImageSizeType;
  setGlobalImageSize: (val: ImageSizeType) => void;
  imageModel: ImageModelType;
  setImageModel: (val: ImageModelType) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const TONES: { id: ToneType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Authoritative, insightful, polished & enterprise-ready',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'witty',
    label: 'Witty',
    desc: 'Clever, humorous, relatable & conversational',
    icon: <Laugh className="w-4 h-4" />,
    color: 'from-amber-500 to-pink-500',
  },
  {
    id: 'urgent',
    label: 'Urgent',
    desc: 'High FOMO, action-driven, timely & imperative',
    icon: <Flame className="w-4 h-4" />,
    color: 'from-rose-600 to-orange-500',
  },
  {
    id: 'inspiring',
    label: 'Inspiring',
    desc: 'Uplifting, motivational, visionary & story-driven',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'bold',
    label: 'Bold / Hot Take',
    desc: 'Contrarian, provocative, decisive & trend-challenging',
    icon: <Compass className="w-4 h-4" />,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'educational',
    label: 'Educational',
    desc: 'Step-by-step breakdown, value-dense & tactical',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'from-cyan-600 to-blue-600',
  },
];

const PRESETS = [
  {
    title: '🚀 Product Launch',
    idea: 'We just launched OmniSync 2.0: real-time database sync with zero config that cut our latency by 65%. Built over 6 months of intense user feedback.',
  },
  {
    title: '💡 Contrarian Tech Take',
    idea: 'Most companies do not need AI agents; they need clean database hygiene and structured workflows. Stop adding LLM wrappers to broken processes.',
  },
  {
    title: '📈 Bootstrapped Milestone',
    idea: 'Our small 3-person team just crossed $100k ARR without a single dollar of venture capital. Here are the 3 non-obvious principles that worked for us.',
  },
  {
    title: '⚠️ Critical Security Alert',
    idea: 'Urgent patch: Three major npm libraries have zero-day vulnerabilities affecting Node 20+. If you deploy before Monday, update your lockfiles immediately.',
  },
  {
    title: '🎯 Design System Rule',
    idea: 'Why consistent 8px grids and strict typographic hierarchies make products feel 10x more trustworthy even before customers read a single word.',
  },
];

export const IdeaInput: React.FC<IdeaInputProps> = ({
  idea,
  setIdea,
  tone,
  setTone,
  targetAudience,
  setTargetAudience,
  industry,
  setIndustry,
  globalImageSize,
  setGlobalImageSize,
  imageModel,
  setImageModel,
  isGenerating,
  onGenerate,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header & Quick Starters */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Transform Your Idea Across Platforms</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Simultaneous 3-in-1
                </span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Enter any idea or update. We'll tailor long-form LinkedIn copy, punchy tweets, and aesthetic Instagram captions with matching custom AI images.
              </p>
            </div>
          </div>

          {/* Prompt Starters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Presets:
            </span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdea(p.idea)}
                className="text-xs whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer flex-shrink-0"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Core Idea Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label htmlFor="idea-input" className="font-semibold text-slate-300">
              Your Core Idea, News, or Announcement
            </label>
            <span>{idea.length} characters</span>
          </div>
          <div className="relative">
            <textarea
              id="idea-input"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. We just released an AI feature that automates multi-channel social media posts and generates tailored images with precise aspect ratios. It saves content creators 15 hours a week..."
              rows={4}
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 resize-y transition-all outline-none"
            />
          </div>
        </div>

        {/* Tone Selection (Highlighted: Professional, Witty, Urgent) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Desired Tone <span className="text-slate-500 font-normal">(Crucial for voice calibration)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TONES.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`flex flex-col items-start text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t.icon}
                    </span>
                    <span className="text-xs font-bold leading-tight text-white">{t.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {t.desc}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Affordances: Image Quality, Model & Audience */}
        <div className="border-t border-slate-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Image Engine &amp; Targeting Controls</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              {/* Image Size Affordance: 1K, 2K, 4K */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Image Resolution Affordance
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['1K', '2K', '4K'] as ImageSizeType[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGlobalImageSize(size)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        globalImageSize === size
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700/60'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Generated via gemini-3-pro-image-preview
                </p>
              </div>

              {/* Image Model Affordance */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Studio Image Model
                </label>
                <select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value as ImageModelType)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-3-pro-image-preview">
                    gemini-3-pro-image-preview (Studio Quality)
                  </option>
                  <option value="gemini-nano-banana-2.1">
                    gemini-nano-banana-2.1 (Fast &amp; High-Fidelity)
                  </option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Automatic graceful fallback enabled
                </p>
              </div>

              {/* Target Audience / Niche */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Audience / Niche <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Founders, Engineers, Marketers"
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>
              Generates 3 tailored platform copies + 3 tailored aspect-ratio AI images simultaneously
            </span>
          </div>

          <button
            type="button"
            disabled={!idea.trim() || isGenerating}
            onClick={onGenerate}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              !idea.trim() || isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Multi-Platform Campaign...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Simultaneously Generate 3 Platforms</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
