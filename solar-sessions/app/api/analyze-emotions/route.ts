import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchEmotions, DatabaseEmotion } from "../../../lib/database";
import { createAuthenticatedSupabaseClient } from "@/lib/auth-server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = 'nodejs';
export const maxDuration = 60;

interface EmotionSelection {
  emotion_id: number;
  intensity: number;
}

interface AnalysisResult {
  session_name: string;
  emotions: EmotionSelection[];
}

/**
 * POST /api/analyze-emotions
 * Analyze transcribed text and return session name and emotion selections
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { supabase } = await createAuthenticatedSupabaseClient(request);
    
    const { text } = await request.json();

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "No text provided for analysis",
        },
        { status: 400 }
      );
    }

    console.log(`[INFO] Analyzing emotions for text: "${text.substring(0, 50)}..."`);

    // Fetch available emotions from database using authenticated client
    let emotions: DatabaseEmotion[];
    try {
      emotions = await fetchEmotions(supabase);
      if (!emotions || emotions.length === 0) {
        return NextResponse.json(
          {
            error: true,
            message: "Failed to fetch emotions from database",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch emotions:", error);
      return NextResponse.json(
        {
          error: true,
          message: "Failed to fetch emotions from database",
        },
        { status: 500 }
      );
    }

    // Create emotion mapping for Gemini
    const emotionList = emotions.map(e => `${e.id}: ${e.name}`).join(', ');

    // Use Gemini 2.0 flash-lite for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an emotion analysis AI. Given the following transcribed text and available emotions, provide:

1. A short, descriptive session name (2-4 words)
2. Select 1-6 emotions that best match the text
3. Assign intensity values (up to 2 decimal places) where all intensities sum to exactly 1.0

Available emotions: ${emotionList}

Text: "${text}"

Respond with ONLY a JSON object in this exact format:
{
  "session_name": "string",
  "emotions": [
    {
      "emotion_id": number,
      "intensity": number
    }
  ]
}

Requirements:
- session_name: 2-4 descriptive words
- emotions: 1-6 emotions from the available list
- intensity: decimal numbers (up to 2 decimal places) that sum to exactly 1.0
- emotion_id: must match the IDs from the available emotions list`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();

    console.log(`[INFO] Gemini response: ${responseText}`);

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[ERROR] Failed to parse Gemini response:", parseError);
      return NextResponse.json(
        {
          error: true,
          message: "Failed to parse AI response",
          details: responseText,
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!analysisResult.session_name || !analysisResult.emotions || !Array.isArray(analysisResult.emotions)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid response structure from AI",
          details: analysisResult,
        },
        { status: 500 }
      );
    }

    // Validate emotion IDs exist in database
    const validEmotionIds = emotions.map(e => e.id);
    const invalidEmotions = analysisResult.emotions.filter(e => !validEmotionIds.includes(e.emotion_id));
    if (invalidEmotions.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: "AI selected invalid emotion IDs",
          details: { invalidEmotions, validEmotionIds },
        },
        { status: 500 }
      );
    }

    // Validate intensity sum
    const intensitySum = analysisResult.emotions.reduce((sum, e) => sum + e.intensity, 0);
    if (Math.abs(intensitySum - 1.0) > 0.01) { // Allow small floating point errors
      return NextResponse.json(
        {
          error: true,
          message: "Emotion intensities must sum to 1.0",
          details: { intensitySum, emotions: analysisResult.emotions },
        },
        { status: 500 }
      );
    }

    // Add emotion names and colors to the response
    const enrichedEmotions = analysisResult.emotions.map(selection => {
      const emotion = emotions.find(e => e.id === selection.emotion_id);
      return {
        emotion_id: selection.emotion_id,
        intensity: selection.intensity,
        name: emotion?.name || 'Unknown',
        color: emotion?.color || '#000000',
        is_positive: emotion?.is_positive || false,
      };
    });

    console.log(`[INFO] Analysis completed successfully: "${analysisResult.session_name}" with ${enrichedEmotions.length} emotions`);

    return NextResponse.json(
      {
        session_name: analysisResult.session_name,
        emotions: enrichedEmotions,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ERROR] Unexpected error in emotion analysis API:", message);
    return NextResponse.json(
      {
        error: true,
        message: "An unexpected error occurred during emotion analysis",
        details: message,
      },
      { status: 500 }
    );
  }
}
