"use client";

interface NotificationBannerProps {
  onEnable: () => void;
  onDismiss: () => void;
}

export default function NotificationBanner({
  onEnable,
  onDismiss,
}: NotificationBannerProps) {
  return (
    <div className="mx-4 mt-4 mb-1 rounded-lg border border-bible-border bg-bible-surface px-4 py-3 flex items-start gap-3">
      {/* Bell icon */}
      <div className="flex-shrink-0 mt-0.5 text-bible-gold">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5A4.5 4.5 0 0 0 3.5 6v2.5l-1 2h11l-1-2V6A4.5 4.5 0 0 0 8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 12.5a1.5 1.5 0 0 0 3 0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-bible-muted leading-relaxed">
          Get a gentle reminder every 3 hours to keep up with your reading.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={onEnable}
            className="text-[11px] tracking-widest uppercase text-bible-gold hover:text-bible-gold-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
          >
            Enable
          </button>
          <button
            onClick={onDismiss}
            className="text-[11px] tracking-widest uppercase text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
          >
            No thanks
          </button>
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M1 1l10 10M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
