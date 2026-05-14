"use strict";

import { APP_CONFIG } from "./config.js";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;

  if (isJson) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => "");
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP_ERROR_${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function buildUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_CONFIG.apiBaseUrl}${cleanPath}`;
}

export const apiClient = {
  async request(path, options = {}) {
    const controller = new AbortController();
    const timeout = Number(options.timeout || APP_CONFIG.defaultTimeout);

    const timer = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(buildUrl(path), {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      return await parseResponse(response);
    } finally {
      clearTimeout(timer);
    }
  },

  get(path, options = {}) {
    return this.request(path, {
      ...options,
      method: "GET"
    });
  },

  post(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: "POST",
      body
    });
  },

  put(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: "PUT",
      body
    });
  },

  patch(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: "PATCH",
      body
    });
  },

  delete(path, options = {}) {
    return this.request(path, {
      ...options,
      method: "DELETE"
    });
  }
};