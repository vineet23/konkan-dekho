import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import {
  listTrashedExperiences,
  listTrashedPlots,
  restoreExperience,
  restorePlot,
} from "@/lib/content";

export async function GET() {
  return withAdmin(async () => {
    const [plots, experiences] = await Promise.all([
      listTrashedPlots(),
      listTrashedExperiences(),
    ]);
    return NextResponse.json({ plots, experiences });
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const type = body.type as "plot" | "experience";
    const id = Number(body.id);
    if (!id || (type !== "plot" && type !== "experience")) {
      return jsonError("type and id are required");
    }
    if (type === "plot") {
      const record = await restorePlot(id);
      return NextResponse.json({ record });
    }
    const record = await restoreExperience(id);
    return NextResponse.json({ record });
  });
}
