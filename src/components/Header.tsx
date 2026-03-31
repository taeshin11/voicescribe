"use client";

import { useState, useEffect } from "react";
import { MODEL_OPTIONS } from "@/lib/types";

interface HeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function Header({ selectedModel, onModelChange }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border-color)]">
      <div className="max-w-content mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--foreground)]">
            Voice<span className="text-accent">Scribe</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Model selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--text-secondary)]">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="text-sm bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-btn px-3 py-1.5 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.size})
                </option>
              ))}
            </select>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-btn hover:bg-[var(--secondary-bg)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-btn hover:bg-[var(--secondary-bg)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--background)] px-6 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--text-secondary)]">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="text-sm bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-btn px-3 py-1.5 text-[var(--foreground)] flex-1"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.size})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-sm text-[var(--foreground)]"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
}
