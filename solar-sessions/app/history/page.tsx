"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const SpaceBackground = dynamic(() => import("@/components/SpaceBackground"), {
  ssr: false,
});

interface RantSession {
  id: string;
  transcript: string;
  emotion: string;
  intensity: number | null;
  ai_insight: string | null;
  audio_duration: number | null;
  audio_size: number | null;
  created_at: string;
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<RantSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rant_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error loading sessions:', message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm('Delete this session?')) return;

    try {
      const { error } = await supabase
        .from('rant_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSessions(sessions.filter(s => s.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Failed to delete: ' + message);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
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
    return colors[emotion.toLowerCase()] || "#9C27B0";
  };

  if (loading || isLoading) {
    return (
      <>
        <SpaceBackground />
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}>
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid #ffd700",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}></div>
            <p>Loading...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SpaceBackground />
      <div style={{
        minHeight: "100vh",
        padding: "6rem 2rem 4rem",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              background: "linear-gradient(45deg, #ffd700, #ff8c00, #ff6b6b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 1rem 0",
            }}>
              📜 Your Rant History
            </h1>
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.1rem",
            }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div style={{
              padding: "1.5rem",
              background: "rgba(244, 67, 54, 0.1)",
              border: "1px solid #f44336",
              borderRadius: "10px",
              color: "#f44336",
              textAlign: "center",
              marginBottom: "2rem",
            }}>
              Error: {error}
            </div>
          )}

          {/* Empty State */}
          {sessions.length === 0 && !error && (
            <div style={{
              padding: "3rem 2rem",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "15px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.7)",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎤</div>
              <h2 style={{ color: "white", marginBottom: "0.5rem" }}>No sessions yet</h2>
              <p style={{ marginBottom: "1.5rem" }}>Start recording your thoughts to see them here</p>
              <button
                onClick={() => router.push('/rant-reflect')}
                style={{
                  padding: "0.75rem 2rem",
                  background: "linear-gradient(135deg, #4CAF50, #45a049)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Record Your First Rant
              </button>
            </div>
          )}

          {/* Sessions List */}
          <div style={{
            display: "grid",
            gap: "1.5rem",
          }}>
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  padding: "2rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: `2px solid ${getEmotionColor(session.emotion)}`,
                  borderRadius: "15px",
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 0 20px ${getEmotionColor(session.emotion)}40`,
                }}
              >
                {/* Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}>
                  <div>
                    <div style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: getEmotionColor(session.emotion),
                      textTransform: "capitalize",
                      marginBottom: "0.25rem",
                    }}>
                      {session.emotion}
                      {session.intensity && ` (${session.intensity}/10)`}
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}>
                      {new Date(session.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(244, 67, 54, 0.2)",
                      border: "1px solid #f44336",
                      borderRadius: "8px",
                      color: "#f44336",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Transcript */}
                <div style={{
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}>
                    Transcript:
                  </div>
                  <div style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    fontStyle: "italic",
                  }}>
                    &ldquo;{session.transcript}&rdquo;
                  </div>
                </div>

                {/* AI Insight */}
                {session.ai_insight && (
                  <div style={{
                    padding: "1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                    borderLeft: `4px solid ${getEmotionColor(session.emotion)}`,
                  }}>
                    <div style={{
                      color: getEmotionColor(session.emotion),
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}>
                      💡 AI Insight
                    </div>
                    <div style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}>
                      {session.ai_insight}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
