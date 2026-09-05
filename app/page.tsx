import { getPlots, getExperiences } from "@/lib/content";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-static";

export default async function Home() {
  const [plots, experiences] = await Promise.all([
    getPlots(),
    getExperiences(),
  ]);

  return <HomeClient plots={plots} experiences={experiences} />;
}
