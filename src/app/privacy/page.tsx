import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — VoiceScribe",
  description: "VoiceScribe privacy policy. Your files never leave your device.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              Your Privacy Matters
            </h2>
            <p>
              VoiceScribe is designed with your privacy as a top priority. All
              audio and video transcription processing happens entirely within
              your web browser. <strong>Your files are never uploaded to any server.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              What We Don&apos;t Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>We never upload, access, or store your audio/video files</li>
              <li>We never access or store your transcription results</li>
              <li>We do not require any account, login, or personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              What We Collect
            </h2>
            <p>
              We collect anonymous, aggregated usage data to improve the service:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>File format and size (not the file itself)</li>
              <li>Audio duration</li>
              <li>Detected language</li>
              <li>Transcription length (character count only)</li>
              <li>AI model used</li>
              <li>Browser user-agent string</li>
              <li>Page URL and referrer</li>
            </ul>
            <p className="mt-2">
              This data is sent to a private Google Sheets webhook and is used
              solely for understanding usage patterns and improving VoiceScribe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              Advertising
            </h2>
            <p>
              VoiceScribe uses Adsterra advertising network to support free
              operation. Adsterra may use cookies and tracking technologies as
              described in their own privacy policy. We do not control or have
              access to data collected by advertising partners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              Local Storage
            </h2>
            <p>
              VoiceScribe uses browser local storage to save your preferences
              (dark mode, AI model selection) and recent transcription history.
              This data stays on your device and can be cleared at any time
              through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us
              through the website.
            </p>
          </section>

          <p className="text-sm text-[var(--text-secondary)] pt-4 border-t border-[var(--border-color)]">
            Last updated: April 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
