"use strict";

export function formatMs(value) {
  const number = Number(value || 0);
  return `${number.toFixed(0)} ms`;
}

export function truncate(value, max = 80) {
  const text = String(value || "");

  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max)}...`;
}