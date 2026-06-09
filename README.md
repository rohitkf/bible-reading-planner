# Core Bible Reading Plan

> Read the narrative and theological heart of Scripture — at your own pace.

A beautifully minimal, open-source web app that generates a personalised daily Bible reading plan. You choose how long you want to take — days, months, or years — and the app builds a focused reading schedule across **898 chapters** of core Scripture, skipping the books best suited for slower, devotional engagement.

---

## Features

- **Flexible scheduling** — pick any duration from 1 day to 2 years
- **898 core chapters** across 32 books, curated for narrative and theology
- **Smart day titles** — each day gets a thematic name generated from the content you're reading
- **Old Testament / New Testament sections** with average chapter-count and time estimates
- **Month grouping** for long plans — collapsible sections keep long schedules navigable
- **Books Skipped tab** — explains exactly what was cut and why, with a follow-up devotional suggestion
- **Progress tracking** — checkboxes persist to `localStorage`; your progress survives page refreshes
- **Shareable URLs** — `/plan?n=30&unit=days` encodes the full plan; send the link to a friend to read the same schedule
- **Zero account required** — no sign-up, no server, no tracking
- **Vercel-ready** — deploys in one click

---

## What "Core Bible" means

The full Bible contains 1,189 chapters. This app focuses on **898 chapters** that carry the main narrative arc, theology, and prophecy. Seven books are intentionally skipped:

| Book | Chapters | Why |
|------|----------|-----|
| Leviticus | 27 | Ceremonial & sacrificial law — unpacked theologically in Hebrews |
| Numbers | 36 | Census records and wilderness logistics |
| 1 Chronicles | 29 | Repeats Samuel with genealogies |
| 2 Chronicles | 36 | Repeats Kings — read Kings and you have it |
| Psalms | 150 | Devotional poetry — best read slowly, one chapter a day |
| Song of Songs | 8 | Allegorical love poetry |
| Lamentations | 5 | Poetic grief over Jerusalem's fall |

None of these are worthless. They're just better suited to devotional reading alongside a narrative plan, not as part of a focused run-through.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) |
| Fonts | [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro) + [Inter](https://fonts.google.com/specimen/Inter) via `next/font` |
| State | React `useState` / `useEffect` + `localStorage` |
| Deployment | [Vercel](https://vercel.com) |

No database. No backend. No authentication. The entire plan is generated client-side from a deterministic algorithm — the same `n` and `unit` always produce the same plan.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Run locally

```bash
git clone https://github.com/rohitkf/bible-reading-planner.git
cd bible-reading-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The fastest path to production:

1. Fork or clone this repository
2. Push to your GitHub account
3. Go to [vercel.com/new](https://vercel.com/new) and import the repository
4. Vercel auto-detects Next.js — click **Deploy**

No environment variables required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frohitkf%2Fbible-reading-planner)

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, dark background
│   ├── page.tsx            # Landing page — N selector, unit pills, live stats
│   └── plan/
│       ├── page.tsx        # Suspense boundary (required for useSearchParams)
│       └── PlanClient.tsx  # Plan display — tabs, sections, day list
├── components/
│   ├── DayItem.tsx         # Collapsible day row with checkbox and readings
│   ├── SectionHeader.tsx   # OT / NT section divider with stats
│   ├── MonthGroup.tsx      # Month accordion for plans > 60 days
│   ├── BooksSkipped.tsx    # "Books Skipped" tab content
│   └── ProgressBar.tsx     # Gold progress bar with completion label
├── hooks/
│   └── useProgress.ts      # localStorage progress tracking hook
└── lib/
    ├── bibleData.ts        # Book list, skipped books, thematic segments
    └── planGenerator.ts    # Plan generation algorithm
```

### How the plan algorithm works

1. Build a flat array of all 898 chapters in canonical order, each tagged with its book and testament
2. Distribute evenly across `N` days: `base = floor(898 / N)`, first `898 % N` days get one extra chapter
3. For each day, derive a thematic title by looking up pre-defined theme segments (e.g. Genesis 1–11 → *"Creation & Fall"*) and combining the top two themes in reading order
4. Format each day's chapters as human-readable ranges (e.g. `Genesis 1–43, Exodus 1–4`)
5. Split days into OT and NT sections: a day belongs to the NT section only when all its chapters are from the New Testament

---

## Plan limits

| Unit | Minimum | Maximum |
|------|---------|---------|
| Days | 1 | 800 |
| Months | 1 | 24 |
| Years | 1 | 2 |

These bounds ensure every day has at least one chapter to read (898 chapters ÷ 800 days ≈ 1.1 chapters/day).

---

## Contributing

Contributions are welcome. A few areas that would be valuable:

- **Thematic titles** — the `THEME_SEGMENTS` array in `src/lib/bibleData.ts` drives day-title generation; better segment names improve the experience
- **Accessibility** — keyboard navigation, screen reader labels, focus management
- **Internationalisation** — the plan logic is language-agnostic; UI strings are centralised and ready for i18n

Please open an issue before starting a significant change so we can align on direction.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*"Your word is a lamp to my feet and a light to my path."* — Psalm 119:105
