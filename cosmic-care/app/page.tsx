"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("../components/SpaceBackground"), {
  ssr: false,
  loading: () => (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)"
    }} />
  ),
});

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        height: "100dvh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        <div style={{ fontSize: "18px", opacity: 0.7 }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SpaceBackground />
      <div style={{
        minHeight: "100vh",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        paddingTop: "80px", // Account for fixed navbar
        background: "transparent"
      }}>

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "2rem",
        textAlign: "center"
      }}>
        {/* Logo/Title */}
        <div style={{
          marginBottom: "3rem",
          animation: "fadeInUp 1s ease-out"
        }}>
          <h1 style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: "700",
            background: "linear-gradient(45deg, #ffd700, #ff8c00, #ff6b6b)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.1
          }}>
            Cosmic Care
          </h1>
          <p style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            opacity: 0.8,
            margin: "1rem 0 0 0",
            fontWeight: "300",
            letterSpacing: "0.05em"
          }}>
            Visualize Your Day Through Space
          </p>
        </div>

        {/* Description */}
        <div style={{
          maxWidth: "600px",
          marginBottom: "4rem",
          animation: "fadeInUp 1s ease-out 0.3s both"
        }}>
          <p style={{
            fontSize: "1.2rem",
            lineHeight: 1.6,
            opacity: 0.9,
            margin: "0 0 2rem 0"
          }}>
            Transform your daily sessions into an interactive solar system.
            Each planet represents a session, and moons orbit around them as emotions.
            Explore your day in a beautiful, immersive 3D experience.
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginTop: "2rem"
          }}>
            <div style={{
              background: "rgba(255, 215, 0, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              🌅 Morning Sessions
            </div>
            <div style={{
              background: "rgba(255, 140, 0, 0.1)",
              border: "1px solid rgba(255, 140, 0, 0.3)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              ☀️ Afternoon Focus
            </div>
            <div style={{
              background: "rgba(138, 43, 226, 0.1)",
              border: "1px solid rgba(138, 43, 226, 0.3)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              🌙 Evening Reflection
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{
          animation: "fadeInUp 1s ease-out 0.6s both"
        }}>
          <Link
            href="/today"
            style={{
              display: "inline-block",
              background: "linear-gradient(45deg, #ffd700, #ff8c00)",
              color: "#000",
              textDecoration: "none",
              padding: "1rem 2.5rem",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "600",
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 25px rgba(255, 215, 0, 0.3)",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 215, 0, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 215, 0, 0.3)";
            }}
          >
            Explore Today&apos;s Sessions
          </Link>
        </div>

        {/* Features */}
        <div style={{
          marginTop: "5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          maxWidth: "800px",
          width: "100%",
          animation: "fadeInUp 1s ease-out 0.9s both"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌌</div>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600" }}>
              3D Visualization
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem", lineHeight: 1.5 }}>
              Immerse yourself in a beautiful 3D solar system where each planet represents your daily sessions.
            </p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎭</div>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600" }}>
              Emotion Tracking
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem", lineHeight: 1.5 }}>
              Moons orbit around planets representing emotions, with sizes reflecting their intensity.
            </p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600" }}>
              Interactive Analysis
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem", lineHeight: 1.5 }}>
              Click planets to dive deep into session details and emotional patterns throughout your day.
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }
        }
      `}</style>
      </div>
    </>
  );
}