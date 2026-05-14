"use strict";

import { isValidHttpMethod } from "./http-methods.js";

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidUrl(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isValidJsonString(value) {
  if (!isNonEmptyString(value)) {
    return true;
  }

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function validateProjectPayload(payload = {}) {
  const errors = [];

  if (!isNonEmptyString(payload.name)) {
    errors.push("PROJECT_NAME_REQUIRED");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateEndpointPayload(payload = {}) {
  const errors = [];

  if (!isNonEmptyString(payload.name)) {
    errors.push("ENDPOINT_NAME_REQUIRED");
  }

  if (!isValidHttpMethod(payload.method)) {
    errors.push("INVALID_HTTP_METHOD");
  }

  if (!isValidUrl(payload.url)) {
    errors.push("INVALID_ENDPOINT_URL");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateRequestPayload(payload = {}) {
  const errors = [];

  if (!isValidHttpMethod(payload.method)) {
    errors.push("INVALID_HTTP_METHOD");
  }

  if (!isValidUrl(payload.url)) {
    errors.push("INVALID_REQUEST_URL");
  }

  if (payload.body && typeof payload.body === "string" && !isValidJsonString(payload.body)) {
    errors.push("INVALID_JSON_BODY");
  }

  if (payload.headers && !isPlainObject(payload.headers)) {
    errors.push("HEADERS_MUST_BE_OBJECT");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}