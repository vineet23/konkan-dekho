"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/plots", label: "Plots" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/trash", label: "Trash" },
];

export function AdminShell({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLogin, router]);

  async function publish() {
    setPublishing(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setMessage(
        data.message || "Published — public pages refreshed"
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLogin) {
    return <div className="min-h-screen bg-stone-100">{children}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">
              Konkan Dekho
            </p>
            <h1 className="text-lg font-semibold">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={publish}
              disabled={publishing}
              className="min-h-10 px-4"
            >
              {publishing ? "Publishing…" : "Publish"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={logout}
              className="min-h-10"
            >
              Log out
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "min-h-10 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
                pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href))
                  ? "bg-stone-900 text-white"
                  : "text-stone-700 hover:bg-stone-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {message ? (
          <p className="mx-auto max-w-3xl px-4 pb-2 text-sm text-stone-600">
            {message}
          </p>
        ) : null}
      </header>
      <main className="mx-auto max-w-3xl px-4 py-4">{children}</main>
    </div>
  );
}
