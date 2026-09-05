import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { TrashClient } from "@/components/admin/trash-client";
import {
  listTrashedExperiences,
  listTrashedPlots,
} from "@/lib/content";

export default async function AdminTrashPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const [plots, experiences] = await Promise.all([
    listTrashedPlots(),
    listTrashedExperiences(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Trash</h2>
        <p className="text-sm text-stone-600">
          Soft-deleted items stay here indefinitely. Restore anytime.
        </p>
      </div>
      <TrashClient plots={plots} experiences={experiences} />
    </div>
  );
}
