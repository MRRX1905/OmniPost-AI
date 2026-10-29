import React, { useState } from 'react';
import {
  Instagram,
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
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react';
import { InstagramPost, PlatformImageState, AspectRatioType, ImageSizeType } from '../types';

interface InstagramCardProps {
  post: InstagramPost;
  imageState: PlatformImageState;
  onUpdateCaption: (newCaption: string) => void;
  onUpdateHook: (newHook: string) => void;
  onRegenerateImage: (ratio: AspectRatioType, size: ImageSizeType, prompt?: string) => void;
  onQuickEdit: (instruction: string) => void;
  onOpenVirality: () => void;
  onOpenHooks: () => void;
  isProcessingAction: boolean;
}

const ASPECT_RATIOS: AspectRatioType[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

export const InstagramCard: React.FC<InstagramCardProps> = ({
  post,
  imageState,
  onUpdateCaption,
  onUpdateHook,
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
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(imageState.aspectRatio || '1:1');
  const [selectedSize, setSelectedSize] = useState<ImageSizeType>(imageState.imageSize || '1K');
  const [expandedCaption, setExpandedCaption] = useState(false);

  const formattedHashtags = post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
  const fullPostText = `${post.hook}\n\n${post.caption}\n\n${post.engagementQuestion}\n.\n.\n.\n${formattedHashtags}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageState.imageUrl) return;
    const a = document.createElement('a');
    a.href = imageState.imageUrl;
    a.download = `instagram-post-image-${Date.now()}.png`;
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
        return 'aspect-square';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all hover:border-slate-700/80">
      {/* Top Header Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Instagram Gradient Icon */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Instagram className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">Instagram</span>
            <span className="text-[10px] text-slate-400 ml-1.5 font-medium">Visual-Focused</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isEditing
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
            title="Toggle inline editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
            title="Copy caption & hashtags"
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
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 font-medium transition-colors"
          title="Generate 5 alternative hooks with gemini-3.1-flash-lite"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
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
              onClick={() => onQuickEdit('Add tasteful aesthetic emojis and clean line breaks')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              ✨ Aesthetic Emojis
            </button>
            <button
              onClick={() => onQuickEdit('Make the caption more intimate, vulnerable and story-driven')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              📖 Storytelling Tone
            </button>
            <button
              onClick={() => onQuickEdit('Craft a high-converting comment-magnet call-to-action')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              💬 Comment Magnet
            </button>
            <button
              onClick={() => onQuickEdit('Refine hashtags into high-reach, medium-niche clusters')}
              className="w-full text-left px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 rounded"
            >
              #️⃣ Supercharge Hashtags
            </button>
          </div>
        </div>
      </div>

      {/* Realistic Instagram Mobile Card */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-3">
        {/* Instagram Header with Story Gradient Ring */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-white">
                IG
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">yourbrand.hq</span>
                <span className="text-[10px] text-slate-400">• Following</span>
              </div>
              <span className="text-[10px] text-slate-500">Original Audio</span>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </div>

        {/* Dedicated Image Area with Aspect Ratio Affordance */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-semibold text-slate-300">Feed Visual</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {imageState.aspectRatio}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {imageState.imageSize}
              </span>
            </div>

            <button
              onClick={() => setShowImageControls(!showImageControls)}
              className="text-rose-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1"
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
                  Aspect Ratio Affordance (Instagram Optimal: 1:1, 4:3, or 9:16)
                </label>
                <div className="flex flex-wrap gap-1">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-all ${
                        selectedRatio === ratio
                          ? 'bg-rose-600 text-white border-rose-500'
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
                          ? 'bg-rose-600 text-white border-rose-500'
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
                  className="px-3 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded flex items-center gap-1.5"
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
            )} max-h-84 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center`}
          >
            {imageState.isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-medium">
                  Generating {imageState.aspectRatio} ({imageState.imageSize}) visual...
                </span>
                <span className="text-[10px] text-slate-500">via gemini-3-pro-image-preview</span>
              </div>
            ) : imageState.imageUrl ? (
              <>
                <img
                  src={imageState.imageUrl}
                  alt="Instagram visual"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-lg"
                    title="Download high-resolution image"
                  >
                    <Download className="w-4 h-4 text-rose-400" />
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
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Generate Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instagram Interactive Action Row */}
        <div className="flex items-center justify-between pt-1 text-slate-200">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer transition-colors" />
            <MessageCircle className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
            <Send className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-5 h-5 hover:text-amber-400 cursor-pointer transition-colors" />
        </div>

        {/* Likes Count */}
        <div className="text-xs font-bold text-white">Liked by alex and 2,419 others</div>

        {/* Caption & Hashtag Area */}
        {isEditing ? (
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Hook</label>
              <input
                type="text"
                value={post.hook}
                onChange={(e) => onUpdateHook(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Story Caption
              </label>
              <textarea
                value={post.caption}
                onChange={(e) => onUpdateCaption(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-xs text-slate-200 leading-relaxed font-sans">
            <div>
              <span className="font-bold text-white mr-1.5">yourbrand.hq</span>
              <span className="font-semibold text-white">{post.hook}</span>
            </div>

            <div
              className={`whitespace-pre-line text-slate-300 ${
                !expandedCaption ? 'line-clamp-3' : ''
              }`}
            >
              {post.caption}
            </div>

            <button
              onClick={() => setExpandedCaption(!expandedCaption)}
              className="text-slate-500 hover:text-slate-300 text-[11px] font-medium"
            >
              {expandedCaption ? 'less' : '...more'}
            </button>

            {post.engagementQuestion && (
              <p className="text-rose-300 font-semibold text-xs pt-1">
                💬 {post.engagementQuestion}
              </p>
            )}

            {/* Visual Advice Banner */}
            {post.visualStyleAdvice && (
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{post.visualStyleAdvice}</span>
              </div>
            )}

            {/* Strategic Hashtags */}
            <div className="pt-2 text-slate-400 text-[11px] leading-relaxed break-words font-medium">
              {post.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer mr-1.5 inline-block"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
