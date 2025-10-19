import { GoogleGenerativeAI } from "@google/generative-ai";

// Optional Gemini-based speech-to-text via audio bytes prompt (quality varies compared to Whisper)
const genAIKey = process.env.GEMINI_API_KEY || "";
const genAI = genAIKey ? new GoogleGenerativeAI(genAIKey) : undefined;

/**
 * Attempt a lightweight Gemini transcription by hinting that content is speech.
 * Note: Gemini's text model isn't an ASR model; this is a best-effort fallback.
 */
export async function tryGeminiTranscription(audioFile: File): Promise<string | null> {
  try {
    if (!genAI) return null;
    // Currently, the public text model API does not accept raw audio;
    // without Gemini Audio models available here, we return null.
    // Placeholder for future upgrade to Gemini's audio understanding APIs.
    return null;
  } catch (e) {
    console.error("Gemini transcription fallback failed:", e instanceof Error ? e.message : String(e));
    return null;
  }
}

export default { tryGeminiTranscription };
