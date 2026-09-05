import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import {
  getExperienceHistory,
  listExperiencesUncached,
} from "@/lib/content";
import { ExperienceEditor } from "@/components/admin/experience-editor";

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const id = Number(params.id);
  const experiences = await listExperiencesUncached();
  const experience = experiences.find((e) => e.id === id);
  if (!experience) notFound();
  const history = await getExperienceHistory(id);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit experience</h2>
      <ExperienceEditor
        initial={experience}
        historyCount={history.length}
        existingExperiences={experiences.map((e) => ({
          id: e.id,
          slug: e.slug,
        }))}
      />
    </div>
  );
}
