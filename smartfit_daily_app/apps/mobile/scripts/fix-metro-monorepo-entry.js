#!/usr/bin/env node
/**
 * Workaround for an @expo/cli bug in this Expo SDK version: when generating
 * the web dev server's initial HTML, it resolves the `expo-router/entry`
 * "main" module via plain Node `require.resolve()` (not Metro's configured
 * multi-root resolver), then does `path.relative(projectRoot, resolved)`
 * without normalizing ".." segments for the URL — producing a broken
 * `/../../node_modules/...` <script src>, which browsers refuse to execute.
 *
 * In this npm-workspaces monorepo, `expo-router` is hoisted to the
 * workspace root, so `projectRoot` (apps/mobile) is always 2 directories
 * below it — hitting this bug every time. Metro's own resolver (configured
 * via metro.config.js's nodeModulesPaths) handles the real bundling fine;
 * only this one entry-point-URL-generation step is affected.
 *
 * Fix: keep a real (non-symlinked — Node resolves symlinks to their
 * realpath, which defeats the purpose) local copy of expo-router in
 * apps/mobile/node_modules, so the nearest-ancestor lookup finds it 1 level
 * up (a clean relative path) instead of 2.
 *
 * Runs on postinstall. Safe to delete once the upstream bug is fixed —
 * check the "main"/`expo-router/entry` `<script src>` no longer has ".."
 * in it (docs/02-design/02-technical/tech-stack.md's Expo version note).
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '../..');
const source = path.join(workspaceRoot, 'node_modules', 'expo-router');
const dest = path.join(projectRoot, 'node_modules', 'expo-router');

if (!fs.existsSync(source)) {
  console.warn('[fix-metro-monorepo-entry] expo-router not found at workspace root — skipping.');
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(source, dest, { recursive: true, dereference: true });
console.log('[fix-metro-monorepo-entry] Copied expo-router into apps/mobile/node_modules.');
