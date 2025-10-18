import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Transcribe audio file to text using OpenAI Whisper API
 * @param audioFile - The audio file to transcribe
 * @returns Promise<string> - Transcribed text
 */
export async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    const result = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: "en", // Optional: can be omitted for auto-detection
    });

    const text = typeof result === 'string' ? result : (result.text || "");
    return text.trim();
  } catch (error: unknown) {
    const anyErr = error as any;
    const status = anyErr?.status ?? anyErr?.statusCode;
    const message = anyErr?.message ?? (error instanceof Error ? error.message : String(error));
    console.error("Whisper API Error:", status ? `${status} ${message}` : message);

    // Rethrow with structured info so callers can branch on 429
    const err = new Error(`Transcription failed: ${message}`) as Error & { status?: number; code?: string };
    if (typeof status === 'number') err.status = status;
    if (status === 429 || /\b429\b/.test(String(message))) err.code = 'RATE_LIMIT';
    throw err;
  }
}
