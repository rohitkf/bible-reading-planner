"use client";

import { useState } from "react";
import type { DayReading } from "@/lib/planGenerator";

interface DayItemProps {
  day: DayReading;
  completedReadings: Set<string>;
  onToggleReading: (day: number, idx: number) => void;
  onToggleDay: (day: number, total: number, complete: boolean) => void;
}

export default function DayItem({
  day,
  completedReadings,
  onToggleReading,
  onToggleDay,
}: DayItemProps) {
  const [expanded, setExpanded] = useState(false);

  const total = day.readings.length;
  const doneCount = day.readings.filter((_, i) =>
    completedReadings.has(`${day.day}-${i}`)
  ).length;
  const allDone = total > 0 && doneCount === total;
  const partial = doneCount > 0 && !allDone;

  return (
    <div
      className={`border-b border-bible-border transition-opacity ${
        allDone ? "opacity-55" : ""
      }`}
    >
      {/* ── Collapsed row ── */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Day-level circle — select-all / clear-all */}
        <button
          onClick={() => onToggleDay(day.day, total, !allDone)}
          aria-label={allDone ? "Mark day as unread" : "Mark all readings as done"}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          style={{
            borderColor: allDone ? "#4a8a60" : partial ? "#c8963c" : "#534e42",
            backgroundColor: allDone ? "#4a8a60" : "transparent",
          }}
        >
          {allDone && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4L4.5 7.5L11 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {partial && <div className="w-2 h-2 rounded-full bg-bible-gold" />}
        </button>

        {/* Day metadata + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-bible-dim uppercase mb-0.5">
            <span>Day {day.day}</span>
            <span>·</span>
            <span>{day.chapterCount}ch</span>
            {partial && (
              <span className="text-bible-gold-muted font-medium">
                {doneCount}/{total}
              </span>
            )}
          </div>
          <div className="font-serif italic text-bible-gold text-base leading-tight truncate">
            {day.title}
          </div>
        </div>

        {/* Expand chevron */}
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse" : "Expand readings"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Expanded reading checklist ── */}
      {expanded && (
        <div className="px-4 pb-4 ml-9">
          <div className="border-t border-bible-border pt-3 space-y-1.5">
            {day.readings.map((reading, i) => {
              const done = completedReadings.has(`${day.day}-${i}`);
              return (
                <button
                  key={i}
                  onClick={() => onToggleReading(day.day, i)}
                  className="w-full flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded py-0.5"
                >
                  {/* Square checkbox */}
                  <div
                    className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all"
                    style={{
                      borderColor: done ? "#4a8a60" : "#534e42",
                      backgroundColor: done ? "#4a8a60" : "transparent",
                    }}
                  >
                    {done && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      done
                        ? "text-bible-dim line-through"
                        : "text-bible-muted group-hover:text-bible-text"
                    }`}
                  >
                    {reading}
                  </span>
                </button>
              );
            })}

            <div className="text-[11px] text-bible-dim pt-2 tracking-wide">
              ~{Math.round(day.chapterCount * 3)} min reading time
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
