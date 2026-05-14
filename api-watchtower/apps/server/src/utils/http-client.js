"use strict";

const axios = require("axios");
const { env } = require("../config/env");
const { createTimer } = require("./response-time");
const { classifyStatus } = require("./status-classifier");
const { safeJsonParse } = require("./safe-json");

function normalizeHeaders(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return {};
  }

  return headers;
}

function normalizeBody(body) {
  if (body === undefined || body === null || body === "") {
    return undefined;
  }

  if (typeof body === "string") {
    return safeJsonParse(body, body);
  }

  return body;
}

async function executeHttpRequest(payload) {
  const method = String(payload.method || "GET").toUpperCase();
  const url = String(payload.url || "").trim();
  const headers = normalizeHeaders(payload.headers);
  const body = normalizeBody(payload.body);
  const timeout = Number(payload.timeout || env.REQUEST_TIMEOUT_MS);

  const timer = createTimer();

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      timeout,
      validateStatus: () => true,
      maxRedirects: 5
    });

    const responseTimeMs = timer.stop();

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      kind: classifyStatus(response.status, responseTimeMs),
      responseTimeMs,
      headers: response.headers,
      body: response.data,
      error: null
    };
  } catch (error) {
    const responseTimeMs = timer.stop();

    return {
      ok: false,
      status: error.response?.status || 0,
      statusText: error.response?.statusText || "Request Failed",
      kind: "error",
      responseTimeMs,
      headers: error.response?.headers || {},
      body: error.response?.data || null,
      error: {
        message: error.message,
        code: error.code || "REQUEST_ERROR"
      }
    };
  }
}

module.exports = {
  executeHttpRequest
};