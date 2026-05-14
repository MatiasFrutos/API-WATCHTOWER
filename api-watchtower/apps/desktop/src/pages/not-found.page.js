"use strict";

export function renderNotFoundPage() {
  return `
    <section class="aw-not-found">
      <h2>404</h2>
      <p>La página solicitada no existe.</p>
      <a href="#/dashboard" class="aw-primary-button">Volver al dashboard</a>
    </section>
  `;
}