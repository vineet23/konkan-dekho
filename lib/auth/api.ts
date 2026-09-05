import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function withAdmin<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    requireAdmin();
  } catch {
    return Promise.resolve(jsonError("Unauthorized", 401));
  }
  return handler().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : "Request failed";
    const status = message === "UNAUTHORIZED" ? 401 : 400;
    return jsonError(message, status);
  });
}
