"use strict";

export function renderLoader(text = "Cargando...") {
  return `
    <div class="aw-loader">
      <div class="aw-loader-spinner"></div>
      <span>${text}</span>
    </div>
  `;
}