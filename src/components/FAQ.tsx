"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is VoiceScribe really free?",
    a: "Yes, VoiceScribe is completely free. All transcription processing happens directly in your browser using AI, so there are no server costs to pass on to you.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Your files never leave your device. All audio and video processing happens entirely in your browser. We never upload, store, or access your files.",
  },
  {
    q: "What file formats are supported?",
    a: "VoiceScribe supports MP4, M4A, MP3, WAV, WebM, OGG, MOV, AVI, and FLAC files. Both audio and video files are accepted.",
  },
  {
    q: "What languages are supported?",
    a: "VoiceScribe supports over 90 languages including English, Korean (한국어), Japanese (日本語), Chinese (中文), Spanish, French, German, and many more. The language is automatically detected.",
  },
  {
    q: "Why is the first transcription slow?",
    a: "On your first use, VoiceScribe needs to download the AI model (about 150-400MB depending on the model selected). This is cached in your browser, so subsequent transcriptions start much faster.",
  },
  {
    q: "Can I edit the transcription?",
    a: "Yes! Click on any text in the transcription result to edit it. You can correct any mistakes before downloading the final file.",
  },
  {
    q: "What output formats are available?",
    a: "You can download your transcription as TXT (plain text), SRT (subtitle format for video editors), or VTT (WebVTT for web video captions).",
  },
  {
    q: "What's the maximum file size?",
    a: "VoiceScribe supports files up to 500MB. For best results with longer files, we recommend using the Small or Medium model for better accuracy.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 md:px-12 bg-[var(--secondary-bg)]" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-[var(--secondary-bg)] transition-colors"
              >
                <h3 className="font-semibold text-sm md:text-base">{faq.q}</h3>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-[var(--text-secondary)] transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
