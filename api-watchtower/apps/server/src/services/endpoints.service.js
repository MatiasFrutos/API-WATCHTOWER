"use strict";

const { DB_FILES } = require("../storage/db");
const { readJson, writeJson } = require("../storage/json-db");
const { createId } = require("../utils/id");

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function listEndpoints(filters = {}) {
  const endpoints = readJson(DB_FILES.endpoints, []);

  if (filters.projectId) {
    return endpoints.filter((endpoint) => endpoint.projectId === filters.projectId);
  }

  return endpoints;
}

function getEndpointById(id) {
  const endpoints = listEndpoints();
  return endpoints.find((endpoint) => endpoint.id === id) || null;
}

function createEndpoint(payload) {
  const endpoints = listEndpoints();
  const method = String(payload.method || "GET").toUpperCase();

  if (!String(payload.name || "").trim()) {
    const error = new Error("ENDPOINT_NAME_REQUIRED");
    error.status = 400;
    throw error;
  }

  if (!String(payload.url || "").trim()) {
    const error = new Error("ENDPOINT_URL_REQUIRED");
    error.status = 400;
    throw error;
  }

  if (!ALLOWED_METHODS.includes(method)) {
    const error = new Error("INVALID_HTTP_METHOD");
    error.status = 400;
    throw error;
  }

  const endpoint = {
    id: createId("endpoint"),
    projectId: payload.projectId || null,
    name: String(payload.name || "").trim(),
    method,
    url: String(payload.url || "").trim(),
    headers: payload.headers || {},
    body: payload.body || "",
    status: "idle",
    lastStatusCode: null,
    lastResponseTimeMs: null,
    lastCheckedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  endpoints.unshift(endpoint);
  writeJson(DB_FILES.endpoints, endpoints);

  return endpoint;
}

function updateEndpoint(id, payload) {
  const endpoints = listEndpoints();
  const index = endpoints.findIndex((endpoint) => endpoint.id === id);

  if (index === -1) {
    const error = new Error("ENDPOINT_NOT_FOUND");
    error.status = 404;
    throw error;
  }

  endpoints[index] = {
    ...endpoints[index],
    ...payload,
    id: endpoints[index].id,
    method: payload.method ? String(payload.method).toUpperCase() : endpoints[index].method,
    updatedAt: new Date().toISOString()
  };

  writeJson(DB_FILES.endpoints, endpoints);

  return endpoints[index];
}

function removeEndpoint(id) {
  const endpoints = listEndpoints();
  const nextEndpoints = endpoints.filter((endpoint) => endpoint.id !== id);

  writeJson(DB_FILES.endpoints, nextEndpoints);

  return {
    removed: endpoints.length !== nextEndpoints.length
  };
}

function updateEndpointCheckResult(id, result) {
  const endpoints = listEndpoints();
  const index = endpoints.findIndex((endpoint) => endpoint.id === id);

  if (index === -1) {
    return null;
  }

  endpoints[index] = {
    ...endpoints[index],
    status: result.kind,
    lastStatusCode: result.status,
    lastResponseTimeMs: result.responseTimeMs,
    lastCheckedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  writeJson(DB_FILES.endpoints, endpoints);

  return endpoints[index];
}

module.exports = {
  listEndpoints,
  getEndpointById,
  createEndpoint,
  updateEndpoint,
  removeEndpoint,
  updateEndpointCheckResult
};