# OmniPost AI — Cross-Platform Social Content & Image Generator

OmniPost AI transforms a single idea into synchronized, platform-tailored social media campaigns simultaneously for **LinkedIn** (long-form authority), **Twitter / 𝕏** (short, punchy with thread support), and **Instagram** (visual-focused with rich hashtag clusters), accompanied by studio-quality AI images formatted for each platform's optimal aspect ratio.

---

## 🚀 Key Features

### 1. Simultaneous 3-in-1 Platform Generation
- **LinkedIn**: Thoughtful storytelling case studies, formatted line breaks, bold opening hooks, bulleted insights, call-to-action discussion triggers, and targeted professional hashtags.
- **Twitter / 𝕏**: High-impact scroll-stopping hook strictly under 280 characters with a live character count badge, focused hashtags, and an optional expandable multi-tweet thread.
- **Instagram**: Narrative visual caption with line spacing, engagement-magnet prompts, aesthetic carousel advice, and a strategic cluster of 15–20 hashtags.

### 2. Tone Calibration
Calibrate the exact voice of the generated content:
- **Professional**: Authoritative, insightful, polished & enterprise-ready
- **Witty**: Clever, humorous, conversational & relatable
- **Urgent**: High FOMO, action-driven, timely & imperative
- **Inspiring**: Uplifting, visionary & story-driven
- **Bold / Hot Take**: Contrarian, provocative & trend-challenging
- **Educational**: Value-dense, tactical step-by-step breakdowns

### 3. Studio Image Generation & Aspect Ratio Control
- **Aspect Ratio Affordance**: Choose between `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `9:16`, `16:9`, and `21:9` for any platform.
  - *LinkedIn Default*: `16:9` (feed banner)
  - *Twitter/X Default*: `16:9` (card preview) or `3:2`
  - *Instagram Default*: `1:1` (square feed) or `4:3`
- **Resolution Affordance**: Generate visuals at **1K** (1024px), **2K** (2048px), or **4K** (4096px).
- **Studio Model Selection**:
  - `gemini-3-pro-image-preview` (Studio Quality, cinematic lighting)
  - `gemini-nano-banana-2.1` (High-speed generation with full aspect ratio control)
- **1-Click Download**: Directly save high-resolution image assets formatted for each platform.

### 4. Gemini Multi-Model Intelligence
- **`gemini-4-argon` (Complex Task)**: Deep virality and algorithmic performance audit evaluating hook strength, reader friction, estimated reach multiplier, and platform-specific algorithm mechanics.
- **`gemini-3.8-flash` (General Task)**: Simultaneous synthesis of structured multi-platform copy and visual prompts from raw ideas.
- **`gemini-3.1-flash-lite` (Fast Tasks)**:
  - **Quick AI Polish**: Make punchier, shorten, expand key takeaways, inject wit, add aesthetic emojis.
  - **5-Hook Brainstormer**: Irresistible opening hooks across 5 distinct styles (Question, Contrarian, Story, Data, Bold) with 1-click swap.

### 5. Workflow & Export Tools
- **Authentic Platform Previews**: Realistic UI shells for LinkedIn, Twitter/X, and Instagram mobile feeds.
- **Dual View Modes**: Side-by-side **3-Column Studio Grid** or **Single Focus Tabs**.
- **In-Place Editing**: Direct inline editing of headlines, post copy, and visual prompts with real-time character counters.
- **Campaign Export**: 1-click export of the entire campaign into clean Markdown (`.md`) format or clipboard.
- **Browser History**: Automatically saves recent campaigns locally in `localStorage` for quick retrieval.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend**: Node.js, Express, tsx
- **Development Server**: Express with Vite middlewares mounted in dev mode
- **AI SDK**: `@google/genai` (server-side proxy architecture, keeping API keys secure)
- **Models Used**:
  - `gemini-3.8-flash`: Multi-channel social copy generation
  - `gemini-4-argon`: Virality & psychological engagement analysis
  - `gemini-3.1-flash-lite`: Sub-second edits and hook brainstorming
  - `gemini-3-pro-image-preview` & `gemini-nano-banana-2.1`: Generative image engine

---

## 📡 Backend API Endpoints

| Endpoint | Method | Model | Description |
|---|---|---|---|
| `/api/generate-posts` | `POST` | `gemini-3.8-flash` | Generates LinkedIn, Twitter, and Instagram copy simultaneously |
| `/api/generate-image` | `POST` | `gemini-3-pro-image-preview` / `gemini-nano-banana-2.1` | Generates platform visual with user-selected aspect ratio and resolution (1K/2K/4K) |
| `/api/analyze-post` | `POST` | `gemini-4-argon` | Evaluates virality score (1-100), hook quality, and platform algorithm tips |
| `/api/quick-edit` | `POST` | `gemini-3.1-flash-lite` | Lightning-fast surgical rewrite (punchier, shorter, witty, urgent) |
| `/api/generate-hooks` | `POST` | `gemini-3.1-flash-lite` | Generates 5 high-converting opening hooks for any post |

---

## 💻 Local Development

1. **Clone and Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your Gemini API Key:
   ```env
   GEMINI_API_KEY="your-api-key"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The dev server will run on `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

---

## 📄 License
Apache-2.0
