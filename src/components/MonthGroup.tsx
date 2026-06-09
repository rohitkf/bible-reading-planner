"use client";

import { useState } from "react";
import DayItem from "./DayItem";
import type { DayReading } from "@/lib/planGenerator";

interface MonthGroupProps {
  monthNumber: number;
  days: DayReading[];
  completedReadings: Set<string>;
  onToggleReading: (day: number, idx: number) => void;
  onToggleDay: (day: number, total: number, complete: boolean) => void;
  defaultOpen?: boolean;
}

export default function MonthGroup({
  monthNumber,
  days,
  completedReadings,
  onToggleReading,
  onToggleDay,
  defaultOpen = false,
}: MonthGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  // Count fully-completed days in this month
  const completedDays = days.filter((d) =>
    d.readings.length > 0 &&
    d.readings.every((_, i) => completedReadings.has(`${d.day}-${i}`))
  ).length;
  const allDone = completedDays === days.length;

  return (
    <div className="border-b border-bible-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bible-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              allDone ? "bg-bible-success" : "bg-bible-gold-muted"
            }`}
          />
          <span className="text-xs tracking-widest uppercase text-bible-muted">
            Month {monthNumber}
          </span>
          <span className="text-xs text-bible-dim">
            Days {days[0].day}–{days[days.length - 1].day}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-bible-dim">
            {completedDays}/{days.length}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-bible-dim transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div>
          {days.map((day) => (
            <DayItem
              key={day.day}
              day={day}
              completedReadings={completedReadings}
              onToggleReading={onToggleReading}
              onToggleDay={onToggleDay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
