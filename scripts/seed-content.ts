import { promises as fs } from "fs";
import path from "path";
import { plots } from "../lib/data/plots";
import { experiences } from "../lib/data/experiences";
import { plotsArraySchema } from "../lib/schemas/plot";
import { experiencesArraySchema } from "../lib/schemas/experience";

async function main() {
  const root = path.join(process.cwd(), "content");
  await fs.mkdir(path.join(root, "history", "plots"), { recursive: true });
  await fs.mkdir(path.join(root, "history", "experiences"), { recursive: true });
  await fs.mkdir(path.join(root, "trash"), { recursive: true });

  const parsedPlots = plotsArraySchema.parse(plots);
  const parsedExperiences = experiencesArraySchema.parse(experiences);

  await fs.writeFile(
    path.join(root, "plots.json"),
    JSON.stringify(parsedPlots, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(root, "experiences.json"),
    JSON.stringify(parsedExperiences, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(root, "trash", "plots.json"),
    JSON.stringify([], null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(root, "trash", "experiences.json"),
    JSON.stringify([], null, 2),
    "utf8"
  );

  console.log(
    `Seeded ${parsedPlots.length} plots and ${parsedExperiences.length} experiences into content/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
