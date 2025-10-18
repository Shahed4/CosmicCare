// New schema for today's data
export type Emotion = {
  name: string;
  intensity: number;
  color: string;
};

export type SessionEmotions = {
  positive: Emotion[];
  negative: Emotion[];
};

export type Session = {
  date: string;
  name: string;
  color: string;
  emotions: SessionEmotions;
};

export type DayData = {
  date: string;
  sessions: Session[];
};

// Hard-coded dummy data with new schema
export const data: DayData = {
  date: "2025-10-17",
  sessions: [
    {
      date: "2025-10-17",
      name: "Morning",
      color: "#ffd700",
      emotions: {
        positive: [
          { name: "Energetic", intensity: 0.35, color: "#ff6b6b" },
          { name: "Focused", intensity: 0.3, color: "#4ecdc4" },
          { name: "Optimistic", intensity: 0.2, color: "#45b7d1" },
        ],
        negative: [
          { name: "Tired", intensity: 0.1, color: "#6c757d" },
          { name: "Anxious", intensity: 0.05, color: "#dc3545" },
        ],
      },
    },
    {
      date: "2025-10-17",
      name: "Afternoon",
      color: "#ff8c00",
      emotions: {
        positive: [
          { name: "Productive", intensity: 0.4, color: "#96ceb4" },
          { name: "Determined", intensity: 0.25, color: "#feca57" },
          { name: "Confident", intensity: 0.15, color: "#ff9ff3" },
        ],
        negative: [
          { name: "Stressed", intensity: 0.15, color: "#e74c3c" },
          { name: "Overwhelmed", intensity: 0.05, color: "#8b0000" },
        ],
      },
    },
    {
      date: "2025-10-17",
      name: "Evening",
      color: "#8a2be2",
      emotions: {
        positive: [
          { name: "Reflective", intensity: 0.35, color: "#a8e6cf" },
          { name: "Satisfied", intensity: 0.3, color: "#ffd3a5" },
          { name: "Peaceful", intensity: 0.2, color: "#c7ceea" },
        ],
        negative: [
          { name: "Lonely", intensity: 0.1, color: "#2c3e50" },
          { name: "Restless", intensity: 0.05, color: "#7f8c8d" },
        ],
      },
    },
  ],
};
