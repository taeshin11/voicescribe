export interface TranscriptionSegment {
  timestamp: string;
  text: string;
}

export interface HistoryEntry {
  id: string;
  fileName: string;
  date: string;
  duration: number;
  language: string;
  segments: TranscriptionSegment[];
}

export type ModelOption = {
  id: string;
  label: string;
  description: string;
  size: string;
};

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "Xenova/whisper-tiny",
    label: "Tiny",
    description: "Fastest, lower accuracy",
    size: "~75MB",
  },
  {
    id: "Xenova/whisper-small",
    label: "Small",
    description: "Balanced speed & accuracy",
    size: "~250MB",
  },
  {
    id: "Xenova/whisper-medium",
    label: "Medium",
    description: "Best accuracy, slower",
    size: "~750MB",
  },
];
