import { NextRequest, NextResponse } from "next/server";
import {
  checkLoginRateLimit,
  createAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/auth/admin";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body.password || "");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: "Admin auth is not configured" },
      { status: 500 }
    );
  }

  const cookie = createAdminSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
