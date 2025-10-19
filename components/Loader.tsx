"use client";

export default function Loader() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1.5rem",
      padding: "3rem",
    }}>
      {/* Animated Spinner */}
      <div style={{
        width: "60px",
        height: "60px",
        border: "4px solid rgba(255, 255, 255, 0.1)",
        borderTop: "4px solid #ffd700",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />

      {/* Loading Text */}
      <p style={{
        fontSize: "1.2rem",
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: "500",
        animation: "pulse 1.5s ease-in-out infinite",
      }}>
        Analyzing your thoughts...
      </p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
