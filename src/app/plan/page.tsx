import { Suspense } from "react";
import PlanClient from "./PlanClient";

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-bible-dim text-sm tracking-widest uppercase animate-pulse">
            Building your plan…
          </div>
        </div>
      }
    >
      <PlanClient />
    </Suspense>
  );
}
