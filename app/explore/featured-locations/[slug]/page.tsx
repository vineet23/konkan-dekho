import type { Metadata } from "next";
import LocationPlotsClient from "./client";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const decodedSlug = decodeURIComponent(params.slug);
    return {
        title: `${decodedSlug} Stays | Konkan Dekho`,
        description: `Explore and unlock a world of homestays in ${decodedSlug}`,
        openGraph: {
            images: ["/image/logo.svg"],
        },
    };
}

export default function LocationPlotsPage({
    params,
}: {
    params: { slug: string };
}) {
    return <LocationPlotsClient slug={params.slug} />;
}
