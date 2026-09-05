import type { Plot } from "@/lib/schemas/plot";
import type { Experience } from "@/lib/schemas/experience";

export type TrashPlot = {
  deletedAt: string;
  record: Plot;
};

export type TrashExperience = {
  deletedAt: string;
  record: Experience;
};
