"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
  pct: number;
}

export default function ProgressBar({ completed, total, pct }: ProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs tracking-wider text-bible-muted mb-2 uppercase">
        <span>{completed} of {total} days</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-0.5 bg-bible-border rounded-full overflow-hidden">
        <div
          className="h-full bg-bible-gold rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
