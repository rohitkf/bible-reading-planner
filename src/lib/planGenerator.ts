import {
  CORE_BOOKS,
  THEME_SEGMENTS,
  TOTAL_CORE_CHAPTERS,
  type Testament,
} from "./bibleData";

export interface ChapterRef {
  bookName: string;
  chapter: number;
  testament: Testament;
}

export interface ReadingGroup {
  label: string;    // e.g. "Genesis 1–43"
  startIdx: number; // 0-based index into day.chapters (inclusive)
  count: number;    // number of chapters in this group
}

export interface DayReading {
  day: number;
  chapters: ChapterRef[];
  title: string;
  chapterCount: number;
  readingGroups: ReadingGroup[];
}

export interface PlanSection {
  testament: Testament;
  label: string;
  startDay: number;
  endDay: number;
  avgChaptersPerDay: number;
  avgHoursPerDay: number;
  days: DayReading[];
}

export interface ReadingPlan {
  totalDays: number;
  totalChapters: number;
  sections: PlanSection[];
}

const MINS_PER_CHAPTER = 3;

function buildChapterList(): ChapterRef[] {
  const refs: ChapterRef[] = [];
  for (const book of CORE_BOOKS) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      refs.push({ bookName: book.name, chapter: ch, testament: book.testament });
    }
  }
  return refs;
}

function getTheme(bookName: string, chapter: number): string {
  const seg = THEME_SEGMENTS.find(
    (s) =>
      s.bookName === bookName &&
      chapter >= s.fromChapter &&
      chapter <= s.toChapter
  );
  return seg?.theme ?? bookName;
}

function buildTitle(chapters: ChapterRef[], forceSecondTestament = false): string {
  if (chapters.length === 0) return "Rest";

  // Track themes in order of first appearance, with counts
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const c of chapters) {
    const t = getTheme(c.bookName, c.chapter);
    if (!counts.has(t)) order.push(t);
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  if (order.length === 1) return order[0];

  // In parallel mode, always surface the top NT theme even if it's a minority
  if (forceSecondTestament) {
    const otThemes = order.filter((t) =>
      chapters.some((c) => c.testament === "OT" && getTheme(c.bookName, c.chapter) === t)
    );
    const ntThemes = order.filter((t) =>
      chapters.some((c) => c.testament === "NT" && getTheme(c.bookName, c.chapter) === t)
    );
    const otTop = otThemes[0];
    const ntTop = ntThemes[0];
    if (otTop && ntTop) return `${otTop} · ${ntTop}`;
    return otTop ?? ntTop ?? order[0];
  }

  // Sequential: include second theme only if it covers ≥20% of the day's chapters
  const threshold = chapters.length * 0.2;
  const second = order.find((t, i) => i > 0 && (counts.get(t) ?? 0) >= threshold);
  if (second) {
    return `${order[0]} & ${second}`;
  }
  return order[0];
}

function buildReadingGroups(chapters: ChapterRef[]): ReadingGroup[] {
  const groups: ReadingGroup[] = [];
  let i = 0;
  while (i < chapters.length) {
    const bookName = chapters[i].bookName;
    const start = chapters[i].chapter;
    const startIdx = i;
    let j = i;
    while (j < chapters.length && chapters[j].bookName === bookName) j++;
    const end = chapters[j - 1].chapter;
    const label = start === end ? `${bookName} ${start}` : `${bookName} ${start}–${end}`;
    groups.push({ label, startIdx, count: j - startIdx });
    i = j;
  }
  return groups;
}

function avgChapters(days: DayReading[]): number {
  if (days.length === 0) return 0;
  return Math.round(days.reduce((s, d) => s + d.chapterCount, 0) / days.length * 10) / 10;
}

function toHours(chaptersPerDay: number): number {
  return Math.round((chaptersPerDay * MINS_PER_CHAPTER) / 60 * 10) / 10;
}

export function generatePlan(totalDays: number, parallel = false): ReadingPlan {
  if (parallel) return generateParallelPlan(totalDays);

  const all = buildChapterList();
  const total = TOTAL_CORE_CHAPTERS; // 898
  const base = Math.floor(total / totalDays);
  const extra = total % totalDays;

  const days: DayReading[] = [];
  let idx = 0;

  for (let day = 1; day <= totalDays; day++) {
    const count = base + (day <= extra ? 1 : 0);
    const dayChapters = all.slice(idx, idx + count);
    idx += count;
    days.push({
      day,
      chapters: dayChapters,
      title: buildTitle(dayChapters),
      chapterCount: dayChapters.length,
      readingGroups: buildReadingGroups(dayChapters),
    });
  }

  // Split into OT and NT sections
  // A day belongs to NT section only if ALL its chapters are NT
  const otDays = days.filter((d) => !d.chapters.every((c) => c.testament === "NT"));
  const ntDays = days.filter((d) => d.chapters.every((c) => c.testament === "NT"));

  const sections: PlanSection[] = [];

  if (otDays.length > 0) {
    const avg = avgChapters(otDays);
    sections.push({
      testament: "OT",
      label: "Old Testament",
      startDay: 1,
      endDay: otDays[otDays.length - 1].day,
      avgChaptersPerDay: avg,
      avgHoursPerDay: toHours(avg),
      days: otDays,
    });
  }

  if (ntDays.length > 0) {
    const avg = avgChapters(ntDays);
    sections.push({
      testament: "NT",
      label: "New Testament",
      startDay: ntDays[0].day,
      endDay: totalDays,
      avgChaptersPerDay: avg,
      avgHoursPerDay: toHours(avg),
      days: ntDays,
    });
  }

  return { totalDays, totalChapters: total, sections };
}

function generateParallelPlan(totalDays: number): ReadingPlan {
  const all = buildChapterList();
  const otChapters = all.filter((c) => c.testament === "OT");
  const ntChapters = all.filter((c) => c.testament === "NT");

  const otBase = Math.floor(otChapters.length / totalDays);
  const otExtra = otChapters.length % totalDays;
  const ntBase = Math.floor(ntChapters.length / totalDays);
  const ntExtra = ntChapters.length % totalDays;

  const days: DayReading[] = [];
  let otIdx = 0, ntIdx = 0;

  for (let day = 1; day <= totalDays; day++) {
    const otCount = otBase + (day <= otExtra ? 1 : 0);
    const ntCount = ntBase + (day <= ntExtra ? 1 : 0);
    const dayChapters = [
      ...otChapters.slice(otIdx, otIdx + otCount),
      ...ntChapters.slice(ntIdx, ntIdx + ntCount),
    ];
    otIdx += otCount;
    ntIdx += ntCount;
    days.push({
      day,
      chapters: dayChapters,
      title: buildTitle(dayChapters, true),
      chapterCount: dayChapters.length,
      readingGroups: buildReadingGroups(dayChapters),
    });
  }

  const avg = avgChapters(days);
  return {
    totalDays,
    totalChapters: TOTAL_CORE_CHAPTERS,
    sections: [{
      testament: "OT",
      label: "Old & New Testament",
      startDay: 1,
      endDay: totalDays,
      avgChaptersPerDay: avg,
      avgHoursPerDay: toHours(avg),
      days,
    }],
  };
}

export function getTotalDays(n: number, unit: string): number {
  if (unit === "months") return n * 30;
  if (unit === "years") return n * 365;
  return n;
}

export function formatPlanLabel(n: number, unit: string): string {
  const singular = unit.replace(/s$/, "");
  const label = n === 1 ? singular : unit;
  return `${n} ${label.charAt(0).toUpperCase() + label.slice(1)}`;
}
