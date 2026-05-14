"use strict";

export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}