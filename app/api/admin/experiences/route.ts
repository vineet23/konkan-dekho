import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import {
  createExperience,
  listExperiencesUncached,
  saveExperience,
} from "@/lib/content";
import { experienceAdminSchema } from "@/lib/schemas/experience";

export async function GET() {
  return withAdmin(async () => {
    const experiences = await listExperiencesUncached();
    return NextResponse.json({ experiences });
  });
}

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const parsed = experienceAdminSchema.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Invalid experience"
      );
    }
    const experience = await createExperience(parsed.data);
    return NextResponse.json({ experience });
  });
}

export async function PUT(req: NextRequest) {
  return withAdmin(async () => {
    const body = await req.json();
    const parsed = experienceAdminSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Invalid experience"
      );
    }
    const experience = await saveExperience(parsed.data);
    return NextResponse.json({ experience });
  });
}
