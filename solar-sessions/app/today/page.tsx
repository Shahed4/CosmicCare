"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { fetchSessionsForDate } from "../../lib/database";

const SolarScene = dynamic(() => import("../../components/SolarScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100dvh",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Loading...
    </div>
  ),
});

const SunOnlyScene = dynamic(() => import("../../components/SunOnlyScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100dvh",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      Loading...
    </div>
  ),
});

export default function TodayPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dayData, setDayData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch today's data when user is available
  useEffect(() => {
    const fetchTodayData = async () => {
      if (!user) return;

      setDataLoading(true);
      setError(null);

      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        const data = await fetchSessionsForDate(user.id, today);

        if (data) {
          setDayData(data);
        } else {
          // If no data for today, create empty structure
          setDayData({
            date: today,
            sessions: [],
          });
        }
      } catch (err) {
        console.error("Error fetching today data:", err);
        setError("Failed to load today's data");
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchTodayData();
    }
  }, [user]);

  // Show loading while checking authentication
  if (loading || dataLoading) {
    return (
      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #ffd700, #ff8c00)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loading today's data...
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "50%",
              borderTopColor: "#ffd700",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show redirect message if not authenticated
  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #ffd700, #ff8c00)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Redirecting to login...
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "50%",
              borderTopColor: "#ffd700",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "#ffd700",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no sessions for today
  if (!dayData || dayData.sessions.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    return (
      <main style={{ height: "100vh", background: "black" }}>
        <SunOnlyScene
          headline={formatDate(today)}
          onRecordSession={() => router.push("/create-session")}
        />
      </main>
    );
  }

  // Only render the protected content if user is authenticated and data is loaded
  return (
    <main style={{ height: "100vh", background: "black" }}>
      <SolarScene data={dayData} headline={formatDate(dayData.date)} />
    </main>
  );
}
