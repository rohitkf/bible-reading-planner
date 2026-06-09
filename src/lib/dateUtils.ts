export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.ceil(days));
  return d;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Returns today at midnight local time (stable reference for comparisons)
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Days elapsed since a stored ISO date string ("YYYY-MM-DD"), minimum 1
export function daysElapsedSince(isoDate: string): number {
  const start = new Date(isoDate + "T00:00:00");
  const diff = today().getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
