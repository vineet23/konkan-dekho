import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "kd_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  v: 1;
  exp: number;
};

export function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function encodeSession(payload: SessionPayload, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(body, secret);
  return `${body}.${sig}`;
}

export function decodeSession(
  token: string,
  secret: string,
  now = Date.now()
): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as SessionPayload;
    if (payload.v !== 1 || typeof payload.exp !== "number") return null;
    if (now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function passwordsMatch(candidate: string, password: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
