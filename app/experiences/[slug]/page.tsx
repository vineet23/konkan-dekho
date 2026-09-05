import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperiences, getExperienceBySlug, getPlots } from "@/lib/content";
import { ClientExperiencePage } from "@/components/experiences/client-experience-page";

export const dynamicParams = true;

export async function generateStaticParams() {
  const experiences = await getExperiences();
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const experience = await getExperienceBySlug(params.slug);

  if (!experience) {
    return {
      title: "Experience Not Found | Konkan Dekho",
      description: "This experience could not be found.",
    };
  }

  return {
    title: `${experience.name} | Konkan Dekho Experiences`,
    description: experience.description,
    openGraph: {
      images:
        experience.photos && experience.photos.length > 0
          ? [experience.photos[0]]
          : ["/image/logo.svg"],
    },
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: { slug: string };
}) {
  const [experience, allPlots] = await Promise.all([
    getExperienceBySlug(params.slug),
    getPlots(),
  ]);

  if (!experience) {
    notFound();
  }

  return (
    <ClientExperiencePage experience={experience} allPlots={allPlots} />
  );
}
