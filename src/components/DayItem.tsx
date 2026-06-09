"use client";

import { useState } from "react";
import type { DayReading } from "@/lib/planGenerator";

interface DayItemProps {
  day: DayReading;
  isCompleted: boolean;
  onToggle: (day: number) => void;
}

export default function DayItem({ day, isCompleted, onToggle }: DayItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border-b border-bible-border transition-colors ${isCompleted ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(day.day)}
          aria-label={isCompleted ? "Mark as unread" : "Mark as read"}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          style={{
            borderColor: isCompleted ? "#4a8a60" : "#534e42",
            backgroundColor: isCompleted ? "#4a8a60" : "transparent",
          }}
        >
          {isCompleted && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Day info */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-widest text-bible-dim uppercase mb-0.5">
            Day {day.day}
            <span className="mx-1.5">·</span>
            {day.chapterCount}ch
          </div>
          <div className="font-serif italic text-bible-gold text-base leading-tight truncate">
            {day.title}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Expanded readings */}
      {expanded && (
        <div className="px-4 pb-4 ml-9">
          <div className="border-t border-bible-border pt-3 space-y-1">
            {day.readings.map((r, i) => (
              <div key={i} className="text-sm text-bible-muted">
                {r}
              </div>
            ))}
            <div className="text-[11px] text-bible-dim mt-2 tracking-wide">
              ~{Math.round(day.chapterCount * 3)} min reading time
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
