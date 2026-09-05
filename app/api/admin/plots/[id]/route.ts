import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import {
  getPlotHistory,
  listPlotsUncached,
  savePlot,
  trashPlot,
} from "@/lib/content";
import { plotAdminSchema } from "@/lib/schemas/plot";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const plots = await listPlotsUncached();
    const plot = plots.find((p) => p.id === id);
    if (!plot) return jsonError("Plot not found", 404);
    const history = await getPlotHistory(id);
    return NextResponse.json({ plot, historyCount: history.length });
  });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const body = await req.json();
    const parsed = plotAdminSchema.safeParse({ ...body, id });
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid plot");
    }
    const plot = await savePlot(parsed.data);
    const history = await getPlotHistory(id);
    return NextResponse.json({ plot, historyCount: history.length });
  });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    await trashPlot(Number(params.id));
    return NextResponse.json({ ok: true });
  });
}
