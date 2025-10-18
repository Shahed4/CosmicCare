# Solar Sessions — Rant & Reflect (Next.js + Whisper + Gemini)

This folder contains the Next.js app for Solar Sessions with an integrated "Rant & Reflect" feature — a voice-first emotional reflection tool that uses OpenAI Whisper for speech-to-text and Google Gemini for emotion analysis.

This README is focused on the Rant & Reflect integration and how to run it locally.

## Features

- Record short voice rants in the browser (MediaRecorder).
- Transcribe audio with OpenAI Whisper (server-side API route).
- Analyze emotional tone with Google Gemini (server-side API route).
- Minimal, reactive UI components: `Recorder`, `TranscriptView`, `EmotionCard`.

## File highlights

- `app/rant-reflect/page.tsx` — Rant & Reflect UI and orchestration.
- `app/api/transcribe/route.ts` — serverless API route that accepts an audio `FormData` upload, calls Whisper and Gemini helpers, and returns the combined result.
- `lib/whisper.ts` — Whisper helper wrapper for OpenAI audio transcription.
- `lib/gemini.ts` — Gemini helper wrapper for emotion analysis.
- `components/Recorder.tsx`, `components/TranscriptView.tsx`, `components/EmotionCard.tsx` — frontend UI pieces.

## Environment variables

Create a `.env.local` in the `solar-sessions` folder with the following variables (or set them in your hosting platform):

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=ya29.a0AfH6S... (or your Gemini credential)
# Optional: other keys your project needs (e.g. Supabase)
```

For convenience, a `.env.example` is included alongside this README.

## Local development (quick start)

1. Install dependencies

```bash
# From the solar-sessions folder
npm install
# or
pnpm install
```

2. Add your API keys to `.env.local`.

3. Start the dev server

```bash
npm run dev
# or
pnpm dev
```

4. Open `http://localhost:3000/rant-reflect` and test the recorder.

Notes:
- The transcription route expects a `POST` with a `FormData` field named `audio` (file). The page already sends `recording.webm` from the browser.
- Keep audio sessions under 25MB to avoid serverless size limits.

## Troubleshooting

- If imports like `@/lib/whisper` cannot be resolved, ensure your `tsconfig.json` or `jsconfig.json` has `baseUrl`/`paths` configured.
- If the Whisper or Gemini calls fail, check your env vars and API key scopes.

## Next steps (suggested)

- Add end-to-end tests for the transcription API using a small sample audio fixture.
- Add persisted session history (Supabase/Postgres) to track emotional trends.
- Implement real-time streaming transcription for more immediacy.

---

If you'd like, I can also:
- Add a `.github/workflows` CI job that runs TypeScript checks and lints.
- Add a small E2E test that POSTs a short audio file to the API route.
# 🌟 Solar Sessions

> **Visualize Your Day Through Space & Reflect on Your Emotions with AI**

Solar Sessions is an innovative full-stack Next.js application that combines **3D space visualization** of your daily activities with **AI-powered emotional reflection** through voice. Transform your sessions into an interactive solar system and use the integrated **Rant & Reflect** feature to speak freely and receive intelligent emotional insights.

---

## 🎯 **Project Overview**

**Solar Sessions** offers two core experiences:

### 1. 🪐 **Solar System Visualization**
Transform your daily sessions into beautiful 3D planets orbiting in space. Each planet represents a work session, and moons represent emotions associated with that session.

### 2. 🎧 **Rant & Reflect (AI Emotional Analysis)**
An AI-driven self-therapy tool that allows users to:
- **Record voice rants** directly in the browser
- **Transcribe speech to text** using OpenAI's Whisper API
- **Analyze emotional tone** using Google's Gemini Pro AI
- **Receive personalized insights** and suggestions for emotional wellness

---

## ✨ **Key Features**

### Rant & Reflect Module
* 🎙️ **Voice Recording Interface** - Record audio directly from the browser using Web Audio API
* 🧾 **Speech-to-Text Conversion** - Whisper automatically transcribes user speech with high accuracy
* 💬 **Emotion Classification** - Gemini analyzes emotional tone (calm, angry, anxious, hopeful, etc.)
* 💡 **AI Insights** - Get compassionate suggestions based on your emotional state
* ⚡ **Instant Feedback** - Real-time transcription and analysis
* 📊 **Intensity Scoring** - Emotion intensity rated on a 1-10 scale

### Solar Sessions Core
* 🌌 **3D Space Environment** - Beautiful space visualization with Three.js
* 🔐 **Authentication** - Secure user authentication with Supabase
* 📅 **Calendar Integration** - Track and visualize sessions over time
* 🎨 **Beautiful UI** - Modern, responsive design with smooth animations

---

## 🛠️ **Tech Stack**

| Layer                  | Technology                              |
| ---------------------- | --------------------------------------- |
| **Framework**          | Next.js 15 (App Router)                 |
| **Frontend**           | React 19, TypeScript, TailwindCSS       |
| **3D Graphics**        | Three.js, React Three Fiber             |
| **Backend**            | Next.js API Routes (Serverless)         |
| **Authentication**     | Supabase                                |
| **Speech Recognition** | OpenAI Whisper (`whisper-1`)            |
| **Emotion Analysis**   | Google Gemini Pro                       |
| **Audio Capture**      | MediaRecorder API (WebRTC)              |
| **Deployment**         | Vercel (Recommended)                    |

---

## 📂 **Project Structure**

```
solar-sessions/
│
├── app/
│   ├── page.tsx                        # Home page
│   ├── layout.tsx                      # Root layout with navbar & auth
│   ├── rant-reflect/
│   │   └── page.tsx                    # Rant & Reflect main page
│   ├── api/
│   │   ├── transcribe/
│   │   │   └── route.ts                # Whisper + Gemini API endpoint
│   │   └── health/
│   │       └── route.ts                # Health check endpoint
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── signup/
│   │   └── page.tsx                    # Signup page
│   └── dummy/                          # Sample session pages
│
├── components/
│   ├── NavBar.tsx                      # Navigation bar
│   ├── AuthModal.tsx                   # Authentication modal
│   ├── SpaceBackground.tsx             # 3D space visualization
│   ├── Recorder.tsx                    # Audio recording component
│   ├── TranscriptView.tsx              # Display transcription
│   ├── EmotionCard.tsx                 # Display emotion analysis
│   └── Loader.tsx                      # Loading animation
│
├── lib/
│   ├── whisper.ts                      # OpenAI Whisper integration
│   ├── gemini.ts                       # Google Gemini integration
│   └── supabase.ts                     # Supabase client setup
│
├── contexts/
│   └── AuthContext.tsx                 # Authentication context
│
├── public/                             # Static assets
├── .env.local                          # Environment variables
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (for Whisper)
- Google Gemini API key
- Supabase account (optional, for auth features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SolarSessions.git
   cd SolarSessions/solar-sessions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase (Optional - for authentication)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI Whisper API (Required for Rant & Reflect)
   OPENAI_API_KEY=your_openai_api_key

   # Google Gemini API (Required for emotion analysis)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎧 **Using Rant & Reflect**

1. Navigate to **Rant & Reflect** from the navbar
2. Click the **"START"** button to begin recording
3. Speak freely about your thoughts, feelings, or experiences
4. Click **"STOP"** when finished
5. Wait for AI processing (usually 5-15 seconds)
6. View your:
   - 📝 **Transcription** - What you said
   - 💭 **Emotion** - Detected emotional state
   - 📊 **Intensity** - How strong the emotion is (1-10)
   - 💡 **Insights** - Helpful suggestions from AI
7. Click **"Record Another"** to start a new session

---

## 🧠 **How It Works**

### Rant & Reflect Workflow

```
┌──────────────┐
│ User Speaks  │
│   (Browser)  │
└──────┬───────┘
       │ Audio Blob
       ▼
┌──────────────────┐
│  POST /api/      │
│  transcribe      │
└────────┬─────────┘
         │
    ┌────▼────┐
    │ Whisper │ ──► Transcribed Text
    │   API   │
    └────┬────┘
         │
    ┌────▼────┐
    │ Gemini  │ ──► Emotion Analysis
    │   Pro   │     (emotion, intensity, suggestions)
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ JSON Response   │
│ to Frontend     │
└─────────────────┘
```

### API Response Format
```json
{
  "text": "I've been feeling overwhelmed by work lately...",
  "emotion": "stressed",
  "confidence": "8",
  "suggestions": "Take regular breaks and practice mindfulness.",
  "timestamp": "2025-10-18T16:25:00Z",
  "processingTime": "7.32s",
  "fileSize": "156.78 KB"
}
```

---

## 📡 **API Endpoints**

### `POST /api/transcribe`
Upload audio file and receive transcription + emotion analysis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `audio` (File, max 25MB)

**Response:**
```json
{
  "text": "string",
  "emotion": "string",
  "confidence": "string",
  "suggestions": "string",
  "timestamp": "ISO string",
  "processingTime": "string",
  "fileSize": "string"
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "ISO string",
  "service": "Solar Sessions API",
  "version": "1.0.0"
}
```

---

## 🎨 **Features & Components**

### Recorder Component
- Real-time recording with visual feedback
- Timer display during recording
- Microphone permission handling
- Audio blob generation

### Emotion Card
- Color-coded by emotion type
- Emoji representation
- Intensity meter (1-10)
- AI-generated insights

### Transcript View
- Clean, readable text display
- Quotation formatting
- Smooth animations

---

## 🔒 **Security & Privacy**

- Audio files are **not stored** on servers
- Processing happens in real-time via API
- All data transmission uses HTTPS
- Environment variables protect API keys
- Supabase handles authentication securely

---

## 🌐 **Deployment**

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel automatically handles:
- Serverless API routes
- Edge caching
- Automatic HTTPS
- Zero-config deployment

---

## 🚧 **Future Enhancements**

- [ ] 🔄 **Real-time streaming transcription**
- [ ] 📊 **Emotion tracking dashboard over time**
- [ ] 🗄️ **Save rant history to database**
- [ ] 🧘 **Personalized wellness recommendations**
- [ ] 🌍 **Multilingual support**
- [ ] 📱 **Mobile app version**
- [ ] 🔗 **Integration with calendar for mood tracking**
- [ ] 🎯 **Goal setting based on emotional patterns**

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is open source and available under the MIT License.

---

## 🙏 **Acknowledgments**

- **OpenAI** for the Whisper speech recognition model
- **Google** for the Gemini Pro AI model
- **Vercel** for the amazing Next.js framework
- **Three.js** for 3D graphics capabilities
- **Supabase** for authentication infrastructure

---

## 📧 **Contact**

For questions, suggestions, or feedback:
- Create an issue on GitHub
- Email: your-email@example.com

---

## 🎯 **Summary**

**Solar Sessions** combines cutting-edge AI technology with beautiful 3D visualization to create a unique self-reflection and productivity tracking experience. The **Rant & Reflect** module demonstrates how AI can be used compassionately to help people understand their emotions better.

By merging:
- 🎤 **Speech recognition (Whisper)**
- 🧠 **Emotional intelligence (Gemini)**
- 🌌 **3D visualization (Three.js)**
- ⚡ **Seamless full-stack integration (Next.js)**

We've created a powerful tool for **mental wellness** and **self-awareness** in the modern digital age.

---

**Built with ❤️ by the Solar Sessions Team**
