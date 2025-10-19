import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface EmotionAnalysis {
  emotion: string;
  confidence: string;
  suggestions?: string;
}

/**
 * Analyze emotional tone of transcribed text using Gemini
 * @param text - The transcribed text to analyze
 * @returns Promise<EmotionAnalysis>
 */
export async function analyzeEmotion(text: string): Promise<EmotionAnalysis> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("No text provided for emotion analysis");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Primary emotion detection
    const emotionPrompt = `Analyze the emotional tone of the following text and respond with ONLY a single word or short phrase describing the primary emotion (e.g., calm, angry, sad, anxious, hopeful, frustrated, excited, confused, content, stressed).

Text: "${text}"

Emotion:`;

    const result = await model.generateContent(emotionPrompt);
    const response = await result.response;
    const emotion = response.text().trim().toLowerCase();

    // Intensity analysis
    const intensityPrompt = `On a scale of 1-10, how intense is the emotion in this text? Respond with ONLY a number.

Text: "${text}"

Intensity (1-10):`;

    const intensityResult = await model.generateContent(intensityPrompt);
    const intensityResponse = await intensityResult.response;
    const intensity = intensityResponse.text().trim();

    // Optional: Get helpful suggestions
    const suggestionPrompt = `Based on this emotional reflection, provide ONE brief, compassionate suggestion or insight (maximum 20 words) that could help the person:

Text: "${text}"

Suggestion:`;

    const suggestionResult = await model.generateContent(suggestionPrompt);
    const suggestionResponse = await suggestionResult.response;
    const suggestions = suggestionResponse.text().trim();

    return {
      emotion,
      confidence: intensity,
      suggestions,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Gemini API Error:", message);
    throw new Error(`Emotion analysis failed: ${message}`);
  }
}
