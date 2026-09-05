"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export function AdminSearchList({
  items,
  emptyLabel,
}: {
  items: { id: number; title: string; subtitle: string; href: string }[];
  emptyLabel: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.subtitle.toLowerCase().includes(needle)
    );
  }, [items, q]);

  return (
    <div className="space-y-3">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        className="min-h-11"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">{emptyLabel}</p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-white">
          {filtered.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block px-4 py-3 hover:bg-stone-50 active:bg-stone-100"
              >
                <p className="font-medium leading-snug">{item.title}</p>
                <p className="text-sm text-stone-500">{item.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
