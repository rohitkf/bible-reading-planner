"use client";

interface InstallBannerProps {
  isIOS: boolean;
  canInstall: boolean; // Android deferred prompt available
  onInstall: () => void;
  onDismiss: () => void;
}

export default function InstallBanner({
  isIOS,
  canInstall,
  onInstall,
  onDismiss,
}: InstallBannerProps) {
  return (
    <div className="mx-4 mt-3 mb-1 rounded-lg border border-bible-border bg-bible-surface px-4 py-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Phone icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-bible-gold flex-shrink-0 mt-0.5"
          >
            <rect x="2.5" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="7" cy="11" r="0.7" fill="currentColor" />
            <line x1="5" y1="2.8" x2="9" y2="2.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] tracking-widest uppercase text-bible-muted font-medium">
            Add to Home Screen
          </span>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded flex-shrink-0"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {isIOS ? (
        /* iOS: step-by-step instructions */
        <div className="space-y-2">
          <p className="text-xs text-bible-muted">
            Install this app on your iPhone or iPad:
          </p>
          <ol className="space-y-1.5">
            <li className="flex items-center gap-2 text-xs text-bible-dim">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-bible-card border border-bible-border flex items-center justify-center text-[9px] text-bible-muted font-semibold">
                1
              </span>
              <span>
                Tap the{" "}
                <span className="inline-flex items-center gap-0.5 text-bible-muted">
                  {/* iOS share icon */}
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="inline-block">
                    <path
                      d="M5.5 1v8M2.5 4L5.5 1l3 3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.5 7v4.5h8V7"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <strong className="font-medium">Share</strong>
                </span>{" "}
                button in Safari&apos;s toolbar
              </span>
            </li>
            <li className="flex items-center gap-2 text-xs text-bible-dim">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-bible-card border border-bible-border flex items-center justify-center text-[9px] text-bible-muted font-semibold">
                2
              </span>
              <span>
                Scroll down and tap{" "}
                <strong className="text-bible-muted font-medium">&ldquo;Add to Home Screen&rdquo;</strong>
              </span>
            </li>
            <li className="flex items-center gap-2 text-xs text-bible-dim">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-bible-card border border-bible-border flex items-center justify-center text-[9px] text-bible-muted font-semibold">
                3
              </span>
              <span>
                Tap <strong className="text-bible-muted font-medium">&ldquo;Add&rdquo;</strong> — done!
              </span>
            </li>
          </ol>
        </div>
      ) : canInstall ? (
        /* Android: one-tap install */
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-bible-muted">
            Install for quick access from your home screen.
          </p>
          <button
            onClick={onInstall}
            className="flex-shrink-0 bg-bible-gold hover:bg-bible-gold-light text-bible-bg text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          >
            Install
          </button>
        </div>
      ) : null}
    </div>
  );
}
