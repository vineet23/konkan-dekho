import { getExperiences } from "@/lib/content";
import { ExperiencesClient } from "@/components/experiences-client";

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  return <ExperiencesClient experiences={experiences} />;
}
