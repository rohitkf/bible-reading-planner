import { SKIPPED_BOOKS, TOTAL_SKIPPED_CHAPTERS } from "@/lib/bibleData";

interface BooksSkippedProps {
  totalDays: number;
  skipPoetry: boolean;
}

export default function BooksSkipped({ totalDays, skipPoetry }: BooksSkippedProps) {
  const paceLabel = totalDays <= 30 ? "blitz" : totalDays <= 90 ? "focused read" : "journey";

  if (!skipPoetry) {
    return (
      <div className="px-4 py-5">
        <div className="bg-bible-card border border-bible-border rounded-lg px-4 py-5 text-center">
          <p className="font-serif italic text-bible-gold text-lg mb-2">Reading the Full Bible</p>
          <p className="text-sm text-bible-muted leading-relaxed">
            No books skipped — your plan includes all {TOTAL_SKIPPED_CHAPTERS} chapters of poetry,
            census, and history that the core plan omits.
          </p>
        </div>
        <div className="mt-4 space-y-2">
          {SKIPPED_BOOKS.map((book) => (
            <div
              key={book.name}
              className="bg-bible-card border border-bible-border rounded-lg px-4 py-3 opacity-60"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-serif italic text-bible-gold text-base leading-tight">
                  {book.name}
                </span>
                <span className="text-xs text-bible-dim whitespace-nowrap mt-0.5 flex-shrink-0">
                  {book.chapters} ch · included
                </span>
              </div>
              <p className="text-xs text-bible-muted mt-1 leading-snug">{book.reason}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      <p className="text-sm text-bible-muted leading-relaxed mb-5">
        These{" "}
        <span className="text-bible-text font-semibold">{TOTAL_SKIPPED_CHAPTERS} chapters</span>{" "}
        were removed to focus on narrative, theology, and prophecy. None are worthless
        — but for a {totalDays}-day {paceLabel}, these are the natural cuts.
      </p>

      <div className="space-y-2">
        {SKIPPED_BOOKS.map((book) => (
          <div
            key={book.name}
            className="bg-bible-card border border-bible-border rounded-lg px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-serif italic text-bible-gold text-base leading-tight">
                {book.name}
              </span>
              <span className="text-xs text-bible-dim whitespace-nowrap mt-0.5 flex-shrink-0">
                {book.chapters} ch
              </span>
            </div>
            <p className="text-xs text-bible-muted mt-1 leading-snug">{book.reason}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-bible-card border border-bible-border rounded-lg px-4 py-3">
        <p className="text-xs text-bible-muted leading-relaxed">
          <span className="text-bible-text font-semibold">After your plan:</span> Psalms
          are best read one chapter a day over 5 months. Let them be your follow-up
          devotional.
        </p>
      </div>
    </div>
  );
}
