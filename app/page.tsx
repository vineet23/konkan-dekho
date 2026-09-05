import { getPlots, getExperiences } from "@/lib/content";
import { HomeClient } from "@/components/home-client";

/** Static until Publish calls revalidatePath (Vercel on-demand ISR). */
export const revalidate = false;

export default async function Home() {
  const [plots, experiences] = await Promise.all([
    getPlots(),
    getExperiences(),
  ]);

  return <HomeClient plots={plots} experiences={experiences} />;
}
