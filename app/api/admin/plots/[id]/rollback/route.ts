import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/api";
import { getPlotHistory, rollbackPlot } from "@/lib/content";

type Ctx = { params: { id: string } };

export async function POST(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const plot = await rollbackPlot(id);
    const history = await getPlotHistory(id);
    return NextResponse.json({ plot, historyCount: history.length });
  });
}
