"use strict";

export function renderStatusBadge(status = "idle", label = "Idle") {
  return `
    <span class="aw-status aw-status-${status}">
      <span></span>
      ${label}
    </span>
  `;
}