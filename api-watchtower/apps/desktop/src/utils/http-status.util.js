"use strict";

export function getHttpStatusKind(status) {
  const code = Number(status);

  if (!code) {
    return "idle";
  }

  if (code >= 200 && code < 300) {
    return "ok";
  }

  if (code >= 300 && code < 500) {
    return "warning";
  }

  return "error";
}