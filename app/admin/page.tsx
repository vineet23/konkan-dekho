import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import {
  listExperiencesUncached,
  listPlotsUncached,
  listTrashedExperiences,
  listTrashedPlots,
} from "@/lib/content";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }

  const [plots, experiences, trashPlots, trashExperiences] = await Promise.all([
    listPlotsUncached(),
    listExperiencesUncached(),
    listTrashedPlots(),
    listTrashedExperiences(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-stone-600">
          Edit content, then hit Publish when you want the public site to
          refresh.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">Plots</p>
          <p className="text-3xl font-semibold">{plots.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">Experiences</p>
          <p className="text-3xl font-semibold">{experiences.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">In trash</p>
          <p className="text-3xl font-semibold">
            {trashPlots.length + trashExperiences.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="min-h-11 flex-1">
          <Link href="/admin/plots/new">Add plot</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 flex-1">
          <Link href="/admin/experiences/new">Add experience</Link>
        </Button>
      </div>
    </div>
  );
}
