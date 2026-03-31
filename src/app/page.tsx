"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroUpload from "@/components/HeroUpload";
import HowItWorks from "@/components/HowItWorks";
import TranscriptionResult from "@/components/TranscriptionResult";
import FAQ from "@/components/FAQ";
import SupportedFormats from "@/components/SupportedFormats";
import History from "@/components/History";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { TranscriptionSegment } from "@/lib/types";

export default function Home() {
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [modelUsed, setModelUsed] = useState("whisper-small");
  const [selectedModel, setSelectedModel] = useState<string>("Xenova/whisper-small");
  const [hasResult, setHasResult] = useState(false);

  const handleTranscriptionComplete = useCallback(
    (result: {
      segments: TranscriptionSegment[];
      fileName: string;
      duration: number;
      language: string;
      model: string;
    }) => {
      setSegments(result.segments);
      setFileName(result.fileName);
      setDuration(result.duration);
      setDetectedLanguage(result.language);
      setModelUsed(result.model);
      setIsTranscribing(false);
      setHasResult(true);
      setProgress(100);

      // Save to history
      try {
        const history = JSON.parse(localStorage.getItem("voicescribe_history") || "[]");
        const entry = {
          id: Date.now().toString(),
          fileName: result.fileName,
          date: new Date().toISOString(),
          duration: result.duration,
          language: result.language,
          segments: result.segments,
        };
        history.unshift(entry);
        if (history.length > 10) history.pop();
        localStorage.setItem("voicescribe_history", JSON.stringify(history));
      } catch {
        // localStorage might be full
      }
    },
    []
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header selectedModel={selectedModel} onModelChange={setSelectedModel} />

      <AdBanner position="top" />

      <main className="flex-1">
        <HeroUpload
          isTranscribing={isTranscribing}
          setIsTranscribing={setIsTranscribing}
          progress={progress}
          setProgress={setProgress}
          progressMessage={progressMessage}
          setProgressMessage={setProgressMessage}
          selectedModel={selectedModel}
          onTranscriptionComplete={handleTranscriptionComplete}
        />

        {hasResult && (
          <TranscriptionResult
            segments={segments}
            setSegments={setSegments}
            fileName={fileName}
            duration={duration}
            detectedLanguage={detectedLanguage}
            modelUsed={modelUsed}
          />
        )}

        <History
          onRestore={(segments, fileName, dur, lang) => {
            setSegments(segments);
            setFileName(fileName);
            setDuration(dur);
            setDetectedLanguage(lang);
            setHasResult(true);
          }}
        />

        <HowItWorks />

        <AdBanner position="native" />

        <SupportedFormats />

        <FAQ />
      </main>

      <AdBanner position="bottom" />

      <Footer />
    </div>
  );
}
