export type Host = {
    id: string;               // e.g. "advait"
    name: string;             // "Advait Kulkarni"
    photo: string;            // URL or /images/...
    description: string;
    phone?: string;
    instagram?: string;
    website?: string;
    location?: string;
    languages?: string[];
    since?: string;
};

export const hosts: Host[] = [
    {
        id: "advait",
        name: "Advait Kulkarni",
        photo: "https://firebasestorage.googleapis.com/v0/b/konkandekho-158ab.firebasestorage.app/o/Hosts%2FAdvait%2FWhatsApp%20Image%202025-08-12%20at%2022.25.23.jpeg?alt=media&token=18007776-6ad1-4d00-8467-1986f3e2441e",
        description:
            "Curating sea‑facing stays and helping guests discover hidden Konkan gems—clean beaches, homestyle meals, and scenic drives.",
        phone: "tel:+919834069861",
        instagram: "https://instagram.com/konkandekho",
        website: "https://www.konkandekho.com",
        location: "Ratnagiri, Maharashtra",
        languages: ["Marathi", "Hindi", "English"],
        since: "2022",
    },
    // add more hosts here
];

// tiny helpers
export const hostById = (id?: string) => hosts.find(h => h.id === id);
