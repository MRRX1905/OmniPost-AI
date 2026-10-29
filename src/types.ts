export type ToneType = 'professional' | 'witty' | 'urgent' | 'inspiring' | 'bold' | 'educational';

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type ImageSizeType = '1K' | '2K' | '4K';

export type ImageModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type PlatformType = 'linkedin' | 'twitter' | 'instagram';

export interface LinkedInPost {
  headline: string;
  content: string;
  callToAction: string;
  hashtags: string[];
  imagePrompt: string;
  imageAspectRecommended: AspectRatioType | string;
  estimatedReadTime?: string;
}

export interface TwitterPost {
  tweet: string;
  thread?: string[];
  hashtags: string[];
  imagePrompt: string;
  imageAspectRecommended: AspectRatioType | string;
  characterCount?: number;
}

export interface InstagramPost {
  hook: string;
  caption: string;
  engagementQuestion: string;
  hashtags: string[];
  imagePrompt: string;
  imageAspectRecommended: AspectRatioType | string;
  visualStyleAdvice?: string;
}

export interface GeneratedPostsData {
  linkedin: LinkedInPost;
  twitter: TwitterPost;
  instagram: InstagramPost;
}

export interface PlatformImageState {
  imageUrl?: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  modelUsed?: string;
  isLoading: boolean;
  error?: string;
}

export interface ViralityAnalysis {
  viralityScore: number;
  verdict: string;
  hookRating: string;
  hookAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
  estimatedReachMultiplier?: string;
  algorithmTip: string;
}

export interface SavedCampaign {
  id: string;
  idea: string;
  tone: ToneType;
  timestamp: number;
  posts: GeneratedPostsData;
  images: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}
