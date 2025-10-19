"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    if (onModeChange) {
      onModeChange(newMode);
    }
    // Clear form data when switching modes
    setEmail('');
    setPassword('');
    setError(null);
    setMessage(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(15px)',
      padding: '20px',
      boxSizing: 'border-box',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(26, 26, 46, 0.95) 50%, rgba(22, 33, 62, 0.95) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        minHeight: '400px',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 215, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        margin: 'auto',
        animation: 'slideInUp 0.4s ease-out',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Animated background stars */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          background: `
            radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,215,0,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,140,0,0.2), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 100px',
          animation: 'twinkle 8s linear infinite',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #ffd700, #ff8c00, #ff6b6b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {mode === 'login' ? 'Welcome Back' : 'Join Cosmic Care'}
              </h2>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: '400'
              }}>
                {mode === 'login' ? 'Sign in to explore your cosmic journey' : 'Create your account to start your space adventure'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                e.currentTarget.style.borderColor = '#ff6b6b';
                e.currentTarget.style.color = '#ff6b6b';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              ×
            </button>
          </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.02em'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd700';
                e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.02em'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffd700';
                e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#ff6b6b',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#4caf50',
              fontSize: '0.9rem'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: loading
                ? 'rgba(255, 215, 0, 0.3)'
                : 'linear-gradient(45deg, #ffd700, #ff8c00)',
              color: loading ? 'rgba(255, 255, 255, 0.7)' : '#000',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: loading
                ? 'none'
                : '0 8px 25px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  borderTopColor: 'rgba(255, 255, 255, 0.8)',
                  animation: 'spin 1s linear infinite'
                }} />
                Loading...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span>{mode === 'login' ? '🔑' : '✨'}</span>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => handleModeSwitch('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffd700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontWeight: '600',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ff8c00';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => handleModeSwitch('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffd700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: 'inherit',
                  fontWeight: '600',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ff8c00';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

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
