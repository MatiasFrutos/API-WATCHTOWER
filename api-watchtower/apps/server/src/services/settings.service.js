"use strict";

const { DB_FILES } = require("../storage/db");
const { readJson, writeJson } = require("../storage/json-db");

const DEFAULT_SETTINGS = {
  theme: "dark",
  timeout: 30000,
  autoSaveHistory: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

function getSettings() {
  return readJson(DB_FILES.settings, DEFAULT_SETTINGS);
}

function updateSettings(payload) {
  const currentSettings = getSettings();

  const nextSettings = {
    ...currentSettings,
    ...payload,
    updatedAt: new Date().toISOString()
  };

  writeJson(DB_FILES.settings, nextSettings);

  return nextSettings;
}

module.exports = {
  getSettings,
  updateSettings
};