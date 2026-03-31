export default function SupportedFormats() {
  const formats = [
    { ext: "MP4", type: "Video", icon: "film" },
    { ext: "M4A", type: "Audio", icon: "music" },
    { ext: "MP3", type: "Audio", icon: "music" },
    { ext: "WAV", type: "Audio", icon: "music" },
    { ext: "WebM", type: "Video", icon: "film" },
    { ext: "OGG", type: "Audio", icon: "music" },
    { ext: "MOV", type: "Video", icon: "film" },
    { ext: "AVI", type: "Video", icon: "film" },
    { ext: "FLAC", type: "Audio", icon: "music" },
  ];

  return (
    <section className="py-16 px-6 md:px-12" id="formats">
      <div className="max-w-content mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Supported Formats
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
          VoiceScribe supports all major audio and video formats. Upload any of
          these file types and get your transcription instantly.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {formats.map((f) => (
            <div
              key={f.ext}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-card p-4 text-center hover:shadow-md hover:border-accent/30 transition-all duration-200"
            >
              <div className="text-accent mb-2">
                {f.icon === "film" ? (
                  <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m12-3.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5m1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75h-12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                )}
              </div>
              <p className="font-semibold text-sm">{f.ext}</p>
              <p className="text-xs text-[var(--text-secondary)]">{f.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
