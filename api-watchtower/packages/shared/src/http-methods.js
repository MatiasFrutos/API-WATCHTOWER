"use strict";

export const HTTP_METHODS = Object.freeze([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS"
]);

export const HTTP_METHODS_WITH_BODY = Object.freeze([
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
]);

export function isValidHttpMethod(method) {
  return HTTP_METHODS.includes(String(method || "").toUpperCase());
}

export function normalizeHttpMethod(method) {
  const cleanMethod = String(method || "GET").trim().toUpperCase();

  if (!isValidHttpMethod(cleanMethod)) {
    return "GET";
  }

  return cleanMethod;
}

export function methodAllowsBody(method) {
  return HTTP_METHODS_WITH_BODY.includes(normalizeHttpMethod(method));
}