import OpenAI from "openai";

export interface EmotionAnalysis {
  emotion: string;
  confidence: string; // 1-10 as string to keep UI unchanged
  suggestions?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze emotional tone of text using OpenAI Chat Completions (JSON mode)
 */
export async function analyzeEmotion(text: string): Promise<EmotionAnalysis> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("No text provided for emotion analysis");
    }

    const model = process.env.OPENAI_EMOTION_MODEL || "gpt-4o-mini";

    const system = `You analyze a user's short reflection and output JSON only with keys: 
{
  "emotion": string,            // primary emotion as one word or short phrase (e.g., calm, angry, sad, anxious, hopeful)
  "intensity": number,          // 1-10 integer for how intense the emotion is
  "suggestions": string         // one brief, compassionate suggestion (<= 20 words)
}
Return ONLY valid JSON, no extra text.`;

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Text: "${text}"` },
      ],
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Fallback: attempt to coerce simple outputs
      parsed = { emotion: content.toLowerCase().slice(0, 40), intensity: 5 };
    }

    const emotion = String(parsed.emotion || "unknown").toLowerCase();
    const intensityNum = Number.parseInt(String(parsed.intensity || parsed.confidence || 5), 10);
    const intensity = Number.isFinite(intensityNum) ? Math.max(1, Math.min(10, intensityNum)).toString() : "5";
    const suggestions = (parsed.suggestions ? String(parsed.suggestions) : undefined)?.trim();

    return { emotion, confidence: intensity, suggestions };
  } catch (error: unknown) {
    const anyErr: any = error;
    const status = anyErr?.status ?? anyErr?.statusCode;
    const message = anyErr?.message ?? (error instanceof Error ? error.message : String(error));
    console.error("OpenAI Emotion Analysis Error:", status ? `${status} ${message}` : message);
    const err = new Error(`Emotion analysis failed: ${message}`) as Error & { status?: number };
    if (typeof status === 'number') err.status = status;
    throw err;
  }
}

export default { analyzeEmotion };
