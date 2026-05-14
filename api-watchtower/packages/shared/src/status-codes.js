"use strict";

export const HTTP_STATUS_TEXT = Object.freeze({
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  409: "Conflict",
  415: "Unsupported Media Type",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout"
});

export function getStatusText(statusCode) {
  const code = Number(statusCode);

  return HTTP_STATUS_TEXT[code] || "Unknown Status";
}

export function getStatusGroup(statusCode) {
  const code = Number(statusCode);

  if (!code) {
    return "idle";
  }

  if (code >= 200 && code < 300) {
    return "success";
  }

  if (code >= 300 && code < 400) {
    return "redirect";
  }

  if (code >= 400 && code < 500) {
    return "client-error";
  }

  if (code >= 500) {
    return "server-error";
  }

  return "info";
}

export function getStatusKind(statusCode, responseTimeMs = 0) {
  const code = Number(statusCode);
  const time = Number(responseTimeMs || 0);

  if (!code) {
    return "idle";
  }

  if (code >= 200 && code < 300 && time <= 1000) {
    return "ok";
  }

  if (code >= 200 && code < 300 && time > 1000) {
    return "warning";
  }

  if (code >= 300 && code < 500) {
    return "warning";
  }

  return "error";
}