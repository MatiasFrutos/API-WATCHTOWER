"use strict";

const { executeHttpRequest } = require("../utils/http-client");
const { addHistoryEntry } = require("./history.service");
const { updateEndpointCheckResult } = require("./endpoints.service");

function validateRequestPayload(payload) {
  const method = String(payload.method || "GET").toUpperCase();
  const url = String(payload.url || "").trim();

  if (!url) {
    const error = new Error("REQUEST_URL_REQUIRED");
    error.status = 400;
    throw error;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const error = new Error("REQUEST_URL_MUST_START_WITH_HTTP");
    error.status = 400;
    throw error;
  }

  return {
    ...payload,
    method,
    url
  };
}

async function sendRequest(payload) {
  const cleanPayload = validateRequestPayload(payload);
  const result = await executeHttpRequest(cleanPayload);

  const historyEntry = addHistoryEntry({
    endpointId: cleanPayload.endpointId || null,
    projectId: cleanPayload.projectId || null,
    method: cleanPayload.method,
    url: cleanPayload.url,
    status: result.status,
    statusText: result.statusText,
    kind: result.kind,
    responseTimeMs: result.responseTimeMs,
    ok: result.ok,
    requestHeaders: cleanPayload.headers || {},
    requestBody: cleanPayload.body || null,
    responseHeaders: result.headers || {},
    responseBody: result.body || null,
    error: result.error || null
  });

  if (cleanPayload.endpointId) {
    updateEndpointCheckResult(cleanPayload.endpointId, result);
  }

  return {
    ...result,
    historyId: historyEntry.id
  };
}

module.exports = {
  sendRequest
};