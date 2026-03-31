"use client";

import { useEffect, useState } from "react";
import { sendPageView } from "@/lib/webhook";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState<{
    today: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    sendPageView().then((data) => {
      if (data) setVisitorCount(data);
    });
  }, []);

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--background)] py-8 px-6 md:px-12">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              &copy; {new Date().getFullYear()} VoiceScribe. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <a href="#how-it-works" className="hover:text-accent transition-colors">
              How It Works
            </a>
            <a href="#formats" className="hover:text-accent transition-colors">
              Formats
            </a>
            <a href="#faq" className="hover:text-accent transition-colors">
              FAQ
            </a>
            <a href="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </a>
          </div>

          {/* Visitor counter */}
          {visitorCount && (
            <div className="text-xs text-[var(--text-secondary)]">
              Today: {visitorCount.today} visitors | Total:{" "}
              {visitorCount.total.toLocaleString()} visitors
            </div>
          )}
        </div>

        {/* Privacy statement */}
        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          Your files never leave your device. All processing happens in your browser.
        </div>
      </div>
    </footer>
  );
}
