"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordingModal({ isOpen, onClose }: RecordingModalProps) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetRecording = () => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Reset all states
    setIsRecording(false);
    setIsPaused(false);
    setIsProcessing(false);
    setIsAnalyzing(false);
    setIsSaving(false);
    setError("");
    setRecordingTime(0);
    
    // Clear refs
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetRecording();
    }
  }, [isOpen]);

  const startRecording = async () => {
    console.log("Start recording clicked!"); // Debug log
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processRecording(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
      console.error("Error accessing microphone:", err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });
      formData.append("audio", audioFile);

      const response = await fetch("/api/transcribe-simple", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Continue with emotion analysis and auto-save
        await analyzeEmotionsAndSave(data.text);
      } else {
        setError(data.message || "Transcription failed");
      }
    } catch (err) {
      setError("Failed to process recording. Please try again.");
      console.error("Error processing audio:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeEmotionsAndSave = async (text: string) => {
    setIsAnalyzing(true);
    setError("");

    try {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError("No valid session found");
        return;
      }

      // Step 1: Analyze emotions
      const analysisResponse = await fetch("/api/analyze-emotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text }),
      });

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        setError(analysisData.message || "Emotion analysis failed");
        return;
      }

      // Step 2: Auto-save session
      setIsSaving(true);

      const saveResponse = await fetch("/api/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          session_name: analysisData.session_name,
          transcript: text,
          emotions: analysisData.emotions.map((e: any) => ({
            emotion_id: e.emotion_id,
            intensity: e.intensity,
          })),
          advice: analysisData.advice,
        }),
      });

      const saveData = await saveResponse.json();

      if (saveResponse.ok) {
        // Success! Close modal and refresh page
        handleClose();
        window.location.reload();
      } else {
        setError(saveData.message || "Failed to save session");
      }
    } catch (err) {
      setError("Failed to process session. Please try again.");
      console.error("Error processing session:", err);
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    resetRecording();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="recording-modal"
          style={{
            background: "linear-gradient(135deg, rgba(15, 15, 25, 0.98), rgba(25, 25, 40, 0.98))",
            backdropFilter: "blur(25px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "48px",
            maxWidth: "520px",
            width: "100%",
            color: "white",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            animation: "slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)",
              opacity: 0.8,
            }}
          />
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px", position: "relative" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "12px",
                background: "linear-gradient(135deg, #ffd27f, #ff8c00, #ff6b6b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              ✨ Voice Reflection
            </div>
            <div style={{ 
              fontSize: "15px", 
              opacity: 0.8,
              fontWeight: "400",
              lineHeight: "1.4",
            }}>
              Record your thoughts and get instant transcription
            </div>
            {/* Subtle glow effect */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "60px",
                background: "radial-gradient(circle, rgba(255, 107, 107, 0.1), transparent)",
                borderRadius: "50%",
                zIndex: -1,
              }}
            />
          </div>

          {/* Recording Controls */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
              {!isRecording && !isProcessing && (
                <div style={{ position: "relative", zIndex: 1, pointerEvents: "auto" }}>
                  <button
                    onMouseDown={(e) => {
                      console.log("Button mouse down!"); // Debug log
                    }}
                    onMouseUp={(e) => {
                      console.log("Button mouse up!"); // Debug log
                    }}
                    onClick={(e) => {
                      console.log("Button clicked!"); // Debug log
                      e.preventDefault();
                      e.stopPropagation();
                      startRecording();
                    }}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                      border: "none",
                      color: "white",
                      fontSize: "32px",
                      cursor: "pointer",
                      boxShadow: "0 12px 30px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      position: "relative",
                      overflow: "hidden",
                      zIndex: 10,
                      pointerEvents: "auto",
                      userSelect: "none",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 16px 40px rgba(255, 107, 107, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    <div style={{ 
                      position: "absolute", 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0,
                      background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%)",
                    }} />
                    🎤
                  </button>
                </div>
              )}

              {isRecording && (
                <div>
                  <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
                    {/* Pause/Resume Button */}
                    <button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: isPaused 
                          ? "linear-gradient(135deg, #ff9800, #f57c00)" 
                          : "linear-gradient(135deg, #2196f3, #1976d2)",
                        border: "none",
                        color: "white",
                        fontSize: "24px",
                        cursor: "pointer",
                        boxShadow: isPaused 
                          ? "0 10px 25px rgba(255, 152, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)" 
                          : "0 10px 25px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = isPaused 
                          ? "0 14px 35px rgba(255, 152, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)" 
                          : "0 14px 35px rgba(33, 150, 243, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = isPaused 
                          ? "0 10px 25px rgba(255, 152, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)" 
                          : "0 10px 25px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                      }}
                    >
                      <div style={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 50%)",
                      }} />
                      {isPaused ? "▶️" : "⏸️"}
                    </button>

                    {/* Stop Button */}
                    <button
                      onClick={stopRecording}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4caf50, #45a049)",
                        border: "none",
                        color: "white",
                        fontSize: "24px",
                        cursor: "pointer",
                        boxShadow: "0 10px 25px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 14px 35px rgba(76, 175, 80, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                      }}
                    >
                      <div style={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 50%)",
                      }} />
                      ⏹️
                    </button>
                  </div>
                  
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: isPaused ? "#ff9800" : "#ff6b6b",
                      marginBottom: "8px",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {isPaused ? "⏸️ Paused" : "🔴 Recording"}: {formatTime(recordingTime)}
                  </div>
                  <div style={{ 
                    fontSize: "13px", 
                    opacity: 0.8, 
                    fontWeight: "400",
                    lineHeight: "1.4",
                  }}>
                    {isPaused ? "Click play to resume recording" : "Click pause to pause or stop to finish"}
                  </div>
                </div>
              )}

              {(isProcessing || isAnalyzing || isSaving) && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: isSaving 
                          ? "linear-gradient(135deg, #96CEB4, #85C1A3)" 
                          : isAnalyzing 
                          ? "linear-gradient(135deg, #4ecdc4, #45b7d1)" 
                          : "linear-gradient(135deg, #ffd700, #ff8c00)",
                        border: "none",
                        color: "white",
                        fontSize: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        animation: "spin 1.5s linear infinite",
                        boxShadow: isSaving 
                          ? "0 12px 30px rgba(150, 206, 180, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                          : isAnalyzing 
                          ? "0 12px 30px rgba(78, 205, 196, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                          : "0 12px 30px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%)",
                      }} />
                      {isSaving ? "💾" : isAnalyzing ? "🧠" : "⏳"}
                    </div>
                    {/* Processing rings */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        left: "-8px",
                        right: "-8px",
                        bottom: "-8px",
                        border: `2px solid ${isSaving ? 'rgba(150, 206, 180, 0.3)' : isAnalyzing ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 215, 0, 0.3)'}`,
                        borderRadius: "50%",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "-16px",
                        left: "-16px",
                        right: "-16px",
                        bottom: "-16px",
                        border: `1px solid ${isSaving ? 'rgba(150, 206, 180, 0.2)' : isAnalyzing ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 215, 0, 0.2)'}`,
                        borderRadius: "50%",
                        animation: "pulse 1.5s ease-in-out infinite 0.5s",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: isSaving ? "#96CEB4" : isAnalyzing ? "#4ecdc4" : "#ffd700",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {isSaving ? "💾 Saving..." : isAnalyzing ? "🧠 Analyzing..." : "✨ Processing..."}
                  </div>
                  <div style={{ 
                    fontSize: "13px", 
                    opacity: 0.8, 
                    marginTop: "6px",
                    fontWeight: "400",
                    lineHeight: "1.4",
                  }}>
                    {isSaving ? "Saving session to database" : isAnalyzing ? "Analyzing emotions with AI" : "Transcribing your speech with AI"}
                  </div>
                </div>
              )}
            </div>


          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.05))",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "24px",
                color: "#f44336",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "inset 0 2px 4px rgba(244, 67, 54, 0.1)",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
            <button
              onClick={handleClose}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 50%)",
              }} />
              Close
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations & Responsive */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        /* Custom scrollbar for transcription */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(78, 205, 196, 0.5);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(78, 205, 196, 0.7);
        }

        @media (max-width: 600px) {
          .recording-modal {
            position: fixed !important;
            inset: 0 !important;
            max-width: 100% !important;
            width: 100vw !important;
            height: 100svh !important;
            height: 100dvh !important; /* fallback */
            height: 100vh !important; /* fallback */
            max-height: 100svh !important;
            margin: 0 !important;
            padding: 24px !important;
            border-radius: 0;
            box-sizing: border-box !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            padding-top: calc(1rem + env(safe-area-inset-top)) !important;
            padding-bottom: calc(1rem + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </>
  );
}
