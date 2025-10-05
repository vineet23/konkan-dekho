import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { plots } from "@/lib/data/plots";
import { ClientPlotPage } from "@/components/plots/client-plot-page";

export function generateStaticParams() {
  return plots.map((plot) => ({
    slug: `${plot.slug}-${plot.area.toLowerCase().replace(/ /g, "-")}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const plot = plots.find(
    (p) => `${p.slug}-${p.area.toLowerCase().replace(/ /g, "-")}` === params.slug
  );
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
          ? plot.images[0]
          : ["/image/logo.svg"],
    },
  };
}

export default function PlotDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const plot = plots.find(
    (p) => `${p.slug}-${p.area.toLowerCase().replace(/ /g, "-")}` === params.slug
  );

  if (!plot) {
    notFound();
  }

  return <ClientPlotPage id={plot.id.toString()} />;
}