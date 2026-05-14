"use strict";

import { historyService } from "../services/history.service.js";
import { requestsService } from "../services/requests.service.js";
import { showToast } from "../components/toast.js";
import { openModal } from "../components/modal.js";
import { prettyJson } from "../utils/json.util.js";
import { formatDateTime } from "../utils/date.util.js";

let historyCache = [];

export function renderHistoryPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Timeline</p>
        <h2>History</h2>
        <p>Historial de requests ejecutadas, tiempos de respuesta y estados HTTP.</p>
      </div>

      <div class="aw-history-actions">
        <button class="aw-icon-button" type="button" data-action="reload-history" title="Actualizar historial">
          ↻
        </button>

        <button class="aw-primary-button" type="button" data-action="clear-history">
          Limpiar historial
        </button>
      </div>
    </div>

    <section class="aw-panel">
      <div class="aw-panel-header">
        <div>
          <h3>Requests guardadas</h3>
          <p>Las pruebas se guardan localmente en el backend de API Watchtower.</p>
        </div>
      </div>

      <div id="history-content">
        <div class="aw-empty-state">
          <div class="aw-empty-icon">◎</div>
          <h3>Cargando historial...</h3>
          <p>Estamos consultando el almacenamiento local.</p>
        </div>
      </div>
    </section>
  `;
}

export function bindHistoryPageEvents() {
  document.removeEventListener("click", handleHistoryClick);
  document.addEventListener("click", handleHistoryClick);

  loadHistory();
}

function handleHistoryClick(event) {
  const reloadButton = event.target.closest("[data-action='reload-history']");
  const clearButton = event.target.closest("[data-action='clear-history']");
  const repeatButton = event.target.closest("[data-action='repeat-history']");
  const copyButton = event.target.closest("[data-action='copy-history']");
  const viewButton = event.target.closest("[data-action='view-history']");

  if (reloadButton) {
    loadHistory();
    return;
  }

  if (clearButton) {
    clearHistory();
    return;
  }

  if (repeatButton) {
    const historyId = repeatButton.dataset.historyId;

    if (historyId) {
      repeatRequest(historyId);
    }

    return;
  }

  if (copyButton) {
    const historyId = copyButton.dataset.historyId;

    if (historyId) {
      copyHistoryResponse(historyId);
    }

    return;
  }

  if (viewButton) {
    const historyId = viewButton.dataset.historyId;

    if (historyId) {
      openHistoryDetail(historyId);
    }
  }
}

async function loadHistory() {
  const content = document.querySelector("#history-content");

  if (!content) {
    return;
  }

  content.innerHTML = `
    <div class="aw-empty-state">
      <div class="aw-empty-icon">◎</div>
      <h3>Cargando historial...</h3>
      <p>Estamos consultando el backend local.</p>
    </div>
  `;

  try {
    const response = await historyService.list();

    historyCache = Array.isArray(response?.data) ? response.data : [];

    content.innerHTML = renderHistoryContent(historyCache);
  } catch (error) {
    content.innerHTML = `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">!</div>
        <h3>No se pudo cargar el historial</h3>
        <p>${escapeHtml(error.message || "Error desconocido")}</p>
      </div>
    `;

    showToast("No se pudo cargar el historial.", "error");
  }
}

function renderHistoryContent(history) {
  if (!history.length) {
    return `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◷</div>
        <h3>Historial vacío</h3>
        <p>Cuando ejecutes requests desde Tester, aparecerán en esta sección.</p>
      </div>
    `;
  }

  return `
    <div class="aw-history-list">
      ${history.map(renderHistoryItem).join("")}
    </div>
  `;
}

function renderHistoryItem(item) {
  const status = item.status || 0;
  const kind = item.kind || getKindFromStatus(status);
  const method = item.method || "GET";
  const url = item.url || "-";
  const responseTimeMs = item.responseTimeMs || 0;
  const createdAt = item.createdAt ? formatDateTime(item.createdAt) : "-";
  const statusText = item.statusText || "Sin status";

  return `
    <article class="aw-history-item">
      <div class="aw-history-main">
        <div class="aw-history-line">
          <span class="aw-method-badge">${escapeHtml(method)}</span>

          <span class="aw-status aw-status-${escapeHtml(kind)}">
            <span></span>
            HTTP ${escapeHtml(status || "-")} · ${escapeHtml(statusText)}
          </span>

          <span class="aw-response-time">${escapeHtml(responseTimeMs)} ms</span>
        </div>

        <strong class="aw-history-url">${escapeHtml(url)}</strong>

        <div class="aw-history-meta">
          <span>${escapeHtml(createdAt)}</span>
          <span>ID: ${escapeHtml(item.id || "-")}</span>
        </div>
      </div>

      <div class="aw-history-buttons">
        <button
          class="aw-icon-button"
          type="button"
          title="Ver detalle"
          data-action="view-history"
          data-history-id="${escapeHtml(item.id)}"
        >
          ◉
        </button>

        <button
          class="aw-icon-button"
          type="button"
          title="Copiar respuesta"
          data-action="copy-history"
          data-history-id="${escapeHtml(item.id)}"
        >
          ⧉
        </button>

        <button
          class="aw-primary-button"
          type="button"
          data-action="repeat-history"
          data-history-id="${escapeHtml(item.id)}"
        >
          Repetir
        </button>
      </div>
    </article>
  `;
}

async function clearHistory() {
  const confirmed = window.confirm("¿Limpiar todo el historial? Esta acción no elimina proyectos ni endpoints.");

  if (!confirmed) {
    return;
  }

  try {
    await historyService.clear();

    historyCache = [];

    showToast("Historial limpiado correctamente.", "success");

    await loadHistory();
  } catch (error) {
    showToast(error.message || "No se pudo limpiar el historial.", "error");
  }
}

async function repeatRequest(historyId) {
  const item = historyCache.find((entry) => entry.id === historyId);

  if (!item) {
    showToast("Entrada de historial no encontrada.", "error");
    return;
  }

  const payload = {
    endpointId: item.endpointId || null,
    projectId: item.projectId || null,
    method: item.method || "GET",
    url: item.url || "",
    headers: item.requestHeaders || {},
    body: item.requestBody || "",
    timeout: 30000
  };

  if (!payload.url) {
    showToast("La entrada no tiene URL para repetir.", "error");
    return;
  }

  try {
    showToast("Repitiendo request...", "info");

    const response = await requestsService.send(payload);
    const data = response?.data || response;

    showToast(`Request repetida: HTTP ${data.status || "-"}`, data.ok ? "success" : "error");

    await loadHistory();
  } catch (error) {
    showToast(error.message || "No se pudo repetir la request.", "error");
  }
}

async function copyHistoryResponse(historyId) {
  const item = historyCache.find((entry) => entry.id === historyId);

  if (!item) {
    showToast("Entrada de historial no encontrada.", "error");
    return;
  }

  const payload = {
    ok: item.ok,
    status: item.status,
    statusText: item.statusText,
    kind: item.kind,
    responseTimeMs: item.responseTimeMs,
    responseHeaders: item.responseHeaders || {},
    responseBody: item.responseBody ?? null,
    error: item.error || null,
    createdAt: item.createdAt
  };

  try {
    await navigator.clipboard.writeText(prettyJson(payload));
    showToast("Respuesta copiada.", "success");
  } catch {
    showToast("No se pudo copiar la respuesta.", "error");
  }
}

function openHistoryDetail(historyId) {
  const item = historyCache.find((entry) => entry.id === historyId);

  if (!item) {
    showToast("Entrada de historial no encontrada.", "error");
    return;
  }

  openModal({
    title: "Detalle de request",
    body: `
      <div class="aw-history-detail">
        <div class="aw-history-detail-grid">
          <div>
            <span class="aw-card-label">Método</span>
            <strong>${escapeHtml(item.method || "-")}</strong>
          </div>

          <div>
            <span class="aw-card-label">Status</span>
            <strong>HTTP ${escapeHtml(item.status || "-")}</strong>
          </div>

          <div>
            <span class="aw-card-label">Tiempo</span>
            <strong>${escapeHtml(item.responseTimeMs || 0)} ms</strong>
          </div>

          <div>
            <span class="aw-card-label">Fecha</span>
            <strong>${escapeHtml(item.createdAt ? formatDateTime(item.createdAt) : "-")}</strong>
          </div>
        </div>

        <label class="aw-field aw-field-spaced">
          <span>URL</span>
          <input class="aw-input" value="${escapeHtml(item.url || "")}" readonly />
        </label>

        <label class="aw-field aw-field-spaced">
          <span>Request guardada</span>
          <pre class="aw-code-viewer"><code>${escapeHtml(prettyJson({
            headers: item.requestHeaders || {},
            body: item.requestBody || null
          }))}</code></pre>
        </label>

        <label class="aw-field aw-field-spaced">
          <span>Response guardada</span>
          <pre class="aw-code-viewer"><code>${escapeHtml(prettyJson({
            ok: item.ok,
            status: item.status,
            statusText: item.statusText,
            kind: item.kind,
            responseTimeMs: item.responseTimeMs,
            headers: item.responseHeaders || {},
            body: item.responseBody ?? null,
            error: item.error || null
          }))}</code></pre>
        </label>
      </div>
    `,
    footer: ""
  });
}

function getKindFromStatus(status) {
  const code = Number(status || 0);

  if (!code) {
    return "idle";
  }

  if (code >= 200 && code < 300) {
    return "ok";
  }

  if (code >= 300 && code < 500) {
    return "warning";
  }

  return "error";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}