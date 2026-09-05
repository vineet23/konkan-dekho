import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlots, getPlotBySlugKey, getExperiences } from "@/lib/content";
import { ClientPlotPage } from "@/components/plots/client-plot-page";

export const dynamicParams = true;

export async function generateStaticParams() {
  const plots = await getPlots();
  return plots.map((plot) => ({
    slug: `${plot.slug}-${plot.area.toLowerCase().replace(/ /g, "-")}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const plot = await getPlotBySlugKey(params.slug);
  if (!plot) {
    return {
      title: "Plot Not Found | Konkan Dekho",
      description: "This plot could not be found.",
    };
  }
  return {
    title: `${plot.title} by Konkan Dekho`,
    description: plot.description,
    openGraph: {
      images:
        plot.images && plot.images.length > 0
          ? [plot.images[0]]
          : ["/image/logo.svg"],
    },
  };
}

export default async function PlotDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const [plot, allPlots, experiences] = await Promise.all([
    getPlotBySlugKey(params.slug),
    getPlots(),
    getExperiences(),
  ]);

  if (!plot) {
    notFound();
  }

  return (
    <ClientPlotPage
      plot={plot}
      allPlots={allPlots}
      experiences={experiences}
    />
  );
}
