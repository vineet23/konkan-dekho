/** Flatten react-hook-form / Zod nested errors into readable messages. */
export function flattenFormErrors(
  errors: Record<string, unknown>,
  prefix = ""
): string[] {
  const out: string[] = [];
  const skip = new Set(["type", "types", "ref", "message", "root"]);

  for (const [key, val] of Object.entries(errors)) {
    if (!val || typeof val !== "object") continue;
    const node = val as Record<string, unknown>;
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof node.message === "string" && node.message) {
      out.push(node.message);
    }
    if (
      node.root &&
      typeof node.root === "object" &&
      typeof (node.root as { message?: string }).message === "string"
    ) {
      out.push(String((node.root as { message: string }).message));
    }

    for (const [childKey, childVal] of Object.entries(node)) {
      if (skip.has(childKey)) continue;
      if (childVal && typeof childVal === "object") {
        out.push(
          ...flattenFormErrors(
            { [childKey]: childVal },
            path
          )
        );
      }
    }
  }

  return Array.from(new Set(out.filter(Boolean)));
}

export function fieldError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".");
  let cur: unknown = errors;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  if (cur && typeof cur === "object" && "message" in cur) {
    const msg = (cur as { message?: string }).message;
    return msg ? String(msg) : undefined;
  }
  return undefined;
}

/** First message on an array field (root / message / index 0…). */
export function arrayFieldError(
  errors: Record<string, unknown>,
  name: string
): string | undefined {
  const node = errors[name];
  if (!node || typeof node !== "object") return undefined;
  const obj = node as Record<string, unknown>;
  if (typeof obj.message === "string" && obj.message) return obj.message;
  if (
    obj.root &&
    typeof obj.root === "object" &&
    typeof (obj.root as { message?: string }).message === "string"
  ) {
    return String((obj.root as { message: string }).message);
  }
  for (const [k, v] of Object.entries(obj)) {
    if (skipMeta(k) && v && typeof v === "object" && "message" in v) {
      const msg = (v as { message?: string }).message;
      if (msg) return String(msg);
    }
  }
  return undefined;
}

function skipMeta(key: string) {
  return !["type", "types", "ref", "message", "root"].includes(key);
}
