"use strict";

export const APP_CONFIG = {
  appName: "API Watchtower",
  appVersion: "0.1.0",
  apiBaseUrl: "http://127.0.0.1:3567/api",
  defaultTimeout: 30000,
  storagePrefix: "api_watchtower",
  defaultRoute: "/dashboard"
};

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export const STATUS_KIND = {
  OK: "ok",
  WARNING: "warning",
  ERROR: "error",
  IDLE: "idle"
};