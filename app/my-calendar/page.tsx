"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { fetchSessionsForDateRange } from '../../lib/database';

export default function MyCalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch month data when user is available
  useEffect(() => {
    const fetchMonthData = async () => {
      if (!user) {
        return;
      }

      setDataLoading(true);
      setError(null);

      try {
        // Get selected month's start and end dates (local time)
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Last day of current month
        
        // Format dates as YYYY-MM-DD using local time
        const startDateString = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const endDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        
        const data = await fetchSessionsForDateRange(user.id, startDateString, endDateString);
        
        setMonthData(data);
      } catch (err) {
        console.error('Error fetching month data:', err);
        setError('Failed to load calendar data');
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchMonthData();
    }
  }, [user, currentMonth]);

  // Show loading while checking authentication
  if (loading || dataLoading) {
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
        <div style={{
          textAlign: "center"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffd700",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem auto"
          }}></div>
          <p style={{
            fontSize: "1.1rem",
            color: "rgba(255, 255, 255, 0.8)"
          }}>
            Loading calendar...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show redirect message if not authenticated
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
        <div style={{
          textAlign: "center"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffd700",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem auto"
          }}></div>
          <p style={{
            fontSize: "1.1rem",
            color: "rgba(255, 255, 255, 0.8)"
          }}>
            Redirecting to login...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: '#ef4444'
          }}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: '#ffd700',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  // Create a calendar grid for the selected month
  const createCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push({ date: null, isCurrentMonth: false });
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = monthData.find(d => d.date === dateString);
      
      calendarDays.push({
        date: day,
        dateString,
        isCurrentMonth: true,
        dayData
      });
    }

    return calendarDays;
  };

  const getDayColor = (dayData: any) => {
    if (!dayData) return "#2d3748"; // Disabled gray

    // Calculate average positive and negative percentages across all sessions
    let totalPositivePercent = 0;
    let totalNegativePercent = 0;
    let sessionCount = 0;

    dayData.sessions.forEach((session: any) => {
      sessionCount++;
      let sessionPositive = 0;
      let sessionNegative = 0;
      
      session.emotions.positive.forEach((emotion: any) => {
        sessionPositive += emotion.intensity;
      });
      session.emotions.negative.forEach((emotion: any) => {
        sessionNegative += emotion.intensity;
      });
      
      // Convert session totals to percentages (each session = 100%)
      const sessionPositivePercent = sessionPositive * 100;
      const sessionNegativePercent = sessionNegative * 100;
      
      totalPositivePercent += sessionPositivePercent;
      totalNegativePercent += sessionNegativePercent;
    });

    // Calculate day average percentages
    const avgPositivePercent = totalPositivePercent / sessionCount;
    const avgNegativePercent = totalNegativePercent / sessionCount;

    // Balanced day (50% positive, 50% negative)
    if (Math.abs(avgPositivePercent - avgNegativePercent) < 5) {
      return "#4299e1"; // Calm blue
    }

    // Higher positive intensity - vibrant green gradient
    if (avgPositivePercent > avgNegativePercent) {
      if (avgPositivePercent >= 95) return "#10b981"; // Emerald green - brightest
      if (avgPositivePercent >= 90) return "#059669"; // Emerald green - bright
      if (avgPositivePercent >= 85) return "#047857"; // Emerald green - medium
      if (avgPositivePercent >= 80) return "#065f46"; // Emerald green - dark
      if (avgPositivePercent >= 75) return "#064e3b"; // Emerald green - darker
      if (avgPositivePercent >= 70) return "#064e3b"; // Emerald green - darkest
      if (avgPositivePercent >= 65) return "#064e3b"; // Emerald green - very dark
      return "#064e3b"; // Emerald green - extremely dark
    }

    // Higher negative intensity - vibrant red gradient
    if (avgNegativePercent > avgPositivePercent) {
      if (avgNegativePercent >= 95) return "#f87171"; // Red-400 - brightest
      if (avgNegativePercent >= 90) return "#ef4444"; // Red-500 - bright
      if (avgNegativePercent >= 85) return "#dc2626"; // Red-600 - medium
      if (avgNegativePercent >= 80) return "#b91c1c"; // Red-700 - dark
      if (avgNegativePercent >= 75) return "#991b1b"; // Red-800 - darker
      if (avgNegativePercent >= 70) return "#7f1d1d"; // Red-900 - darkest
      if (avgNegativePercent >= 65) return "#7f1d1d"; // Red-900 - very dark
      return "#7f1d1d"; // Red-900 - extremely dark
    }

    return "#2d3748"; // Fallback gray
  };

  const getDayTooltip = (dayData: any) => {
    if (!dayData) return "No data available";

    // Calculate average positive and negative percentages across all sessions
    let totalPositivePercent = 0;
    let totalNegativePercent = 0;
    let sessionCount = 0;

    dayData.sessions.forEach((session: any) => {
      sessionCount++;
      let sessionPositive = 0;
      let sessionNegative = 0;
      
      session.emotions.positive.forEach((emotion: any) => {
        sessionPositive += emotion.intensity;
      });
      session.emotions.negative.forEach((emotion: any) => {
        sessionNegative += emotion.intensity;
      });
      
      // Convert session totals to percentages (each session = 100%)
      const sessionPositivePercent = sessionPositive * 100;
      const sessionNegativePercent = sessionNegative * 100;
      
      totalPositivePercent += sessionPositivePercent;
      totalNegativePercent += sessionNegativePercent;
    });

    // Calculate day average percentages
    const avgPositivePercent = totalPositivePercent / sessionCount;
    const avgNegativePercent = totalNegativePercent / sessionCount;

    const positivePercent = Math.round(avgPositivePercent);
    const negativePercent = Math.round(avgNegativePercent);

    return `${dayData.date}: ${positivePercent}% positive, ${negativePercent}% negative`;
  };

  const calendarDays = createCalendarGrid();

  return (
    <div className="calendar-page" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      paddingTop: "100px", // Account for navbar
      padding: "100px 2rem 2rem 2rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        color: "white"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(45deg, #ffd700, #ff8c00)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem"
          }}>
            Emotional Calendar
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "1rem"
          }}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          
          {/* Month Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              ← Previous
            </button>
            
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Next →
            </button>
          </div>
          
          {/* Quick Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem"
          }}>
            <button
              onClick={() => setCurrentMonth(new Date())}
              style={{
                padding: "6px 12px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Current Month
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(2025, 9))} // October 2025
              style={{
                padding: "6px 12px",
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              October 2025 (Test Data)
            </button>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.6)",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "2px" }}></div>
              <span>95%+ Positive</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#059669", borderRadius: "2px" }}></div>
              <span>90%+ Positive</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#047857", borderRadius: "2px" }}></div>
              <span>85%+ Positive</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#4299e1", borderRadius: "2px" }}></div>
              <span>Balanced</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#dc2626", borderRadius: "2px" }}></div>
              <span>85%+ Negative</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#ef4444", borderRadius: "2px" }}></div>
              <span>90%+ Negative</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#f87171", borderRadius: "2px" }}></div>
              <span>95%+ Negative</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", backgroundColor: "#2d3748", borderRadius: "2px" }}></div>
              <span>No Data</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid" style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          {/* Days of week header */}
          <div className="dow" style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
            marginBottom: "1rem"
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.6)",
                padding: "0.5rem"
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="days" style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem"
          }}>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: "1",
                  backgroundColor: day.isCurrentMonth ? getDayColor(day.dayData) : "#1a1a2e",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: day.isCurrentMonth ? "white" : "rgba(255, 255, 255, 0.3)",
                  cursor: day.isCurrentMonth ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  border: selectedDate === day.dateString ? "2px solid #ffd700" : "2px solid transparent",
                  position: "relative"
                }}
                onClick={() => day.isCurrentMonth && day.dayData && day.dateString && setSelectedDate(day.dateString)}
                onMouseOver={(e) => {
                  if (day.isCurrentMonth && day.dayData) {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
                  }
                }}
                onMouseOut={(e) => {
                  if (day.isCurrentMonth && day.dayData) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                title={day.isCurrentMonth && day.dayData ? getDayTooltip(day.dayData) : ""}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div style={{
            marginTop: "2rem",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            {(() => {
              const dayData = monthData.find(d => d.date === selectedDate);
              if (!dayData) return null;

              // Calculate average positive and negative percentages across all sessions
              let totalPositivePercent = 0;
              let totalNegativePercent = 0;
              let sessionCount = 0;

              dayData.sessions.forEach((session: any) => {
                sessionCount++;
                let sessionPositive = 0;
                let sessionNegative = 0;
                
                session.emotions.positive.forEach((emotion: any) => {
                  sessionPositive += emotion.intensity;
                });
                session.emotions.negative.forEach((emotion: any) => {
                  sessionNegative += emotion.intensity;
                });
                
                // Convert session totals to percentages (each session = 100%)
                const sessionPositivePercent = sessionPositive * 100;
                const sessionNegativePercent = sessionNegative * 100;
                
                totalPositivePercent += sessionPositivePercent;
                totalNegativePercent += sessionNegativePercent;
              });

              // Calculate day average percentages
              const avgPositivePercent = totalPositivePercent / sessionCount;
              const avgNegativePercent = totalNegativePercent / sessionCount;

              const positivePercent = Math.round(avgPositivePercent);
              const negativePercent = Math.round(avgNegativePercent);

              return (
                <div>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "#ffd700"
                  }}>
                    {(() => {
                      const [year, month, day] = selectedDate.split('-').map(Number);
                      const date = new Date(year, month - 1, day); // month is 0-indexed
                      return date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                    })()}
                  </h3>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2rem"
                  }}>
                    <div style={{
                      textAlign: "center",
                      flex: 1
                    }}>
                      <div style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#22c55e",
                        marginBottom: "0.5rem"
                      }}>
                        {positivePercent}%
                      </div>
                      <div style={{
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.7)"
                      }}>
                        Positive
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center",
                      flex: 1
                    }}>
                      <div style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#ef4444",
                        marginBottom: "0.5rem"
                      }}>
                        {negativePercent}%
                      </div>
                      <div style={{
                        fontSize: "0.9rem",
                        color: "rgba(255, 255, 255, 0.7)"
                      }}>
                        Negative
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem"
                  }}>
                    {dayData.sessions.map((session: any, index: number) => (
                      <div key={index} style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}>
                        <h4 style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          marginBottom: "1rem",
                          color: session.color
                        }}>
                          {session.name}
                        </h4>
                        
                        <div style={{ marginBottom: "1rem" }}>
                          <h5 style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#22c55e",
                            marginBottom: "0.5rem"
                          }}>
                            Positive Emotions
                          </h5>
                          {session.emotions.positive.map((emotion: any, i: number) => (
                            <div key={i} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.25rem",
                              fontSize: "0.85rem"
                            }}>
                              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>{emotion.name}</span>
                              <span style={{ color: "#22c55e", fontWeight: "500" }}>
                                {Math.round(emotion.intensity * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <h5 style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#ef4444",
                            marginBottom: "0.5rem"
                          }}>
                            Negative Emotions
                          </h5>
                          {session.emotions.negative.map((emotion: any, i: number) => (
                            <div key={i} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "0.25rem",
                              fontSize: "0.85rem"
                            }}>
                              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>{emotion.name}</span>
                              <span style={{ color: "#ef4444", fontWeight: "500" }}>
                                {Math.round(emotion.intensity * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 480px) {
          .calendar-page { padding: 80px 1rem 1rem 1rem !important; }
          .calendar-grid { padding: 1rem !important; }
          .dow { gap: 0.25rem !important; }
          .days { gap: 0.25rem !important; }
          .calendar-page h1 { font-size: 1.75rem !important; }
        }
      `}</style>
    </div>
  );
}
