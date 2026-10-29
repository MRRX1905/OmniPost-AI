import React from 'react';
import { X, History, Trash2, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { SavedCampaign } from '../types';

interface CampaignHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: SavedCampaign[];
  onLoadCampaign: (campaign: SavedCampaign) => void;
  onDeleteCampaign: (id: string) => void;
  onClearAll: () => void;
}

export const CampaignHistoryModal: React.FC<CampaignHistoryModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  onLoadCampaign,
  onDeleteCampaign,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Saved Campaigns History</h3>
              <p className="text-xs text-slate-400">
                {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} stored in your browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/40 border border-rose-900/60"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No campaigns saved yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Generate your first multi-platform post and it will automatically be saved here.
              </p>
            </div>
          ) : (
            campaigns.map((camp) => {
              const dateStr = new Date(camp.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={camp.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                        {camp.tone}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 font-semibold line-clamp-2">
                      "{camp.idea}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>✓ LinkedIn</span>
                      <span>✓ Twitter</span>
                      <span>✓ Instagram</span>
                      {Object.keys(camp.images).length > 0 && (
                        <span className="text-purple-400 font-medium">
                          • {Object.keys(camp.images).length} Images
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onLoadCampaign(camp);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCampaign(camp.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-colors"
                      title="Delete saved campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
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
