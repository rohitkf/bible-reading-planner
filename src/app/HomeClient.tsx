"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TOTAL_CORE_CHAPTERS, TOTAL_SKIPPED_CHAPTERS, CORE_BOOKS } from "@/lib/bibleData";
import { getTotalDays } from "@/lib/planGenerator";
import { addDays, formatDate, today } from "@/lib/dateUtils";

type Unit = "days" | "months" | "years";

const LIMITS: Record<Unit, { min: number; max: number; default: number }> = {
  days: { min: 1, max: 800, default: 90 },
  months: { min: 1, max: 24, default: 3 },
  years: { min: 1, max: 2, default: 1 },
};

const UNIT_LABELS: Record<Unit, string> = {
  days: "DAYS",
  months: "MONTHS",
  years: "YEARS",
};

const PLAN_CONFIG_KEY = "bible-plan-config";

function loadSavedConfig(): { n: number; unit: Unit } | null {
  try {
    const raw = localStorage.getItem(PLAN_CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { n: number; unit: Unit };
    if (
      typeof parsed.n === "number" &&
      ["days", "months", "years"].includes(parsed.unit)
    )
      return parsed;
  } catch { /* ignore */ }
  return null;
}

export function savePlanConfig(n: number, unit: Unit) {
  try {
    const startDate = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    localStorage.setItem(PLAN_CONFIG_KEY, JSON.stringify({ n, unit, startDate }));
  } catch { /* ignore */ }
}

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // When coming back via "Adjust Plan", URL carries n/unit to pre-fill the form
  const urlN = parseInt(searchParams.get("n") ?? "", 10);
  const urlUnit = searchParams.get("unit") as Unit | null;
  const isAdjusting = searchParams.get("adjust") === "1";

  const initialUnit: Unit =
    urlUnit && ["days", "months", "years"].includes(urlUnit)
      ? urlUnit
      : "days";
  const initialN = !isNaN(urlN) && urlN > 0 ? urlN : LIMITS[initialUnit].default;

  const [unit, setUnit] = useState<Unit>(initialUnit);
  const [n, setN] = useState<number>(initialN);
  const [ready, setReady] = useState(false);

  // On first mount: if a plan is saved and user didn't intentionally navigate back, jump straight to it
  useEffect(() => {
    if (isAdjusting) {
      setReady(true);
      return;
    }
    const saved = loadSavedConfig();
    if (saved) {
      router.replace(`/plan?n=${saved.n}&unit=${saved.unit}`);
      // Don't set ready — the redirect will happen before the user sees anything
    } else {
      setReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { min, max } = LIMITS[unit];

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    setN(LIMITS[newUnit].default);
  };

  const clamp = (val: number) => Math.max(min, Math.min(max, val));
  const handleChange = (val: number) => setN(clamp(val));
  const increment = () => setN((v) => clamp(v + 1));
  const decrement = () => setN((v) => clamp(v - 1));

  const totalDays = getTotalDays(n, unit);

  const { chaptersPerDay, minPerDay, endDate } = useMemo(() => {
    const cpd = TOTAL_CORE_CHAPTERS / totalDays;
    return {
      chaptersPerDay:
        cpd < 1 ? cpd.toFixed(2) : cpd < 10 ? cpd.toFixed(1) : Math.round(cpd),
      minPerDay:
        cpd * 3 >= 60
          ? `~${((cpd * 3) / 60).toFixed(1)} hrs`
          : `~${Math.round(cpd * 3)} min`,
      endDate: formatDate(addDays(today(), totalDays)),
    };
  }, [totalDays]);

  const handleStart = () => {
    savePlanConfig(n, unit);
    router.push(`/plan?n=${n}&unit=${unit}`);
  };

  // Blank screen while checking for saved plan to avoid flash
  if (!ready) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12 max-w-sm">
        <p className="text-[10px] tracking-widest2 text-bible-dim uppercase mb-4">
          Scripture · Narrative · Theology
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-bible-gold-light leading-tight mb-4">
          Core Bible
        </h1>
        <p className="text-sm text-bible-muted leading-relaxed">
          Read the narrative & theological heart of Scripture at your own pace.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-bible-dim tracking-wide">
          <span>{TOTAL_CORE_CHAPTERS} chapters</span>
          <span>·</span>
          <span>{CORE_BOOKS.length} books</span>
          <span>·</span>
          <span>Skips {TOTAL_SKIPPED_CHAPTERS} ch of poetry &amp; census</span>
        </div>
      </div>

      {/* Selector card */}
      <div className="w-full max-w-sm bg-bible-surface border border-bible-border rounded-2xl px-6 py-8">
        <p className="text-xs tracking-widest text-bible-dim uppercase text-center mb-6">
          How long do you want to take?
        </p>

        {/* Number input */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={decrement}
            disabled={n <= min}
            aria-label="Decrease"
            className="w-11 h-11 rounded-full border border-bible-border flex items-center justify-center text-bible-muted hover:text-bible-text hover:border-bible-border-light disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          >
            <svg width="16" height="2" viewBox="0 0 16 2" fill="none">
              <path d="M1 1H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative">
            <input
              type="number"
              value={n}
              min={min}
              max={max}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) handleChange(val);
              }}
              className="w-28 text-center text-5xl font-semibold text-bible-gold bg-transparent border-none outline-none focus:text-bible-gold-light"
              style={{ caretColor: "#c8963c" }}
            />
          </div>

          <button
            onClick={increment}
            disabled={n >= max}
            aria-label="Increase"
            className="w-11 h-11 rounded-full border border-bible-border flex items-center justify-center text-bible-muted hover:text-bible-text hover:border-bible-border-light disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Unit pills */}
        <div className="flex gap-2 justify-center mb-6">
          {(["days", "months", "years"] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u)}
              className={`px-4 py-2 rounded-full text-[11px] tracking-widest uppercase transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold ${
                unit === u
                  ? "bg-bible-gold text-bible-bg font-semibold"
                  : "border border-bible-border text-bible-muted hover:border-bible-border-light hover:text-bible-text"
              }`}
            >
              {UNIT_LABELS[u]}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-bible-border mb-5" />

        {/* Live stats */}
        <div className="text-center mb-6">
          <p className="text-sm text-bible-muted">
            <span className="text-bible-text font-medium">~{chaptersPerDay} chapters</span>
            <span className="mx-2 text-bible-dim">·</span>
            <span className="text-bible-text font-medium">{minPerDay}</span>
            <span className="text-xs text-bible-dim ml-1">per day</span>
          </p>
          {unit !== "days" && (
            <p className="text-xs text-bible-dim mt-1">{totalDays} days total</p>
          )}
          <p className="text-xs text-bible-dim mt-1">
            Finishes by{" "}
            <span className="text-bible-muted font-medium">{endDate}</span>
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full bg-bible-gold hover:bg-bible-gold-light text-bible-bg font-semibold text-sm tracking-widest uppercase py-3.5 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bible-surface"
        >
          {isAdjusting ? "Update Plan →" : "Generate Plan →"}
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-bible-dim text-center max-w-xs leading-relaxed">
        Progress is saved locally in your browser.
        <br />
        Share the plan URL to use the same schedule on any device.
      </p>
    </main>
  );
}
