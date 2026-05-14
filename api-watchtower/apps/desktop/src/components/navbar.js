"use strict";

import { APP_CONFIG } from "../core/config.js";

function refreshIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2"></path>
      <path d="M4 5v4h4"></path>
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2"></path>
      <path d="M20 19v-4h-4"></path>
    </svg>
  `;
}

export function renderNavbar() {
  return `
    <header class="aw-navbar">
      <div>
        <p class="aw-eyebrow">Desktop MVP</p>
        <h1>${APP_CONFIG.appName}</h1>
      </div>

      <div class="aw-navbar-actions">
        <span class="aw-pill" id="aw-clock">--:--:--</span>
        <button class="aw-icon-button" type="button" data-action="refresh-page" title="Actualizar">
          ${refreshIcon()}
        </button>
      </div>
    </header>
  `;
}

export function bindNavbarEvents() {
  const clock = document.querySelector("#aw-clock");

  function updateClock() {
    if (!clock) {
      return;
    }

    const now = new Date();

    clock.textContent = now.toLocaleString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  updateClock();
  setInterval(updateClock, 1000);

  document.removeEventListener("click", handleNavbarClick);
  document.addEventListener("click", handleNavbarClick);
}

function handleNavbarClick(event) {
  const refreshButton = event.target.closest("[data-action='refresh-page']");

  if (!refreshButton) {
    return;
  }

  window.location.reload();
}