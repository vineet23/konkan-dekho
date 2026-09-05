import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/api";
import {
  getExperienceHistory,
  rollbackExperience,
} from "@/lib/content";

type Ctx = { params: { id: string } };

export async function POST(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const experience = await rollbackExperience(id);
    const history = await getExperienceHistory(id);
    return NextResponse.json({
      experience,
      historyCount: history.length,
    });
  });
}
