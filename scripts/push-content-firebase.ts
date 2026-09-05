/**
 * Push local content/*.json into Firebase Storage (first-time / sync).
 *
 * Requires in .env.local (or the shell):
 *   FIREBASE_SERVICE_ACCOUNT_JSON  (or FIREBASE_SERVICE_ACCOUNT_BASE64)
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *
 * Usage: npm run push:content
 */
import { promises as fs } from "fs";
import path from "path";

async function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim().replace(/^\uFEFF/, "");
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    // .env.local optional if vars already exported
  }
}

async function readLocal(relative: string, fallback: unknown) {
  const filePath = path.join(process.cwd(), "content", relative);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function main() {
  await loadEnvLocal();

  const { CONTENT_KEYS } = await import("../lib/content/paths");
  const { writeJson, useFirebaseContentStore } = await import(
    "../lib/content/store"
  );

  if (!useFirebaseContentStore()) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (or _BASE64) and NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local."
    );
  }

  const plots = await readLocal("plots.json", []);
  const experiences = await readLocal("experiences.json", []);
  const trashPlots = await readLocal("trash/plots.json", []);
  const trashExperiences = await readLocal("trash/experiences.json", []);

  await writeJson(CONTENT_KEYS.plots, plots);
  await writeJson(CONTENT_KEYS.experiences, experiences);
  await writeJson(CONTENT_KEYS.trashPlots, trashPlots);
  await writeJson(CONTENT_KEYS.trashExperiences, trashExperiences);

  console.log(
    `Pushed to Firebase Storage: ${Array.isArray(plots) ? plots.length : "?"} plots, ${
      Array.isArray(experiences) ? experiences.length : "?"
    } experiences`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
