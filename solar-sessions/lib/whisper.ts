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
  } catch (error: any) {
    console.error("Whisper API Error:", error.message || error);
    throw new Error(`Transcription failed: ${error.message || error}`);
  }
}
