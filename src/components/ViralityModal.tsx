import React from 'react';
import { X, BarChart2, CheckCircle, AlertTriangle, Lightbulb, Zap, ArrowUpRight } from 'lucide-react';
import { ViralityAnalysis, PlatformType } from '../types';

interface ViralityModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ViralityAnalysis | null;
  isLoading: boolean;
  platform: PlatformType;
}

export const ViralityModal: React.FC<ViralityModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  platform,
}) => {
  if (!isOpen) return null;

  const platformTitle =
    platform === 'linkedin' ? 'LinkedIn' : platform === 'twitter' ? 'Twitter / 𝕏' : 'Instagram';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700 flex items-center justify-center text-purple-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{platformTitle} Virality &amp; Algorithm Audit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Powered by gemini-4-argon
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Deep complex reasoning &amp; psychological engagement evaluation
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-base font-semibold text-white">Analyzing with Gemini 4 Argon...</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Performing deep evaluation of hook retention, readability friction, comment drivers, and platform algorithm mechanics.
                </p>
              </div>
            </div>
          ) : analysis ? (
            <>
              {/* Score Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-18 h-18 rounded-full flex items-center justify-center bg-slate-900 border-4 border-purple-500 shadow-lg shadow-purple-500/20">
                    <span className="text-2xl font-black text-white">{analysis.viralityScore}</span>
                    <span className="text-[10px] text-slate-400 absolute bottom-1">/100</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                      Engagement Verdict
                    </span>
                    <h4 className="text-lg font-bold text-white">{analysis.verdict}</h4>
                    {analysis.estimatedReachMultiplier && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Estimated reach: {analysis.estimatedReachMultiplier}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5">
                  <span className="text-xs text-slate-400 block">Hook Retention</span>
                  <span className="text-sm font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 inline-block mt-1">
                    {analysis.hookRating}
                  </span>
                </div>
              </div>

              {/* Hook Critique */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hook &amp; Scroll-Stop Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysis.hookAnalysis}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Key Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses / Opportunities */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Friction Points to Fix</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-200">
                  3 High-Impact Tweaks to Boost Impressions:
                </div>
                <div className="space-y-2">
                  {analysis.actionableRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithm Secret Tip */}
              {analysis.algorithmTip && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-indigo-300 block">
                      Platform Algorithm Secret
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {analysis.algorithmTip}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No analysis data available.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
