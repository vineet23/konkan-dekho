import { getPlots } from "@/lib/content";
import { FeaturedLocationsClient } from "@/components/featured-locations-client";

export default async function FeaturedLocationsPage() {
  const plots = await getPlots();
  return <FeaturedLocationsClient plots={plots} />;
}
