"use strict";

const fs = require("fs");
const { DATA_DIR, DB_FILES } = require("./db");
const { writeJson } = require("./json-db");

function ensureFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, fallback);
  }
}

function seedDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  ensureFile(DB_FILES.projects, []);
  ensureFile(DB_FILES.endpoints, []);
  ensureFile(DB_FILES.history, []);
  ensureFile(DB_FILES.settings, {
    theme: "dark",
    timeout: 30000,
    autoSaveHistory: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

module.exports = {
  seedDatabase
};