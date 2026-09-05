import { cache } from "react";
import {
  plotSchema,
  plotsArraySchema,
  type Plot,
} from "@/lib/schemas/plot";
import { CONTENT_KEYS, HISTORY_LIMIT } from "./paths";
import { isFirebaseContentMode, readJson, writeJson } from "./store";
import type { TrashPlot } from "./types";

export type { TrashPlot } from "./types";

const loggedPlotLoad = { done: false };

async function readPlotsRaw(): Promise<Plot[]> {
  const source = isFirebaseContentMode() ? "Firebase Storage" : "local content/";
  const data = await readJson<unknown>(CONTENT_KEYS.plots, []);
  const parsed = plotsArraySchema.safeParse(data);
  if (!parsed.success) {
    console.error(`[content] Invalid plots.json (source=${source})`, parsed.error.flatten());
    return [];
  }
  if (!loggedPlotLoad.done) {
    loggedPlotLoad.done = true;
    console.log(`[content] Loaded ${parsed.data.length} plots from ${source}`);
  }
  return parsed.data;
}

export const getPlots = cache(async () => readPlotsRaw());

export async function getPlotById(id: number): Promise<Plot | undefined> {
  const plots = await getPlots();
  return plots.find((p) => p.id === id);
}

export async function getPlotBySlugKey(slugKey: string): Promise<Plot | undefined> {
  const plots = await getPlots();
  return plots.find(
    (p) => `${p.slug}-${p.area.toLowerCase().replace(/ /g, "-")}` === slugKey
  );
}

export async function listPlotsUncached(): Promise<Plot[]> {
  return readPlotsRaw();
}

export async function savePlot(input: Plot): Promise<Plot> {
  const plot = plotSchema.parse(input);
  const plots = await readPlotsRaw();
  const index = plots.findIndex((p) => p.id === plot.id);

  if (plots.some((p) => p.id !== plot.id && p.slug === plot.slug)) {
    throw new Error("A plot with this slug already exists");
  }

  if (index >= 0) {
    const previous = plots[index];
    await pushHistory(previous);
    plots[index] = plot;
  } else {
    plots.push(plot);
  }

  await writeJson(CONTENT_KEYS.plots, plots);
  return plot;
}

export async function createPlot(
  input: Omit<Plot, "id"> & { id?: number }
): Promise<Plot> {
  const plots = await readPlotsRaw();
  const id =
    input.id ??
    (plots.length ? Math.max(...plots.map((p) => p.id)) + 1 : 1);
  return savePlot({ ...input, id } as Plot);
}

async function pushHistory(plot: Plot) {
  const key = CONTENT_KEYS.plotHistory(plot.id);
  const history = await readJson<Plot[]>(key, []);
  history.unshift(plot);
  await writeJson(key, history.slice(0, HISTORY_LIMIT));
}

export async function getPlotHistory(id: number): Promise<Plot[]> {
  return readJson<Plot[]>(CONTENT_KEYS.plotHistory(id), []);
}

export async function rollbackPlot(id: number): Promise<Plot> {
  const key = CONTENT_KEYS.plotHistory(id);
  const history = await readJson<Plot[]>(key, []);
  if (!history.length) {
    throw new Error("No history available to rollback");
  }
  const [previous, ...rest] = history;
  const plots = await readPlotsRaw();
  const index = plots.findIndex((p) => p.id === id);
  if (index < 0) {
    throw new Error("Plot not found");
  }
  plots[index] = previous;
  await writeJson(CONTENT_KEYS.plots, plots);
  await writeJson(key, rest);
  return previous;
}

export async function trashPlot(id: number): Promise<void> {
  const plots = await readPlotsRaw();
  const index = plots.findIndex((p) => p.id === id);
  if (index < 0) {
    throw new Error("Plot not found");
  }
  const [record] = plots.splice(index, 1);
  await writeJson(CONTENT_KEYS.plots, plots);

  const trash = await readJson<TrashPlot[]>(CONTENT_KEYS.trashPlots, []);
  trash.unshift({ deletedAt: new Date().toISOString(), record });
  await writeJson(CONTENT_KEYS.trashPlots, trash);
}

export async function listTrashedPlots(): Promise<TrashPlot[]> {
  return readJson<TrashPlot[]>(CONTENT_KEYS.trashPlots, []);
}

export async function restorePlot(id: number): Promise<Plot> {
  const trash = await readJson<TrashPlot[]>(CONTENT_KEYS.trashPlots, []);
  const trashIndex = trash.findIndex((t) => t.record.id === id);
  if (trashIndex < 0) {
    throw new Error("Plot not found in trash");
  }
  const entry = trash[trashIndex];
  const plots = await readPlotsRaw();

  if (plots.some((p) => p.id === entry.record.id)) {
    throw new Error("Cannot restore: a live plot already uses this id");
  }
  if (plots.some((p) => p.slug === entry.record.slug)) {
    throw new Error("Cannot restore: a live plot already uses this slug");
  }

  plots.push(entry.record);
  trash.splice(trashIndex, 1);
  await writeJson(CONTENT_KEYS.plots, plots);
  await writeJson(CONTENT_KEYS.trashPlots, trash);
  return entry.record;
}

export async function replaceAllPlots(plots: Plot[]): Promise<void> {
  const parsed = plotsArraySchema.parse(plots);
  await writeJson(CONTENT_KEYS.plots, parsed);
}
