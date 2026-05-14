"use strict";

const { DB_FILES } = require("../storage/db");
const { readJson, writeJson } = require("../storage/json-db");
const { createId } = require("../utils/id");

function listHistory() {
  return readJson(DB_FILES.history, []);
}

function addHistoryEntry(payload) {
  const history = listHistory();

  const entry = {
    id: createId("history"),
    endpointId: payload.endpointId || null,
    projectId: payload.projectId || null,
    method: payload.method,
    url: payload.url,
    status: payload.status,
    statusText: payload.statusText,
    kind: payload.kind,
    responseTimeMs: payload.responseTimeMs,
    ok: payload.ok,
    requestHeaders: payload.requestHeaders || {},
    requestBody: payload.requestBody || null,
    responseHeaders: payload.responseHeaders || {},
    responseBody: payload.responseBody || null,
    error: payload.error || null,
    createdAt: new Date().toISOString()
  };

  history.unshift(entry);

  const limitedHistory = history.slice(0, 500);

  writeJson(DB_FILES.history, limitedHistory);

  return entry;
}

function clearHistory() {
  writeJson(DB_FILES.history, []);

  return {
    cleared: true
  };
}

module.exports = {
  listHistory,
  addHistoryEntry,
  clearHistory
};