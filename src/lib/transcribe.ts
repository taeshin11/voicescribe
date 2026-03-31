import { TranscriptionSegment } from "./types";

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}]`;
}

// Cache the pipeline to avoid re-downloading model
let cachedTranscriber: Awaited<ReturnType<typeof createPipeline>> | null = null;
let cachedModelId: string | null = null;

async function createPipeline(
  modelId: string,
  onProgress: (progress: number, message: string) => void
) {
  const transformers = await import("@xenova/transformers");
  const { pipeline, env } = transformers;

  // Configure for browser-only usage
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  return await pipeline("automatic-speech-recognition", modelId, {
    progress_callback: (data: {
      status: string;
      progress?: number;
      file?: string;
    }) => {
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
  });
}

export async function transcribeAudio(
  audioData: Float32Array,
  modelId: string,
  onProgress: (progress: number, message: string) => void
): Promise<{ segments: TranscriptionSegment[]; language: string }> {
  onProgress(5, "Loading AI model...");

  try {
    onProgress(10, "Initializing transcription model...");

    // Reuse cached pipeline if same model
    if (!cachedTranscriber || cachedModelId !== modelId) {
      cachedTranscriber = await createPipeline(modelId, onProgress);
      cachedModelId = modelId;
    } else {
      onProgress(50, "Model already loaded. Starting transcription...");
    }

    onProgress(55, "Transcribing audio...");

    const result = await cachedTranscriber(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5,
      task: "transcribe",
      return_timestamps: true,
    });

    onProgress(90, "Processing results...");

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
        const sentences = output.text.match(/[^.!?]+[.!?]+/g) || [
          output.text,
        ];
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

    if (segments.length === 0) {
      segments.push({
        timestamp: "[00:00]",
        text: "No speech detected in the audio.",
      });
    }

    onProgress(100, "Transcription complete!");
    return { segments, language: detectedLanguage };
  } catch (error) {
    // Reset cache on error so user can retry
    cachedTranscriber = null;
    cachedModelId = null;

    const msg =
      error instanceof Error ? error.message : "Unknown transcription error";

    // Provide helpful error messages
    if (msg.includes("Unsupported model type")) {
      throw new Error(
        "Model loading failed. Please try the Tiny model, or refresh the page and try again."
      );
    }
    if (msg.includes("memory") || msg.includes("OOM")) {
      throw new Error(
        "Not enough memory. Try the Tiny model or close other browser tabs."
      );
    }
    throw error;
  }
}

export async function extractAudioFromFile(
  file: File,
  onProgress: (progress: number, message: string) => void
): Promise<{ audioData: Float32Array; duration: number }> {
  const isVideo =
    file.type.startsWith("video/") ||
    [".mp4", ".mov", ".avi", ".webm"].some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

  if (isVideo) {
    onProgress(1, "Extracting audio from video...");
  } else {
    onProgress(1, "Processing audio file...");
  }

  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext ||
    (
      window as unknown as {
        webkitAudioContext: typeof AudioContext;
      }
    ).webkitAudioContext)({
    sampleRate: 16000,
  });

  onProgress(3, "Decoding audio...");

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const duration = audioBuffer.duration;

  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const monoData = new Float32Array(length);

  if (numChannels === 1) {
    audioBuffer.copyFromChannel(monoData, 0);
  } else {
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
