import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  Zap,
  BarChart2,
  Edit3,
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  Share,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { TwitterPost, PlatformImageState, AspectRatioType, ImageSizeType } from '../types';

interface TwitterCardProps {
  post: TwitterPost;
  imageState: PlatformImageState;
  onUpdateTweet: (newTweet: string) => void;
  onRegenerateImage: (ratio: AspectRatioType, size: ImageSizeType, prompt?: string) => void;
  onQuickEdit: (instruction: string) => void;
  onOpenVirality: () => void;
  onOpenHooks: () => void;
  isProcessingAction: boolean;
}

const ASPECT_RATIOS: AspectRatioType[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

export const TwitterCard: React.FC<TwitterCardProps> = ({
  post,
  imageState,
  onUpdateTweet,
  onRegenerateImage,
  onQuickEdit,
  onOpenVirality,
  onOpenHooks,
  isProcessingAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(imageState.prompt);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(imageState.aspectRatio || '16:9');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(imageState.imageSize || '1K');

  const charCount = post.tweet.length;
  const isOverLimit = charCount > 280;

  const fullCopyText = showThread && post.thread && post.thread.length > 0
    ? [post.tweet, ...post.thread].join('\n\n---\n\n')
    : post.tweet;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCopyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageState.imageUrl) return;
    const a = document.createElement('a');
    a.href = imageState.imageUrl;
    a.download = `twitter-x-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApplyImageRegen = () => {
    onRegenerateImage(selectedRatio, selectedSize, customPrompt);
    setShowImageControls(false);
  };

  const getAspectClass = (ratio: AspectRatioType) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '9:16':
        return 'aspect-[9/16]';
      case '21:9':
        return 'aspect-[21/9]';
      case '3:2':
        return 'aspect-[3/2]';
      case '2:3':
        return 'aspect-[2/3]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all hover:border-slate-700/80">
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* X Logo */}
          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white border border-slate-700 shadow-sm font-black text-sm">
            𝕏
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">Twitter / 𝕏</span>
            <span className="text-[10px] text-slate-400 ml-1.5 font-medium">Short &amp; Punchy</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {post.thread && post.thread.length > 0 && (
            <button
              onClick={() => setShowThread(!showThread)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                showThread
                  ? 'bg-sky-600 text-white border-sky-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Thread View"
            >
              <Layers className="w-3 h-3" />
              <span>Thread ({post.thread.length + 1})</span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isEditing
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
            title="Toggle inline editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
            title="Copy Tweet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick AI Intelligence Tools Bar */}
      <div className="bg-slate-950/40 px-3 py-2 border-b border-slate-800/60 flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={onOpenVirality}
          disabled={isProcessingAction}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 font-medium transition-colors"
          title="Audit virality with gemini-4-argon"
        >
          <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Audit Virality (Argon)</span>
        </button>

        <button
          onClick={onOpenHooks}
          disabled={isProcessingAction}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 font-medium transition-colors"
          title="Generate 5 alternative hooks with gemini-3.1-flash-lite"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>5 Hooks</span>
        </button>

        <div className="relative group ml-auto">
          <button
            disabled={isProcessingAction}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Polish</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1 z-30 hidden group-hover:block space-y-0.5">
            <button
              onClick={() => onQuickEdit('Make it strictly under 240 characters, razor sharp and punchy')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              ⚡ Make Ultra-Punchy
            </button>
            <button
              onClick={() => onQuickEdit('Inject witty sarcasm or sharp clever humor')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              😏 Witty &amp; Clever
            </button>
            <button
              onClick={() => onQuickEdit('Increase urgency and immediate call for attention')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              🚨 High Urgency
            </button>
            <button
              onClick={() => onQuickEdit('Turn this into a high-engagement open question for quote-tweets')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              💬 Quote-Tweet Bait
            </button>
          </div>
        </div>
      </div>

      {/* Tweet Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
        {/* Author Simulation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
              @
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">Your Name</span>
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500 flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
                <span className="text-xs text-slate-400">@handle</span>
              </div>
              <span className="text-[10px] text-slate-500">2h ago</span>
            </div>
          </div>

          {/* Character Count Live Pill */}
          <div
            className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
              isOverLimit
                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                : charCount > 250
                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {charCount}/280
          </div>
        </div>

        {/* Content View / Edit */}
        {isEditing ? (
          <div>
            <textarea
              value={post.tweet}
              onChange={(e) => onUpdateTweet(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm sm:text-base text-slate-100 leading-snug whitespace-pre-line font-sans">
              {post.tweet}
            </div>

            {/* Optional Thread Preview */}
            {showThread && post.thread && post.thread.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Thread Continuation:
                </span>
                {post.thread.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 relative pl-4 border-l-2 border-l-sky-500"
                  >
                    <span className="text-[10px] text-slate-500 block mb-1">
                      Part {idx + 2}/{post.thread!.length + 1}
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dedicated Image Area with Aspect Ratio Affordance */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-slate-300">Twitter Card Asset</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800">
                {imageState.aspectRatio}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {imageState.imageSize}
              </span>
            </div>

            <button
              onClick={() => setShowImageControls(!showImageControls)}
              className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize Image</span>
            </button>
          </div>

          {/* Image Settings Accordion */}
          {showImageControls && (
            <div className="mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Aspect Ratio Affordance (Twitter Optimal: 16:9 or 3:2)
                </label>
                <div className="flex flex-wrap gap-1">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-all ${
                        selectedRatio === ratio
                          ? 'bg-sky-600 text-white border-sky-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Resolution Affordance (1K, 2K, 4K)
                </label>
                <div className="flex gap-1.5">
                  {(['1K', '2K', '4K'] as ImageSizeType[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-0.5 text-xs font-bold rounded border transition-all ${
                        selectedSize === sz
                          ? 'bg-sky-600 text-white border-sky-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Custom Visual Prompt
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowImageControls(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyImageRegen}
                  disabled={imageState.isLoading}
                  className="px-3 py-1 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${imageState.isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate with New Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* Image Display */}
          <div
            className={`w-full ${getAspectClass(
              imageState.aspectRatio
            )} max-h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center`}
          >
            {imageState.isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-medium">
                  Generating {imageState.aspectRatio} ({imageState.imageSize}) visual...
                </span>
                <span className="text-[10px] text-slate-500">via gemini-3-pro-image-preview</span>
              </div>
            ) : imageState.imageUrl ? (
              <>
                <img
                  src={imageState.imageUrl}
                  alt="Twitter visual"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-lg"
                    title="Download high-resolution image"
                  >
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => onRegenerateImage(imageState.aspectRatio, imageState.imageSize)}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-lg"
                    title="Regenerate image"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-300" />
                    <span>Regen</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500 p-4 text-center">
                <ImageIcon className="w-8 h-8 text-slate-600" />
                <span className="text-xs">No image yet</span>
                <button
                  onClick={() => onRegenerateImage(imageState.aspectRatio, imageState.imageSize)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Generate Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Twitter Action Bar */}
      <div className="border-t border-slate-800 bg-slate-950/50 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 font-medium">
        <button className="flex items-center gap-1 hover:text-sky-400 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>42</span>
        </button>
        <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
          <Repeat2 className="w-4 h-4" />
          <span>128</span>
        </button>
        <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
          <Heart className="w-4 h-4" />
          <span>840</span>
        </button>
        <button className="flex items-center gap-1 hover:text-sky-400 transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1 hover:text-sky-400 transition-colors">
          <Share className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
