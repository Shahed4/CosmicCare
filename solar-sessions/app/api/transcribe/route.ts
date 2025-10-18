import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/whisper";
import { analyzeEmotion } from "@/lib/gemini";

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout for serverless function

/**
 * POST /api/transcribe
 * Upload audio file and get transcription + emotion analysis
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    // Validate file exists
    if (!audioFile) {
      return NextResponse.json(
        {
          error: true,
          message: "No audio file provided",
          code: "NO_FILE",
        },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit for Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        {
          error: true,
          message: "File size exceeds 25MB limit",
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/mp4",
      "audio/webm",
      "audio/ogg",
      "audio/mp3",
      "audio/x-m4a",
    ];

    if (!allowedTypes.includes(audioFile.type) &&
        !audioFile.name.match(/\.(mp3|wav|m4a|webm|ogg)$/i)) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid file type. Only audio files are allowed.",
          code: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    console.log(`[INFO] Processing audio file: ${audioFile.name} (${audioFile.size} bytes)`);

    // Step 1: Transcribe audio using Whisper
    let transcription: string;
    try {
      transcription = await transcribeAudio(audioFile);
      console.log(`[INFO] Transcription completed: "${transcription.substring(0, 50)}..."`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error("[ERROR] Whisper transcription failed:", message);
      return NextResponse.json(
        {
          error: true,
          message: "Speech-to-text conversion failed",
          code: "WHISPER_ERROR",
          details: message,
        },
        { status: 500 }
      );
    }

    // Check if transcription is empty
    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json(
        {
          error: true,
          message: "No speech detected in audio file",
          code: "NO_SPEECH",
        },
        { status: 400 }
      );
    }

    // Step 2: Analyze emotion using Gemini
    let emotionData;
    try {
      emotionData = await analyzeEmotion(transcription);
      console.log(
        `[INFO] Emotion analysis completed: ${emotionData.emotion} (intensity: ${emotionData.confidence})`
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error("[ERROR] Gemini emotion analysis failed:", message);
      return NextResponse.json(
        {
          error: true,
          message: "Emotion analysis failed",
          code: "GEMINI_ERROR",
          details: message,
        },
        { status: 500 }
      );
    }

    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Step 3: Send successful response
    const response = {
      text: transcription,
      emotion: emotionData.emotion,
      confidence: emotionData.confidence,
      suggestions: emotionData.suggestions,
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}s`,
      fileSize: `${(audioFile.size / 1024).toFixed(2)} KB`,
    };

    console.log(`[INFO] Request completed in ${processingTime}s`);
    return NextResponse.json(response, { status: 200 });

  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("[ERROR] Unexpected error in transcription API:", message);
    return NextResponse.json(
      {
        error: true,
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
        details: message,
      },
      { status: 500 }
    );
  }
}

/**
 * Normalize unknown errors to a string message
 */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err);
  } catch {
    return 'Unknown error';
  }
}
