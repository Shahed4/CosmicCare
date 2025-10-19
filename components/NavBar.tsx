"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { href: "/today", label: "Today's Sessions", icon: "🌌" },
    { href: "/my-calendar", label: "My Calendar", icon: "📅" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="navbar" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "rgba(12, 12, 12, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "1rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <div style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          background: "linear-gradient(45deg, #ffd700, #ff8c00)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em"
        }}>
          Cosmic Care
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem"
      }}>
        {/* Main Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: isActive(item.href) ? "#ffd700" : "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: isActive(item.href)
                  ? "rgba(255, 215, 0, 0.1)"
                  : "transparent",
                border: isActive(item.href)
                  ? "1px solid rgba(255, 215, 0, 0.3)"
                  : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseOver={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.color = "#ffd700";
                  e.currentTarget.style.background = "rgba(255, 215, 0, 0.05)";
                  e.currentTarget.style.border = "1px solid rgba(255, 215, 0, 0.2)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive(item.href)) {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Authentication Section */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          paddingLeft: "1rem",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          {user ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.9)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: isUserDropdownOpen ? "6px 6px 0 0" : "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  width: "160px",
                  justifyContent: "space-between"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <span>{user.user_metadata?.display_name || user.email}</span>
                <span style={{
                  transform: isUserDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}>
                  ▼
                </span>
              </button>

              {isUserDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "rgba(12, 12, 12, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderTop: "none",
                    borderRadius: "0 0 6px 6px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    width: "160px",
                    zIndex: 1002,
                    animation: "fadeInDown 0.2s ease-out"
                  }}
                >
                  <button
                    onClick={async () => {
                      await handleSignOut();
                      setIsUserDropdownOpen(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff6b6b",
                      padding: "0.8rem 1rem",
                      borderRadius: "0 0 6px 6px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: "100%",
                      textAlign: "left"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
              <Link
                href={pathname === '/login' ? '/signup' : '/login'}
                style={{
                  background: "linear-gradient(45deg, #ffd700, #ff8c00)",
                  border: "none",
                  color: "#000",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  textDecoration: "none"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>{pathname === '/login' ? '✨' : '🔑'}</span>
                {pathname === '/login' ? 'Sign Up' : 'Sign In'}
              </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          padding: "0.5rem"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "#ffd700";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "white";
        }}
      >
        ☰
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(12, 12, 12, 0.98)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: isActive(item.href) ? "#ffd700" : "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                background: isActive(item.href)
                  ? "rgba(255, 215, 0, 0.1)"
                  : "transparent",
                border: isActive(item.href)
                  ? "1px solid rgba(255, 215, 0, 0.3)"
                  : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          nav > div:nth-child(2) {
            display: none !important;
          }
          nav > button {
            display: block !important;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding-left: calc(1rem + env(safe-area-inset-left)) !important;
            padding-right: calc(1rem + env(safe-area-inset-right)) !important;
            padding-top: calc(0.75rem + env(safe-area-inset-top)) !important;
            padding-bottom: 0.75rem !important;
          }
        }
      `}</style>
    </nav>
  );
}
