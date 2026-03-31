"use client";

import { useState, useRef, useCallback } from "react";
import { TranscriptionSegment } from "@/lib/types";
import { transcribeAudio, extractAudioFromFile } from "@/lib/transcribe";
import { sendTranscriptionEvent } from "@/lib/webhook";

const ACCEPTED_FORMATS = [
  ".mp4", ".m4a", ".mp3", ".wav", ".webm", ".ogg", ".mov", ".avi", ".flac",
];
const ACCEPTED_MIME = [
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/x-wav", "audio/webm",
  "audio/ogg", "audio/flac", "audio/x-m4a", "video/mp4", "video/webm",
  "video/quicktime", "video/x-msvideo",
];
const MAX_SIZE_MB = 500;

interface HeroUploadProps {
  isTranscribing: boolean;
  setIsTranscribing: (v: boolean) => void;
  progress: number;
  setProgress: (v: number) => void;
  progressMessage: string;
  setProgressMessage: (v: string) => void;
  selectedModel: string;
  onTranscriptionComplete: (result: {
    segments: TranscriptionSegment[];
    fileName: string;
    duration: number;
    language: string;
    model: string;
  }) => void;
}

export default function HeroUpload({
  isTranscribing,
  setIsTranscribing,
  progress,
  setProgress,
  progressMessage,
  setProgressMessage,
  selectedModel,
  onTranscriptionComplete,
}: HeroUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
      return `Unsupported format "${ext}". Supported: ${ACCEPTED_FORMATS.join(", ")}`;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      return `File too large (${sizeMB.toFixed(1)}MB). Maximum: ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError("");
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setSelectedFile(file);
    },
    [validateFile]
  );

  const startTranscription = useCallback(async () => {
    if (!selectedFile) return;

    setIsTranscribing(true);
    setError("");
    setProgress(0);
    setProgressMessage("Preparing file...");

    try {
      const { audioData, duration } = await extractAudioFromFile(
        selectedFile,
        (p, msg) => {
          setProgress(p);
          setProgressMessage(msg);
        }
      );

      const { segments, language } = await transcribeAudio(
        audioData,
        selectedModel,
        (p, msg) => {
          setProgress(p);
          setProgressMessage(msg);
        }
      );

      const modelLabel = selectedModel.split("/").pop() || "whisper-small";

      onTranscriptionComplete({
        segments,
        fileName: selectedFile.name,
        duration,
        language,
        model: modelLabel,
      });

      // Silent webhook POST
      const totalChars = segments.reduce((sum, s) => sum + s.text.length, 0);
      sendTranscriptionEvent({
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size_mb: parseFloat((selectedFile.size / (1024 * 1024)).toFixed(2)),
        duration_seconds: Math.round(duration),
        detected_language: language,
        transcription_length_chars: totalChars,
        model_used: modelLabel,
      });
    } catch (err) {
      console.error("Transcription error:", err);
      setError(
        err instanceof Error
          ? `Transcription failed: ${err.message}`
          : "Transcription failed. Please try a different file or model."
      );
      setIsTranscribing(false);
    }
  }, [selectedFile, selectedModel, setIsTranscribing, setProgress, setProgressMessage, onTranscriptionComplete]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-content mx-auto text-center">
        {/* Hero text */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-balance">
          Free Audio & Video{" "}
          <span className="text-accent">Transcription</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-2 max-w-2xl mx-auto">
          Upload. Transcribe. Download. — Convert audio & video to text in
          seconds, right in your browser.
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Your files never leave your device. All processing happens locally.
        </p>

        {/* Upload zone */}
        <div
          className={`
            relative max-w-2xl mx-auto rounded-card border-2 border-dashed p-8 md:p-12
            transition-all duration-200 cursor-pointer
            ${
              isDragging
                ? "upload-zone-active border-accent bg-accent/5"
                : "border-[var(--border-color)] hover:border-accent/50 hover:bg-[var(--secondary-bg)]"
            }
            ${isTranscribing ? "pointer-events-none opacity-70" : ""}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isTranscribing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          {!selectedFile && !isTranscribing && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">
                  Drop your file here or{" "}
                  <span className="text-accent">browse</span>
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  MP4, M4A, MP3, WAV, WebM, OGG, MOV, AVI, FLAC — up to 500MB
                </p>
              </div>
            </div>
          )}

          {selectedFile && !isTranscribing && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {formatFileSize(selectedFile.size)} •{" "}
                  {selectedFile.type || "unknown type"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startTranscription();
                  }}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-btn transition-colors duration-150 shadow-md hover:shadow-lg"
                >
                  Transcribe Now
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setError("");
                  }}
                  className="px-4 py-2.5 border border-[var(--border-color)] rounded-btn hover:bg-[var(--secondary-bg)] transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isTranscribing && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-accent animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <div className="w-full max-w-md">
                <p className="text-sm font-medium mb-2">{progressMessage}</p>
                <div className="h-3 bg-[var(--secondary-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar-animated rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(progress, 2)}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 max-w-2xl mx-auto p-3 bg-error/10 border border-error/20 rounded-btn text-error text-sm">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
