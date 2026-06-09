"use client";

import { useState } from "react";
import DayItem from "./DayItem";
import type { DayReading } from "@/lib/planGenerator";

interface MonthGroupProps {
  monthNumber: number;
  days: DayReading[];
  completed: Set<number>;
  onToggle: (day: number) => void;
  defaultOpen?: boolean;
}

export default function MonthGroup({
  monthNumber,
  days,
  completed,
  onToggle,
  defaultOpen = false,
}: MonthGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const completedInMonth = days.filter((d) => completed.has(d.day)).length;
  const allDone = completedInMonth === days.length;

  return (
    <div className="border-b border-bible-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bible-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-1.5 h-1.5 rounded-full ${allDone ? "bg-bible-success" : "bg-bible-gold-muted"}`}
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
            {completedInMonth}/{days.length}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-bible-dim transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div>
          {days.map((day) => (
            <DayItem
              key={day.day}
              day={day}
              isCompleted={completed.has(day.day)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
