import { promises as fs } from "fs";
import path from "path";
import {
  getContentBucket,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";

function localRoot() {
  return path.join(process.cwd(), "content");
}

function localPath(key: string) {
  const relative = key.replace(/^content\//, "");
  return path.join(localRoot(), relative);
}

async function ensureParent(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

/** Production (Netlify): Firebase Storage. Local: content/ on disk. */
export function useFirebaseContentStore() {
  return isFirebaseAdminConfigured();
}

async function firebaseReadJson<T>(key: string, fallback: T): Promise<T> {
  const bucket = getContentBucket();
  if (!bucket) return fallback;

  const file = bucket.file(key);
  const [exists] = await file.exists();
  if (!exists) return fallback;

  const [buf] = await file.download();
  return JSON.parse(buf.toString("utf8")) as T;
}

async function firebaseWriteJson(key: string, body: string): Promise<void> {
  const bucket = getContentBucket();
  if (!bucket) {
    throw new Error("Firebase Storage is not configured for content writes");
  }

  await bucket.file(key).save(body, {
    contentType: "application/json; charset=utf-8",
    metadata: {
      cacheControl: "no-cache",
    },
    resumable: false,
  });
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (useFirebaseContentStore()) {
    try {
      return await firebaseReadJson(key, fallback);
    } catch (err) {
      console.error(`Firebase content read failed for ${key}`, err);
      return fallback;
    }
  }

  const filePath = localPath(key);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(key: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);

  if (useFirebaseContentStore()) {
    await firebaseWriteJson(key, body);
    return;
  }

  const filePath = localPath(key);
  await ensureParent(filePath);
  await fs.writeFile(filePath, body, "utf8");
}

/** @deprecated use isFirebaseContentMode — kept for older imports */
export function isBlobMode() {
  return useFirebaseContentStore();
}

export function isFirebaseContentMode() {
  return useFirebaseContentStore();
}
