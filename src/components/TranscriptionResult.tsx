"use client";

import { useState } from "react";
import { TranscriptionSegment } from "@/lib/types";

interface TranscriptionResultProps {
  segments: TranscriptionSegment[];
  setSegments: (segments: TranscriptionSegment[]) => void;
  fileName: string;
  duration: number;
  detectedLanguage: string;
  modelUsed: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatDate(): string {
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${days[now.getDay()]} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function TranscriptionResult({
  segments,
  setSegments,
  fileName,
  duration,
  detectedLanguage,
  modelUsed,
}: TranscriptionResultProps) {
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"txt" | "srt" | "vtt">("txt");

  const fullText = segments
    .map((s) => `${s.timestamp}\n${s.text}`)
    .join("\n\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateTxt = (): string => {
    const header = `VoiceScribe Transcription
File: ${fileName}
Date: ${formatDate()}
Duration: ${formatDuration(duration)}
Language: ${detectedLanguage}
Model: ${modelUsed}

---

`;
    return header + fullText;
  };

  const generateSrt = (): string => {
    return segments
      .map((s, i) => {
        const timeMatch = s.timestamp.match(/\[(\d+):(\d+)\]/);
        const startMins = timeMatch ? parseInt(timeMatch[1]) : 0;
        const startSecs = timeMatch ? parseInt(timeMatch[2]) : 0;
        const nextSeg = segments[i + 1];
        const nextMatch = nextSeg?.timestamp.match(/\[(\d+):(\d+)\]/);
        const endMins = nextMatch ? parseInt(nextMatch[1]) : startMins;
        const endSecs = nextMatch ? parseInt(nextMatch[2]) : startSecs + 5;

        const startTime = `00:${String(startMins).padStart(2, "0")}:${String(startSecs).padStart(2, "0")},000`;
        const endTime = `00:${String(endMins).padStart(2, "0")}:${String(endSecs).padStart(2, "0")},000`;

        return `${i + 1}\n${startTime} --> ${endTime}\n${s.text}`;
      })
      .join("\n\n");
  };

  const generateVtt = (): string => {
    const header = "WEBVTT\n\n";
    return (
      header +
      segments
        .map((s, i) => {
          const timeMatch = s.timestamp.match(/\[(\d+):(\d+)\]/);
          const startMins = timeMatch ? parseInt(timeMatch[1]) : 0;
          const startSecs = timeMatch ? parseInt(timeMatch[2]) : 0;
          const nextSeg = segments[i + 1];
          const nextMatch = nextSeg?.timestamp.match(/\[(\d+):(\d+)\]/);
          const endMins = nextMatch ? parseInt(nextMatch[1]) : startMins;
          const endSecs = nextMatch ? parseInt(nextMatch[2]) : startSecs + 5;

          const startTime = `00:${String(startMins).padStart(2, "0")}:${String(startSecs).padStart(2, "0")}.000`;
          const endTime = `00:${String(endMins).padStart(2, "0")}:${String(endSecs).padStart(2, "0")}.000`;

          return `${startTime} --> ${endTime}\n${s.text}`;
        })
        .join("\n\n")
    );
  };

  const handleDownload = () => {
    let content: string;
    let ext: string;
    let mimeType: string;

    switch (downloadFormat) {
      case "srt":
        content = generateSrt();
        ext = "srt";
        mimeType = "text/plain";
        break;
      case "vtt":
        content = generateVtt();
        ext = "vtt";
        mimeType = "text/vtt";
        break;
      default:
        content = generateTxt();
        ext = "txt";
        mimeType = "text/plain";
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const downloadName = `VoiceScribe_${baseName}_${dateStr}.${ext}`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSegmentEdit = (index: number, newText: string) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], text: newText };
    setSegments(updated);
  };

  return (
    <section className="py-8 px-6 md:px-12" id="result">
      <div className="max-w-content mx-auto">
        <div className="bg-[var(--card-bg)] rounded-card shadow-md border border-[var(--border-color)] overflow-hidden">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-6 border-b border-[var(--border-color)] bg-[var(--secondary-bg)]">
            <div>
              <h2 className="text-xl font-bold">Transcription Result</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {fileName} • {formatDuration(duration)} •{" "}
                {detectedLanguage.toUpperCase()} • {modelUsed}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm border border-[var(--border-color)] rounded-btn hover:bg-[var(--secondary-bg)] transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </>
                )}
              </button>

              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as "txt" | "srt" | "vtt")}
                className="px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--border-color)] rounded-btn"
              >
                <option value="txt">.TXT</option>
                <option value="srt">.SRT</option>
                <option value="vtt">.VTT</option>
              </select>

              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-white font-semibold rounded-btn transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>

          {/* Transcription content */}
          <div className="p-4 md:p-6 max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={index} className="group">
                  <span className="text-xs font-mono text-accent font-semibold">
                    {segment.timestamp}
                  </span>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleSegmentEdit(index, e.currentTarget.textContent || "")
                    }
                    className="mt-1 text-[var(--foreground)] leading-relaxed outline-none border border-transparent hover:border-[var(--border-color)] focus:border-accent rounded px-2 py-1 -mx-2 transition-colors"
                  >
                    {segment.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit hint */}
          <div className="px-4 md:px-6 pb-4 text-xs text-[var(--text-secondary)]">
            Click on any text to edit before downloading.
          </div>
        </div>
      </div>
    </section>
  );
}
