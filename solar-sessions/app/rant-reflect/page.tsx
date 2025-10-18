"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Recorder from "@/components/Recorder";
import TranscriptView from "@/components/TranscriptView";
import EmotionCard from "@/components/EmotionCard";
import Loader from "@/components/Loader";

const SpaceBackground = dynamic(() => import("@/components/SpaceBackground"), {
  ssr: false,
});

interface TranscriptionResult {
  text: string;
  emotion: string;
  confidence: string;
  suggestions?: string;
  timestamp: string;
  processingTime: string;
  fileSize: string;
}

export default function RantReflectPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Create FormData and append the audio file
      const formData = new FormData();
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });
      formData.append("audio", audioFile);

      // Send to API
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "An error occurred during processing");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("Error processing audio:", errMsg);
      setError("Failed to process recording. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <SpaceBackground />
      <div className="rant-reflect-container">
        {/* Header */}
        <div className="header">
          <h1 className="title">
            🎧 Rant & Reflect
          </h1>
          <p className="subtitle">
            AI-Powered Emotional Reflection Through Voice
          </p>
          <p className="description">
            Speak freely. Get instant transcription and emotional insights powered by AI.
          </p>
        </div>

        {/* Main Content */}
        <div className="content">
          {!result && !isProcessing && (
            <Recorder
              onRecordingComplete={handleRecordingComplete}
              isProcessing={isProcessing}
            />
          )}

          {isProcessing && <Loader />}

          {error && (
            <div className="error-card">
              <p className="error-title">⚠️ Error</p>
              <p className="error-message">{error}</p>
              <button onClick={handleReset} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {result && (
            <div className="results">
              <TranscriptView text={result.text} />
              <EmotionCard
                emotion={result.emotion}
                confidence={result.confidence}
                suggestions={result.suggestions}
              />

              {/* Metadata */}
              <div className="metadata">
                <div className="metadata-item">
                  <span className="metadata-label">⏱️ Processing Time:</span>
                  <span className="metadata-value">{result.processingTime}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">📦 File Size:</span>
                  <span className="metadata-value">{result.fileSize}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">🕐 Timestamp:</span>
                  <span className="metadata-value">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Record Another Button */}
              <button onClick={handleReset} className="record-another-button">
                🎤 Record Another
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .rant-reflect-container {
            min-height: 100vh;
            padding: 6rem 2rem 4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 10;
          }

          .header {
            text-align: center;
            margin-bottom: 4rem;
            max-width: 800px;
          }

          .title {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 700;
            background: linear-gradient(45deg, #ffd700, #ff8c00, #ff6b6b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 1rem 0;
          }

          .subtitle {
            font-size: clamp(1.2rem, 3vw, 1.5rem);
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 1rem 0;
            font-weight: 500;
          }

          .description {
            font-size: clamp(1rem, 2vw, 1.1rem);
            color: rgba(255, 255, 255, 0.6);
            margin: 0;
            line-height: 1.6;
          }

          .content {
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .error-card {
            padding: 2rem;
            background: rgba(244, 67, 54, 0.1);
            border: 2px solid #f44336;
            border-radius: 15px;
            text-align: center;
            animation: shake 0.5s ease-in-out;
          }

          .error-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #f44336;
            margin: 0 0 1rem 0;
          }

          .error-message {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 1.5rem 0;
          }

          .retry-button {
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #f44336, #e91e63);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(244, 67, 54, 0.4);
          }

          .results {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            animation: fadeIn 0.5s ease-out;
          }

          .metadata {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            padding: 1.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            justify-content: center;
          }

          .metadata-item {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            text-align: center;
          }

          .metadata-label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 500;
          }

          .metadata-value {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 600;
          }

          .record-another-button {
            padding: 1rem 2.5rem;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 1rem auto 0;
            display: block;
          }

          .record-another-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          @media (max-width: 768px) {
            .rant-reflect-container {
              padding: 5rem 1rem 2rem;
            }

            .metadata {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
