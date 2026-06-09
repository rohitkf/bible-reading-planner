"use client";

import { useState, useEffect, useCallback } from "react";

export function useProgress(planKey: string, totalDays: number) {
  const storageKey = `bible-plan-progress-${planKey}`;
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCompleted(new Set(JSON.parse(raw) as number[]));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey]);

  const toggle = useCallback(
    (day: number) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(day)) next.delete(day);
        else next.add(day);
        try {
          localStorage.setItem(storageKey, JSON.stringify([...next]));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  const reset = useCallback(() => {
    setCompleted(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const completedCount = completed.size;
  const pct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return { completed, toggle, reset, completedCount, pct, hydrated };
}
