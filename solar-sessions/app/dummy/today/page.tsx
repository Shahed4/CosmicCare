"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const SolarScene = dynamic(() => import("../../../components/SolarScene"), {
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

interface DailySession {
  id: string;
  session_date: string;
  session_name: string;
  session_color: string;
  emotions: {
    positive: Array<{ name: string; intensity: number; color: string }>;
    negative: Array<{ name: string; intensity: number; color: string }>;
  };
  created_at: string;
}

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todayData, setTodayData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch today's sessions from Supabase
  useEffect(() => {
    if (user) {
      loadTodaysSessions();
    }
  }, [user]);

  const loadTodaysSessions = async () => {
    try {
      setIsLoadingData(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const { data: sessions, error: dbError } = await supabase
        .from('daily_sessions')
        .select('*')
        .eq('session_date', today)
        .order('created_at', { ascending: true });

      if (dbError) throw dbError;

      if (sessions && sessions.length > 0) {
        // Transform Supabase data to match SolarScene expected format
        const transformedData = {
          date: today,
          sessions: sessions.map((session: DailySession) => ({
            name: session.session_name,
            color: session.session_color,
            emotions: {
              positive: session.emotions.positive || [],
              negative: session.emotions.negative || []
            }
          }))
        };
        setTodayData(transformedData);
      } else {
        // No sessions for today - create empty state
        setTodayData({
          date: today,
          sessions: []
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error loading sessions:', message);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Loading...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#ffd700',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Redirecting to login...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#ffd700',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ff6b6b' }}>
            Error Loading Sessions
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            {error}
          </div>
          <button
            onClick={loadTodaysSessions}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (isLoadingData) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Loading today&apos;s sessions...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#ffd700',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show empty state if no sessions
  if (!todayData || todayData.sessions.length === 0) {
    return (
      <div style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem"
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌅</div>
          <div style={{
            fontSize: '1.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            No sessions for today yet
          </div>
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '1.5rem'
          }}>
            Create your first mood session of the day to see it visualized here!
          </div>
          <button
            onClick={() => router.push('/rant-reflect')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🎤 Record Your Mood
          </button>
        </div>
      </div>
    );
  }

  // Format the headline with the current date
  const formatDate = () => {
    const date = new Date(todayData.date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Only render the protected content if user is authenticated
  return (
    <main style={{ height: "100vh", background: "black" }}>
      <SolarScene data={todayData} headline={formatDate()} />
    </main>
  );
}
