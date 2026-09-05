import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAdmin } from "@/lib/auth/api";

export async function POST() {
  return withAdmin(async () => {
    // Bust public pages after content changes
    revalidatePath("/", "layout");
    revalidatePath("/experiences");
    revalidatePath("/explore/all-plots");
    revalidatePath("/explore/featured-locations");
    return NextResponse.json({
      ok: true,
      publishedAt: new Date().toISOString(),
    });
  });
}
