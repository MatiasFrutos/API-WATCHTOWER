"use strict";

const fs = require("fs");
const path = require("path");

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function resolveFromRoot(...parts) {
  return path.join(process.cwd(), ...parts);
}

module.exports = {
  ensureDirectory,
  fileExists,
  resolveFromRoot
};