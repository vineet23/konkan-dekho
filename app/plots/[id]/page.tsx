import { notFound } from "next/navigation";
import { plots } from "@/lib/data/plots";
import { ClientPlotPage } from "@/components/plots/client-plot-page";

export function generateStaticParams() {
  return plots.map((plot) => ({
    id: plot.id.toString(),
  }));
}

export default function PlotDetailsPage({ params }: { params: { id: string } }) {
  const plot = plots.find(p => p.id === parseInt(params.id));
  
  if (!plot) {
    notFound();
  }

  return <ClientPlotPage id={params.id} />;
}