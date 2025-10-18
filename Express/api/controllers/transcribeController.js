import { transcribeAudio } from "../services/whisperService.js";
import { analyzeEmotion } from "../services/geminiService.js";
import { logInfo, logError } from "../utils/logger.js";

/**
 * Main controller for transcription + emotion analysis
 */
export async function handleTranscription(req, res) {
  const startTime = Date.now();

  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No audio file provided",
        code: "NO_FILE",
      });
    }

    logInfo(`Processing audio file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Step 1: Transcribe audio using Whisper
    let transcription;
    try {
      transcription = await transcribeAudio(req.file.buffer, req.file.originalname);
      logInfo(`Transcription completed: "${transcription.substring(0, 50)}..."`);
    } catch (error) {
      logError("Whisper transcription failed", error);
      return res.status(500).json({
        error: true,
        message: "Speech-to-text conversion failed",
        code: "WHISPER_ERROR",
        details: error.message,
      });
    }

    // Check if transcription is empty
    if (!transcription || transcription.trim().length === 0) {
      return res.status(400).json({
        error: true,
        message: "No speech detected in audio file",
        code: "NO_SPEECH",
      });
    }

    // Step 2: Analyze emotion using Gemini
    let emotionData;
    try {
      emotionData = await analyzeEmotion(transcription);
      logInfo(`Emotion analysis completed: ${emotionData.emotion} (intensity: ${emotionData.confidence})`);
    } catch (error) {
      logError("Gemini emotion analysis failed", error);
      return res.status(500).json({
        error: true,
        message: "Emotion analysis failed",
        code: "GEMINI_ERROR",
        details: error.message,
      });
    }

    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Step 3: Send successful response
    const response = {
      text: transcription,
      emotion: emotionData.emotion,
      confidence: emotionData.confidence,
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime}s`,
      fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
    };

    logInfo(`Request completed in ${processingTime}s`);
    res.status(200).json(response);

  } catch (error) {
    logError("Unexpected error in transcription controller", error);
    res.status(500).json({
      error: true,
      message: "An unexpected error occurred",
      code: "INTERNAL_ERROR",
      details: error.message,
    });
  }
}

export default { handleTranscription };
