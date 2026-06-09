"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { generatePlan, getTotalDays, formatPlanLabel } from "@/lib/planGenerator";
import { TOTAL_CORE_CHAPTERS, TOTAL_SKIPPED_CHAPTERS } from "@/lib/bibleData";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ProgressBar";
import SectionHeader from "@/components/SectionHeader";
import DayItem from "@/components/DayItem";
import MonthGroup from "@/components/MonthGroup";
import BooksSkipped from "@/components/BooksSkipped";

type Tab = "plan" | "skipped";

export default function PlanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("plan");

  const n = parseInt(searchParams.get("n") ?? "90", 10);
  const unit = (searchParams.get("unit") ?? "days") as "days" | "months" | "years";

  const validN = isNaN(n) || n < 1 ? 90 : n;
  const totalDays = getTotalDays(validN, unit);
  const planLabel = formatPlanLabel(validN, unit);
  const planKey = `${validN}-${unit}`;

  const plan = useMemo(() => generatePlan(totalDays), [totalDays]);

  const { completed, toggle, completedCount, pct, hydrated } = useProgress(planKey, totalDays);

  const firstUnreadRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextUnread = () => {
    if (firstUnreadRef.current) {
      firstUnreadRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Average chapters per day for subtitle
  const avgCpd = TOTAL_CORE_CHAPTERS / totalDays;
  const avgCpdStr = avgCpd < 1 ? avgCpd.toFixed(2) : avgCpd < 10 ? avgCpd.toFixed(1) : Math.round(avgCpd).toString();

  const isLongPlan = totalDays > 60;

  return (
    <div className="min-h-screen max-w-2xl mx-auto">
      {/* Back button */}
      <div className="px-4 pt-5 pb-1">
        <button
          onClick={() => router.push(`/?n=${validN}&unit=${unit}`)}
          className="flex items-center gap-1.5 text-xs text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded tracking-widest uppercase"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Adjust Plan
        </button>
      </div>

      {/* Header */}
      <header className="px-4 pt-4 pb-5 border-b border-bible-border">
        <p className="text-[10px] tracking-widest2 text-bible-dim uppercase mb-2">
          {planLabel} Reading Plan
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-bible-gold-light leading-tight mb-2">
          Core Bible in {planLabel}
        </h1>
        <p className="text-xs text-bible-muted tracking-wide">
          {TOTAL_CORE_CHAPTERS} chapters
          <span className="mx-2">·</span>
          Narrative &amp; Theology
          <span className="mx-2">·</span>
          Skips {TOTAL_SKIPPED_CHAPTERS} ch of poetry &amp; census
        </p>
        <p className="text-xs text-bible-dim mt-1">
          ~{avgCpdStr} chapters/day
        </p>

        {hydrated && (
          <ProgressBar completed={completedCount} total={totalDays} pct={pct} />
        )}
      </header>

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

      {/* Tab content */}
      {activeTab === "plan" && (
        <div>
          {plan.sections.map((section) => (
            <div key={section.testament}>
              <SectionHeader section={section} />

              {isLongPlan ? (
                /* Month grouping for long plans */
                (() => {
                  const groups: Array<{ monthNum: number; days: typeof section.days }> = [];
                  let monthStart = 0;
                  let monthNum = Math.floor((section.startDay - 1) / 30) + 1;

                  while (monthStart < section.days.length) {
                    const monthEnd = Math.min(monthStart + 30, section.days.length);
                    groups.push({
                      monthNum,
                      days: section.days.slice(monthStart, monthEnd),
                    });
                    monthStart = monthEnd;
                    monthNum++;
                  }

                  // Find the "current" month (first month with incomplete days)
                  const currentMonthIdx = groups.findIndex((g) =>
                    g.days.some((d) => !completed.has(d.day))
                  );

                  return groups.map((group, idx) => (
                    <MonthGroup
                      key={group.monthNum}
                      monthNumber={group.monthNum}
                      days={group.days}
                      completed={completed}
                      onToggle={toggle}
                      defaultOpen={idx === currentMonthIdx}
                    />
                  ));
                })()
              ) : (
                /* Flat day list for short plans */
                <div>
                  {section.days.map((day, idx) => {
                    const isFirstUnread = !completed.has(day.day) &&
                      section.days.slice(0, idx).every((d) => completed.has(d.day)) &&
                      (section.testament === "OT"
                        ? true
                        : plan.sections[0]?.days.every((d) => completed.has(d.day)));

                    return (
                      <div
                        key={day.day}
                        ref={isFirstUnread ? firstUnreadRef : undefined}
                      >
                        <DayItem
                          day={day}
                          isCompleted={completed.has(day.day)}
                          onToggle={toggle}
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

      {activeTab === "skipped" && <BooksSkipped totalDays={totalDays} />}

      {/* Jump to next unread – only for short plans */}
      {activeTab === "plan" && !isLongPlan && completedCount > 0 && completedCount < totalDays && (
        <div className="sticky bottom-6 flex justify-center px-4 mt-4 pb-6">
          <button
            onClick={scrollToNextUnread}
            className="bg-bible-surface border border-bible-border text-bible-muted hover:text-bible-text text-xs tracking-widest uppercase px-5 py-2.5 rounded-full shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          >
            Jump to next unread
          </button>
        </div>
      )}

      {/* All done message */}
      {activeTab === "plan" && hydrated && completedCount === totalDays && totalDays > 0 && (
        <div className="px-4 py-8 text-center">
          <div className="text-2xl font-serif italic text-bible-gold mb-2">
            You&apos;ve finished the Core Bible.
          </div>
          <p className="text-sm text-bible-muted">
            Now pick up Psalms — one chapter a day, 5 months.
          </p>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-16" />
    </div>
  );
}
