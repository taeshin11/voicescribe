"use client";

import { useState, useEffect } from "react";
import { HistoryEntry, TranscriptionSegment } from "@/lib/types";

interface HistoryProps {
  onRestore: (segments: TranscriptionSegment[], fileName: string, duration: number, language: string) => void;
}

export default function History({ onRestore }: HistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("voicescribe_history") || "[]");
      setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("voicescribe_history");
    setHistory([]);
  };

  const handleRestore = (entry: HistoryEntry) => {
    onRestore(entry.segments, entry.fileName, entry.duration, entry.language);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) return null;

  return (
    <section className="py-8 px-6 md:px-12">
      <div className="max-w-content mx-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-accent transition-colors mb-4"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Recent Transcriptions ({history.length})
        </button>

        {isOpen && (
          <div className="space-y-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-btn hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.fileName}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {formatDate(entry.date)} • {entry.language.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(entry)}
                  className="ml-3 px-3 py-1 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                >
                  Restore
                </button>
              </div>
            ))}
            <button
              onClick={clearHistory}
              className="text-xs text-error hover:underline mt-2"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
