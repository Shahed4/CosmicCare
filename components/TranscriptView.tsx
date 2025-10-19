"use client";

interface TranscriptViewProps {
  text: string;
}

export default function TranscriptView({ text }: TranscriptViewProps) {
  if (!text) return null;

  return (
    <div className="transcript" style={{
      padding: "2rem",
      background: "rgba(0, 0, 0, 0.5)",
      borderRadius: "15px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      maxWidth: "700px",
      margin: "0 auto",
      animation: "fadeInUp 0.5s ease-out",
    }}>
      <h3 style={{
        margin: "0 0 1rem 0",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#ffd700",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}>
        📝 Your Transcription
      </h3>
      <p style={{
        margin: 0,
        fontSize: "1.1rem",
        lineHeight: "1.8",
        color: "rgba(255, 255, 255, 0.9)",
        fontStyle: "italic",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}>
        &ldquo;{text}&rdquo;
      </p>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .transcript {
            max-width: 100% !important;
            padding: 1rem;
          }
          .transcript h3 { font-size: 1.25rem; }
          .transcript p { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
