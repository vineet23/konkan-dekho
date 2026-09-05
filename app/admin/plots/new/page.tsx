import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listPlotsUncached } from "@/lib/content";
import { PlotEditor } from "@/components/admin/plot-editor";

export default async function NewPlotPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const plots = await listPlotsUncached();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">New plot</h2>
      <PlotEditor
        isNew
        existingPlots={plots.map((p) => ({
          id: p.id,
          slug: p.slug,
          area: p.area,
        }))}
      />
    </div>
  );
}
