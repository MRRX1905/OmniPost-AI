import React, { useState } from 'react';
import {
  Linkedin,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  Zap,
  BarChart2,
  Edit3,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  MoreHorizontal,
  ExternalLink,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import { LinkedInPost, PlatformImageState, AspectRatioType, ImageSizeType } from '../types';

interface LinkedInCardProps {
  post: LinkedInPost;
  imageState: PlatformImageState;
  onUpdateContent: (newContent: string) => void;
  onUpdateHeadline: (newHeadline: string) => void;
  onRegenerateImage: (ratio: AspectRatioType, size: ImageSizeType, prompt?: string) => void;
  onQuickEdit: (instruction: string) => void;
  onOpenVirality: () => void;
  onOpenHooks: () => void;
  isProcessingAction: boolean;
}

const ASPECT_RATIOS: AspectRatioType[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

export const LinkedInCard: React.FC<LinkedInCardProps> = ({
  post,
  imageState,
  onUpdateContent,
  onUpdateHeadline,
  onRegenerateImage,
  onQuickEdit,
  onOpenVirality,
  onOpenHooks,
  isProcessingAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(imageState.prompt);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(imageState.aspectRatio || '16:9');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(imageState.imageSize || '1K');

  const fullPostText = `${post.headline}\n\n${post.content}\n\n${post.callToAction}\n\n${post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageState.imageUrl) return;
    const a = document.createElement('a');
    a.href = imageState.imageUrl;
    a.download = `linkedin-post-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApplyImageRegen = () => {
    onRegenerateImage(selectedRatio, selectedSize, customPrompt);
    setShowImageControls(false);
  };

  // Helper for container aspect-ratio styling
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
          <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-sm">
            <Linkedin className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">LinkedIn</span>
            <span className="text-[10px] text-slate-400 ml-1.5 font-medium">Long-Form Authority</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
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
            title="Copy entire post"
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
              onClick={() => onQuickEdit('Make the opening hook 2x punchier and shorter')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              🔥 Punchier Hook
            </button>
            <button
              onClick={() => onQuickEdit('Condense and trim fluff while keeping bullet points')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              ✂️ Shorten &amp; Condense
            </button>
            <button
              onClick={() => onQuickEdit('Expand on the key takeaways and bullet points')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              📝 Expand Takeaways
            </button>
            <button
              onClick={() => onQuickEdit('Increase executive authority and professional clarity')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              👔 Executive Tone
            </button>
          </div>
        </div>
      </div>

      {/* Authentic LinkedIn Post Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
        {/* Author Simulation Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-indigo-700 flex items-center justify-center font-bold text-sm text-white border border-slate-600">
              OP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Your Name</span>
                <span className="text-xs text-slate-400">• 1st</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Founder &amp; Strategist • Building the Future of Work
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>1d • Edited •</span>
                <Clock className="w-2.5 h-2.5" />
                <span>{post.estimatedReadTime || '1 min read'}</span>
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-500" />
        </div>

        {/* Post Text Area / Editor */}
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Headline / Scroll-Stopper
              </label>
              <input
                type="text"
                value={post.headline}
                onChange={(e) => onUpdateHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Body &amp; Takeaways
              </label>
              <textarea
                value={post.content}
                onChange={(e) => onUpdateContent(e.target.value)}
                rows={8}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-slate-200 leading-relaxed font-sans">
            <div className="font-bold text-white text-base tracking-tight border-l-2 border-indigo-500 pl-2.5 py-0.5">
              {post.headline}
            </div>

            <div className="whitespace-pre-line text-slate-200 text-sm">{post.content}</div>

            {post.callToAction && (
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-indigo-300 font-medium text-xs">
                💡 {post.callToAction}
              </div>
            )}

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold text-[#0A66C2] hover:underline cursor-pointer"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Image Area with Aspect Ratio Affordance */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-300">Platform Asset</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {imageState.aspectRatio}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {imageState.imageSize}
              </span>
            </div>

            <button
              onClick={() => setShowImageControls(!showImageControls)}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center gap-1"
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
                  Aspect Ratio Affordance
                </label>
                <div className="flex flex-wrap gap-1">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-all ${
                        selectedRatio === ratio
                          ? 'bg-indigo-600 text-white border-indigo-500'
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
                          ? 'bg-indigo-600 text-white border-indigo-500'
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
                  className="px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center gap-1.5"
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
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-medium">
                  Generating {imageState.aspectRatio} ({imageState.imageSize}) visual...
                </span>
                <span className="text-[10px] text-slate-500">via gemini-3-pro-image-preview</span>
              </div>
            ) : imageState.imageUrl ? (
              <>
                <img
                  src={imageState.imageUrl}
                  alt="LinkedIn visual"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-lg"
                    title="Download high-resolution image"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
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
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Generate Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realistic LinkedIn Engagement Footer */}
      <div className="border-t border-slate-800 bg-slate-950/50 px-4 py-2.5 flex items-center justify-around text-xs text-slate-400 font-semibold">
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Repeat className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
