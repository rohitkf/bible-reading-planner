"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours

const MESSAGES = [
  "Time for your Bible reading! Open a chapter and let it speak to you.",
  "A few chapters a day — your streak is worth protecting. Keep going!",
  "The Word is waiting. Even one chapter makes a difference today.",
  "You're on a journey through the whole Bible. Don't stop now!",
  "Small steps, big story. Your reading today matters.",
  "Every chapter brings you closer to completing your plan. You've got this.",
  "The ancient words are still alive. Carve out a few minutes today.",
  "Reading the Bible isn't just a goal — it's a daily gift to yourself.",
];

export type NotificationState = "unsupported" | "default" | "granted" | "denied";

export function useNotifications(progressPct: number) {
  const [permission, setPermission] = useState<NotificationState>("unsupported");
  const [dismissed, setDismissed] = useState(false);
  const progressRef = useRef(progressPct);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep progressRef current without resetting the interval
  useEffect(() => {
    progressRef.current = progressPct;
  }, [progressPct]);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission as NotificationState);
    try {
      const d = localStorage.getItem("bible-plan-notification-dismissed");
      if (d === "true") setDismissed(true);
    } catch { /* ignore */ }
  }, []);

  const sendNotification = useCallback(() => {
    if (typeof window === "undefined" || Notification.permission !== "granted") return;
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const pct = progressRef.current;
    const body = pct > 0 ? `${msg} (${pct}% complete)` : msg;
    new Notification("Bible Reading Reminder", {
      body,
      icon: "/favicon.ico",
    });
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(sendNotification, INTERVAL_MS);
  }, [sendNotification]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as NotificationState);
    if (result === "granted") {
      new Notification("Bible Reading Reminder", {
        body: "Reminders enabled! We'll check in every 3 hours to keep you on track.",
        icon: "/favicon.ico",
      });
      startInterval();
    }
  }, [startInterval]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem("bible-plan-notification-dismissed", "true");
    } catch { /* ignore */ }
  }, []);

  // Start interval immediately if already granted
  useEffect(() => {
    if (permission === "granted") {
      startInterval();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [permission, startInterval]);

  const showBanner =
    permission === "default" && !dismissed;

  return { permission, showBanner, requestPermission, dismiss };
}
