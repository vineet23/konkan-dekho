import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import { createPlot, listPlotsUncached, savePlot } from "@/lib/content";
import { plotAdminSchema } from "@/lib/schemas/plot";

export async function GET() {
  return withAdmin(async () => {
    const plots = await listPlotsUncached();
    return NextResponse.json({ plots });
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const parsed = plotAdminSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid plot");
    }
    const plot = await createPlot(parsed.data);
    return NextResponse.json({ plot });
  });
}

export async function PUT(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const parsed = plotAdminSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid plot");
    }
    const plot = await savePlot(parsed.data);
    return NextResponse.json({ plot });
  });
}
