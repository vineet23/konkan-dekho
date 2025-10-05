/* eslint-disable */
// Build-time sitemap generator for output: 'export'
// - Reads plot IDs from lib/data/plots.ts (no TS runtime deps)
// - Writes public/sitemap.xml

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT_DIR = process.cwd();
const SITE_URL = "https://konkandekho.com";

function loadPlotsFromTypeScript() {
  const tsFile = path.join(ROOT_DIR, "lib", "data", "plots.ts");
  const tsCode = fs.readFileSync(tsFile, "utf8");

  // Strip TS imports and type annotations, convert to CommonJS export
  const withoutImports = tsCode.replace(/^import[^\n]*\n/gm, "");
  const commonJsCode = withoutImports.replace(
    /export\s+const\s+plots\s*:\s*[^=]+=/,
    "module.exports ="
  );

  const sandbox = { module: {}, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(commonJsCode, sandbox, { filename: "plots.ts" });
  const data = sandbox.module.exports;
  if (!Array.isArray(data)) {
    throw new Error("Parsed plots.ts did not export an array");
  }
  return data;
}

function formatDateYYYYMMDD(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildUrls() {
  const staticPaths = [
    "/",
    "/about",
    "/contact",
    "/explore/all-plots",
    "/explore/featured-locations",
    "/explore/how-it-works",
    "/explore/list-your-plot",
    "/team",
    "/testimonials",
  ];

  const plots = loadPlotsFromTypeScript();
  const plotPaths = plots.map(
    (p) => `/${p.slug}-${p.area.toLowerCase().replace(/ /g, "-")}`
  );

  return { staticPaths, plotPaths };
}

function generateSitemapXml({ staticPaths, plotPaths }) {
  const today = formatDateYYYYMMDD();

  const urlEntry = (loc, priority) =>
    `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const entries = [];
  for (const p of staticPaths)
    entries.push(urlEntry(p, p === "/" ? "1.0" : "0.7"));
  for (const p of plotPaths) entries.push(urlEntry(p, "0.8"));

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n"
  )}\n</urlset>\n`;
}

function writeFileEnsured(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function main() {
  try {
    const urls = buildUrls();
    const xml = generateSitemapXml(urls);
    const outPath = path.join(ROOT_DIR, "public", "sitemap.xml");
    writeFileEnsured(outPath, xml);
    console.log(`Generated ${outPath}`);
  } catch (err) {
    console.error("Failed to generate sitemap.xml:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
