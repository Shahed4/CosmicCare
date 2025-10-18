import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { handleTranscription } from "../controllers/transcribeController.js";

const router = express.Router();

/**
 * POST /api/transcribe
 * Upload audio file and get transcription + emotion analysis
 */
router.post("/transcribe", upload.single("audio"), handleTranscription);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
