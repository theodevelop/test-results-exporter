import { cp, mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const version = "1.0.0";

async function packageBrowser(browser) {
  const staging = path.join(dist, browser);
  const manifestSource = path.join(root, `manifest.${browser}.json`);
  const targetZip = path.join(dist, `test-results-exporter-${browser}-v${version}.zip`);

  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });

  for (const name of ["popup.html", "popup.css", "popup.js", "icons"]) {
    await cp(path.join(root, name), path.join(staging, name), { recursive: true });
  }
  await cp(manifestSource, path.join(staging, "manifest.json"));

  await rm(targetZip, { force: true });
  await execFileAsync("zip", ["-qr", targetZip, "."], { cwd: staging });
}

async function packageSource() {
  const targetZip = path.join(dist, `test-results-exporter-source-v${version}.zip`);
  await rm(targetZip, { force: true });
  await execFileAsync("zip", ["-qr", targetZip, ".", "-x", "dist/*"], { cwd: root });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await packageBrowser("chrome");
await packageBrowser("firefox");
await packageSource();
console.log(`Packages created in ${dist}`);
