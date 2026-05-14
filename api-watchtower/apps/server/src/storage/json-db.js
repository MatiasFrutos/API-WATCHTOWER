"use strict";

const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(filePath, fallback) {
  try {
    ensureDir(filePath);

    if (!fs.existsSync(filePath)) {
      writeJson(filePath, fallback);
      return fallback;
    }

    const raw = fs.readFileSync(filePath, "utf8");

    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return data;
}

function updateJson(filePath, fallback, updater) {
  const currentData = readJson(filePath, fallback);
  const nextData = updater(currentData);

  writeJson(filePath, nextData);

  return nextData;
}

module.exports = {
  readJson,
  writeJson,
  updateJson
};