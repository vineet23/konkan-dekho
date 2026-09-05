import { promises as fs } from "fs";
import path from "path";

function useBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

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

async function blobListUrl(key: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const res = await fetch(
    `https://vercel.com/api/blob?prefix=${encodeURIComponent(key)}&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(`Blob list failed: ${res.status}`);
  }
  const data = (await res.json()) as {
    blobs?: { pathname: string; url: string }[];
  };
  const exact = (data.blobs || []).find((b) => b.pathname === key);
  return exact?.url ?? null;
}

async function blobPut(key: string, body: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const res = await fetch(
    `https://vercel.com/api/blob?pathname=${encodeURIComponent(key)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-content-type": "application/json",
        "x-add-random-suffix": "0",
        "x-allow-overwrite": "1",
        "x-access": "public",
      },
      body,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blob put failed: ${res.status} ${text}`);
  }
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (useBlobStore()) {
    const url = await blobListUrl(key);
    if (!url) return fallback;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
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

  if (useBlobStore()) {
    await blobPut(key, body);
    return;
  }

  const filePath = localPath(key);
  await ensureParent(filePath);
  await fs.writeFile(filePath, body, "utf8");
}

export function isBlobMode() {
  return useBlobStore();
}
