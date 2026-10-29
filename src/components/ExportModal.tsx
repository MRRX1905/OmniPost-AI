import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText } from 'lucide-react';
import { GeneratedPostsData, ToneType } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: GeneratedPostsData | null;
  idea: string;
  tone: ToneType;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  posts,
  idea,
  tone,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !posts) return null;

  const markdownContent = `# Social Media Multi-Platform Campaign
Generated via OmniPost AI
Idea: ${idea}
Tone: ${tone.toUpperCase()}
Date: ${new Date().toLocaleString()}

---

## 1. LinkedIn (Long-Form Authority)
**Headline:**
${posts.linkedin.headline}

**Post Body:**
${posts.linkedin.content}

**Call to Action:**
${posts.linkedin.callToAction}

**Hashtags:**
${posts.linkedin.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

**Image Prompt (Aspect Ratio ${posts.linkedin.imageAspectRecommended}):**
${posts.linkedin.imagePrompt}

---

## 2. Twitter / X (Short & Punchy)
**Main Tweet:**
${posts.twitter.tweet}

${
  posts.twitter.thread && posts.twitter.thread.length > 0
    ? `**Thread Continuation:**\n${posts.twitter.thread
        .map((t, idx) => `Tweet ${idx + 2}: ${t}`)
        .join('\n\n')}\n\n`
    : ''
}**Hashtags:**
${posts.twitter.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

**Image Prompt (Aspect Ratio ${posts.twitter.imageAspectRecommended}):**
${posts.twitter.imagePrompt}

---

## 3. Instagram (Visual-Focused)
**Hook:**
${posts.instagram.hook}

**Caption:**
${posts.instagram.caption}

**Engagement Question:**
${posts.instagram.engagementQuestion}

**Hashtags:**
${posts.instagram.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

**Visual Style Advice:**
${posts.instagram.visualStyleAdvice || 'High contrast, clean lighting, carousel recommended'}

**Image Prompt (Aspect Ratio ${posts.instagram.imageAspectRecommended}):**
${posts.instagram.imagePrompt}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnipost-campaign-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Complete Campaign</h3>
              <p className="text-xs text-slate-400">
                Copy or download formatted Markdown containing all 3 platform drafts and prompts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Markdown Preview Area */}
        <div className="p-6 overflow-y-auto">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
            {markdownContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
