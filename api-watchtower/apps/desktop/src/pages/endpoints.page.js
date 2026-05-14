"use strict";

import { HTTP_METHODS } from "../core/config.js";
import { endpointsService } from "../services/endpoints.service.js";
import { openModal, closeModal } from "../components/modal.js";
import { showToast } from "../components/toast.js";

let endpointsCache = [];

export function renderEndpointsPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Routes</p>
        <h2>Endpoints</h2>
        <p>Listado de rutas registradas para testeo y monitoreo.</p>
      </div>

      <button class="aw-primary-button" type="button" data-action="open-endpoint-modal">
        Nuevo endpoint
      </button>
    </div>

    <section id="endpoints-content">
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◎</div>
        <h3>Cargando endpoints...</h3>
        <p>Estamos consultando el backend local.</p>
      </div>
    </section>
  `;
}

export function bindEndpointsPageEvents() {
  document.removeEventListener("click", handleEndpointsClick);
  document.removeEventListener("submit", handleEndpointsSubmit);

  document.addEventListener("click", handleEndpointsClick);
  document.addEventListener("submit", handleEndpointsSubmit);

  loadEndpoints();
}

function handleEndpointsClick(event) {
  const openButton = event.target.closest("[data-action='open-endpoint-modal']");
  const deleteButton = event.target.closest("[data-action='delete-endpoint']");
  const testButton = event.target.closest("[data-action='test-endpoint']");

  if (openButton) {
    openCreateEndpointModal();
    return;
  }

  if (deleteButton) {
    const endpointId = deleteButton.dataset.endpointId;

    if (endpointId) {
      deleteEndpoint(endpointId);
    }

    return;
  }

  if (testButton) {
    const endpointId = testButton.dataset.endpointId;

    if (endpointId) {
      goToTester(endpointId);
    }
  }
}

function handleEndpointsSubmit(event) {
  const form = event.target.closest("#endpoint-form");

  if (!form) {
    return;
  }

  event.preventDefault();
  createEndpoint(form);
}

async function loadEndpoints() {
  const content = document.querySelector("#endpoints-content");

  if (!content) {
    return;
  }

  content.innerHTML = `
    <div class="aw-empty-state">
      <div class="aw-empty-icon">◎</div>
      <h3>Cargando endpoints...</h3>
      <p>Estamos consultando el backend local.</p>
    </div>
  `;

  try {
    const projectId = getProjectIdFromHash();
    const response = await endpointsService.list(projectId);

    endpointsCache = Array.isArray(response?.data) ? response.data : [];

    content.innerHTML = renderEndpointsContent(endpointsCache);
  } catch (error) {
    content.innerHTML = `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">!</div>
        <h3>No se pudieron cargar los endpoints</h3>
        <p>${escapeHtml(error.message || "Error desconocido")}</p>
      </div>
    `;

    showToast("No se pudieron cargar los endpoints.", "error");
  }
}

function renderEndpointsContent(endpoints) {
  if (!endpoints.length) {
    return `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◎</div>
        <h3>No hay endpoints</h3>
        <p>Agregá tu primer endpoint para probarlo desde API Watchtower.</p>
      </div>
    `;
  }

  return `
    <section class="aw-grid aw-grid-3">
      ${endpoints.map(renderEndpointCard).join("")}
    </section>
  `;
}

function renderEndpointCard(endpoint) {
  const status = endpoint.status || "idle";
  const statusLabel = getStatusLabel(status);
  const lastStatus = endpoint.lastStatusCode ? `HTTP ${endpoint.lastStatusCode}` : "Sin pruebas";
  const responseTime = endpoint.lastResponseTimeMs ? `${endpoint.lastResponseTimeMs} ms` : "Sin tiempo";

  return `
    <article class="aw-card aw-endpoint-card">
      <div class="aw-endpoint-card-header">
        <div>
          <span class="aw-card-label">Endpoint</span>
          <strong class="aw-endpoint-title">${escapeHtml(endpoint.name)}</strong>
        </div>

        <span class="aw-status aw-status-${escapeHtml(status)}">
          <span></span>
          ${escapeHtml(statusLabel)}
        </span>
      </div>

      <div class="aw-endpoint-method-row">
        <span class="aw-method-badge">${escapeHtml(endpoint.method || "GET")}</span>
        <span class="aw-endpoint-last">${escapeHtml(lastStatus)} · ${escapeHtml(responseTime)}</span>
      </div>

      <div class="aw-project-url">
        ${escapeHtml(endpoint.url)}
      </div>

      <div class="aw-project-actions">
        <button
          class="aw-primary-button"
          type="button"
          data-action="test-endpoint"
          data-endpoint-id="${escapeHtml(endpoint.id)}"
        >
          Probar
        </button>

        <button
          class="aw-icon-button"
          type="button"
          title="Eliminar endpoint"
          data-action="delete-endpoint"
          data-endpoint-id="${escapeHtml(endpoint.id)}"
        >
          ×
        </button>
      </div>
    </article>
  `;
}

function openCreateEndpointModal() {
  const projectId = getProjectIdFromHash();

  openModal({
    title: "Nuevo endpoint",
    body: `
      <form id="endpoint-form" class="aw-project-form">
        <input type="hidden" name="projectId" value="${escapeHtml(projectId)}" />

        <label class="aw-field">
          <span>Nombre del endpoint</span>
          <input
            class="aw-input"
            name="name"
            type="text"
            placeholder="Ej: Obtener usuarios"
            autocomplete="off"
            required
          />
        </label>

        <div class="aw-form-grid">
          <label class="aw-field">
            <span>Método</span>
            <select class="aw-input" name="method">
              ${HTTP_METHODS.map((method) => `
                <option value="${method}">${method}</option>
              `).join("")}
            </select>
          </label>

          <label class="aw-field">
            <span>Timeout</span>
            <input
              class="aw-input"
              name="timeout"
              type="number"
              min="1000"
              step="1000"
              value="30000"
            />
          </label>
        </div>

        <label class="aw-field">
          <span>URL completa</span>
          <input
            class="aw-input"
            name="url"
            type="url"
            placeholder="https://jsonplaceholder.typicode.com/posts/1"
            autocomplete="off"
            required
          />
        </label>

        <label class="aw-field">
          <span>Headers JSON opcional</span>
          <textarea
            class="aw-code-input aw-textarea-small"
            name="headers"
            spellcheck="false"
            placeholder='{"Authorization":"Bearer token"}'
          ></textarea>
        </label>

        <label class="aw-field">
          <span>Body JSON opcional</span>
          <textarea
            class="aw-code-input aw-textarea-small"
            name="body"
            spellcheck="false"
            placeholder='{"name":"Matias"}'
          ></textarea>
        </label>

        <div class="aw-modal-footer-actions">
          <button class="aw-icon-button" type="button" data-modal-close>
            Cancelar
          </button>

          <button class="aw-primary-button" type="submit">
            Guardar endpoint
          </button>
        </div>
      </form>
    `,
    footer: ""
  });

  setTimeout(() => {
    document.querySelector("#endpoint-form input[name='name']")?.focus();
  }, 50);
}

async function createEndpoint(form) {
  const submitButton = form.querySelector("button[type='submit']");
  const projectId = form.projectId?.value || getProjectIdFromHash();

  const headersText = form.headers.value.trim();
  const bodyText = form.body.value.trim();

  let headers = {};

  if (headersText) {
    try {
      headers = JSON.parse(headersText);
    } catch {
      showToast("Los headers deben ser JSON válido.", "error");
      return;
    }
  }

  const payload = {
    projectId: projectId || null,
    name: form.name.value.trim(),
    method: form.method.value.trim(),
    url: form.url.value.trim(),
    timeout: Number(form.timeout.value || 30000),
    headers,
    body: bodyText
  };

  if (!payload.name) {
    showToast("El nombre del endpoint es obligatorio.", "error");
    return;
  }

  if (!payload.url) {
    showToast("La URL del endpoint es obligatoria.", "error");
    return;
  }

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }

    await endpointsService.create(payload);

    closeModal();
    showToast("Endpoint creado correctamente.", "success");

    await loadEndpoints();
  } catch (error) {
    showToast(error.message || "No se pudo crear el endpoint.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar endpoint";
    }
  }
}

async function deleteEndpoint(endpointId) {
  const confirmed = window.confirm("¿Eliminar este endpoint?");

  if (!confirmed) {
    return;
  }

  try {
    await endpointsService.remove(endpointId);

    showToast("Endpoint eliminado correctamente.", "success");

    await loadEndpoints();
  } catch (error) {
    showToast(error.message || "No se pudo eliminar el endpoint.", "error");
  }
}

function goToTester(endpointId) {
  const endpoint = endpointsCache.find((item) => item.id === endpointId);

  if (!endpoint) {
    showToast("Endpoint no encontrado.", "error");
    return;
  }

  const params = new URLSearchParams({
    endpointId: endpoint.id,
    projectId: endpoint.projectId || "",
    method: endpoint.method || "GET",
    url: endpoint.url || ""
  });

  window.location.hash = `/tester?${params.toString()}`;
}

function getProjectIdFromHash() {
  const hash = String(window.location.hash || "");
  const queryIndex = hash.indexOf("?");

  if (queryIndex === -1) {
    return "";
  }

  const query = hash.slice(queryIndex + 1);
  const params = new URLSearchParams(query);

  return params.get("projectId") || "";
}

function getStatusLabel(status) {
  const labels = {
    ok: "OK",
    warning: "Lento",
    error: "Error",
    idle: "Sin probar"
  };

  return labels[status] || "Sin probar";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}