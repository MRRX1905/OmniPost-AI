import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IdeaInput } from './components/IdeaInput';
import { LinkedInCard } from './components/LinkedInCard';
import { TwitterCard } from './components/TwitterCard';
import { InstagramCard } from './components/InstagramCard';
import { ViralityModal } from './components/ViralityModal';
import { HooksModal, HookItem } from './components/HooksModal';
import { ImageSettingsModal } from './components/ImageSettingsModal';
import { CampaignHistoryModal } from './components/CampaignHistoryModal';
import { ExportModal } from './components/ExportModal';
import {
  ToneType,
  ImageSizeType,
  ImageModelType,
  PlatformType,
  GeneratedPostsData,
  PlatformImageState,
  ViralityAnalysis,
  SavedCampaign,
  AspectRatioType,
} from './types';
import {
  Sparkles,
  Columns,
  Square,
  FileDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

const STORAGE_KEY = 'omnipost_saved_campaigns_v1';

export default function App() {
  // Main Input State
  const [idea, setIdea] = useState(
    'We just launched OmniSync 2.0: real-time database sync with zero config that cut our latency by 65%. Built over 6 months of intense user feedback.'
  );
  const [tone, setTone] = useState<ToneType>('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');

  // Studio Image Affordances
  const [globalImageSize, setGlobalImageSize] = useState<ImageSizeType>('1K');
  const [imageModel, setImageModel] = useState<ImageModelType>('gemini-3-pro-image-preview');

  // Generated State
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState<GeneratedPostsData | null>(null);

  // Platform Image States
  const [images, setImages] = useState<Record<PlatformType, PlatformImageState>>({
    linkedin: {
      prompt: '',
      aspectRatio: '16:9',
      imageSize: '1K',
      isLoading: false,
    },
    twitter: {
      prompt: '',
      aspectRatio: '16:9',
      imageSize: '1K',
      isLoading: false,
    },
    instagram: {
      prompt: '',
      aspectRatio: '1:1',
      imageSize: '1K',
      isLoading: false,
    },
  });

  // Layout View Switcher
  const [viewMode, setViewMode] = useState<'grid' | 'tabs'>('grid');
  const [activeTab, setActiveTab] = useState<PlatformType>('linkedin');

  // Toast Banner
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Virality Modal State (Gemini 4 Argon)
  const [viralityModal, setViralityModal] = useState<{
    isOpen: boolean;
    platform: PlatformType;
    data: ViralityAnalysis | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    platform: 'linkedin',
    data: null,
    isLoading: false,
  });

  // Hooks Modal State (Gemini 3.1 Flash-Lite)
  const [hooksModal, setHooksModal] = useState<{
    isOpen: boolean;
    platform: PlatformType;
    hooks: HookItem[];
    isLoading: boolean;
  }>({
    isOpen: false,
    platform: 'linkedin',
    hooks: [],
    isLoading: false,
  });

  // Action status
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Saved Campaigns
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);

  // Load saved campaigns on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedCampaigns(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to parse saved campaigns', err);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /**
   * Primary Action: Simultaneously generate tailored posts for LinkedIn, Twitter, and Instagram
   * Then automatically trigger tailored image generation for each platform's optimal aspect ratio
   */
  const handleGenerate = async () => {
    if (!idea.trim() || isGenerating) return;

    setIsGenerating(true);
    setToast(null);

    try {
      // 1. Generate multi-platform copy using gemini-3.8-flash
      const res = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tone,
          targetAudience,
          industry,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate posts');
      }

      const generatedData: GeneratedPostsData = json.data;
      setPosts(generatedData);
      showToast('All 3 platform posts drafted! Generating matching AI images...', 'success');

      // Initialize image states with the model recommended aspect ratios
      const linkedinRatio = (generatedData.linkedin.imageAspectRecommended as AspectRatioType) || '16:9';
      const twitterRatio = (generatedData.twitter.imageAspectRecommended as AspectRatioType) || '16:9';
      const instagramRatio = (generatedData.instagram.imageAspectRecommended as AspectRatioType) || '1:1';

      setImages({
        linkedin: {
          prompt: generatedData.linkedin.imagePrompt,
          aspectRatio: linkedinRatio,
          imageSize: globalImageSize,
          isLoading: true,
        },
        twitter: {
          prompt: generatedData.twitter.imagePrompt,
          aspectRatio: twitterRatio,
          imageSize: globalImageSize,
          isLoading: true,
        },
        instagram: {
          prompt: generatedData.instagram.imagePrompt,
          aspectRatio: instagramRatio,
          imageSize: globalImageSize,
          isLoading: true,
        },
      });

      // 2. Concurrently generate tailored images for each platform
      generatePlatformAsset('linkedin', generatedData.linkedin.imagePrompt, linkedinRatio, globalImageSize);
      generatePlatformAsset('twitter', generatedData.twitter.imagePrompt, twitterRatio, globalImageSize);
      generatePlatformAsset('instagram', generatedData.instagram.imagePrompt, instagramRatio, globalImageSize);

      // Save initial campaign
      const newCampaign: SavedCampaign = {
        id: `camp_${Date.now()}`,
        idea,
        tone,
        timestamp: Date.now(),
        posts: generatedData,
        images: {},
      };

      const updated = [newCampaign, ...savedCampaigns.slice(0, 19)];
      setSavedCampaigns(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error generating posts', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Generate or regenerate image for a specific platform
   * Primary model: gemini-3-pro-image-preview
   * Supports resolution affordance: 1K, 2K, 4K
   * Supports aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
   */
  const generatePlatformAsset = async (
    platform: PlatformType,
    prompt: string,
    aspectRatio: AspectRatioType,
    imageSize: ImageSizeType
  ) => {
    setImages((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        prompt,
        aspectRatio,
        imageSize,
        isLoading: true,
        error: undefined,
      },
    }));

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageSize,
          preferredModel: imageModel,
          platform,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate platform image');
      }

      setImages((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          imageUrl: json.data.imageUrl,
          modelUsed: json.data.modelUsed,
          aspectRatio: json.data.aspectRatio,
          imageSize: json.data.imageSize,
          isLoading: false,
        },
      }));

      // Update current campaign image in state/local storage
      setSavedCampaigns((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        copy[0] = {
          ...copy[0],
          images: {
            ...copy[0].images,
            [platform]: json.data.imageUrl,
          },
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
        } catch (_) {}
        return copy;
      });
    } catch (err: any) {
      console.error(err);
      setImages((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          isLoading: false,
          error: err.message,
        },
      }));
      showToast(`Image generation for ${platform} had an issue: ${err.message}`, 'error');
    }
  };

  /**
   * Audit Virality using gemini-4-argon (Complex reasoning task)
   */
  const handleOpenViralityAudit = async (platform: PlatformType) => {
    if (!posts) return;

    let content = '';
    let headline = '';
    if (platform === 'linkedin') {
      content = posts.linkedin.content;
      headline = posts.linkedin.headline;
    } else if (platform === 'twitter') {
      content = posts.twitter.tweet;
    } else {
      content = posts.instagram.caption;
      headline = posts.instagram.hook;
    }

    setViralityModal({
      isOpen: true,
      platform,
      data: null,
      isLoading: true,
    });

    try {
      const res = await fetch('/api/analyze-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content,
          headline,
          idea,
          tone,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Analysis failed');
      }

      setViralityModal((prev) => ({
        ...prev,
        data: json.data,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error(err);
      showToast(`Virality audit failed: ${err.message}`, 'error');
      setViralityModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  /**
   * Fast Hook Brainstormer using gemini-3.1-flash-lite
   */
  const handleOpenHooks = async (platform: PlatformType) => {
    setHooksModal({
      isOpen: true,
      platform,
      hooks: [],
      isLoading: true,
    });

    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          platform,
          tone,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Hooks generation failed');
      }

      setHooksModal((prev) => ({
        ...prev,
        hooks: json.data.hooks || [],
        isLoading: false,
      }));
    } catch (err: any) {
      console.error(err);
      showToast(`Failed to generate hooks: ${err.message}`, 'error');
      setHooksModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  /**
   * Quick Edit Polish using gemini-3.1-flash-lite
   */
  const handleQuickEdit = async (platform: PlatformType, instruction: string) => {
    if (!posts) return;
    setIsProcessingAction(true);

    let currentContent = '';
    if (platform === 'linkedin') currentContent = posts.linkedin.content;
    else if (platform === 'twitter') currentContent = posts.twitter.tweet;
    else currentContent = posts.instagram.caption;

    try {
      const res = await fetch('/api/quick-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentContent,
          instruction,
          platform,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Quick edit failed');
      }

      const revised = json.revisedContent;

      if (platform === 'linkedin') {
        setPosts({
          ...posts,
          linkedin: { ...posts.linkedin, content: revised },
        });
      } else if (platform === 'twitter') {
        setPosts({
          ...posts,
          twitter: { ...posts.twitter, tweet: revised },
        });
      } else {
        setPosts({
          ...posts,
          instagram: { ...posts.instagram, caption: revised },
        });
      }

      showToast(`Applied: "${instruction}"`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Quick edit failed', 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  /**
   * Apply Hook from Hooks Modal
   */
  const handleApplyHook = (newHook: string) => {
    if (!posts) return;
    const platform = hooksModal.platform;

    if (platform === 'linkedin') {
      setPosts({
        ...posts,
        linkedin: { ...posts.linkedin, headline: newHook },
      });
    } else if (platform === 'twitter') {
      setPosts({
        ...posts,
        twitter: { ...posts.twitter, tweet: `${newHook}\n\n${posts.twitter.tweet}` },
      });
    } else {
      setPosts({
        ...posts,
        instagram: { ...posts.instagram, hook: newHook },
      });
    }

    showToast(`Updated hook for ${platform}!`, 'success');
  };

  /**
   * Load Saved Campaign from History
   */
  const handleLoadCampaign = (camp: SavedCampaign) => {
    setIdea(camp.idea);
    setTone(camp.tone);
    setPosts(camp.posts);

    setImages({
      linkedin: {
        imageUrl: camp.images.linkedin,
        prompt: camp.posts.linkedin.imagePrompt,
        aspectRatio: (camp.posts.linkedin.imageAspectRecommended as AspectRatioType) || '16:9',
        imageSize: globalImageSize,
        isLoading: false,
      },
      twitter: {
        imageUrl: camp.images.twitter,
        prompt: camp.posts.twitter.imagePrompt,
        aspectRatio: (camp.posts.twitter.imageAspectRecommended as AspectRatioType) || '16:9',
        imageSize: globalImageSize,
        isLoading: false,
      },
      instagram: {
        imageUrl: camp.images.instagram,
        prompt: camp.posts.instagram.imagePrompt,
        aspectRatio: (camp.posts.instagram.imageAspectRecommended as AspectRatioType) || '1:1',
        imageSize: globalImageSize,
        isLoading: false,
      },
    });

    showToast('Loaded saved campaign!', 'success');
  };

  /**
   * Delete Campaign
   */
  const handleDeleteCampaign = (id: string) => {
    const updated = savedCampaigns.filter((c) => c.id !== id);
    setSavedCampaigns(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('Campaign deleted from history', 'info');
  };

  /**
   * Clear all history
   */
  const handleClearAllHistory = () => {
    setSavedCampaigns([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Cleared campaign history', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200 shadow-emerald-900/30'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700/80 text-rose-200 shadow-rose-900/30'
                : 'bg-indigo-950/90 border-indigo-700/80 text-indigo-200 shadow-indigo-900/30'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        imageModel={imageModel}
        setImageModel={setImageModel}
        globalImageSize={globalImageSize}
        setGlobalImageSize={setGlobalImageSize}
        savedCount={savedCampaigns.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Core Idea & Tone Input Section */}
        <IdeaInput
          idea={idea}
          setIdea={setIdea}
          tone={tone}
          setTone={setTone}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          industry={industry}
          setIndustry={setIndustry}
          globalImageSize={globalImageSize}
          setGlobalImageSize={setGlobalImageSize}
          imageModel={imageModel}
          setImageModel={setImageModel}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />

        {/* Generated Multi-Platform Showcase */}
        {posts ? (
          <section className="space-y-5 animate-in fade-in duration-300">
            {/* View Switcher & Bulk Actions Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Platform Results:
                </span>
                <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>3-Column Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('tabs')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'tabs'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Single Focus Tab</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export Campaign (.md)</span>
                </button>
              </div>
            </div>

            {/* Tab selector for Tabs mode */}
            {viewMode === 'tabs' && (
              <div className="flex border-b border-slate-800 gap-2 pb-1">
                {(['linkedin', 'twitter', 'instagram'] as PlatformType[]).map((plat) => {
                  const isActive = activeTab === plat;
                  const label =
                    plat === 'linkedin'
                      ? 'LinkedIn (Long-Form)'
                      : plat === 'twitter'
                      ? 'Twitter / 𝕏 (Punchy)'
                      : 'Instagram (Visual)';
                  return (
                    <button
                      key={plat}
                      onClick={() => setActiveTab(plat)}
                      className={`px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-700'
                          : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Platform Previews Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* LinkedIn Card */}
                <LinkedInCard
                  post={posts.linkedin}
                  imageState={images.linkedin}
                  onUpdateContent={(content) =>
                    setPosts({ ...posts, linkedin: { ...posts.linkedin, content } })
                  }
                  onUpdateHeadline={(headline) =>
                    setPosts({ ...posts, linkedin: { ...posts.linkedin, headline } })
                  }
                  onRegenerateImage={(ratio, size, prompt) =>
                    generatePlatformAsset(
                      'linkedin',
                      prompt || posts.linkedin.imagePrompt,
                      ratio,
                      size
                    )
                  }
                  onQuickEdit={(instr) => handleQuickEdit('linkedin', instr)}
                  onOpenVirality={() => handleOpenViralityAudit('linkedin')}
                  onOpenHooks={() => handleOpenHooks('linkedin')}
                  isProcessingAction={isProcessingAction}
                />

                {/* Twitter / X Card */}
                <TwitterCard
                  post={posts.twitter}
                  imageState={images.twitter}
                  onUpdateTweet={(tweet) =>
                    setPosts({ ...posts, twitter: { ...posts.twitter, tweet } })
                  }
                  onRegenerateImage={(ratio, size, prompt) =>
                    generatePlatformAsset(
                      'twitter',
                      prompt || posts.twitter.imagePrompt,
                      ratio,
                      size
                    )
                  }
                  onQuickEdit={(instr) => handleQuickEdit('twitter', instr)}
                  onOpenVirality={() => handleOpenViralityAudit('twitter')}
                  onOpenHooks={() => handleOpenHooks('twitter')}
                  isProcessingAction={isProcessingAction}
                />

                {/* Instagram Card */}
                <InstagramCard
                  post={posts.instagram}
                  imageState={images.instagram}
                  onUpdateCaption={(caption) =>
                    setPosts({ ...posts, instagram: { ...posts.instagram, caption } })
                  }
                  onUpdateHook={(hook) =>
                    setPosts({ ...posts, instagram: { ...posts.instagram, hook } })
                  }
                  onRegenerateImage={(ratio, size, prompt) =>
                    generatePlatformAsset(
                      'instagram',
                      prompt || posts.instagram.imagePrompt,
                      ratio,
                      size
                    )
                  }
                  onQuickEdit={(instr) => handleQuickEdit('instagram', instr)}
                  onOpenVirality={() => handleOpenViralityAudit('instagram')}
                  onOpenHooks={() => handleOpenHooks('instagram')}
                  isProcessingAction={isProcessingAction}
                />
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                {activeTab === 'linkedin' && (
                  <LinkedInCard
                    post={posts.linkedin}
                    imageState={images.linkedin}
                    onUpdateContent={(content) =>
                      setPosts({ ...posts, linkedin: { ...posts.linkedin, content } })
                    }
                    onUpdateHeadline={(headline) =>
                      setPosts({ ...posts, linkedin: { ...posts.linkedin, headline } })
                    }
                    onRegenerateImage={(ratio, size, prompt) =>
                      generatePlatformAsset(
                        'linkedin',
                        prompt || posts.linkedin.imagePrompt,
                        ratio,
                        size
                      )
                    }
                    onQuickEdit={(instr) => handleQuickEdit('linkedin', instr)}
                    onOpenVirality={() => handleOpenViralityAudit('linkedin')}
                    onOpenHooks={() => handleOpenHooks('linkedin')}
                    isProcessingAction={isProcessingAction}
                  />
                )}

                {activeTab === 'twitter' && (
                  <TwitterCard
                    post={posts.twitter}
                    imageState={images.twitter}
                    onUpdateTweet={(tweet) =>
                      setPosts({ ...posts, twitter: { ...posts.twitter, tweet } })
                    }
                    onRegenerateImage={(ratio, size, prompt) =>
                      generatePlatformAsset(
                        'twitter',
                        prompt || posts.twitter.imagePrompt,
                        ratio,
                        size
                      )
                    }
                    onQuickEdit={(instr) => handleQuickEdit('twitter', instr)}
                    onOpenVirality={() => handleOpenViralityAudit('twitter')}
                    onOpenHooks={() => handleOpenHooks('twitter')}
                    isProcessingAction={isProcessingAction}
                  />
                )}

                {activeTab === 'instagram' && (
                  <InstagramCard
                    post={posts.instagram}
                    imageState={images.instagram}
                    onUpdateCaption={(caption) =>
                      setPosts({ ...posts, instagram: { ...posts.instagram, caption } })
                    }
                    onUpdateHook={(hook) =>
                      setPosts({ ...posts, instagram: { ...posts.instagram, hook } })
                    }
                    onRegenerateImage={(ratio, size, prompt) =>
                      generatePlatformAsset(
                        'instagram',
                        prompt || posts.instagram.imagePrompt,
                        ratio,
                        size
                      )
                    }
                    onQuickEdit={(instr) => handleQuickEdit('instagram', instr)}
                    onOpenVirality={() => handleOpenViralityAudit('instagram')}
                    onOpenHooks={() => handleOpenHooks('instagram')}
                    isProcessingAction={isProcessingAction}
                  />
                )}
              </div>
            )}
          </section>
        ) : (
          /* Empty State Explainer */
          <div className="border border-slate-800/80 rounded-2xl p-10 bg-slate-900/40 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto text-indigo-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ready to Generate Your Campaign</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Choose a preset idea above or type your announcement, select your tone (Professional, Witty, or Urgent), and click Generate to see synchronized drafts with optimal aspect ratio visuals.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                LinkedIn 16:9 Banner
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Twitter/X 16:9 Card
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Instagram 1:1 Square
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/80">
                1K, 2K &amp; 4K Resolution
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Virality Audit Modal (Gemini 4 Argon) */}
      <ViralityModal
        isOpen={viralityModal.isOpen}
        onClose={() => setViralityModal((prev) => ({ ...prev, isOpen: false }))}
        analysis={viralityModal.data}
        isLoading={viralityModal.isLoading}
        platform={viralityModal.platform}
      />

      {/* Hooks Brainstormer Modal (Gemini 3.1 Flash-Lite) */}
      <HooksModal
        isOpen={hooksModal.isOpen}
        onClose={() => setHooksModal((prev) => ({ ...prev, isOpen: false }))}
        hooks={hooksModal.hooks}
        isLoading={hooksModal.isLoading}
        platform={hooksModal.platform}
        onApplyHook={handleApplyHook}
      />

      {/* Image Settings Modal */}
      <ImageSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        imageModel={imageModel}
        setImageModel={setImageModel}
        globalImageSize={globalImageSize}
        setGlobalImageSize={setGlobalImageSize}
      />

      {/* Campaign History Drawer/Modal */}
      <CampaignHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        campaigns={savedCampaigns}
        onLoadCampaign={handleLoadCampaign}
        onDeleteCampaign={handleDeleteCampaign}
        onClearAll={handleClearAllHistory}
      />

      {/* Export Complete Campaign Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        posts={posts}
        idea={idea}
        tone={tone}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <p>OmniPost AI • Powered by Google Gemini 3.8 Flash, 4 Argon, 3.1 Flash-Lite &amp; Studio Image Models</p>
      </footer>
    </div>
  );
}
