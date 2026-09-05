/** Client helpers for admin media. Uploads go through /api/admin/upload (Admin SDK). */

export function isFirebaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
}

export async function uploadAdminFile(
  file: File,
  folder: "plots" | "experiences"
): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Paste a URL instead, or set NEXT_PUBLIC_FIREBASE_* env vars."
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Upload failed"
    );
  }
  if (!data.url || typeof data.url !== "string") {
    throw new Error("Upload failed: no URL returned");
  }
  return data.url;
}
