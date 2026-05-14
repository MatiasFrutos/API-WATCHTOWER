"use strict";

import { HTTP_METHODS } from "../core/config.js";
import { storage } from "../core/storage.js";
import { requestsService } from "../services/requests.service.js";
import { showToast } from "../components/toast.js";
import { prettyJson, safeJsonParse } from "../utils/json.util.js";

const TESTER_LAST_REQUEST_KEY = "tester:last-request";

let lastResponse = null;

export function renderTesterPage() {
  const query = getQueryParamsFromHash();
  const savedRequest = storage.get(TESTER_LAST_REQUEST_KEY, {});

  const endpointId = query.get("endpointId") || savedRequest.endpointId || "";
  const projectId = query.get("projectId") || savedRequest.projectId || "";
  const method = query.get("method") || savedRequest.method || "GET";
  const url = query.get("url") || savedRequest.url || "";
  const headers = savedRequest.headers ? prettyJson(savedRequest.headers) : "";
  const body = savedRequest.body ? prettyJson(savedRequest.body) : "";

  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Request Lab</p>
        <h2>Tester</h2>
        <p>Ejecutá requests reales, medí tiempos y guardá historial local.</p>
      </div>

      <div class="aw-tester-actions">
        <a class="aw-icon-button" href="#/history" title="Ver historial">
          ◷
        </a>
      </div>
    </div>

    <section
      class="aw-tester"
      data-endpoint-id="${escapeHtml(endpointId)}"
      data-project-id="${escapeHtml(projectId)}"
    >
      <div class="aw-request-bar">
        <select class="aw-input aw-method-select" id="tester-method">
          ${HTTP_METHODS.map((item) => `
            <option value="${item}" ${item === method ? "selected" : ""}>${item}</option>
          `).join("")}
        </select>

        <input
          class="aw-input"
          id="tester-url"
          type="url"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
          value="${escapeHtml(url)}"
        />

        <button class="aw-primary-button" type="button" id="tester-send">
          Send
        </button>
      </div>

      <div class="aw-tester-grid">
        <article class="aw-panel">
          <div class="aw-panel-header">
            <div>
              <h3>Request</h3>
              <p>Headers y body opcionales en formato JSON.</p>
            </div>
          </div>

          <label class="aw-field">
            <span>Headers JSON</span>
            <textarea
              class="aw-code-input aw-textarea-small"
              id="tester-headers"
              spellcheck="false"
              placeholder='{"Authorization":"Bearer token"}'
            >${escapeHtml(headers)}</textarea>
          </label>

          <label class="aw-field aw-field-spaced">
            <span>Body JSON</span>
            <textarea
              class="aw-code-input"
              id="tester-body"
              spellcheck="false"
              placeholder='{"name":"Matias"}'
            >${escapeHtml(body)}</textarea>
          </label>
        </article>

        <article class="aw-panel">
          <div class="aw-panel-header">
            <div>
              <h3>Response</h3>
              <p id="tester-response-meta">Sin ejecutar todavía.</p>
            </div>

            <button class="aw-icon-button" type="button" id="tester-copy-response" title="Copiar respuesta">
              ⧉
            </button>
          </div>

          <pre class="aw-code-viewer" data-language="json"><code id="tester-response-code">{
  "message": "Ejecutá una request para ver la respuesta"
}</code></pre>
        </article>
      </div>
    </section>
  `;
}

export function bindTesterPageEvents() {
  document.removeEventListener("click", handleTesterClick);
  document.addEventListener("click", handleTesterClick);
}

function handleTesterClick(event) {
  const sendButton = event.target.closest("#tester-send");
  const copyButton = event.target.closest("#tester-copy-response");

  if (sendButton) {
    executeRequest();
    return;
  }

  if (copyButton) {
    copyLastResponse();
  }
}

async function executeRequest() {
  const shell = document.querySelector(".aw-tester");
  const sendButton = document.querySelector("#tester-send");
  const methodInput = document.querySelector("#tester-method");
  const urlInput = document.querySelector("#tester-url");
  const headersInput = document.querySelector("#tester-headers");
  const bodyInput = document.querySelector("#tester-body");
  const responseCode = document.querySelector("#tester-response-code");
  const responseMeta = document.querySelector("#tester-response-meta");

  if (!shell || !sendButton || !methodInput || !urlInput || !headersInput || !bodyInput) {
    showToast("No se pudo leer el formulario del tester.", "error");
    return;
  }

  const endpointId = shell.dataset.endpointId || "";
  const projectId = shell.dataset.projectId || "";
  const method = methodInput.value.trim().toUpperCase();
  const url = urlInput.value.trim();
  const headersText = headersInput.value.trim();
  const bodyText = bodyInput.value.trim();

  if (!url) {
    showToast("La URL es obligatoria.", "error");
    urlInput.focus();
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    showToast("La URL debe comenzar con http:// o https://", "error");
    urlInput.focus();
    return;
  }

  let headers = {};

  if (headersText) {
    headers = safeJsonParse(headersText, null);

    if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
      showToast("Los headers deben ser un JSON válido.", "error");
      headersInput.focus();
      return;
    }
  }

  let body = "";

  if (bodyText) {
    const parsedBody = safeJsonParse(bodyText, null);

    if (parsedBody === null) {
      showToast("El body debe ser JSON válido.", "error");
      bodyInput.focus();
      return;
    }

    body = parsedBody;
  }

  const payload = {
    endpointId: endpointId || null,
    projectId: projectId || null,
    method,
    url,
    headers,
    body,
    timeout: 30000
  };

  storage.set(TESTER_LAST_REQUEST_KEY, payload);

  try {
    sendButton.disabled = true;
    sendButton.textContent = "Sending...";

    if (responseMeta) {
      responseMeta.textContent = "Ejecutando request...";
    }

    if (responseCode) {
      responseCode.textContent = "{\n  \"loading\": true\n}";
    }

    const response = await requestsService.send(payload);
    const data = response?.data || response;

    lastResponse = data;

    renderResponse(data);

    showToast("Request ejecutada y guardada en historial.", "success");
  } catch (error) {
    const errorPayload = {
      ok: false,
      message: error.message || "REQUEST_FAILED",
      status: error.status || 0,
      data: error.data || null
    };

    lastResponse = errorPayload;

    renderResponse(errorPayload);

    showToast(error.message || "No se pudo ejecutar la request.", "error");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
  }
}

function renderResponse(data) {
  const responseCode = document.querySelector("#tester-response-code");
  const responseMeta = document.querySelector("#tester-response-meta");

  const status = data?.status || 0;
  const statusText = data?.statusText || "Sin status";
  const responseTimeMs = data?.responseTimeMs || 0;
  const kind = data?.kind || "idle";

  if (responseMeta) {
    responseMeta.innerHTML = `
      <span class="aw-status aw-status-${escapeHtml(kind)}">
        <span></span>
        HTTP ${escapeHtml(status || "-")} · ${escapeHtml(statusText)}
      </span>
      <span class="aw-response-time">${escapeHtml(responseTimeMs)} ms</span>
    `;
  }

  if (responseCode) {
    responseCode.textContent = prettyJson({
      ok: data?.ok ?? false,
      status: data?.status ?? 0,
      statusText: data?.statusText || "",
      kind: data?.kind || "idle",
      responseTimeMs: data?.responseTimeMs || 0,
      headers: data?.headers || {},
      body: data?.body ?? data?.data ?? null,
      error: data?.error || null,
      historyId: data?.historyId || null
    });
  }
}

async function copyLastResponse() {
  if (!lastResponse) {
    showToast("No hay respuesta para copiar.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(prettyJson(lastResponse));
    showToast("Respuesta copiada.", "success");
  } catch {
    showToast("No se pudo copiar la respuesta.", "error");
  }
}

function getQueryParamsFromHash() {
  const hash = String(window.location.hash || "");
  const queryIndex = hash.indexOf("?");

  if (queryIndex === -1) {
    return new URLSearchParams();
  }

  return new URLSearchParams(hash.slice(queryIndex + 1));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}