"use strict";

export function renderModalHost() {
  return `
    <div id="aw-modal-host" class="aw-modal-host" hidden></div>
  `;
}

export function openModal({ title = "Modal", body = "", footer = "" }) {
  const host = document.querySelector("#aw-modal-host");

  if (!host) {
    return;
  }

  host.hidden = false;
  host.innerHTML = `
    <div class="aw-modal-backdrop" data-modal-close></div>
    <section class="aw-modal">
      <header class="aw-modal-header">
        <h2>${title}</h2>
        <button type="button" class="aw-icon-button" data-modal-close>×</button>
      </header>
      <div class="aw-modal-body">
        ${body}
      </div>
      <footer class="aw-modal-footer">
        ${footer}
      </footer>
    </section>
  `;
}

export function closeModal() {
  const host = document.querySelector("#aw-modal-host");

  if (!host) {
    return;
  }

  host.hidden = true;
  host.innerHTML = "";
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closeModal();
  }
});