import type { Metadata } from "next";
import { getPlots, getExperiences } from "@/lib/content";
import LocationPlotsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  return {
    title: `${decodedSlug} Stays | Konkan Dekho`,
    description: `Explore and unlock a world of homestays in ${decodedSlug}`,
    openGraph: {
      images: ["/image/logo.svg"],
    },
  };
}

export default async function LocationPlotsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [plots, experiences] = await Promise.all([
    getPlots(),
    getExperiences(),
  ]);

  return (
    <LocationPlotsClient
      slug={params.slug}
      plots={plots}
      experiences={experiences}
    />
  );
}
