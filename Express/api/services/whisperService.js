import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

/**
 * Transcribe audio file to text using OpenAI Whisper API
 * @param {Buffer} audioBuffer - The audio file buffer
 * @param {string} filename - Original filename for format detection
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioBuffer, filename) {
  try {
    // In Node, construct a Blob from Buffer for the SDK
    const mime = getAudioMimeType(filename);
    const blob = new Blob([audioBuffer], { type: mime });
    const file = new File([blob], filename, { type: mime });

    const result = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      // response_format: "text" // default provides .text
    });

    // SDK can return object with .text; normalize to string
    const text = typeof result === 'string' ? result : (result.text || "");
    return (text || "").toString().trim();
  } catch (error) {
    console.error("Whisper API Error:", error.message || error);
    throw new Error(`Transcription failed: ${error.message || error}`);
  }
}

/**
 * Get MIME type based on file extension
 * @param {string} filename
 * @returns {string}
 */
function getAudioMimeType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const mimeTypes = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    webm: "audio/webm",
    ogg: "audio/ogg",
  };
  return mimeTypes[ext] || "audio/mpeg";
}

export default { transcribeAudio };
