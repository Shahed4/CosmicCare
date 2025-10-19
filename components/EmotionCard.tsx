"use client";

interface EmotionCardProps {
  emotion: string;
  confidence: string;
  suggestions?: string;
}

const emotionColors: { [key: string]: string } = {
  calm: "#4CAF50",
  happy: "#FFD700",
  excited: "#FF8C00",
  anxious: "#9C27B0",
  sad: "#2196F3",
  angry: "#F44336",
  stressed: "#FF5722",
  frustrated: "#E91E63",
  hopeful: "#00BCD4",
  content: "#8BC34A",
  confused: "#FFC107",
};

const emotionEmojis: { [key: string]: string } = {
  calm: "😌",
  happy: "😊",
  excited: "🤩",
  anxious: "😰",
  sad: "😢",
  angry: "😠",
  stressed: "😓",
  frustrated: "😤",
  hopeful: "🌟",
  content: "😊",
  confused: "🤔",
};

export default function EmotionCard({ emotion, confidence, suggestions }: EmotionCardProps) {
  const color = emotionColors[emotion.toLowerCase()] || "#9C27B0";
  const emoji = emotionEmojis[emotion.toLowerCase()] || "💭";

  return (
    <div style={{
      padding: "2rem",
      background: "rgba(0, 0, 0, 0.5)",
      borderRadius: "15px",
      border: `2px solid ${color}`,
      backdropFilter: "blur(10px)",
      maxWidth: "700px",
      margin: "0 auto",
      animation: "fadeInUp 0.7s ease-out",
      boxShadow: `0 0 30px ${color}40`,
    }}>
      {/* Emotion Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span style={{ fontSize: "3rem" }}>{emoji}</span>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: "700",
              color: color,
              textTransform: "capitalize",
            }}>
              {emotion}
            </h3>
            <p style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
            }}>
              Detected Emotion
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: `3px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            fontWeight: "700",
            color: color,
          }}>
            {confidence}/10
          </div>
          <span style={{
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.6)",
          }}>
            Intensity
          </span>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && (
        <div style={{
          padding: "1.5rem",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "10px",
          borderLeft: `4px solid ${color}`,
        }}>
          <p style={{
            margin: "0 0 0.5rem 0",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: color,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            💡 Insight
          </p>
          <p style={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "rgba(255, 255, 255, 0.85)",
          }}>
            {suggestions}
          </p>
        </div>
      )}

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
      `}</style>
    </div>
  );
}
