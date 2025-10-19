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
  id: number;
  date: string;
  name: string;
  color: string;
  transcript: string | null;
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
      id: 1,
      date: "2025-10-17",
      name: "Morning",
      color: "#ffd700",
      transcript: "I woke up feeling refreshed and ready to tackle the day. The morning sunlight streaming through my window filled me with energy and optimism. I'm excited about the projects I have planned and feel focused on my goals.",
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
      id: 2,
      date: "2025-10-17",
      name: "Afternoon",
      color: "#ff8c00",
      transcript: "The afternoon brought some challenges with my workload, but I'm pushing through with determination. I feel productive despite the stress, and I'm confident I can handle everything on my plate.",
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
      id: 3,
      date: "2025-10-17",
      name: "Evening",
      color: "#8a2be2",
      transcript: "As the day winds down, I'm feeling reflective about everything I accomplished. There's a sense of satisfaction mixed with some loneliness, but overall I feel peaceful and ready to rest.",
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
