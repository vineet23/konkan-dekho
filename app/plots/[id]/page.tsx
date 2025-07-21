import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { plots } from "@/lib/data/plots";
import { ClientPlotPage } from "@/components/plots/client-plot-page";

export function generateStaticParams() {
  return plots.map((plot) => ({
    id: plot.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const plot = plots.find((p) => p.id === parseInt(params.id));
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
          ? plot.images
          : ["/image/logo.svg"],
    },
  };
}

export default function PlotDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const plot = plots.find((p) => p.id === parseInt(params.id));

  if (!plot) {
    notFound();
  }

  return <ClientPlotPage id={params.id} />;
}
