import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAdmin } from "@/lib/auth/api";

/**
 * Publish on Vercel: on-demand cache revalidation.
 * Content already lives in Firebase Storage after Save; this refreshes public pages.
 * Optional NETLIFY_BUILD_HOOK_URL is kept as a soft fallback only.
 */
export async function POST() {
  return withAdmin(async () => {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/experiences");
    revalidatePath("/experiences", "layout");
    revalidatePath("/explore/all-plots");
    revalidatePath("/explore/featured-locations");
    revalidatePath("/explore/featured-locations", "layout");

    let netlifyTriggered = false;
    const hook = process.env.NETLIFY_BUILD_HOOK_URL?.trim();
    if (hook) {
      try {
        const res = await fetch(hook, { method: "POST" });
        netlifyTriggered = res.ok;
        if (!res.ok) {
          console.warn(
            `[publish] Netlify build hook returned ${res.status} (ignored; Vercel revalidate is primary)`
          );
        }
      } catch (err) {
        console.warn("[publish] Netlify build hook failed (ignored)", err);
      }
    }

    return NextResponse.json({
      ok: true,
      publishedAt: new Date().toISOString(),
      revalidated: true,
      netlifyTriggered,
      message: netlifyTriggered
        ? "Published — Vercel cache revalidated; Netlify rebuild also triggered"
        : "Published — Vercel public pages revalidated (next visit shows fresh Firebase content)",
    });
  });
}
