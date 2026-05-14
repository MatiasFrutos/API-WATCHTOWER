"use strict";

export function renderSettingsPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Config</p>
        <h2>Settings</h2>
        <p>Configuración general de API Watchtower.</p>
      </div>
    </div>

    <section class="aw-panel">
      <div class="aw-form-grid">
        <label class="aw-field">
          <span>API local</span>
          <input class="aw-input" value="http://127.0.0.1:3567/api" />
        </label>

        <label class="aw-field">
          <span>Timeout default</span>
          <input class="aw-input" value="30000" />
        </label>
      </div>
    </section>
  `;
}