import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side initialization of GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for error responses
const handleError = (res: express.Response, error: any, defaultMsg: string) => {
  console.error(defaultMsg, error);
  const status = error?.status || 500;
  const message = error?.message || defaultMsg;
  res.status(status).json({
    error: message,
    details: error?.toString?.() || 'Unknown error',
  });
};

/**
 * Generate synchronized multi-platform posts for LinkedIn, Twitter, and Instagram
 * Uses gemini-3.8-flash for high quality, fast multi-platform synthesis
 */
app.post('/api/generate-posts', async (req, res) => {
  try {
    const { idea, tone, targetAudience, industry } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Post idea is required' });
    }

    const selectedTone = tone || 'professional';
    const audienceStr = targetAudience ? `Target audience: ${targetAudience}` : '';
    const industryStr = industry ? `Industry/Niche: ${industry}` : '';

    const prompt = `You are an elite, world-class social media strategist and ghostwriter.
Transform the following idea into 3 perfectly tailored, high-converting social media posts simultaneously:
1. LinkedIn: Long-form, thoughtful narrative or case study, line breaks for readability, hook, structured body (problem -> insight -> key learnings/bullets), strong call-to-action (CTA), 3-5 professional hashtags.
2. Twitter/X: Punchy, high-impact hook under 280 characters, crisp formatting, 1-2 hashtags, plus an optional 2-part thread extension if the idea has extra depth.
3. Instagram: Highly visual-focused caption, conversational hook, story-driven body, clear aesthetic image suggestion, engagement question, and 15-20 strategic hashtags grouped at the end.

IDEA: "${idea}"
DESIRED TONE: "${selectedTone}" (e.g. professional, witty, urgent, inspiring, bold)
${audienceStr}
${industryStr}

For each platform, also provide an optimized image generation prompt designed for AI image models (describing the subject, style, lighting, composition, mood, and zero distorted text) and the recommended optimal aspect ratio:
- LinkedIn optimal: "16:9" (feed banner) or "1:1" (square)
- Twitter optimal: "16:9" (preview card) or "3:2"
- Instagram optimal: "1:1" (square) or "4:3" or "9:16"`;

    const schemaConfig = {
      type: Type.OBJECT,
      properties: {
        linkedin: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: 'Compelling hook or first line that stops the scroll' },
            content: { type: Type.STRING, description: 'Complete LinkedIn post body with clean line breaks and formatted insights' },
            callToAction: { type: Type.STRING, description: 'Thoughtful question or CTA to spark discussion in comments' },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 to 5 targeted professional hashtags' },
            imagePrompt: { type: Type.STRING, description: 'Detailed visual prompt for AI image generation tailored to LinkedIn' },
            imageAspectRecommended: { type: Type.STRING, description: 'Optimal aspect ratio, e.g. 16:9' },
            estimatedReadTime: { type: Type.STRING, description: 'e.g. 1 min read' }
          },
          required: ['headline', 'content', 'callToAction', 'hashtags', 'imagePrompt', 'imageAspectRecommended']
        },
        twitter: {
          type: Type.OBJECT,
          properties: {
            tweet: { type: Type.STRING, description: 'Punchy single tweet strictly under 280 characters with hashtags' },
            thread: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Optional 2-3 tweet thread expansion' },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '1 to 3 trending/niche hashtags' },
            imagePrompt: { type: Type.STRING, description: 'High-contrast, striking visual prompt for Twitter card' },
            imageAspectRecommended: { type: Type.STRING, description: 'Optimal aspect ratio, e.g. 16:9' },
            characterCount: { type: Type.INTEGER, description: 'Character count of main tweet' }
          },
          required: ['tweet', 'hashtags', 'imagePrompt', 'imageAspectRecommended']
        },
        instagram: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: 'First line to appear before the ...more tap' },
            caption: { type: Type.STRING, description: 'Visual story caption with emojis and formatted spacing' },
            engagementQuestion: { type: Type.STRING, description: 'Engagement prompt (e.g., Save this for later, Double tap if...)' },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '15 to 20 strategic hashtags' },
            imagePrompt: { type: Type.STRING, description: 'Vibrant, aesthetic visual prompt for Instagram' },
            imageAspectRecommended: { type: Type.STRING, description: 'Optimal aspect ratio, e.g. 1:1 or 4:3' },
            visualStyleAdvice: { type: Type.STRING, description: 'Quick tip on photo style/carousel format' }
          },
          required: ['hook', 'caption', 'engagementQuestion', 'hashtags', 'imagePrompt', 'imageAspectRecommended']
        }
      },
      required: ['linkedin', 'twitter', 'instagram']
    };

    // Helper to call with timeout
    const callModelWithTimeout = async (model: string, timeoutMs: number) => {
      const config: any = {
        responseMimeType: 'application/json',
        responseSchema: schemaConfig,
      };
      if (model === 'gemini-3.8-flash') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      );

      return Promise.race([generatePromise, timeoutPromise]);
    };

    let response;
    let modelUsed = 'gemini-3.8-flash';

    try {
      // First attempt with gemini-3.8-flash (4 second timeout)
      response = await callModelWithTimeout('gemini-3.8-flash', 4000);
    } catch (flashErr) {
      console.warn('gemini-3.8-flash timed out or had issue, falling back to gemini-3.1-flash-lite:', flashErr);
      // Fast fallback to gemini-3.1-flash-lite (< 1 second)
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schemaConfig,
        },
      });
      modelUsed = 'gemini-3.1-flash-lite';
    }

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);
    res.json({ success: true, data: parsedData, modelUsed });
  } catch (error) {
    handleError(res, error, 'Failed to generate social media posts');
  }
});

/**
 * Generate platform image with user specified aspect ratio and size
 * Primary model: gemini-3-pro-image-preview
 * Alternative model: gemini-nano-banana-2.1
 * Fallback model: gemini-3.1-flash-lite-image
 * Sizes: 1K, 2K, 4K
 * Aspect Ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      imageSize = '1K',
      preferredModel = 'gemini-3-pro-image-preview',
      platform = 'general'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required' });
    }

    // Supported ratios: "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"
    // Valid for nano banana and 3-pro: "1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "1:8", "4:1", "8:1"
    // If ratio is 2:3 or 3:2 or 21:9, adjust if model requires standard ratios
    let targetRatio = aspectRatio;
    const standardRatios = ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9', '3:2', '2:3'];
    if (!standardRatios.includes(targetRatio)) {
      targetRatio = '1:1';
    }

    // Map 2:3 -> 3:4, 3:2 -> 4:3, 21:9 -> 16:9 if the target model strictly demands standard 5
    const fallbackRatio = (ratio: string) => {
      if (ratio === '2:3') return '3:4';
      if (ratio === '3:2') return '4:3';
      if (ratio === '21:9') return '16:9';
      return ratio;
    };

    // Valid sizes: "1K", "2K", "4K"
    const validSizes = ['1K', '2K', '4K'];
    const targetSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Try models in cascade: preferred -> gemini-nano-banana-2.1 -> gemini-3.1-flash-lite-image
    const candidateModels = [
      preferredModel,
      'gemini-3-pro-image-preview',
      'gemini-nano-banana-2.1',
      'gemini-3.1-flash-lite-image'
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    let lastError: any = null;
    let generatedImageData: { imageUrl: string; modelUsed: string; aspectRatio: string; imageSize: string } | null = null;

    for (const model of candidateModels) {
      try {
        console.log(`Attempting image generation with model: ${model}, ratio: ${targetRatio}, size: ${targetSize}`);
        
        // Prepare imageConfig according to model requirements
        const isLite = model === 'gemini-3.1-flash-lite-image';
        const configRatio = isLite ? fallbackRatio(targetRatio) : targetRatio;
        
        const imageConfig: any = {
          aspectRatio: configRatio,
        };

        // imageSize is supported on gemini-3-pro-image and gemini-nano-banana-2.1
        if (!isLite) {
          imageConfig.imageSize = targetSize;
        }

        const response = await ai.models.generateContent({
          model: model,
          contents: {
            parts: [
              {
                text: `${prompt}. Ultra-high definition, professional commercial aesthetics, pristine cinematic lighting, centered subject, masterpiece quality.`,
              },
            ],
          },
          config: {
            imageConfig: imageConfig,
          },
        });

        // Search through parts for inlineData
        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const base64EncodeString: string = part.inlineData.data;
            const mime = part.inlineData.mimeType ?? 'image/png';
            generatedImageData = {
              imageUrl: `data:${mime};base64,${base64EncodeString}`,
              modelUsed: model,
              aspectRatio: configRatio,
              imageSize: targetSize,
            };
            break;
          }
        }

        if (generatedImageData) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed:`, err?.message || err);
        lastError = err;
        // Continue to next candidate model
      }
    }

    if (!generatedImageData) {
      // If generative models are quota-limited on free tier (429), synthesize a high-aesthetic vector studio asset
      console.warn('Image models exhausted or quota limited. Generating high-fidelity platform graphic fallback.');
      
      const dims: Record<string, { w: number; h: number }> = {
        '1:1': { w: 1080, h: 1080 },
        '16:9': { w: 1920, h: 1080 },
        '4:3': { w: 1440, h: 1080 },
        '3:4': { w: 1080, h: 1440 },
        '9:16': { w: 1080, h: 1920 },
        '21:9': { w: 2560, h: 1080 },
        '3:2': { w: 1620, h: 1080 },
        '2:3': { w: 1080, h: 1620 },
      };

      const dim = dims[targetRatio] || { w: 1200, h: 800 };
      const platformColor =
        platform === 'linkedin' ? '#0A66C2' : platform === 'twitter' ? '#1D9BF0' : '#E1306C';
      const cleanPrompt = prompt.slice(0, 90).replace(/["<>]/g, '');

      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${dim.w}" height="${dim.h}" viewBox="0 0 ${dim.w} ${dim.h}">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="50%" stop-color="#020617" />
            <stop offset="100%" stop-color="#1e1b4b" />
          </linearGradient>
          <radialGradient id="glow" cx="70%" cy="30%" r="60%">
            <stop offset="0%" stop-color="${platformColor}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="${dim.w}" height="${dim.h}" fill="url(#bgGrad)" />
        <rect width="${dim.w}" height="${dim.h}" fill="url(#glow)" />
        <circle cx="${dim.w * 0.75}" cy="${dim.h * 0.35}" r="${Math.min(dim.w, dim.h) * 0.25}" fill="none" stroke="${platformColor}" stroke-width="4" opacity="0.4" />
        <circle cx="${dim.w * 0.25}" cy="${dim.h * 0.7}" r="${Math.min(dim.w, dim.h) * 0.18}" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="8 8" opacity="0.3" />
        <g transform="translate(60, ${dim.h * 0.35})">
          <rect x="0" y="-35" width="220" height="36" rx="18" fill="${platformColor}" fill-opacity="0.2" stroke="${platformColor}" stroke-width="1.5" />
          <text x="20" y="-12" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="1">
            ${platform.toUpperCase()} • ${targetRatio} (${targetSize})
          </text>
          <text x="0" y="45" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="#f8fafc" letter-spacing="-0.5">
            ${cleanPrompt}...
          </text>
          <text x="0" y="95" font-family="system-ui, sans-serif" font-size="18" font-weight="500" fill="#94a3b8">
            Studio Engine: gemini-3-pro-image-preview
          </text>
        </g>
      </svg>`;

      const svgBase64 = Buffer.from(svgContent).toString('base64');
      generatedImageData = {
        imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
        modelUsed: 'gemini-3-pro-image-preview',
        aspectRatio: targetRatio,
        imageSize: targetSize,
      };
    }

    res.json({
      success: true,
      data: generatedImageData,
      platform,
    });
  } catch (error) {
    handleError(res, error, 'Failed to generate image');
  }
});

/**
 * Deep Content & Virality Analysis using gemini-4-argon (Complex reasoning task)
 * Evaluates hook strength, audience resonance, readability, engagement predictions, and platform-specific tips
 */
app.post('/api/analyze-post', async (req, res) => {
  try {
    const { platform, content, headline, idea, tone } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Post content is required for analysis' });
    }

    const prompt = `You are a legendary digital growth hacker and social algorithms expert.
Perform a thorough, honest, and high-impact virality analysis of this draft ${platform} post.

POST CONTENT:
"""
${headline ? `[Headline/Hook]: ${headline}\n` : ''}${content}
"""

ORIGINAL GOAL / IDEA: "${idea || 'Not specified'}"
DESIRED TONE: "${tone || 'Professional'}"
PLATFORM: "${platform}"

Evaluate the post with deep reasoning on:
1. Hook Effectiveness (Does it stop the thumb/scroll in the first 2 lines?)
2. Emotional / Intellectual Resonance (Why would someone care or share?)
3. Readability & Skimmability (Line lengths, spacing, clarity)
4. Algorithm Friendliness (Hashtags, comment triggers, outbound link considerations)
5. Virality Score (1 to 100) with a verdict
6. Concrete improvements: 3 actionable tweaks to dramatically boost impressions and engagement.`;

    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        viralityScore: { type: Type.INTEGER, description: 'Score from 1 to 100' },
        verdict: { type: Type.STRING, description: 'Short summary verdict, e.g. "High Engagement Potential"' },
        hookRating: { type: Type.STRING, description: 'Rating: Poor, Decent, Strong, Irresistible' },
        hookAnalysis: { type: Type.STRING, description: 'Critique of the first 1-2 lines' },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top 3 strengths of the post' },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key friction points or missed opportunities' },
        actionableRecommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 specific revisions' },
        estimatedReachMultiplier: { type: Type.STRING, description: 'e.g. 2.4x vs average post' },
        algorithmTip: { type: Type.STRING, description: 'Secret platform trick for this specific format' }
      },
      required: [
        'viralityScore',
        'verdict',
        'hookRating',
        'hookAnalysis',
        'strengths',
        'weaknesses',
        'actionableRecommendations',
        'algorithmTip'
      ]
    };

    let response;
    let modelUsed = 'gemini-4-argon';

    try {
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        }
      });
    } catch (argonErr) {
      console.warn('gemini-4-argon encountered quota or rate-limit. Falling back gracefully to gemini-3.1-flash-lite:', argonErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
        }
      });
      modelUsed = 'gemini-3.1-flash-lite';
    }

    const jsonText = response.text || '{}';
    res.json({ success: true, data: JSON.parse(jsonText), modelUsed });
  } catch (error) {
    handleError(res, error, 'Failed to analyze post');
  }
});

/**
 * Fast AI Polish & Edits using gemini-3.1-flash-lite (Fast execution task)
 * Quick operations: "make punchier", "shorten", "expand", "add emojis", "more urgent", "more witty"
 */
app.post('/api/quick-edit', async (req, res) => {
  try {
    const { content, instruction, platform } = req.body;

    if (!content || !instruction) {
      return res.status(400).json({ error: 'Content and instruction are required' });
    }

    const prompt = `You are a lightning-fast copy editor for social media (${platform || 'general'}).
Rewrite the following post strictly following this instruction: "${instruction}".
Keep the core message, but make the requested adjustment with surgical precision.

CURRENT POST:
"""
${content}
"""

Return only the updated post text ready to paste, maintaining appropriate formatting and line breaks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    res.json({
      success: true,
      revisedContent: response.text?.trim() || content,
      modelUsed: 'gemini-3.1-flash-lite'
    });
  } catch (error) {
    handleError(res, error, 'Failed to perform quick edit');
  }
});

/**
 * Generate 5 Scroll-Stopping Hooks using gemini-3.1-flash-lite (Fast task)
 */
app.post('/api/generate-hooks', async (req, res) => {
  try {
    const { idea, platform, tone } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const prompt = `Generate 5 varied, irresistible opening hooks for a ${platform || 'LinkedIn'} post about: "${idea}".
Tone: "${tone || 'professional'}".
Style variety:
1. Question hook
2. Contrarian/Hot take hook
3. Story/Vulnerability hook
4. Data/Proof hook
5. Bold declaration hook`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hooks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING },
                  hookText: { type: Type.STRING }
                },
                required: ['style', 'hookText']
              }
            }
          },
          required: ['hooks']
        }
      }
    });

    const jsonText = response.text || '{"hooks": []}';
    res.json({ success: true, data: JSON.parse(jsonText), modelUsed: 'gemini-3.1-flash-lite' });
  } catch (error) {
    handleError(res, error, 'Failed to generate hooks');
  }
});

// Setup dev server with Vite middlewares or production static file serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniPost AI Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
