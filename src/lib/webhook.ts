const WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;

export async function sendTranscriptionEvent(data: {
  file_name: string;
  file_type: string;
  file_size_mb: number;
  duration_seconds: number;
  detected_language: string;
  transcription_length_chars: number;
  model_used: string;
}) {
  if (!WEBHOOK_URL) return;

  try {
    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "transcription",
        timestamp: new Date().toISOString(),
        ...data,
        user_agent: navigator.userAgent,
        referrer: document.referrer || "direct",
        page_url: window.location.href,
      }),
    });
  } catch {
    // Fire and forget — never show error to user
  }
}

export async function sendPageView(): Promise<{
  today: number;
  total: number;
} | null> {
  if (!WEBHOOK_URL) return null;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "page_view",
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer || "direct",
      }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Silent failure
  }
  return null;
}

export async function getVisitorCount(): Promise<{
  today: number;
  total: number;
} | null> {
  if (!WEBHOOK_URL) return null;

  try {
    const response = await fetch(WEBHOOK_URL, { method: "GET" });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Silent failure
  }
  return null;
}
