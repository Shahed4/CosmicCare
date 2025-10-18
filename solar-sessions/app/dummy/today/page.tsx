"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { data } from '../../../constants/today';

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

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  // Only render the protected content if user is authenticated
  return (
    <main style={{ height: "100vh", background: "black" }}>
      <SolarScene data={data} headline={"Friday, Oct 17"} />
    </main>
  );
}
