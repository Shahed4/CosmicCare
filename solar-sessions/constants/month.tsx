// Types for month data
export type MonthData = {
  startDate: string;
  endDate: string;
  days: DayData[];
};

export type DayData = {
  date: string;
  sessions: Session[];
};

export type Session = {
  date: string;
  name: string; // name of session: morning, afternoon, etc.
  color: string;
  emotions: SessionEmotions;
};

export type SessionEmotions = {
  positive: Emotion[];
  negative: Emotion[];
};

export type Emotion = {
  name: string;
  intensity: number;
  color: string;
};

// Hard-coded dummy data for October 1-17, 2025
export const monthData: MonthData = {
  startDate: "2025-10-01",
  endDate: "2025-10-17",
  days: [
    // October 1, 2025 - 95% negative, 5% positive
    {
      date: "2025-10-01",
      sessions: [
        {
          date: "2025-10-01",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.05, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.5, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-01",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.05, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.5, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-01",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.05, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.5, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 2, 2025 - 90% negative, 10% positive
    {
      date: "2025-10-02",
      sessions: [
        {
          date: "2025-10-02",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.1, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.45, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-02",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.1, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.45, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-02",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.1, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.45, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 3, 2025 - 85% negative, 15% positive
    {
      date: "2025-10-03",
      sessions: [
        {
          date: "2025-10-03",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.15, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.4, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-03",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.15, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.4, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-03",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.15, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.4, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 4, 2025 - 80% negative, 20% positive
    {
      date: "2025-10-04",
      sessions: [
        {
          date: "2025-10-04",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.2, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.35, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-04",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.2, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.35, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-04",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.2, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.35, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 5, 2025 - 75% negative, 25% positive
    {
      date: "2025-10-05",
      sessions: [
        {
          date: "2025-10-05",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.25, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.3, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-05",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.25, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.3, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-05",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.25, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.3, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 6, 2025 - 70% negative, 30% positive
    {
      date: "2025-10-06",
      sessions: [
        {
          date: "2025-10-06",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.3, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.25, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-06",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.3, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.25, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-06",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.3, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.25, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 7, 2025 - 65% negative, 35% positive
    {
      date: "2025-10-07",
      sessions: [
        {
          date: "2025-10-07",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.35, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.2, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-07",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.35, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.2, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-07",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.35, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.2, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 8, 2025 - 60% negative, 40% positive
    {
      date: "2025-10-08",
      sessions: [
        {
          date: "2025-10-08",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.4, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.15, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-08",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.4, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.15, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-08",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.4, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.15, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 9, 2025 - 55% negative, 45% positive
    {
      date: "2025-10-09",
      sessions: [
        {
          date: "2025-10-09",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.45, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.1, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.15, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-09",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.45, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.1, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.15, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-09",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.45, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.1, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.15, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 10, 2025 - 50% negative, 50% positive (balanced)
    {
      date: "2025-10-10",
      sessions: [
        {
          date: "2025-10-10",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Balanced", intensity: 0.25, color: "#ff6b6b" },
              { name: "Centered", intensity: 0.15, color: "#4ecdc4" },
              { name: "Stable", intensity: 0.1, color: "#45b7d1" },
            ],
            negative: [
              { name: "Neutral", intensity: 0.25, color: "#6c757d" },
              { name: "Calm", intensity: 0.15, color: "#dc3545" },
              { name: "Reserved", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-10",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Balanced", intensity: 0.25, color: "#96ceb4" },
              { name: "Centered", intensity: 0.15, color: "#feca57" },
              { name: "Stable", intensity: 0.1, color: "#ff9ff3" },
            ],
            negative: [
              { name: "Neutral", intensity: 0.25, color: "#e74c3c" },
              { name: "Calm", intensity: 0.15, color: "#8b0000" },
              { name: "Reserved", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-10",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Balanced", intensity: 0.25, color: "#a8e6cf" },
              { name: "Centered", intensity: 0.15, color: "#ffd3a5" },
              { name: "Stable", intensity: 0.1, color: "#c7ceea" },
            ],
            negative: [
              { name: "Neutral", intensity: 0.25, color: "#2c3e50" },
              { name: "Calm", intensity: 0.15, color: "#7f8c8d" },
              { name: "Reserved", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 11, 2025 - 45% negative, 55% positive
    {
      date: "2025-10-11",
      sessions: [
        {
          date: "2025-10-11",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.55, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.05, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-11",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.55, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.05, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-11",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.55, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.05, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 12, 2025 - 40% negative, 60% positive
    {
      date: "2025-10-12",
      sessions: [
        {
          date: "2025-10-12",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.6, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Overwhelmed", intensity: 0.0, color: "#6c757d" },
              { name: "Anxious", intensity: 0.3, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-12",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.6, color: "#96ceb4" },
            ],
            negative: [
              { name: "Frustrated", intensity: 0.0, color: "#e74c3c" },
              { name: "Discouraged", intensity: 0.3, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-12",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.6, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Exhausted", intensity: 0.0, color: "#2c3e50" },
              { name: "Defeated", intensity: 0.3, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 13, 2025 - 35% negative, 65% positive
    {
      date: "2025-10-13",
      sessions: [
        {
          date: "2025-10-13",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.65, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Anxious", intensity: 0.25, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-13",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.65, color: "#96ceb4" },
            ],
            negative: [
              { name: "Discouraged", intensity: 0.25, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-13",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.65, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Defeated", intensity: 0.25, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 14, 2025 - 30% negative, 70% positive
    {
      date: "2025-10-14",
      sessions: [
        {
          date: "2025-10-14",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.7, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Anxious", intensity: 0.2, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-14",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.7, color: "#96ceb4" },
            ],
            negative: [
              { name: "Discouraged", intensity: 0.2, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-14",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.7, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Defeated", intensity: 0.2, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 15, 2025 - 25% negative, 75% positive
    {
      date: "2025-10-15",
      sessions: [
        {
          date: "2025-10-15",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.75, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Anxious", intensity: 0.15, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-15",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.75, color: "#96ceb4" },
            ],
            negative: [
              { name: "Discouraged", intensity: 0.15, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-15",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.75, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Defeated", intensity: 0.15, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 16, 2025 - 20% negative, 80% positive
    {
      date: "2025-10-16",
      sessions: [
        {
          date: "2025-10-16",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Hopeful", intensity: 0.8, color: "#ff6b6b" },
            ],
            negative: [
              { name: "Anxious", intensity: 0.1, color: "#dc3545" },
              { name: "Stressed", intensity: 0.1, color: "#8b0000" },
            ],
          },
        },
        {
          date: "2025-10-16",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Determined", intensity: 0.8, color: "#96ceb4" },
            ],
            negative: [
              { name: "Discouraged", intensity: 0.1, color: "#8b0000" },
              { name: "Tired", intensity: 0.1, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-16",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Resilient", intensity: 0.8, color: "#a8e6cf" },
            ],
            negative: [
              { name: "Defeated", intensity: 0.1, color: "#7f8c8d" },
              { name: "Hopeless", intensity: 0.1, color: "#dc3545" },
            ],
          },
        },
      ],
    },
    // October 17, 2025 - 5% negative, 95% positive
    {
      date: "2025-10-17",
      sessions: [
        {
          date: "2025-10-17",
          name: "Morning",
          color: "#ffd700",
          emotions: {
            positive: [
              { name: "Excited", intensity: 0.5, color: "#ff6b6b" },
              { name: "Enthusiastic", intensity: 0.3, color: "#4ecdc4" },
              { name: "Joyful", intensity: 0.15, color: "#45b7d1" },
            ],
            negative: [
              { name: "Slightly tired", intensity: 0.05, color: "#6c757d" },
            ],
          },
        },
        {
          date: "2025-10-17",
          name: "Afternoon",
          color: "#ff8c00",
          emotions: {
            positive: [
              { name: "Accomplished", intensity: 0.5, color: "#96ceb4" },
              { name: "Focused", intensity: 0.3, color: "#feca57" },
              { name: "Creative", intensity: 0.15, color: "#ff9ff3" },
            ],
            negative: [
              { name: "Minor concern", intensity: 0.05, color: "#e74c3c" },
            ],
          },
        },
        {
          date: "2025-10-17",
          name: "Evening",
          color: "#8a2be2",
          emotions: {
            positive: [
              { name: "Grateful", intensity: 0.5, color: "#a8e6cf" },
              { name: "Content", intensity: 0.3, color: "#ffd3a5" },
              { name: "Relaxed", intensity: 0.15, color: "#c7ceea" },
            ],
            negative: [
              { name: "Slightly tired", intensity: 0.05, color: "#2c3e50" },
            ],
          },
        },
      ],
    },
  ],
};