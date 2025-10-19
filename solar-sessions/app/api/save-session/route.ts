import { NextRequest, NextResponse } from "next/server";
import { createSessionWithEmotions } from "@/lib/database";
import { createAuthenticatedSupabaseClient } from "@/lib/auth-server";

export const runtime = 'nodejs';
export const maxDuration = 60;

interface SaveSessionRequest {
  session_name: string;
  transcript: string;
  emotions: Array<{
    emotion_id: number;
    intensity: number;
  }>;
}

/**
 * POST /api/save-session
 * Save a session with emotions to the database
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { supabase, user } = await createAuthenticatedSupabaseClient(request);
    
    const { session_name, transcript, emotions }: SaveSessionRequest = await request.json();

    // Validate input
    if (!session_name || !transcript || !emotions) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing required fields: session_name, transcript, emotions",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(emotions) || emotions.length === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "Emotions must be a non-empty array",
        },
        { status: 400 }
      );
    }

    // Validate emotions structure
    for (const emotion of emotions) {
      if (typeof emotion.emotion_id !== 'number' || typeof emotion.intensity !== 'number') {
        return NextResponse.json(
          {
            error: true,
            message: "Each emotion must have emotion_id (number) and intensity (number)",
          },
          { status: 400 }
        );
      }
    }

    // Generate a random color for the session
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57",
      "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
      "#10AC84", "#EE5A24", "#0984E3", "#6C5CE7", "#A29BFE"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    console.log(`[INFO] Saving session: "${session_name}" for user ${user.id}`);

    // Create session with emotions using authenticated client
    const result = await createSessionWithEmotions(
      user.id,
      session_name,
      transcript,
      randomColor,
      emotions,
      supabase
    );

    if (!result.success) {
      console.error("[ERROR] Failed to save session:", result.error);
      return NextResponse.json(
        {
          error: true,
          message: "Failed to save session to database",
          details: result.error,
        },
        { status: 500 }
      );
    }

    console.log(`[INFO] Session saved successfully with ID: ${result.sessionId}`);

    return NextResponse.json(
      {
        success: true,
        sessionId: result.sessionId,
        message: "Session saved successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ERROR] Unexpected error in save session API:", message);
    return NextResponse.json(
      {
        error: true,
        message: "An unexpected error occurred while saving session",
        details: message,
      },
      { status: 500 }
    );
  }
}
