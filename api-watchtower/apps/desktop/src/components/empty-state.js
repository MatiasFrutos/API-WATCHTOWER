"use strict";

export function renderEmptyState({
  title = "Sin datos",
  description = "Todavía no hay información disponible.",
  action = ""
} = {}) {
  return `
    <section class="aw-empty-state">
      <div class="aw-empty-icon">◎</div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${action}
    </section>
  `;
}