# 🚀 Quick Start Guide — Rant & Reflect

## Prerequisites

- Node.js 18+ installed
- OpenAI API key (for Whisper)
- Google Gemini API key
- Microphone access in browser

## Setup (5 minutes)

### 1. Navigate to the project

```bash
cd "c:/Users/ATM Rahat Hossain/Desktop/SolarSessions/solar-sessions"
```

### 2. Install dependencies (if not done)

```bash
npm install
```

### 3. Create environment file

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 4. Add your API keys

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
GEMINI_API_KEY=AIzaSy-your-actual-gemini-key-here
```

Get your keys:
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://makersuite.google.com/app/apikey

### 5. Start the dev server

```bash
npm run dev
```

### 6. Open in browser

Visit: http://localhost:3000/rant-reflect

### 7. Grant microphone permission

Click "🎤 START" → Allow microphone access when prompted

### 8. Test the feature

1. Click **START** to record
2. Speak for 10-30 seconds
3. Click **STOP**
4. Wait ~5 seconds for processing
5. View your transcription and emotion analysis!

## Troubleshooting

### "Cannot find module '@/lib/whisper'"

- Check `tsconfig.json` has `"@/*": ["./*"]` in paths
- Restart dev server: `Ctrl+C` then `npm run dev`

### "No speech detected"

- Speak louder/closer to microphone
- Check microphone is working in other apps
- Try recording for at least 3-5 seconds

### "Transcription failed"

- Verify `OPENAI_API_KEY` in `.env.local`
- Check API key has billing enabled
- Check terminal for error details

### "Emotion analysis failed"

- Verify `GEMINI_API_KEY` in `.env.local`
- Check Gemini API is enabled in your Google Cloud project

## Production Build

```bash
npm run build
npm start
```

Build output should show:
```
✓ Compiled successfully
Route (app)
├ ○ /rant-reflect    4.83 kB    172 kB
```

## Architecture Overview

```
📁 solar-sessions/
├── app/
│   ├── api/transcribe/route.ts     ← Backend endpoint
│   └── rant-reflect/page.tsx       ← Frontend page
├── lib/
│   ├── whisper.ts                  ← OpenAI Whisper
│   └── gemini.ts                   ← Google Gemini
├── components/
│   ├── Recorder.tsx                ← Audio capture
│   ├── TranscriptView.tsx          ← Text display
│   └── EmotionCard.tsx             ← Emotion display
└── .env.local                      ← API keys (YOU CREATE THIS)
```

## What to Expect

### Recording Phase
- Microphone access prompt
- Recording timer (MM:SS)
- Pulsing red STOP button

### Processing Phase
- Loading animation
- Takes 3-10 seconds
- Progress indicators

### Results Display
- Full transcript in quotes
- Primary emotion (e.g., "stressed")
- Intensity rating (1-10)
- AI-generated compassionate insight
- Processing metadata (time, file size)

## Example Output

**Transcript:**
> "I've been feeling really overwhelmed by work lately. There's just so much to do and not enough time. I wish I could just take a break and relax for a while."

**Emotion:** Stressed  
**Intensity:** 7/10  
**Insight:** *Consider taking short breaks and prioritizing self-care activities.*

## Next Steps

- Try different emotional tones (happy, sad, excited)
- Test with longer recordings (up to 2-3 minutes)
- Experiment with background noise tolerance
- Share the feature with friends/colleagues

## Support

Need help? Check:
1. Terminal output for error messages
2. Browser console (F12) for client errors
3. `INTEGRATION_SUMMARY.md` for detailed docs
4. OpenAI/Gemini API status pages

---

**Status:** ✅ Ready to use!  
**Build:** ✅ Passing  
**Server:** ✅ Running on http://localhost:3000

Happy reflecting! 🎧✨
