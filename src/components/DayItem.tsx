"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { DayReading } from "@/lib/planGenerator";
import { addDays } from "@/lib/dateUtils";

interface DayItemProps {
  day: DayReading;
  startDate: string | null; // "YYYY-MM-DD" — null means no date to show
  completedChapters: Set<string>;
  onToggleChapter: (day: number, chapterIdx: number) => void;
  onToggleGroup: (day: number, startIdx: number, count: number, complete: boolean) => void;
  onToggleDay: (day: number, totalChapters: number, complete: boolean) => void;
}

// ── Confetti particle ───────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  life: number;
}

const CONFETTI_COLORS = ["#c8963c", "#d4a848", "#4a8a60", "#8a8068", "#ddd5b8"];

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Spawn particles
    const count = 40;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    particlesRef.current = Array.from({ length: count }, () => ({
      id: idRef.current++,
      x: cx + (Math.random() - 0.5) * rect.width * 0.6,
      y: rect.height * 0.3,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 4 - 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 5 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 1,
    }));

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      if (particlesRef.current.length === 0) return;

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.vy += 0.12; // gravity
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 0.018;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function DayProgressBar({ pct }: { pct: number }) {
  let color: string;
  if (pct === 100) color = "#4a8a60"; // green
  else if (pct >= 50) color = "#c8963c"; // gold/orange
  else if (pct > 0) color = "#8a5a3a"; // muted amber-red
  else return null; // don't render if 0%

  return (
    <div className="h-0.5 w-full bg-bible-border overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DayItem({
  day,
  startDate,
  completedChapters,
  onToggleChapter,
  onToggleGroup,
  onToggleDay,
}: DayItemProps) {
  // Day-specific date label: "(Jun 10)" — short format, no year
  const dayDateLabel = useMemo(() => {
    if (!startDate) return null;
    const d = addDays(new Date(startDate + "T00:00:00"), day.day - 1);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }, [startDate, day.day]);
  const [expanded, setExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const prevPctRef = useRef(0);

  const total = day.chapterCount;
  const doneCount = Array.from({ length: total }, (_, i) =>
    completedChapters.has(`${day.day}-${i}`)
  ).filter(Boolean).length;

  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const allDone = total > 0 && doneCount === total;
  const partial = doneCount > 0 && !allDone;

  // Fire confetti when we cross 100%
  useEffect(() => {
    if (pct === 100 && prevPctRef.current < 100) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(t);
    }
    prevPctRef.current = pct;
  }, [pct]);

  const toggleGroupExpand = (groupIdx: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupIdx)) next.delete(groupIdx);
      else next.add(groupIdx);
      return next;
    });
  };

  return (
    <div
      className={`border-b border-bible-border transition-opacity relative bg-bible-bg ${
        allDone ? "opacity-55" : ""
      }`}
    >
      <ConfettiCanvas active={showConfetti} />

      {/* ── Collapsed row ── */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Day-level circle — select-all / clear-all */}
        <button
          onClick={() => onToggleDay(day.day, total, !allDone)}
          aria-label={allDone ? "Mark day as unread" : "Mark all chapters as done"}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
          style={{
            borderColor: allDone ? "#4a8a60" : partial ? "#c8963c" : "#534e42",
            backgroundColor: allDone ? "#4a8a60" : "transparent",
          }}
        >
          {allDone && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4L4.5 7.5L11 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {partial && <div className="w-2 h-2 rounded-full bg-bible-gold" />}
        </button>

        {/* Day metadata + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-bible-dim uppercase mb-0.5">
            <span>Day {day.day}</span>
            {dayDateLabel && (
              <span className="text-bible-dim normal-case tracking-normal">
                ({dayDateLabel})
              </span>
            )}
            <span>·</span>
            <span>{day.chapterCount}ch</span>
            {partial && (
              <span className="text-bible-gold-muted font-medium">
                {doneCount}/{total}
              </span>
            )}
          </div>
          <div className="font-serif italic text-bible-gold text-base leading-tight truncate">
            {day.title}
          </div>
        </div>

        {/* Expand chevron */}
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse" : "Expand readings"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Per-day progress bar ── */}
      <DayProgressBar pct={pct} />

      {/* ── Expanded reading groups ── */}
      {expanded && (
        <div className="px-4 pb-4 ml-9">
          <div className="border-t border-bible-border pt-3 space-y-2">
            {day.readingGroups.map((group, gi) => {
              const groupDone = Array.from({ length: group.count }, (_, i) =>
                completedChapters.has(`${day.day}-${group.startIdx + i}`)
              ).filter(Boolean).length;
              const groupAllDone = groupDone === group.count;
              const groupPartial = groupDone > 0 && !groupAllDone;
              const groupOpen = expandedGroups.has(gi);
              const multiChapter = group.count > 1;

              return (
                <div key={gi}>
                  {/* Reading group row */}
                  <div className="flex items-center gap-2">
                    {/* Group checkbox (square, 3-state) */}
                    <button
                      onClick={() => onToggleGroup(day.day, group.startIdx, group.count, !groupAllDone)}
                      aria-label={groupAllDone ? `Unmark ${group.label}` : `Mark ${group.label} complete`}
                      className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
                      style={{
                        borderColor: groupAllDone ? "#4a8a60" : groupPartial ? "#c8963c" : "#534e42",
                        backgroundColor: groupAllDone ? "#4a8a60" : "transparent",
                      }}
                    >
                      {groupAllDone && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path
                            d="M1 3.5L3.5 6L8 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {groupPartial && <div className="w-1.5 h-1.5 rounded-sm bg-bible-gold" />}
                    </button>

                    {/* Group label */}
                    <span
                      className={`flex-1 text-sm transition-colors ${
                        groupAllDone
                          ? "text-bible-dim line-through"
                          : "text-bible-muted"
                      }`}
                    >
                      {group.label}
                    </span>

                    {/* Expand chapters button — only for multi-chapter groups */}
                    {multiChapter && (
                      <button
                        onClick={() => toggleGroupExpand(gi)}
                        aria-label={groupOpen ? "Collapse chapters" : "Expand chapters"}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-bible-dim hover:text-bible-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold rounded"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          className={`transition-transform duration-200 ${groupOpen ? "rotate-180" : ""}`}
                        >
                          <path
                            d="M2 3.5L5 6.5L8 3.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Individual chapter pills — grid layout */}
                  {(groupOpen || !multiChapter) && multiChapter && (
                    <div className="ml-6 mt-2 flex flex-wrap gap-1.5">
                      {Array.from({ length: group.count }, (_, ci) => {
                        const chapterIdx = group.startIdx + ci;
                        const chDone = completedChapters.has(`${day.day}-${chapterIdx}`);
                        const chapterNum = day.chapters[chapterIdx]?.chapter ?? chapterIdx + 1;
                        return (
                          <button
                            key={ci}
                            onClick={() => onToggleChapter(day.day, chapterIdx)}
                            aria-label={`Chapter ${chapterNum}${chDone ? " (done)" : ""}`}
                            className="w-9 h-9 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-bible-gold"
                            style={{
                              backgroundColor: chDone ? "#4a8a60" : "#1e1c15",
                              color: chDone ? "#ffffff" : "#534e42",
                              border: `1px solid ${chDone ? "#4a8a60" : "#2c2920"}`,
                            }}
                          >
                            {chapterNum}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="text-[11px] text-bible-dim pt-1 tracking-wide">
              ~{Math.round(day.chapterCount * 3)} min reading time
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
