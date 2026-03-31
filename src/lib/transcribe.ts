import { TranscriptionSegment } from "./types";

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}]`;
}

export async function transcribeAudio(
  audioData: Float32Array,
  modelId: string,
  onProgress: (progress: number, message: string) => void
): Promise<{ segments: TranscriptionSegment[]; language: string }> {
  onProgress(5, "Loading AI model...");

  const { pipeline, env } = await import("@xenova/transformers");

  // Configure environment
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  onProgress(10, "Initializing transcription model...");

  const transcriber = await pipeline(
    "automatic-speech-recognition",
    modelId,
    {
      progress_callback: (data: { status: string; progress?: number; file?: string }) => {
        if (data.status === "progress" && data.progress) {
          const loadProgress = 10 + data.progress * 0.4;
          onProgress(
            Math.min(loadProgress, 50),
            `Downloading model: ${Math.round(data.progress)}%`
          );
        } else if (data.status === "done") {
          onProgress(50, "Model loaded. Starting transcription...");
        }
      },
    }
  );

  onProgress(55, "Transcribing audio...");

  const result = await transcriber(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
    language: undefined,
    task: "transcribe",
    return_timestamps: true,
  });

  onProgress(90, "Processing results...");

  // Parse segments from result
  const segments: TranscriptionSegment[] = [];
  const detectedLanguage = "en";

  if (result && typeof result === "object") {
    const output = result as {
      text?: string;
      chunks?: Array<{
        text: string;
        timestamp: [number, number | null];
      }>;
      language?: string;
    };

    if (output.chunks && output.chunks.length > 0) {
      for (const chunk of output.chunks) {
        const startTime = chunk.timestamp[0] || 0;
        segments.push({
          timestamp: formatTimestamp(startTime),
          text: chunk.text.trim(),
        });
      }
    } else if (output.text) {
      // No timestamps available, split by sentences
      const sentences = output.text.match(/[^.!?]+[.!?]+/g) || [output.text];
      let currentTime = 0;
      const timePerSentence = audioData.length / 16000 / sentences.length;

      for (const sentence of sentences) {
        segments.push({
          timestamp: formatTimestamp(currentTime),
          text: sentence.trim(),
        });
        currentTime += timePerSentence;
      }
    }
  }

  // If no segments were created, add a fallback
  if (segments.length === 0) {
    segments.push({
      timestamp: "[00:00]",
      text: "No speech detected in the audio.",
    });
  }

  onProgress(100, "Transcription complete!");

  return { segments, language: detectedLanguage };
}

export async function extractAudioFromFile(
  file: File,
  onProgress: (progress: number, message: string) => void
): Promise<{ audioData: Float32Array; duration: number }> {
  const isVideo = file.type.startsWith("video/") ||
    [".mp4", ".mov", ".avi", ".webm"].some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

  if (isVideo) {
    onProgress(1, "Extracting audio from video...");
  } else {
    onProgress(1, "Processing audio file...");
  }

  // Use Web Audio API to decode
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
    sampleRate: 16000,
  });

  onProgress(3, "Decoding audio...");

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const duration = audioBuffer.duration;

  // Convert to mono 16kHz Float32Array
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const monoData = new Float32Array(length);

  if (numChannels === 1) {
    audioBuffer.copyFromChannel(monoData, 0);
  } else {
    // Mix down to mono
    for (let ch = 0; ch < numChannels; ch++) {
      const channelData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        monoData[i] += channelData[i] / numChannels;
      }
    }
  }

  await audioContext.close();
  onProgress(5, "Audio ready for transcription.");

  return { audioData: monoData, duration };
}
