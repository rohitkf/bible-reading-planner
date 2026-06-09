"use client";

import { useState, useEffect, useCallback } from "react";

export function useProgress(planKey: string) {
  const storageKey = `bible-plan-chapters-${planKey}`;
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompletedChapters(new Set(JSON.parse(raw) as string[]));
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

  const toggleChapter = useCallback(
    (dayNum: number, chapterIdx: number) => {
      setCompletedChapters((prev) => {
        const key = `${dayNum}-${chapterIdx}`;
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  // Mark/unmark all chapters in a reading group
  const setGroupComplete = useCallback(
    (dayNum: number, startIdx: number, count: number, complete: boolean) => {
      setCompletedChapters((prev) => {
        const next = new Set(prev);
        for (let i = startIdx; i < startIdx + count; i++) {
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

  // Mark/unmark all chapters for an entire day
  const setDayComplete = useCallback(
    (dayNum: number, totalChapters: number, complete: boolean) => {
      setCompletedChapters((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < totalChapters; i++) {
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
    setCompletedChapters(new Set());
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return {
    completedChapters,
    toggleChapter,
    setGroupComplete,
    setDayComplete,
    reset,
    hydrated,
  };
}
