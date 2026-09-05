import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listExperiencesUncached } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { AdminSearchList } from "@/components/admin/search-list";

export default async function AdminExperiencesPage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const experiences = await listExperiencesUncached();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Experiences</h2>
        <Button asChild className="min-h-10">
          <Link href="/admin/experiences/new">Add</Link>
        </Button>
      </div>
      <AdminSearchList
        items={experiences.map((e) => ({
          id: e.id,
          title: e.name,
          subtitle: `${e.location} · ${e.category}`,
          href: `/admin/experiences/${e.id}`,
        }))}
        emptyLabel="No experiences yet"
      />
    </div>
  );
}
