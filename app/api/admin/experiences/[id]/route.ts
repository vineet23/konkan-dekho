import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import {
  getExperienceHistory,
  listExperiencesUncached,
  saveExperience,
  trashExperience,
} from "@/lib/content";
import { experienceAdminSchema } from "@/lib/schemas/experience";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const experiences = await listExperiencesUncached();
    const experience = experiences.find((e) => e.id === id);
    if (!experience) return jsonError("Experience not found", 404);
    const history = await getExperienceHistory(id);
    return NextResponse.json({
      experience,
      historyCount: history.length,
    });
  });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    const id = Number(params.id);
    const body = await req.json();
    const parsed = experienceAdminSchema.safeParse({ ...body, id });
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Invalid experience"
      );
    }
    const experience = await saveExperience(parsed.data);
    const history = await getExperienceHistory(id);
    return NextResponse.json({ experience, historyCount: history.length });
  });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  return withAdmin(async () => {
    await trashExperience(Number(params.id));
    return NextResponse.json({ ok: true });
  });
}
