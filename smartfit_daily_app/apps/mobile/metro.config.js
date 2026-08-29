// Metro config for an npm-workspaces monorepo — without this, Metro can't
// resolve packages hoisted to the workspace root (expo-router, firebase,
// @smartfit/shared-types, etc.), since it only looks in apps/mobile/node_modules
// by default.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
