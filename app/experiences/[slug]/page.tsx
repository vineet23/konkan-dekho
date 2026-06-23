import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experiences } from "@/lib/data/experiences";
import { ClientExperiencePage } from "@/components/experiences/client-experience-page";

export function generateStaticParams() {
  return experiences.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const experience = experiences.find((e) => e.slug === params.slug);
  
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
          ? experience.photos[0]
          : ["/image/logo.svg"],
    },
  };
}

export default function ExperiencePage({
  params,
}: {
  params: { slug: string };
}) {
  const experience = experiences.find((e) => e.slug === params.slug);

  if (!experience) {
    notFound();
  }

  return <ClientExperiencePage slug={experience.slug} />;
}
