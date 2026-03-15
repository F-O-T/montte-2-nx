#!/usr/bin/env bun

/**
 * Module boundary enforcement for the monorepo.
 *
 * Rules:
 *   apps    → can import from: packages, core, tooling, libs
 *   packages → can import from: core, tooling, libs
 *   libs    → can import from: core, tooling
 *   core    → can import from: tooling
 *   tooling → cannot import from any workspace layer
 *
 * Packages within the same layer CAN import from each other.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "../..");

const LAYERS = ["tooling", "core", "libs", "packages", "apps"] as const;
type Layer = (typeof LAYERS)[number];

// Each layer can depend on layers listed here
const ALLOWED_DEPS: Record<Layer, Layer[]> = {
  tooling: [],
  core: ["tooling"],
  libs: ["core", "tooling"],
  packages: ["core", "tooling", "libs"],
  apps: ["packages", "core", "tooling", "libs"],
};

const SCOPES: Record<Layer, string> = {
  tooling: "@tooling/",
  core: "@core/",
  libs: "@libs/",
  packages: "@packages/",
  apps: "@apps/",
};

function getLayerFromScope(dep: string): Layer | null {
  for (const [layer, scope] of Object.entries(SCOPES)) {
    if (dep.startsWith(scope)) return layer as Layer;
  }
  return null;
}

async function getWorkspacePackages(): Promise<{ name: string; dir: string; layer: Layer }[]> {
  const packages: { name: string; dir: string; layer: Layer }[] = [];

  for (const layer of LAYERS) {
    const layerDir = join(ROOT, layer);
    let entries: string[];
    try {
      entries = await readdir(layerDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const pkgJsonPath = join(layerDir, entry, "package.json");
      try {
        const raw = await readFile(pkgJsonPath, "utf-8");
        const pkg = JSON.parse(raw);
        packages.push({ name: pkg.name, dir: join(layerDir, entry), layer });
      } catch {
        // not a package
      }
    }
  }

  return packages;
}

async function checkBoundaries(): Promise<boolean> {
  const packages = await getWorkspacePackages();
  let hasViolations = false;

  for (const pkg of packages) {
    const pkgJsonPath = join(pkg.dir, "package.json");
    const raw = await readFile(pkgJsonPath, "utf-8");
    const pkgJson = JSON.parse(raw);

    const allDeps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
    };

    for (const dep of Object.keys(allDeps)) {
      const depLayer = getLayerFromScope(dep);
      if (!depLayer) continue; // external dependency

      // Same layer is allowed
      if (depLayer === pkg.layer) continue;

      const allowed = ALLOWED_DEPS[pkg.layer];
      if (!allowed.includes(depLayer)) {
        const rel = relative(ROOT, pkgJsonPath);
        console.error(`❌ Boundary violation: ${pkg.name} (${pkg.layer}) → ${dep} (${depLayer})`);
        console.error(`   ${rel}: "${pkg.layer}" cannot depend on "${depLayer}"`);
        console.error(`   Allowed dependencies for "${pkg.layer}": [${allowed.join(", ")}]`);
        console.error("");
        hasViolations = true;
      }
    }
  }

  if (!hasViolations) {
    console.log("✅ All module boundaries are valid.");
  }

  return !hasViolations;
}

const ok = await checkBoundaries();
if (!ok) process.exit(1);
