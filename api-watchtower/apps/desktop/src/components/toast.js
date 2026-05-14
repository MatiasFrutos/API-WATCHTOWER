"use strict";

let toastTimer = null;

export function renderToastHost() {
  return `
    <div id="aw-toast-host" class="aw-toast-host"></div>
  `;
}

export function showToast(message, type = "info") {
  const host = document.querySelector("#aw-toast-host");

  if (!host) {
    return;
  }

  clearTimeout(toastTimer);

  host.innerHTML = `
    <div class="aw-toast aw-toast-${type}">
      <strong>${type.toUpperCase()}</strong>
      <span>${message}</span>
    </div>
  `;

  toastTimer = setTimeout(() => {
    host.innerHTML = "";
  }, 3200);
}

window.API_WATCHTOWER_TOAST = showToast;