import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listPlotsUncached } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { AdminSearchList } from "@/components/admin/search-list";

export default async function AdminPlotsPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const plots = await listPlotsUncached();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Plots</h2>
        <Button asChild className="min-h-10">
          <Link href="/admin/plots/new">Add</Link>
        </Button>
      </div>
      <AdminSearchList
        items={plots.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: `${p.location} · ${p.price}`,
          href: `/admin/plots/${p.id}`,
        }))}
        emptyLabel="No plots yet"
      />
    </div>
  );
}
