"use strict";

function safeJsonParse(value, fallback = null) {
  try {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }

    if (typeof value === "object") {
      return value;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value || "");
  }
}

module.exports = {
  safeJsonParse,
  safeJsonStringify
};