import { hostById } from "@/lib/data/hosts";
import { plots } from "@/lib/data/plots";
interface HostPageProps {
    params: { id: string };
}

export default function HostPage({ params }: HostPageProps) {
    const hostId = params.id; // already a string like "advait"

    // Find the host
    const host = hostById(hostId);
    if (!host) {
        return <div className="p-4">Host not found</div>;
    }

    // Filter plots by hostId
    const hostPlots = plots.filter((plot) => plot.hostId === hostId);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Host header */}
            <div className="flex flex-col items-center text-center">
                <img
                    src={host.photo}
                    alt={host.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h1 className="text-3xl font-bold">{host.name}</h1>
                <p className="text-gray-600 mt-2">{host.description}</p>
            </div>

            {/* Host's listings */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostPlots.map((plot) => (
                    <div
                        key={plot.id}
                        className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                        <img
                            src={plot.images[0]}
                            alt={plot.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="font-bold text-lg">{plot.title}</h2>
                            <p className="text-gray-600 text-sm">{plot.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}