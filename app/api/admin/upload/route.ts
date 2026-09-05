import { NextRequest, NextResponse } from "next/server";
import { withAdmin, jsonError } from "@/lib/auth/api";
import { uploadAdminFileToStorage } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  return withAdmin(async () => {
    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "plots");
    const folder =
      folderRaw === "experiences" ? "experiences" : ("plots" as const);

    if (!(file instanceof File)) {
      return jsonError("file is required");
    }
    if (file.size <= 0) {
      return jsonError("Empty file");
    }
    if (file.size > MAX_BYTES) {
      return jsonError("File too large (max 25 MB)");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadAdminFileToStorage(
      buffer,
      file.name || "upload.bin",
      folder,
      file.type || undefined
    );

    return NextResponse.json({ url });
  });
}
