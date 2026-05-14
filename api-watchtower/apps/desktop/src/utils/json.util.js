"use strict";

export function safeJsonParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function prettyJson(value) {
  try {
    if (typeof value === "string") {
      return JSON.stringify(JSON.parse(value), null, 2);
    }

    return JSON.stringify(value, null, 2);
  } catch {
    return String(value || "");
  }
}