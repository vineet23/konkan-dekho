import { Suspense } from "react";
import { getPlots, getExperiences } from "@/lib/content";
import { AllPlotsClient } from "@/components/all-plots-client";

export default async function AllPlotsPage() {
  const [plots, experiences] = await Promise.all([
    getPlots(),
    getExperiences(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <AllPlotsClient plots={plots} experiences={experiences} />
    </Suspense>
  );
}
