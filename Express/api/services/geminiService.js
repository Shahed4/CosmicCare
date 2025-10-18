import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

/**
 * Analyze emotional tone of transcribed text using Gemini
 * @param {string} text - The transcribed text to analyze
 * @returns {Promise<{emotion: string, confidence: string}>}
 */
export async function analyzeEmotion(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("No text provided for emotion analysis");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the emotional tone of the following text and respond with ONLY a single word or short phrase describing the primary emotion (e.g., calm, angry, sad, anxious, hopeful, frustrated, excited, confused, content, stressed).

Text: "${text}"

Emotion:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emotion = response.text().trim().toLowerCase();

    // Optional: Get confidence/sentiment analysis
    const confidencePrompt = `On a scale of 1-10, how intense is the emotion in this text? Respond with ONLY a number.

Text: "${text}"

Intensity (1-10):`;

    const confidenceResult = await model.generateContent(confidencePrompt);
    const confidenceResponse = await confidenceResult.response;
    const intensity = confidenceResponse.text().trim();

    return {
      emotion: emotion,
      confidence: intensity,
    };
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error(`Emotion analysis failed: ${error.message}`);
  }
}

export default { analyzeEmotion };
