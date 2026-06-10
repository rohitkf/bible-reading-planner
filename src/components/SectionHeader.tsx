import type { PlanSection } from "@/lib/planGenerator";

interface SectionHeaderProps {
  section: PlanSection;
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  const chStr = section.avgChaptersPerDay % 1 === 0
    ? section.avgChaptersPerDay.toString()
    : section.avgChaptersPerDay.toFixed(1);
  const hrStr = section.avgHoursPerDay < 1
    ? `${Math.round(section.avgHoursPerDay * 60)} min`
    : `${section.avgHoursPerDay} hrs`;

  return (
    <div className="px-4 pt-6 pb-2 bg-bible-bg">
      <div className="text-[10px] tracking-widest text-bible-dim uppercase mb-1">
        Days {section.startDay}–{section.endDay}
        <span className="mx-2">·</span>
        ~{chStr} ch/day
        <span className="mx-2">·</span>
        ~{hrStr}/day
      </div>
      <h2 className="text-lg font-semibold text-bible-text tracking-wide">
        {section.label}
      </h2>
    </div>
  );
}
