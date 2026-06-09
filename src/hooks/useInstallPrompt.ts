"use client";

import { useState, useEffect, useCallback } from "react";

// Chrome fires this before showing its own install UI; we can intercept and trigger manually
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "bible-install-dismissed";

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    setIsInstalled(standalone);

    // iOS detection (no beforeinstallprompt — needs manual instructions)
    const ios =
      /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    try {
      if (localStorage.getItem(DISMISSED_KEY) === "true") setDismissed(true);
    } catch { /* ignore */ }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch { /* ignore */ }
  }, []);

  // Show when: not installed, not dismissed, and either iOS or Android has a pending prompt
  const showBanner =
    !isInstalled && !dismissed && (isIOS || deferredPrompt !== null);

  return { showBanner, isIOS, canInstall: deferredPrompt !== null, install, dismiss };
}
