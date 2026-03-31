import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voicescribe-app.vercel.app"),
  title: "VoiceScribe — Free Audio & Video Transcription Online",
  description:
    "Free browser-based audio and video transcription. Convert MP4, M4A, MP3, WAV files to text instantly. No upload, no sign-up. 무료 음성 텍스트 변환, 녹음 파일 텍스트 변환.",
  keywords: [
    "free audio transcription online",
    "free video to text converter",
    "mp4 to text",
    "m4a to text",
    "voice recording to text",
    "audio to text converter free",
    "무료 음성 텍스트 변환",
    "녹음 파일 텍스트 변환",
    "mp4 텍스트 추출",
    "통화 녹음 텍스트",
    "convert voice memo to text free",
    "transcribe meeting recording online free",
  ],
  authors: [{ name: "VoiceScribe" }],
  openGraph: {
    title: "VoiceScribe — Free Audio & Video Transcription Online",
    description:
      "Upload. Transcribe. Download. Free audio & video transcription in seconds. No sign-up required.",
    url: "https://voicescribe-app.vercel.app",
    siteName: "VoiceScribe",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoiceScribe - Free Audio & Video Transcription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceScribe — Free Audio & Video Transcription Online",
    description:
      "Upload. Transcribe. Download. Free audio & video transcription in seconds.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://voicescribe-app.vercel.app",
    languages: {
      "en-US": "https://voicescribe-app.vercel.app",
      "ko-KR": "https://voicescribe-app.vercel.app",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VoiceScribe",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free browser-based audio and video transcription tool. Convert audio and video files to text instantly using AI.",
  url: "https://voicescribe-app.vercel.app",
  featureList: [
    "Audio transcription",
    "Video transcription",
    "Multiple format support (MP4, M4A, MP3, WAV, WebM, OGG, MOV, AVI, FLAC)",
    "Multilingual support",
    "Browser-based processing",
    "No sign-up required",
    "Free to use",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is VoiceScribe really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, VoiceScribe is completely free. All transcription processing happens directly in your browser using AI, so there are no server costs to pass on to you.",
      },
    },
    {
      "@type": "Question",
      name: "Are my files uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your files never leave your device. All audio and video processing happens entirely in your browser. We never upload, store, or access your files.",
      },
    },
    {
      "@type": "Question",
      name: "What file formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VoiceScribe supports MP4, M4A, MP3, WAV, WebM, OGG, MOV, AVI, and FLAC files. Both audio and video files are accepted.",
      },
    },
    {
      "@type": "Question",
      name: "What languages are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "VoiceScribe supports over 90 languages including English, Korean, Japanese, Chinese, Spanish, French, German, and many more. The language is automatically detected.",
      },
    },
    {
      "@type": "Question",
      name: "Why is the first transcription slow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On your first use, VoiceScribe needs to download the AI model (about 150-400MB depending on the model selected). This is cached in your browser, so subsequent transcriptions start much faster.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#6366F1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme');
                  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-theme">
        {children}
      </body>
    </html>
  );
}
