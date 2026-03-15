import { spawnSync } from "node:child_process";
import { extname } from "node:path";

const includedRoots = ["apps/", "core/", "packages/", "tooling/"];
const excludedSegments = [
  "/dist/",
  "/build/",
  "/coverage/",
  "/storybook-static/",
  "/.mastra/",
  "/paraglide/",
  "/.nx/",
  "/.tanstack/",
];
const excludedSuffixes = [".d.ts", ".d.ts.map", ".js.map", "routeTree.gen.ts"];
const supportedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".md",
  ".yml",
  ".yaml",
]);
const shouldWrite = process.argv.includes("--write");

const trackedFilesResult = spawnSync("git", ["ls-files"], {
  encoding: "utf8",
});

if (trackedFilesResult.status !== 0) {
  process.stderr.write(trackedFilesResult.stderr ?? "");
  process.exit(trackedFilesResult.status ?? 1);
}

const trackedFiles = trackedFilesResult.stdout.split("\n").filter(Boolean);

const filesToCheck = trackedFiles.filter((file) => {
  if (!includedRoots.some((root) => file.startsWith(root))) {
    return false;
  }

  if (excludedSegments.some((segment) => file.includes(segment))) {
    return false;
  }

  if (excludedSuffixes.some((suffix) => file.endsWith(suffix))) {
    return false;
  }

  return supportedExtensions.has(extname(file));
});

if (filesToCheck.length === 0) {
  process.exit(0);
}

const formatCheckResult = spawnSync(
  "oxfmt",
  [shouldWrite ? "--write" : "--check", ...filesToCheck],
  {
    stdio: "inherit",
  },
);

process.exit(formatCheckResult.status ?? 1);
