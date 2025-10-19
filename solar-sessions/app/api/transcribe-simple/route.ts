import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/whisper";

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/transcribe-simple
 * Simple transcription endpoint that only returns transcribed text
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    // Validate file exists
    if (!audioFile) {
      return NextResponse.json(
        {
          error: true,
          message: "No audio file provided",
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
        },
        { status: 400 }
      );
    }

    console.log(`[INFO] Processing audio file: ${audioFile.name} (${audioFile.size} bytes)`);

    // Transcribe audio using Whisper
    let transcription: string;
    try {
      transcription = await transcribeAudio(audioFile);
      console.log(`[INFO] Transcription completed: "${transcription.substring(0, 50)}..."`);
    } catch (error: unknown) {
      const anyErr = error as any;
      const status = anyErr?.status;
      const message = anyErr?.message ?? (error instanceof Error ? error.message : String(error));
      console.error("[ERROR] Whisper transcription failed:", status ? `${status} ${message}` : message);

      return NextResponse.json(
        {
          error: true,
          message: "Speech-to-text conversion failed",
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
        },
        { status: 400 }
      );
    }

    // Return only the transcribed text
    return NextResponse.json(
      {
        text: transcription,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ERROR] Unexpected error in simple transcription API:", message);
    return NextResponse.json(
      {
        error: true,
        message: "An unexpected error occurred",
        details: message,
      },
      { status: 500 }
    );
  }
}
