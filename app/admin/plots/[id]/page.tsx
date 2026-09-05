import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { getPlotHistory, listPlotsUncached } from "@/lib/content";
import { PlotEditor } from "@/components/admin/plot-editor";

export default async function EditPlotPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const id = Number(params.id);
  const plots = await listPlotsUncached();
  const plot = plots.find((p) => p.id === id);
  if (!plot) notFound();
  const history = await getPlotHistory(id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit plot</h2>
      <PlotEditor
        initial={plot}
        historyCount={history.length}
        existingPlots={plots.map((p) => ({
          id: p.id,
          slug: p.slug,
          area: p.area,
        }))}
      />
    </div>
  );
}
