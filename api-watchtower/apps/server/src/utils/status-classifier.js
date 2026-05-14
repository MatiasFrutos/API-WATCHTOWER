"use strict";

function classifyStatus(statusCode, responseTimeMs = 0) {
  const code = Number(statusCode || 0);
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

module.exports = {
  classifyStatus
};