"use client";

import { useState, useRef } from "react";

interface RecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

export default function Recorder({ onRecordingComplete, isProcessing }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
      padding: "2rem",
      background: "rgba(0, 0, 0, 0.4)",
      borderRadius: "20px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
    }}>
      {/* Recording Timer */}
      {isRecording && (
        <div style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "#ff6b6b",
          fontFamily: "monospace",
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: isRecording ? "4px solid #ff6b6b" : "4px solid #4CAF50",
          background: isRecording 
            ? "linear-gradient(135deg, #ff6b6b, #ff4757)" 
            : "linear-gradient(135deg, #4CAF50, #45a049)",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "700",
          cursor: isProcessing ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: isRecording 
            ? "0 0 30px rgba(255, 107, 107, 0.6)" 
            : "0 0 30px rgba(76, 175, 80, 0.6)",
          opacity: isProcessing ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.currentTarget.style.transform = "scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isProcessing ? "⏳" : isRecording ? "⏹ STOP" : "🎤 START"}
      </button>

      {/* Instruction Text */}
      <p style={{
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "1rem",
        textAlign: "center",
        maxWidth: "300px",
        margin: 0,
      }}>
        {isRecording 
          ? "Recording... Click stop when you're done" 
          : isProcessing 
          ? "Processing your recording..." 
          : "Click to start recording your thoughts"}
      </p>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
