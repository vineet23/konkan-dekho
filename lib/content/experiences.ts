import { cache } from "react";
import {
  experienceSchema,
  experiencesArraySchema,
  type Experience,
} from "@/lib/schemas/experience";
import { CONTENT_KEYS, HISTORY_LIMIT } from "./paths";
import { isFirebaseContentMode, readJson, writeJson } from "./store";
import type { TrashExperience } from "./types";

export type { TrashExperience } from "./types";

const loggedExperienceLoad = { done: false };

async function readExperiencesRaw(): Promise<Experience[]> {
  const source = isFirebaseContentMode() ? "Firebase Storage" : "local content/";
  const data = await readJson<unknown>(CONTENT_KEYS.experiences, []);
  const parsed = experiencesArraySchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `[content] Invalid experiences.json (source=${source})`,
      parsed.error.flatten()
    );
    return [];
  }
  if (!loggedExperienceLoad.done) {
    loggedExperienceLoad.done = true;
    console.log(
      `[content] Loaded ${parsed.data.length} experiences from ${source}`
    );
  }
  return parsed.data;
}

export const getExperiences = cache(async () => readExperiencesRaw());

export async function getExperienceBySlug(
  slug: string
): Promise<Experience | undefined> {
  const experiences = await getExperiences();
  return experiences.find((e) => e.slug === slug);
}

export async function listExperiencesUncached(): Promise<Experience[]> {
  return readExperiencesRaw();
}

export async function saveExperience(input: Experience): Promise<Experience> {
  const experience = experienceSchema.parse(input);
  const experiences = await readExperiencesRaw();
  const index = experiences.findIndex((e) => e.id === experience.id);

  if (index >= 0) {
    const previous = experiences[index];
    await pushHistory(previous);
    experiences[index] = experience;
  } else {
    if (experiences.some((e) => e.slug === experience.slug)) {
      throw new Error("An experience with this slug already exists");
    }
    experiences.push(experience);
  }

  await writeJson(CONTENT_KEYS.experiences, experiences);
  return experience;
}

export async function createExperience(
  input: Omit<Experience, "id"> & { id?: number }
): Promise<Experience> {
  const experiences = await readExperiencesRaw();
  const id =
    input.id ??
    (experiences.length ? Math.max(...experiences.map((e) => e.id)) + 1 : 1);
  return saveExperience({ ...input, id } as Experience);
}

async function pushHistory(experience: Experience) {
  const key = CONTENT_KEYS.experienceHistory(experience.id);
  const history = await readJson<Experience[]>(key, []);
  history.unshift(experience);
  await writeJson(key, history.slice(0, HISTORY_LIMIT));
}

export async function getExperienceHistory(
  id: number
): Promise<Experience[]> {
  return readJson<Experience[]>(CONTENT_KEYS.experienceHistory(id), []);
}

export async function rollbackExperience(id: number): Promise<Experience> {
  const key = CONTENT_KEYS.experienceHistory(id);
  const history = await readJson<Experience[]>(key, []);
  if (!history.length) {
    throw new Error("No history available to rollback");
  }
  const [previous, ...rest] = history;
  const experiences = await readExperiencesRaw();
  const index = experiences.findIndex((e) => e.id === id);
  if (index < 0) {
    throw new Error("Experience not found");
  }
  experiences[index] = previous;
  await writeJson(CONTENT_KEYS.experiences, experiences);
  await writeJson(key, rest);
  return previous;
}

export async function trashExperience(id: number): Promise<void> {
  const experiences = await readExperiencesRaw();
  const index = experiences.findIndex((e) => e.id === id);
  if (index < 0) {
    throw new Error("Experience not found");
  }
  const [record] = experiences.splice(index, 1);
  await writeJson(CONTENT_KEYS.experiences, experiences);

  const trash = await readJson<TrashExperience[]>(
    CONTENT_KEYS.trashExperiences,
    []
  );
  trash.unshift({ deletedAt: new Date().toISOString(), record });
  await writeJson(CONTENT_KEYS.trashExperiences, trash);
}

export async function listTrashedExperiences(): Promise<TrashExperience[]> {
  return readJson<TrashExperience[]>(CONTENT_KEYS.trashExperiences, []);
}

export async function restoreExperience(id: number): Promise<Experience> {
  const trash = await readJson<TrashExperience[]>(
    CONTENT_KEYS.trashExperiences,
    []
  );
  const trashIndex = trash.findIndex((t) => t.record.id === id);
  if (trashIndex < 0) {
    throw new Error("Experience not found in trash");
  }
  const entry = trash[trashIndex];
  const experiences = await readExperiencesRaw();

  if (experiences.some((e) => e.id === entry.record.id)) {
    throw new Error("Cannot restore: a live experience already uses this id");
  }
  if (experiences.some((e) => e.slug === entry.record.slug)) {
    throw new Error("Cannot restore: a live experience already uses this slug");
  }

  experiences.push(entry.record);
  trash.splice(trashIndex, 1);
  await writeJson(CONTENT_KEYS.experiences, experiences);
  await writeJson(CONTENT_KEYS.trashExperiences, trash);
  return entry.record;
}

export async function replaceAllExperiences(
  experiences: Experience[]
): Promise<void> {
  const parsed = experiencesArraySchema.parse(experiences);
  await writeJson(CONTENT_KEYS.experiences, parsed);
}
