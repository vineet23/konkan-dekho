import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";

function parseServiceAccount(): Record<string, string> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.trim();
  if (b64) {
    try {
      return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    } catch {
      return null;
    }
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    parseServiceAccount() &&
      (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        process.env.FIREBASE_STORAGE_BUCKET)
  );
}

export function getFirebaseAdminApp(): App | null {
  if (!isFirebaseAdminConfigured()) return null;

  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) return null;

  const bucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET;

  return initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    storageBucket: bucket,
  });
}

export function getContentBucket() {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  return getStorage(app).bucket();
}

/** Admin-SDK upload (bypasses Storage security rules). Returns a public download URL. */
export async function uploadAdminFileToStorage(
  data: Buffer,
  filename: string,
  folder: "plots" | "experiences",
  contentType?: string
): Promise<string> {
  const bucket = getContentBucket();
  if (!bucket) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_BASE64 (or _JSON) and restart."
    );
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectPath = `AdminUploads/${folder}/${Date.now()}-${safeName}`;
  const token = randomUUID();
  const type = contentType || "application/octet-stream";

  await bucket.file(objectPath).save(data, {
    resumable: false,
    metadata: {
      contentType: type,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`;
}
