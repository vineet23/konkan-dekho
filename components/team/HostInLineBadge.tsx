import Image from "next/image";
import Link from "next/link";
import { hostById } from "@/lib/data/hosts";

export default function HostInlineBadge({ hostId }: { hostId?: string }) {
    const host = hostById(hostId);
    if (!host) return null;

    return (
        <Link
            href={`/hosts/${host.id}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-neutral-800/70 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
        >
            <span className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image src={host.photo} alt={host.name} fill className="object-cover" />
            </span>
            <span className="truncate">Host: {host.name}</span>
        </Link>
    );
}
