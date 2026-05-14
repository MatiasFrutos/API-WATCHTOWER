"use strict";

const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");

const DB_FILES = {
  projects: path.join(DATA_DIR, "projects.json"),
  endpoints: path.join(DATA_DIR, "endpoints.json"),
  history: path.join(DATA_DIR, "history.json"),
  settings: path.join(DATA_DIR, "settings.json")
};

module.exports = {
  DATA_DIR,
  DB_FILES
};