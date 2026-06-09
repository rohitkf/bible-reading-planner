"use client";

import { useState, useEffect, useCallback } from "react";

export function useProgress(planKey: string) {
  const storageKey = `bible-plan-readings-${planKey}`;
  const [completedReadings, setCompletedReadings] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompletedReadings(new Set(JSON.parse(raw) as string[]));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey]);

  const persist = useCallback(
    (next: Set<string>) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const toggleReading = useCallback(
    (dayNum: number, readingIdx: number) => {
      setCompletedReadings((prev) => {
        const key = `${dayNum}-${readingIdx}`;
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Marks all readings in a day as complete or clears them all
  const setDayComplete = useCallback(
    (dayNum: number, totalReadings: number, complete: boolean) => {
      setCompletedReadings((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < totalReadings; i++) {
          const key = `${dayNum}-${i}`;
          if (complete) next.add(key);
          else next.delete(key);
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setCompletedReadings(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return { completedReadings, toggleReading, setDayComplete, reset, hydrated };
}
