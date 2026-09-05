"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { TrashPlot, TrashExperience } from "@/lib/content/types";

export function TrashClient({
  plots,
  experiences,
}: {
  plots: TrashPlot[];
  experiences: TrashExperience[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function restore(type: "plot" | "experience", id: number) {
    setError("");
    const res = await fetch("/api/admin/trash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Restore failed");
      return;
    }
    router.refresh();
  }

  if (!plots.length && !experiences.length) {
    return <p className="text-sm text-stone-500">Trash is empty.</p>;
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {plots.length ? (
        <section className="space-y-2">
          <h3 className="font-medium">Plots</h3>
          <ul className="divide-y overflow-hidden rounded-xl border bg-white">
            {plots.map((item) => (
              <li
                key={item.record.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.record.title}</p>
                  <p className="text-xs text-stone-500">
                    Deleted {new Date(item.deletedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  className="min-h-10"
                  variant="outline"
                  onClick={() => restore("plot", item.record.id)}
                >
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {experiences.length ? (
        <section className="space-y-2">
          <h3 className="font-medium">Experiences</h3>
          <ul className="divide-y overflow-hidden rounded-xl border bg-white">
            {experiences.map((item) => (
              <li
                key={item.record.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.record.name}</p>
                  <p className="text-xs text-stone-500">
                    Deleted {new Date(item.deletedAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  className="min-h-10"
                  variant="outline"
                  onClick={() => restore("experience", item.record.id)}
                >
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
