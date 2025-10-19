/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  Stars,
  Text,
  Line,
  Environment,
  Bvh,
  Billboard,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, useState, useEffect } from "react";
import * as React from "react";
import type { DayData, Session, Emotion } from "../constants/today";
import RecordingModal from "./RecordingModal";

type Props = { data: DayData; headline: string };

export default function SolarScene({ data, headline }: Props) {
  const [contextLost, setContextLost] = useState(false);
  const [key, setKey] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState<Session | null>(null);
  const [sunModalOpen, setSunModalOpen] = useState(false);
  const [isClosingPlanetModal, setIsClosingPlanetModal] = useState(false);
  const [isClosingSunModal, setIsClosingSunModal] = useState(false);
  const [returnToSunModal, setReturnToSunModal] = useState(false);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [sunHovered, setSunHovered] = useState(false);
  const [initialCameraPosition, setInitialCameraPosition] =
    useState<THREE.Vector3 | null>(null);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsClosingPlanetModal(true);
    setHoveredSession(null); // Reset highlighting when closing planet modal
    setHoveredPlanet(null); // Reset planet hover when closing planet modal
    setSunHovered(false); // Reset sun hover state when closing planet modal
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setSelectedPlanet(null);
      setIsClosingPlanetModal(false);

      // If we came from sun modal, return to it
      if (returnToSunModal) {
        setReturnToSunModal(false);
        setSunModalOpen(true);
      }
    }, 300); // Match animation duration
  };

  const handleCloseSunModal = () => {
    setIsClosingSunModal(true);
    setHoveredSession(null); // Reset highlighting when closing sun modal
    setHoveredPlanet(null); // Reset planet hover when closing sun modal
    setSunHovered(false); // Reset sun hover state when closing sun modal
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setSunModalOpen(false);
      setIsClosingSunModal(false);
    }, 300); // Match animation duration
  };

  const handleContextLost = () => {
    console.warn("WebGL context lost, attempting to restore...");
    setContextLost(true);
  };

  const handleContextRestored = () => {
    console.log("WebGL context restored");
    setContextLost(false);
    setKey((prev) => prev + 1); // Force re-render
  };

  if (contextLost) {
    return (
      <div
        style={{
          height: "100dvh",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, marginBottom: 16 }}>
            WebGL Context Lost
          </div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            Attempting to restore...
          </div>
          <button
            onClick={() => {
              setContextLost(false);
              setKey((prev) => prev + 1);
            }}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
      `}</style>

      {/* Enhanced HUD / overlay */}
      <div
        style={{
          position: "fixed",
          left: "24px",
          top: "104px", // Adjusted to account for navbar height (80px) + some spacing
          color: "white",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          zIndex: 10,
          userSelect: "none",
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            opacity: 0.9,
            fontSize: "11px",
            letterSpacing: "2px",
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: "8px",
            color: "#ffd27f",
          }}
        >
          Solar Sessions
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "12px",
            background: "linear-gradient(135deg, #ffffff, #ffd27f)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: "12px",
            opacity: 0.8,
            fontSize: "13px",
            lineHeight: "1.5",
            maxWidth: "280px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <span style={{ color: "#4ecdc4", fontWeight: 600 }}>Hover</span>{" "}
            planets for details
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ color: "#ff6b6b", fontWeight: 600 }}>Click</span>{" "}
            planets to focus & analyze
          </div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ color: "#ffd27f", fontWeight: 600 }}>Click</span> sun
            for day analysis
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, fontStyle: "italic" }}>
            Planets pause for 5s after hover
          </div>
        </div>
      </div>

      {/* Floating Plus Button for Adding Sessions */}
      <div
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 20,
          userSelect: "none",
        }}
      >
        <button
          onClick={() => setIsRecordingModalOpen(true)}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            fontSize: "28px",
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 107, 107, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
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
          +
        </button>
      </div>

      {/* Enhanced Planet Details Modal */}
      {(selectedPlanet || isClosingPlanetModal) && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: "80px", // Account for navbar height
            width: "420px",
            height: "calc(100vh - 80px)", // Account for navbar height
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 30, 0.95))",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 999,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "white",
            overflowY: "auto",
            boxShadow: "-20px 0 40px rgba(0, 0, 0, 0.5)",
            animation: isClosingPlanetModal
              ? "slideOutRight 0.3s ease-in"
              : "slideInRight 0.3s ease-out",
          }}
        >
          {/* Enhanced Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              paddingBottom: "20px",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${
                    selectedPlanet?.color || "#cccccc"
                  }, ${selectedPlanet?.color || "#cccccc"}80)`,
                  boxShadow: `0 0 20px ${selectedPlanet?.color || "#cccccc"}40`,
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${
                    selectedPlanet?.color || "#cccccc"
                  }, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {selectedPlanet?.name || ""}
              </h2>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleCloseModal}
                disabled={isClosingPlanetModal}
                style={{
                  background: isClosingPlanetModal
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: isClosingPlanetModal
                    ? "rgba(255, 255, 255, 0.5)"
                    : "white",
                  padding: "12px 16px",
                  cursor: isClosingPlanetModal ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  overflow: "hidden",
                  opacity: isClosingPlanetModal ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isClosingPlanetModal) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(255, 255, 255, 0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isClosingPlanetModal) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <span>✕</span>
                <span>
                  {isClosingPlanetModal ? "Closing..." : "Exit & Zoom Out"}
                </span>
              </button>
            </div>
          </div>

          {/* Enhanced Emotions List */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: 600,
                opacity: 0.9,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "20px",
                  background: `linear-gradient(to bottom, ${
                    selectedPlanet?.color || "#cccccc"
                  }, transparent)`,
                  borderRadius: "2px",
                }}
              />
              Emotional Composition
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Positive Emotions */}
              {selectedPlanet?.emotions.positive.map((emotion, index) => (
                <div
                  key={`positive-${emotion.name}`}
                  style={{
                    background: "rgba(76, 175, 80, 0.05)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "rgba(76, 175, 80, 0.15)";
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 12px 30px ${emotion.color}30`;
                    e.currentTarget.style.borderColor =
                      "rgba(76, 175, 80, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "rgba(76, 175, 80, 0.05)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "rgba(76, 175, 80, 0.3)";
                  }}
                  onClick={() => {
                    // Add click interaction - could show more details or trigger animation
                    console.log(`Clicked on positive emotion: ${emotion.name}`);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${
                          emotion.color || "#4caf50"
                        }, ${emotion.color || "#4caf50"}80)`,
                        boxShadow: `0 0 15px ${emotion.color || "#4caf50"}40`,
                        position: "relative",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        {emotion.name} ✨
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.7,
                          fontStyle: "italic",
                          color: "#4caf50",
                        }}
                      >
                        Positive emotion
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: emotion.color || "#4caf50",
                      textShadow: `0 0 10px ${emotion.color || "#4caf50"}40`,
                    }}
                  >
                    {Math.round(emotion.intensity * 100)}%
                  </div>
                </div>
              ))}

              {/* Negative Emotions */}
              {selectedPlanet?.emotions.negative.map((emotion, index) => (
                <div
                  key={`negative-${emotion.name}`}
                  style={{
                    background: "rgba(244, 67, 54, 0.05)",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    borderRadius: "16px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    animation: `fadeInUp 0.4s ease-out ${
                      (selectedPlanet?.emotions.positive.length || 0) * 0.05 +
                      index * 0.05
                    }s both`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "rgba(244, 67, 54, 0.15)";
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 12px 30px ${emotion.color}30`;
                    e.currentTarget.style.borderColor =
                      "rgba(244, 67, 54, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "rgba(244, 67, 54, 0.05)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor =
                      "rgba(244, 67, 54, 0.3)";
                  }}
                  onClick={() => {
                    // Add click interaction - could show more details or trigger animation
                    console.log(`Clicked on negative emotion: ${emotion.name}`);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${
                          emotion.color || "#f44336"
                        }, ${emotion.color || "#f44336"}80)`,
                        boxShadow: `0 0 15px ${emotion.color || "#f44336"}40`,
                        position: "relative",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        {emotion.name} ⚠️
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.7,
                          fontStyle: "italic",
                          color: "#f44336",
                        }}
                      >
                        Negative emotion
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: emotion.color || "#f44336",
                      textShadow: `0 0 10px ${emotion.color || "#f44336"}40`,
                    }}
                  >
                    {Math.round(emotion.intensity * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Analytics */}
          <div style={{ marginTop: "32px", marginBottom: "24px" }}>
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: 600,
                opacity: 0.9,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "18px",
                  background: `linear-gradient(to bottom, ${
                    selectedPlanet?.color || "#cccccc"
                  }, transparent)`,
                  borderRadius: "2px",
                }}
              />
              Session Analytics
            </h3>

            {/* Emotional Balance Score */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: selectedPlanet?.color || "#cccccc",
                }}
              >
                Emotional Balance Score
              </div>
              {selectedPlanet &&
                (() => {
                  const positiveTotal = selectedPlanet.emotions.positive.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const negativeTotal = selectedPlanet.emotions.negative.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const balanceScore = Math.round(
                    (positiveTotal - negativeTotal) * 100
                  );
                  const scoreColor =
                    balanceScore > 50
                      ? "#4caf50"
                      : balanceScore > 0
                      ? "#ff9800"
                      : "#f44336";
                  const scoreLabel =
                    balanceScore > 50
                      ? "Excellent"
                      : balanceScore > 0
                      ? "Good"
                      : balanceScore > -30
                      ? "Needs Attention"
                      : "Critical";

                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "13px", opacity: 0.8 }}>
                        {scoreLabel}
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: scoreColor,
                          textShadow: `0 0 10px ${scoreColor}40`,
                        }}
                      >
                        {balanceScore > 0 ? "+" : ""}
                        {balanceScore}
                      </div>
                    </div>
                  );
                })()}
            </div>

            {/* Emotion Distribution */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: selectedPlanet?.color || "#cccccc",
                }}
              >
                Emotion Distribution
              </div>
              {selectedPlanet &&
                (() => {
                  const positiveTotal = selectedPlanet.emotions.positive.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const negativeTotal = selectedPlanet.emotions.negative.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const positivePercent = Math.round(positiveTotal * 100);
                  const negativePercent = Math.round(negativeTotal * 100);

                  return (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "#4caf50" }}>
                          Positive
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>
                          {positivePercent}%
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "rgba(76, 175, 80, 0.2)",
                          borderRadius: "3px",
                          overflow: "hidden",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: `${positivePercent}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #4caf50, #66bb6a)",
                            borderRadius: "3px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "#f44336" }}>
                          Negative
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>
                          {negativePercent}%
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "rgba(244, 67, 54, 0.2)",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${negativePercent}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, #f44336, #ef5350)",
                            borderRadius: "3px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
            </div>

            {/* Dominant Emotion Analysis */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "12px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: selectedPlanet?.color || "#cccccc",
                }}
              >
                Dominant Emotion Analysis
              </div>
              {selectedPlanet &&
                (() => {
                  const allEmotions = [
                    ...selectedPlanet.emotions.positive,
                    ...selectedPlanet.emotions.negative,
                  ];
                  const dominantEmotion = allEmotions.reduce((prev, current) =>
                    prev.intensity > current.intensity ? prev : current
                  );
                  const isPositive =
                    selectedPlanet.emotions.positive.includes(dominantEmotion);

                  return (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: isPositive ? "#4caf50" : "#f44336",
                          }}
                        />
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>
                          {dominantEmotion.name}
                        </div>
                        <div style={{ fontSize: "12px", opacity: 0.7 }}>
                          ({Math.round(dominantEmotion.intensity * 100)}%)
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.6,
                          lineHeight: "1.4",
                        }}
                      >
                        {isPositive
                          ? "This positive emotion is driving your overall mood in this session."
                          : "This negative emotion is the primary challenge affecting this session."}
                      </div>
                    </div>
                  );
                })()}
            </div>
          </div>

          {/* Session Transcript */}
          {selectedPlanet?.transcript && (
            <div style={{ marginTop: "32px", marginBottom: "24px" }}>
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  opacity: 0.9,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    width: "3px",
                    height: "18px",
                    background: `linear-gradient(to bottom, ${
                      selectedPlanet?.color || "#cccccc"
                    }, transparent)`,
                    borderRadius: "2px",
                  }}
                />
                Session Transcript
              </h3>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#ffffff",
                    opacity: 0.9,
                    fontStyle: "italic",
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  "{selectedPlanet.transcript}"
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                opacity: 0.8,
                textAlign: "center",
                fontWeight: 600,
                background: `linear-gradient(135deg, ${
                  selectedPlanet?.color || "#cccccc"
                }, #ffffff)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Total Emotional Load:{" "}
              {Math.round(
                ((selectedPlanet?.emotions.positive.reduce(
                  (sum, e) => sum + e.intensity,
                  0
                ) || 0) +
                  (selectedPlanet?.emotions.negative.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  ) || 0)) *
                  100
              )}
              %
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Sun Analysis Modal */}
      {(sunModalOpen || isClosingSunModal) && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: "80px", // Account for navbar height
            width: "450px",
            height: "calc(100vh - 80px)", // Account for navbar height
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 20, 0, 0.95))",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 999,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "white",
            overflowY: "auto",
            boxShadow: "-20px 0 40px rgba(0, 0, 0, 0.5)",
            animation: isClosingSunModal
              ? "slideOutRight 0.3s ease-in"
              : "slideInRight 0.3s ease-out",
          }}
        >
          {/* Enhanced Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              paddingBottom: "20px",
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ffd27f, #ffdf80)",
                  boxShadow: "0 0 20px #ffd27f40",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ffd27f, #ffffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {data.date} - Day Analysis
              </h2>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleCloseSunModal}
                disabled={isClosingSunModal}
                style={{
                  background: isClosingSunModal
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: isClosingSunModal
                    ? "rgba(255, 255, 255, 0.5)"
                    : "white",
                  padding: "12px 16px",
                  cursor: isClosingSunModal ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: isClosingSunModal ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isClosingSunModal) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isClosingSunModal) {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <span>✕</span>
                <span>{isClosingSunModal ? "Closing..." : "Close"}</span>
              </button>
            </div>
          </div>

          {/* Enhanced Emotional Balance Analysis */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: 600,
                opacity: 0.9,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "20px",
                  background:
                    "linear-gradient(to bottom, #ffd27f, transparent)",
                  borderRadius: "2px",
                }}
              />
              Emotional Balance Analysis
            </h3>

            {/* Positive vs Negative Balance Chart */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "20px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  marginBottom: "24px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: "#ffd27f",
                }}
              >
                Positive vs Negative Emotion Distribution
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  height: "140px",
                  padding: "0 8px",
                }}
              >
                {data.sessions.map((session, index) => {
                  const positiveTotal = session.emotions.positive.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const negativeTotal = session.emotions.negative.reduce(
                    (sum, e) => sum + e.intensity,
                    0
                  );
                  const positiveHeight = Math.max(20, positiveTotal * 100);
                  const negativeHeight = Math.max(20, negativeTotal * 100);

                  return (
                    <div
                      key={session.name}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        animation: `fadeInUp 0.5s ease-out ${
                          index * 0.2
                        }s both`,
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {/* Positive emotions bar */}
                      <div
                        style={{
                          width: "16px",
                          height: `${positiveHeight}px`,
                          background:
                            "linear-gradient(to top, #4caf50, #66bb6a)",
                          borderRadius: "8px 8px 0 0",
                          marginBottom: "2px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                          position: "relative",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scaleY(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(76, 175, 80, 0.5)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scaleY(1)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(76, 175, 80, 0.3)";
                        }}
                      />
                      {/* Negative emotions bar */}
                      <div
                        style={{
                          width: "16px",
                          height: `${negativeHeight}px`,
                          background:
                            "linear-gradient(to top, #f44336, #ef5350)",
                          borderRadius: "0 0 8px 8px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(244, 67, 54, 0.3)",
                          position: "relative",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scaleY(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(244, 67, 54, 0.5)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scaleY(1)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(244, 67, 54, 0.3)";
                        }}
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          textAlign: "center",
                          marginTop: "12px",
                          marginBottom: "6px",
                        }}
                      >
                        {session.name}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          opacity: 0.6,
                          textAlign: "center",
                        }}
                      >
                        {Math.round(positiveTotal * 100)}%+ /{" "}
                        {Math.round(negativeTotal * 100)}%-
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emotional Well-being Score */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "20px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: "#ffd27f",
                }}
              >
                Overall Emotional Well-being Score
              </div>
              {data.sessions.map((session, index) => {
                const positiveTotal = session.emotions.positive.reduce(
                  (sum, e) => sum + e.intensity,
                  0
                );
                const negativeTotal = session.emotions.negative.reduce(
                  (sum, e) => sum + e.intensity,
                  0
                );
                const wellBeingScore = Math.round(
                  (positiveTotal - negativeTotal) * 100
                );
                const scoreColor =
                  wellBeingScore > 50
                    ? "#4caf50"
                    : wellBeingScore > 0
                    ? "#ff9800"
                    : "#f44336";

                return (
                  <div
                    key={session.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      padding: "12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      borderRadius: "8px",
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {session.name}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: scoreColor,
                        textShadow: `0 0 10px ${scoreColor}40`,
                      }}
                    >
                      {wellBeingScore > 0 ? "+" : ""}
                      {wellBeingScore}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Emotion Categories Analysis */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  opacity: 0.9,
                  fontWeight: 600,
                  color: "#4ecdc4",
                }}
              >
                Emotion Categories by Session
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {data.sessions.map((session, index) => (
                  <div
                    key={session.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.03)",
                      transition: "all 0.3s ease",
                      animation: `fadeInLeft 0.4s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${
                          session.color || "#cccccc"
                        }, ${session.color || "#cccccc"}80)`,
                        boxShadow: `0 0 10px ${session.color || "#cccccc"}40`,
                      }}
                    />
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        minWidth: "90px",
                        color: session.color || "#cccccc",
                      }}
                    >
                      {session.name}:
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.8,
                        flex: 1,
                        lineHeight: "1.4",
                      }}
                    >
                      {[
                        ...session.emotions.positive,
                        ...session.emotions.negative,
                      ]
                        .map((e) => e.name)
                        .join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session Breakdown */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: 500,
                opacity: 0.9,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Detailed Session Analysis
              <span
                style={{
                  fontSize: "12px",
                  opacity: 0.6,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                (Click to focus)
              </span>
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {data.sessions.map((session, index) => {
                const allEmotions = [
                  ...session.emotions.positive,
                  ...session.emotions.negative,
                ];
                const dominantEmotion = allEmotions.reduce((prev, current) =>
                  prev.intensity > current.intensity ? prev : current
                );
                const emotionDiversity = allEmotions.length;
                const intensityVariance =
                  Math.max(...allEmotions.map((e) => e.intensity)) -
                  Math.min(...allEmotions.map((e) => e.intensity));

                return (
                  <div
                    key={session.name}
                    style={{
                      background:
                        hoveredSession === session.name ||
                        hoveredPlanet === session.name
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(255, 255, 255, 0.05)",
                      border:
                        hoveredSession === session.name ||
                        hoveredPlanet === session.name
                          ? `1px solid ${session.color || "#cccccc"}40`
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "16px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                      transform:
                        hoveredSession === session.name ||
                        hoveredPlanet === session.name
                          ? "translateY(-2px)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredSession === session.name ||
                        hoveredPlanet === session.name
                          ? `0 8px 25px ${session.color || "#cccccc"}20`
                          : "none",
                    }}
                    onClick={() => {
                      // Close sun modal and switch to planet tracking
                      setSunModalOpen(false);
                      setSelectedPlanet(session);
                      setReturnToSunModal(true); // Mark that we should return to sun modal
                      // Focus will be handled by the planet selection
                    }}
                    onMouseOver={(e) => {
                      // Only apply hover effects if not already hovered by planet interaction
                      if (hoveredPlanet !== session.name) {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.border = `1px solid ${
                          session.color || "#cccccc"
                        }40`;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = `0 8px 25px ${
                          session.color || "#cccccc"
                        }20`;
                      }
                      setHoveredSession(session.name);
                    }}
                    onMouseOut={(e) => {
                      // Only reset hover effects if not being hovered by planet interaction
                      if (hoveredPlanet !== session.name) {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.border =
                          "1px solid rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                      setHoveredSession(null);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: session.color || "#cccccc",
                          }}
                        />
                        <span style={{ fontSize: "16px", fontWeight: 500 }}>
                          {session.name}
                        </span>
                      </div>
                      {/* <div style={{
                         fontSize: "14px",
                         fontWeight: 600,
                         color: session.color || "#cccccc"
                       }}>
                         {Math.round(session.emotions.reduce((sum, e) => sum + e.intensity, 0) * 100)}%
                       </div> */}
                    </div>

                    {/* Session Insights */}
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: 0.7,
                        marginBottom: "8px",
                        marginLeft: "24px",
                      }}
                    >
                      <div style={{ marginBottom: "2px" }}>
                        <strong>Dominant:</strong> {dominantEmotion.name} (
                        {Math.round(dominantEmotion.intensity * 100)}%)
                      </div>
                      <div style={{ marginBottom: "2px" }}>
                        <strong>Diversity:</strong> {emotionDiversity} emotions
                      </div>
                      <div>
                        <strong>Variance:</strong>{" "}
                        {Math.round(intensityVariance * 100)}% range
                      </div>
                    </div>

                    {/* Emotion Bars */}
                    <div style={{ marginLeft: "24px" }}>
                      {[
                        ...session.emotions.positive,
                        ...session.emotions.negative,
                      ].map((emotion) => (
                        <div key={emotion.name} style={{ marginBottom: "4px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "10px",
                              marginBottom: "2px",
                            }}
                          >
                            <span>{emotion.name}</span>
                            <span>{Math.round(emotion.intensity * 100)}%</span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "4px",
                              background: "rgba(255, 255, 255, 0.1)",
                              borderRadius: "2px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${emotion.intensity * 100}%`,
                                height: "100%",
                                background: emotion.color || "#cccccc",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.7, textAlign: "center" }}
            >
              Emotion Flow Analysis
            </div>
          </div>
        </div>
      )}

      <Canvas
        key={key}
        gl={{
          antialias: false,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
          alpha: false,
        }}
        camera={{ position: [0, 8, 24], fov: 40, near: 0.1, far: 2000 }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            handleContextLost();
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            handleContextRestored();
          });
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 10, 2]} intensity={0.8} />
        <Environment preset="sunset" />
        <Stars radius={200} depth={50} factor={2} fade />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={4}
          maxDistance={80}
          zoomSpeed={0.5}
        />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <Bvh>
          <SolarSystem
            data={data}
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            sunModalOpen={sunModalOpen}
            setSunModalOpen={setSunModalOpen}
            returnToSunModal={returnToSunModal}
            setReturnToSunModal={setReturnToSunModal}
            onCameraReset={() => {
              // Reset camera to initial position
              if (initialCameraPosition) {
                // This will be handled in the SolarSystem component
              }
            }}
            hoveredSession={hoveredSession}
            setHoveredSession={setHoveredSession}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
            sunHovered={sunHovered}
            setSunHovered={setSunHovered}
          />
        </Bvh>
      </Canvas>

      {/* Recording Modal */}
      <RecordingModal 
        isOpen={isRecordingModalOpen} 
        onClose={() => setIsRecordingModalOpen(false)} 
      />
    </>
  );
}

function SolarSystem({
  data,
  selectedPlanet,
  setSelectedPlanet,
  sunModalOpen,
  setSunModalOpen,
  returnToSunModal,
  setReturnToSunModal,
  onCameraReset,
  hoveredSession,
  setHoveredSession,
  hoveredPlanet,
  setHoveredPlanet,
  sunHovered,
  setSunHovered,
}: {
  data: DayData;
  selectedPlanet: Session | null;
  setSelectedPlanet: (planet: Session | null) => void;
  sunModalOpen: boolean;
  setSunModalOpen: (open: boolean) => void;
  returnToSunModal: boolean;
  setReturnToSunModal: (returnTo: boolean) => void;
  onCameraReset: () => void;
  hoveredSession: string | null;
  setHoveredSession: (sessionId: string | null) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (planetId: string | null) => void;
  sunHovered: boolean;
  setSunHovered: (hovered: boolean) => void;
}) {
  const basePlanetRadius = 4; // first session orbit distance from sun
  const planetGap = 3.375; // gap between session orbits (increased by 50%)
  const moonBaseRadius = 0.7; // first moon orbit
  const moonGap = 0.35; // gap between moon orbits

  const [focused, setFocused] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocused(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-focus when selectedPlanet changes
  useEffect(() => {
    if (selectedPlanet) {
      setFocused(selectedPlanet.name);
    }
  }, [selectedPlanet]);

  // Smooth camera reset when modal is closed
  useEffect(() => {
    if (!selectedPlanet && focused) {
      // Smooth camera reset animation
      const startPosition = camera.position.clone();
      const targetPosition = new THREE.Vector3(0, 8, 24);
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds for smooth transition

      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        // Interpolate position
        camera.position.lerpVectors(
          startPosition,
          targetPosition,
          easeProgress
        );
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          // Animation complete
          camera.position.copy(targetPosition);
          camera.lookAt(0, 0, 0);
          setFocused(null);
        }
      };

      animateCamera();
    }
  }, [selectedPlanet, focused, camera]);

  const handlePlanetSelect = (session: Session) => {
    if (sunModalOpen) {
      // If sun modal is open, close it and switch to planet tracking (same as session card click)
      setSunModalOpen(false);
      setSelectedPlanet(session);
      setReturnToSunModal(true); // Mark that we should return to sun modal
    } else {
      // Normal planet selection behavior
      setSelectedPlanet(session);
      setReturnToSunModal(false); // Clear return flag when clicking planet directly
    }
    setFocused(session.name); // Set focused planet for camera tracking
    setIsPaused(false); // Ensure no planets are paused
  };

  return (
    <group>
      <Sun
        //  label={data.date}
        onClick={() => {
          setFocused(null);
          setHoveredSession(null); // Reset session hover when opening sun modal
          setHoveredPlanet(null); // Reset planet hover when opening sun modal
          setSunHovered(false); // Reset sun hover state when opening sun modal
          setSunModalOpen(true);
        }}
        onHover={(hovered) => {
          // Only trigger hover effects if sun modal is not open
          if (!sunModalOpen) {
            setIsPaused(hovered);
            setSunHovered(hovered);
          }
        }}
        sessions={data.sessions}
      />

      {/* Orbits */}
      {data.sessions.map((s, i) => {
        const r = basePlanetRadius + i * planetGap;
        return <OrbitRing key={`ring-${s.name}`} radius={r} />;
      })}

      {/* Planets */}
      {data.sessions.map((s, i) => {
        const r = basePlanetRadius + i * planetGap;
        return (
          <Planet
            key={s.name}
            session={s}
            radius={r}
            color={s.color ?? "#7aa2f7"}
            title={s.name}
            selected={selectedPlanet?.name === s.name}
            onSelect={() => handlePlanetSelect(s)}
            isPaused={isPaused}
            focusedPlanet={focused}
            sunHovered={sunHovered && !sunModalOpen}
            sunModalOpen={sunModalOpen}
            selectedPlanet={selectedPlanet}
            hoveredSession={hoveredSession}
            setHoveredSession={setHoveredSession}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
          >
            <MoonSystem
              emotions={[...s.emotions.positive, ...s.emotions.negative]}
              ringRadius={moonBaseRadius}
              ringGap={moonGap}
              visible={true}
              isPaused={isPaused}
              planetSelected={selectedPlanet?.name === s.name}
              planetHovered={hoveredSession === s.name}
              focusedPlanet={focused}
              sunHovered={sunHovered && !sunModalOpen}
              sunModalOpen={sunModalOpen}
              isHighlighted={hoveredSession === s.name}
            />
          </Planet>
        );
      })}
    </group>
  );
}

function Sun({
  label,
  onClick,
  onHover,
  sessions,
}: {
  label?: string;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  sessions: Session[];
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
  };

  return (
    <group
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh ref={mesh}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshStandardMaterial
          emissive={"#ffdf80"}
          emissiveIntensity={1.2}
          metalness={0.1}
          roughness={0.5}
          color={"#ffd27f"}
        />
      </mesh>
      <Billboard>
        {label && (
          <Text
            position={[0, 1.9, 0]}
            fontSize={0.35}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        )}
      </Billboard>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => circlePoints(radius), [radius]);
  return (
    <Line
      points={points}
      linewidth={1}
      transparent
      opacity={0.25}
      color="#ffffff"
    />
  );
}

function Planet({
  session,
  radius,
  color,
  title,
  selected,
  onSelect,
  isPaused,
  focusedPlanet,
  sunHovered,
  sunModalOpen,
  selectedPlanet,
  hoveredSession,
  setHoveredSession,
  hoveredPlanet,
  setHoveredPlanet,
  children,
}: {
  session: Session;
  radius: number;
  color: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
  isPaused: boolean;
  focusedPlanet: string | null;
  sunHovered: boolean;
  sunModalOpen: boolean;
  selectedPlanet: Session | null;
  hoveredSession: string | null;
  setHoveredSession: (sessionId: string | null) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (planetId: string | null) => void;
  children?: React.ReactNode;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [inGracePeriod, setInGracePeriod] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentAngleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const hoverEndTimeRef = useRef<number>(0);
  const gracePeriodTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Check if this planet should be highlighted from session card hover or planet hover
  const isHighlighted =
    hoveredSession === session.name || hoveredPlanet === session.name;
  const { camera, mouse, raycaster } = useThree();

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
    };
  }, []);

  // Initialize the angle and time
  useEffect(() => {
    // Start from a random angle for each planet
    currentAngleRef.current = Math.random() * Math.PI * 2;
    lastTimeRef.current = 0;
  }, []);

  // Clear timers when sun hover state changes
  useEffect(() => {
    if (sunHovered) {
      // Clear any existing timers when sun is hovered
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
      setHovered(false);
      setInGracePeriod(false);
    }
  }, [sunHovered]);

  useFrame(({ clock, camera }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const orbitSpeed =
      0.2 +
      (session.name === "morning"
        ? 0
        : session.name === "afternoon"
        ? 0.1
        : 0.2);

    // Continuous hover detection using raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(groupRef.current, true);
    const isMouseOver = intersects.length > 0;

    // Update hover state based on raycaster detection with grace period
    if (isMouseOver && !hovered) {
      // Allow hover if sun modal is open (for reverse highlighting) or if no modals are open
      if (sunModalOpen || (!sunModalOpen && !selectedPlanet)) {
        // Clear any existing timeouts when hovering
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        if (gracePeriodTimeoutRef.current) {
          clearTimeout(gracePeriodTimeoutRef.current);
        }
        setHovered(true);
        setInGracePeriod(false); // Reset grace period when hovering

        // If sun modal is open, trigger session card highlighting
        if (sunModalOpen) {
          setHoveredPlanet(session.name);
        }
      }
    } else if (sunHovered && (hovered || inGracePeriod)) {
      // If sun is hovered, immediately clear all planet timers and states
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
      setHovered(false);
      setInGracePeriod(false);
    } else if (!isMouseOver && hovered && !sunHovered && !selectedPlanet) {
      // When hover ends, start grace period timer (only if sun is not hovered and no planet is selected)
      // Grace period behavior differs based on whether sun modal is open
      hoverEndTimeRef.current = time;

      if (sunModalOpen) {
        // When sun modal is open, immediately clear hover (no grace period for reverse highlighting)
        hoverTimeoutRef.current = setTimeout(() => {
          setHovered(false);
          setInGracePeriod(false);
          // Clear session card highlighting
          setHoveredPlanet(null);
        }, 50);
      } else {
        // Normal grace period behavior when sun modal is not open
        hoverTimeoutRef.current = setTimeout(() => {
          setHovered(false);
          setInGracePeriod(true); // Enter grace period
          // Start 5-second grace period timer
          gracePeriodTimeoutRef.current = setTimeout(() => {
            setInGracePeriod(false); // Grace period ended
          }, 5000);
        }, 50);
      }
    } else if (!isMouseOver && hovered && sunHovered) {
      // If sun is hovered, immediately clear hover state without grace period
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
      setHovered(false);
      setInGracePeriod(false);

      // If sun modal is open, clear session card highlighting
      if (sunModalOpen) {
        setHoveredPlanet(null);
      }
    }

    // Check if we should be moving - planets move when sun modal is open (for hoverability)
    const shouldMove =
      (!isPaused || selected || focusedPlanet) &&
      !hovered &&
      !inGracePeriod &&
      !sunHovered;

    if (shouldMove) {
      if (isPausedRef.current) {
        // We were paused, resume from current angle
        isPausedRef.current = false;
        lastTimeRef.current = time; // Reset time reference
      }

      // Calculate angle incrementally based on time delta
      const deltaTime = time - lastTimeRef.current;
      currentAngleRef.current += deltaTime * orbitSpeed;
      lastTimeRef.current = time;

      const x = Math.cos(currentAngleRef.current) * radius;
      const z = Math.sin(currentAngleRef.current) * radius;
      groupRef.current.position.set(x, 0, z);
    } else if (!isPausedRef.current) {
      // Just got paused, store current time
      lastTimeRef.current = time;
      isPausedRef.current = true;
    }

    // Planet rotation - stop if hovered
    if (ref.current && !hovered) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    }

    // Enhanced camera focus - smooth tracking of selected planet
    if (selected) {
      const currentPos = groupRef.current.position;
      const target = new THREE.Vector3(currentPos.x, 1.5, currentPos.z + 4.5);
      // Smoother interpolation for better visual experience
      camera.position.lerp(target, 0.08);
      camera.lookAt(currentPos.x, 0, currentPos.z);
    }
  });

  const scale = selected ? 1.25 : isHighlighted ? 1.15 : 1; // Scale selected planet for visual feedback

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHovered(true);
  };

  const handlePointerOut = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(false);
    }, 50); // Shorter delay for more responsive interaction
  };

  return (
    <group ref={groupRef}>
      {/* Invisible hit area for easier hovering - smaller to not occlude moons */}
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        scale={scale}
      >
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visible planet */}
      <mesh ref={ref} scale={scale} renderOrder={0}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={0.25}
          roughness={0.6}
          depthWrite={false}
          emissive={isHighlighted ? color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </mesh>

      {/* Enhanced planet tooltip */}
      {((hovered && !selected) || (sunHovered && !sunModalOpen)) &&
        !selectedPlanet &&
        !sunModalOpen && (
          <Html distanceFactor={10} transform sprite>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(10px)",
                padding: "16px 20px",
                borderRadius: "12px",
                border: `2px solid ${color}40`,
                color: "white",
                fontSize: "14px",
                whiteSpace: "nowrap",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontWeight: 600,
                boxShadow: `0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px ${color}20`,
                animation: "fadeInUp 0.3s ease-out",
                maxWidth: "250px",
                minWidth: "150px",
              }}
            >
              <div
                style={{
                  color: color,
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
                {title}
              </div>
              <div
                style={{ fontSize: "12px", opacity: 0.8, lineHeight: "1.4" }}
              >
                {[
                  ...session.emotions.positive,
                  ...session.emotions.negative,
                ].map((emotion) => (
                  <div
                    key={emotion.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ color: emotion.color || "#cccccc" }}>
                      {emotion.name}:
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {Math.round(emotion.intensity * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Html>
        )}

      {React.cloneElement(children as React.ReactElement<any>, {
        planetHovered: hovered,
        sunHovered: sunHovered,
      })}
    </group>
  );
}

function MoonSystem({
  emotions,
  ringRadius,
  ringGap,
  visible,
  isPaused,
  planetSelected,
  planetHovered,
  focusedPlanet,
  sunHovered,
  sunModalOpen,
  isHighlighted,
}: {
  emotions: Emotion[];
  ringRadius: number;
  ringGap: number;
  visible: boolean;
  isPaused: boolean;
  planetSelected: boolean;
  planetHovered?: boolean;
  focusedPlanet: string | null;
  sunHovered: boolean;
  sunModalOpen: boolean;
  isHighlighted: boolean;
}) {
  const items = useMemo(() => {
    const angleStep = (Math.PI * 2) / Math.max(1, emotions.length);
    return emotions.map((e, i) => {
      const radius = ringRadius + i * ringGap;
      const angle = i * angleStep + i * 0.4;
      const size = THREE.MathUtils.lerp(0.08, 0.35, e.intensity);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return {
        ...e,
        radius,
        angle,
        size,
        pos: [x, 0, z] as [number, number, number],
      };
    });
  }, [emotions, ringGap, ringRadius]);

  const group = useRef<THREE.Group>(null);
  const [moonHovered, setMoonHovered] = useState(false);
  const moonHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (moonHoverTimeoutRef.current) {
        clearTimeout(moonHoverTimeoutRef.current);
      }
    };
  }, []);

  useFrame(({ clock }) => {
    if (group.current) {
      // Always rotate moons - never suspend moon movement
      group.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
  });

  // Always show moons now, but with different opacity based on selection, sun hover, or highlighting
  const opacity =
    planetSelected || (sunHovered && !sunModalOpen) || isHighlighted ? 1 : 0.6;

  const handleMoonPointerOver = (e: any) => {
    e.stopPropagation();
    if (moonHoverTimeoutRef.current) {
      clearTimeout(moonHoverTimeoutRef.current);
    }
    setMoonHovered(true);
  };

  const handleMoonPointerOut = () => {
    moonHoverTimeoutRef.current = setTimeout(() => {
      setMoonHovered(false);
    }, 50); // Shorter delay for more responsive interaction
  };

  return (
    <group ref={group}>
      {items.length > 0 && (
        <Line
          points={circlePoints(items[items.length - 1].radius)}
          linewidth={1}
          transparent
          opacity={
            planetSelected || (sunHovered && !sunModalOpen) || isHighlighted
              ? 0.3
              : 0.1
          }
          color="#ffffff"
          renderOrder={-1}
        />
      )}
      {items.map((m) => (
        <group key={m.name} position={m.pos}>
          <mesh
            onPointerOver={handleMoonPointerOver}
            onPointerOut={handleMoonPointerOut}
            renderOrder={10}
          >
            <sphereGeometry args={[m.size, 16, 16]} />
            <meshStandardMaterial
              color={m.color ?? "#cccccc"}
              transparent
              opacity={opacity}
              depthWrite={false}
              depthTest={false}
              alphaTest={0.1}
              emissive={isHighlighted ? m.color ?? "#cccccc" : "#000000"}
              emissiveIntensity={isHighlighted ? 0.2 : 0}
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function circlePoints(radius: number) {
  const segs = 64;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
  }
  return pts;
}
