/**
 * Push local content/*.json into Firebase Storage (first-time / sync).
 *
 * Requires:
 *   FIREBASE_SERVICE_ACCOUNT_JSON  (or FIREBASE_SERVICE_ACCOUNT_BASE64)
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *
 * Usage: npm run push:content
 */
import { promises as fs } from "fs";
import path from "path";
import { CONTENT_KEYS } from "../lib/content/paths";
import { writeJson, useFirebaseContentStore } from "../lib/content/store";

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
  if (!useFirebaseContentStore()) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (or _BASE64) and NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET."
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
