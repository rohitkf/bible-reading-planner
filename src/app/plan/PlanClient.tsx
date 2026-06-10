"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { generatePlan, getTotalDays, formatPlanLabel } from "@/lib/planGenerator";
import { TOTAL_CORE_CHAPTERS, TOTAL_FULL_CHAPTERS, TOTAL_SKIPPED_CHAPTERS } from "@/lib/bibleData";
import { addDays, formatDate, today, daysElapsedSince } from "@/lib/dateUtils";
import { useProgress } from "@/hooks/useProgress";
import { useNotifications } from "@/hooks/useNotifications";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import ProgressBar from "@/components/ProgressBar";
import SectionHeader from "@/components/SectionHeader";
import DayItem from "@/components/DayItem";
import MonthGroup from "@/components/MonthGroup";
import BooksSkipped from "@/components/BooksSkipped";
import NotificationBanner from "@/components/NotificationBanner";
import InstallBanner from "@/components/InstallBanner";

type Tab = "plan" | "skipped";

export default function PlanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [shareCopied, setShareCopied] = useState(false);

  const n = parseInt(searchParams.get("n") ?? "90", 10);
  const unit = (searchParams.get("unit") ?? "days") as "days" | "months" | "years";
  const parallel = searchParams.get("parallel") === "1";
  const skipPoetry = searchParams.get("skipPoetry") !== "0";

  const validN = isNaN(n) || n < 1 ? 90 : n;
  const totalDays = getTotalDays(validN, unit);
  const planLabel = formatPlanLabel(validN, unit);
  const planKey = `${validN}-${unit}${parallel ? "-parallel" : ""}${skipPoetry ? "" : "-full"}`;

  const plan = useMemo(() => generatePlan(totalDays, parallel, skipPoetry), [totalDays, parallel, skipPoetry]);

  const {
    completedChapters,
    toggleChapter,
    setGroupComplete,
    setDayComplete,
    hydrated,
  } = useProgress(planKey);

  // Derive which days are fully done from chapter-level data
  const completedDays = useMemo(() => {
    const set = new Set<number>();
    for (const section of plan.sections) {
      for (const day of section.days) {
        if (
          day.chapterCount > 0 &&
          Array.from({ length: day.chapterCount }, (_, i) =>
            completedChapters.has(`${day.day}-${i}`)
          ).every(Boolean)
        ) {
          set.add(day.day);
        }
      }
    }
    return set;
  }, [completedChapters, plan]);

  const completedCount = completedDays.size;
  const pct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  // Load start date from localStorage (saved when plan was generated)
  const [startDate, setStartDate] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bible-plan-config");
      if (raw) {
        const cfg = JSON.parse(raw) as { startDate?: string };
        setStartDate(cfg.startDate ?? new Date().toISOString().split("T")[0]);
      }
    } catch { /* ignore */ }
  }, []);

  // Original end date: startDate + totalDays
  const originalEndDate = useMemo(() => {
    if (!startDate) return formatDate(addDays(today(), totalDays - 1));
    return formatDate(addDays(new Date(startDate + "T00:00:00"), totalDays - 1));
  }, [startDate, totalDays]);

  // Pace-adjusted end date: only shown when meaningfully ahead of schedule
  const paceEndDate = useMemo(() => {
    if (!startDate || completedCount < 3) return null;
    const elapsed = daysElapsedSince(startDate);
    const pace = completedCount / elapsed; // plan-days completed per calendar day
    if (pace <= 1.1) return null; // not significantly ahead
    const remaining = totalDays - completedCount;
    const estimatedDaysLeft = remaining / pace;
    return formatDate(addDays(today(), estimatedDaysLeft));
  }, [startDate, completedCount, totalDays]);

  const { showBanner, requestPermission, dismiss } = useNotifications(pct);
  const {
    showBanner: showInstallBanner,
    isIOS,
    canInstall,
    install,
    dismiss: dismissInstall,
  } = useInstallPrompt();

  const firstUnreadRef = useRef<HTMLDivElement | null>(null);

  const handleShare = useCallback(async () => {
    const skipPoetryParam = skipPoetry ? "" : "&skipPoetry=0";
    const url = `${window.location.origin}/plan?n=${validN}&unit=${unit}${parallel ? "&parallel=1" : ""}${skipPoetryParam}`;
    const shareData = {
      title: "Bible Reading Plan",
      text: `I'm reading the ${skipPoetry ? "Core" : "Full"} Bible in ${planLabel}! ${pct > 0 ? `${pct}% complete so far. ` : ""}Follow the same plan:`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch { /* user cancelled or not supported */ }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch { /* ignore */ }
  }, [validN, unit, parallel, skipPoetry, planLabel, pct]);

  const scrollToNextUnread = () => {
    firstUnreadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const avgCpd = (skipPoetry ? TOTAL_CORE_CHAPTERS : TOTAL_FULL_CHAPTERS) / totalDays;
  const avgCpdStr =
    avgCpd < 1
      ? avgCpd.toFixed(2)
      : avgCpd < 10
      ? avgCpd.toFixed(1)
      : Math.round(avgCpd).toString();

  const isLongPlan = totalDays > 60;

  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      {/* Back + Share */}
      <div className="px-4 pt-5 pb-1 flex items-center justify-between">
        <button
          onClick={() => router.push(`/?adjust=1&n=${validN}&unit=${unit}${parallel ? "&parallel=1" : ""}${skipPoetry ? "" : "&skipPoetry=0"}`)}
          className="flex items-center gap-1.5 text-xs text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded tracking-widest uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Adjust Plan
        </button>

        <button
          onClick={handleShare}
          aria-label="Share plan"
          className="flex items-center gap-1.5 text-xs text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded tracking-widest uppercase"
        >
          {shareCopied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 6.5L4.5 10L12 2" stroke="#4a8a60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-bible-success">Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4.3 6.2L9.7 3.3M4.3 7.8L9.7 10.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>

      {/* Header */}
      <header className="px-4 pt-4 pb-5 border-b border-bible-border">
        <p className="text-[10px] tracking-widest2 text-bible-dim uppercase mb-2">
          {planLabel} {parallel ? "Parallel " : ""}{skipPoetry ? "" : "Full Bible "}Reading Plan
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-bible-gold-light leading-tight mb-2">
          {skipPoetry ? "Core" : "Full"} Bible in {planLabel}
        </h1>
        <p className="text-xs text-bible-muted tracking-wide">
          {skipPoetry ? TOTAL_CORE_CHAPTERS : TOTAL_FULL_CHAPTERS} chapters
          <span className="mx-2">·</span>
          {parallel ? "OT & NT together daily" : skipPoetry ? "Narrative & Theology" : "Complete Scripture"}
          {skipPoetry && (
            <>
              <span className="mx-2">·</span>
              Skips {TOTAL_SKIPPED_CHAPTERS} ch of poetry &amp; census
            </>
          )}
        </p>
        <p className="text-xs text-bible-dim mt-1">~{avgCpdStr} chapters/day</p>

        {hydrated && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-bible-dim">
              Ends on{" "}
              <span className="text-bible-muted font-medium">{originalEndDate}</span>
            </p>
            {paceEndDate && (
              <p className="text-xs text-bible-gold-muted italic">
                At this pace, you&apos;re likely to finish on{" "}
                <span className="text-bible-gold font-medium not-italic">{paceEndDate}</span>
              </p>
            )}
          </div>
        )}

        {hydrated && (
          <ProgressBar completed={completedCount} total={totalDays} pct={pct} />
        )}
      </header>

      {/* Install banner */}
      {showInstallBanner && (
        <InstallBanner
          isIOS={isIOS}
          canInstall={canInstall}
          onInstall={install}
          onDismiss={dismissInstall}
        />
      )}

      {/* Notification banner */}
      {showBanner && (
        <NotificationBanner
          onEnable={requestPermission}
          onDismiss={dismiss}
        />
      )}

      {/* Tabs */}
      <div className="flex border-b border-bible-border sticky top-0 bg-bible-bg z-10">
        {(["plan", "skipped"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 text-[11px] tracking-widest uppercase transition-all focus:outline-none ${
              activeTab === tab
                ? "text-bible-gold border-b-2 border-bible-gold font-semibold"
                : "text-bible-dim hover:text-bible-muted"
            }`}
          >
            {tab === "plan" ? "Reading Plan" : "Books Skipped"}
          </button>
        ))}
      </div>

      {/* Reading Plan tab */}
      {activeTab === "plan" && (
        <div>
          {plan.sections.map((section) => (
            <div key={section.testament}>
              <SectionHeader section={section} />

              {isLongPlan ? (
                // Month grouping for long plans
                (() => {
                  const groups: Array<{
                    monthNum: number;
                    days: typeof section.days;
                  }> = [];
                  let start = 0;
                  let monthNum = Math.floor((section.startDay - 1) / 30) + 1;
                  while (start < section.days.length) {
                    const end = Math.min(start + 30, section.days.length);
                    groups.push({ monthNum, days: section.days.slice(start, end) });
                    start = end;
                    monthNum++;
                  }
                  const currentMonthIdx = groups.findIndex((g) =>
                    g.days.some(
                      (d) =>
                        !Array.from({ length: d.chapterCount }, (_, i) =>
                          completedChapters.has(`${d.day}-${i}`)
                        ).every(Boolean)
                    )
                  );
                  return groups.map((group, idx) => (
                    <MonthGroup
                      key={group.monthNum}
                      monthNumber={group.monthNum}
                      days={group.days}
                      startDate={startDate}
                      completedChapters={completedChapters}
                      onToggleChapter={toggleChapter}
                      onToggleGroup={setGroupComplete}
                      onToggleDay={setDayComplete}
                      defaultOpen={idx === currentMonthIdx}
                    />
                  ));
                })()
              ) : (
                // Flat list for short plans
                <div>
                  {section.days.map((day, idx) => {
                    const isFirstUnread =
                      !completedDays.has(day.day) &&
                      section.days.slice(0, idx).every((d) => completedDays.has(d.day)) &&
                      (section.testament === "OT"
                        ? true
                        : plan.sections[0]?.days.every((d) => completedDays.has(d.day)));

                    return (
                      <div
                        key={day.day}
                        ref={isFirstUnread ? firstUnreadRef : undefined}
                      >
                        <DayItem
                          day={day}
                          startDate={startDate}
                          completedChapters={completedChapters}
                          onToggleChapter={toggleChapter}
                          onToggleGroup={setGroupComplete}
                          onToggleDay={setDayComplete}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "skipped" && <BooksSkipped totalDays={totalDays} skipPoetry={skipPoetry} />}

      {/* Jump to next unread */}
      {activeTab === "plan" &&
        !isLongPlan &&
        completedCount > 0 &&
        completedCount < totalDays && (
          <div className="sticky bottom-6 flex justify-center px-4 mt-4 pb-6">
            <button
              onClick={scrollToNextUnread}
              className="bg-bible-surface border border-bible-border text-bible-muted hover:text-bible-text text-xs tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
            >
              Jump to next unread
            </button>
          </div>
        )}

      {/* All done */}
      {activeTab === "plan" &&
        hydrated &&
        completedCount === totalDays &&
        totalDays > 0 && (
          <div className="px-4 py-8 text-center">
            <div className="text-2xl font-serif italic text-bible-gold mb-2">
              You&apos;ve finished the {skipPoetry ? "Core" : "Full"} Bible.
            </div>
            <p className="text-sm text-bible-muted">
              {skipPoetry
                ? "Now pick up Psalms — one chapter a day, 5 months."
                : "An extraordinary achievement. Consider starting again, slower."}
            </p>
          </div>
        )}

      <div className="h-16" />
    </div>
  );
}
