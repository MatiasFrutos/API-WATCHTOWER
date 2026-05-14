"use strict";

export const APP_NAME = "API Watchtower";

export const APP_VERSION = "0.1.0";

export const DEFAULT_SERVER_PORT = 3567;

export const DEFAULT_SERVER_HOST = "127.0.0.1";

export const DEFAULT_API_BASE_URL = `http://${DEFAULT_SERVER_HOST}:${DEFAULT_SERVER_PORT}/api`;

export const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

export const DEFAULT_PROJECT_NAME = "Default Project";

export const STORAGE_FILES = {
  PROJECTS: "projects.json",
  ENDPOINTS: "endpoints.json",
  HISTORY: "history.json",
  SETTINGS: "settings.json"
};

export const ENTITY_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DELETED: "deleted"
};

export const RESULT_KIND = {
  IDLE: "idle",
  OK: "ok",
  WARNING: "warning",
  ERROR: "error",
  TIMEOUT: "timeout"
};

export const CONTENT_TYPES = {
  JSON: "application/json",
  TEXT: "text/plain",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  HTML: "text/html",
  XML: "application/xml"
};