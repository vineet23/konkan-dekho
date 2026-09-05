import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { listExperiencesUncached } from "@/lib/content";
import { ExperienceEditor } from "@/components/admin/experience-editor";

export default async function NewExperiencePage() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
  const experiences = await listExperiencesUncached();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">New experience</h2>
      <ExperienceEditor
        isNew
        existingExperiences={experiences.map((e) => ({
          id: e.id,
          slug: e.slug,
        }))}
      />
    </div>
  );
}
