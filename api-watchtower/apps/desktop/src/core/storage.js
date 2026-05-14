"use strict";

import { APP_CONFIG } from "./config.js";

function key(name) {
  return `${APP_CONFIG.storagePrefix}:${name}`;
}

export const storage = {
  get(name, fallback = null) {
    try {
      const value = localStorage.getItem(key(name));

      if (!value) {
        return fallback;
      }

      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  set(name, value) {
    localStorage.setItem(key(name), JSON.stringify(value));
    return value;
  },

  remove(name) {
    localStorage.removeItem(key(name));
  },

  clearAll() {
    Object.keys(localStorage).forEach((itemKey) => {
      if (itemKey.startsWith(`${APP_CONFIG.storagePrefix}:`)) {
        localStorage.removeItem(itemKey);
      }
    });
  }
};