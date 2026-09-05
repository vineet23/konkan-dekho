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

/** Production: Firebase Storage when Admin is configured. Local: content/ on disk. */
export function useFirebaseContentStore() {
  return isFirebaseAdminConfigured();
}

/**
 * Process-level cache so Next build / many pages share one Firebase download
 * instead of re-fetching plots.json / experiences.json per route.
 */
const memoryCache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function invalidateContentCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
    inflight.delete(key);
    return;
  }
  memoryCache.clear();
  inflight.clear();
}

async function firebaseReadJsonUncached<T>(
  key: string,
  fallback: T
): Promise<T> {
  const bucket = getContentBucket();
  if (!bucket) {
    console.warn(`[content] Firebase Admin not ready; fallback for ${key}`);
    return fallback;
  }

  const file = bucket.file(key);
  const [exists] = await file.exists();
  if (!exists) {
    console.warn(
      `[content] Missing in Firebase Storage: ${key} (using fallback)`
    );
    return fallback;
  }

  const [buf] = await file.download();
  console.log(
    `[content] Fetched ${key} from Firebase Storage (${buf.length} bytes)`
  );
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
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const load = (async (): Promise<T> => {
    try {
      if (useFirebaseContentStore()) {
        try {
          const data = await firebaseReadJsonUncached(key, fallback);
          memoryCache.set(key, data);
          return data;
        } catch (err) {
          console.error(`Firebase content read failed for ${key}`, err);
          memoryCache.set(key, fallback);
          return fallback;
        }
      }

      const filePath = localPath(key);
      try {
        const raw = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(raw) as T;
        memoryCache.set(key, data);
        return data;
      } catch {
        memoryCache.set(key, fallback);
        return fallback;
      }
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, load);
  return load;
}

export async function writeJson(key: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);

  // Keep process cache in sync for subsequent reads in this instance
  memoryCache.set(key, data);
  inflight.delete(key);

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

export { invalidateContentCache };
