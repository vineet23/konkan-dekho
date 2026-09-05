import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  decodeSession,
  encodeSession,
  passwordsMatch,
} from "./session";

function getSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    throw new Error("ADMIN_PASSWORD and ADMIN_SESSION_SECRET must be set");
  }
  return { password, secret };
}

export function verifyAdminPassword(candidate: string): boolean {
  const { password } = getSecrets();
  return passwordsMatch(candidate, password);
}

export function createAdminSessionCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
    maxAge: number;
  };
} {
  const { secret } = getSecrets();
  const value = encodeSession(
    { v: 1, exp: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000 },
    secret
  );
  return {
    name: ADMIN_COOKIE_NAME,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    },
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

export function isAdminAuthenticated(): boolean {
  try {
    const { secret } = getSecrets();
    const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    return Boolean(decodeSession(token, secret));
  } catch {
    return false;
  }
}

export function requireAdmin(): void {
  if (!isAdminAuthenticated()) {
    throw new Error("UNAUTHORIZED");
  }
}

// Simple in-memory login rate limit (per process)
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 20;
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) return false;
  entry.count += 1;
  return true;
}

/** Test helper — clears rate-limit state between unit tests. */
export function resetLoginRateLimitForTests() {
  attempts.clear();
}
