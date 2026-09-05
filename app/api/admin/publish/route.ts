import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAdmin } from "@/lib/auth/api";

export async function POST() {
  return withAdmin(async () => {
    // Best-effort ISR bust (works better on some hosts than others)
    revalidatePath("/", "layout");
    revalidatePath("/experiences");
    revalidatePath("/explore/all-plots");
    revalidatePath("/explore/featured-locations");

    let netlifyTriggered = false;
    const hook = process.env.NETLIFY_BUILD_HOOK_URL?.trim();
    if (hook) {
      const res = await fetch(hook, { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return NextResponse.json(
          {
            error: `Netlify build hook failed (${res.status}) ${text}`.trim(),
          },
          { status: 502 }
        );
      }
      netlifyTriggered = true;
    }

    return NextResponse.json({
      ok: true,
      publishedAt: new Date().toISOString(),
      netlifyTriggered,
      message: netlifyTriggered
        ? "Netlify rebuild triggered — site updates in a few minutes"
        : "Cache revalidated. Set NETLIFY_BUILD_HOOK_URL for a full Netlify rebuild.",
    });
  });
}
