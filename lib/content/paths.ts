export const HISTORY_LIMIT = 5;

export const CONTENT_KEYS = {
  plots: "content/plots.json",
  experiences: "content/experiences.json",
  trashPlots: "content/trash/plots.json",
  trashExperiences: "content/trash/experiences.json",
  plotHistory: (id: number) => `content/history/plots/${id}.json`,
  experienceHistory: (id: number) => `content/history/experiences/${id}.json`,
} as const;
