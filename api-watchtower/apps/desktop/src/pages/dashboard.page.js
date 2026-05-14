"use strict";

import { reportsService } from "../services/reports.service.js";
import { historyService } from "../services/history.service.js";
import { showToast } from "../components/toast.js";
import { formatDateTime } from "../utils/date.util.js";

let dashboardSummaryCache = null;
let dashboardHistoryCache = [];

export function renderDashboardPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Overview</p>
        <h2>Dashboard</h2>
        <p>Vista general del estado de tus APIs, endpoints, historial y performance.</p>
      </div>

      <div class="aw-history-actions">
        <button class="aw-icon-button" type="button" data-action="reload-dashboard" title="Actualizar dashboard">
          ↻
        </button>

        <a class="aw-primary-button" href="#/tester">
          Ir al Tester
        </a>
      </div>
    </div>

    <section id="dashboard-summary">
      ${renderDashboardLoading()}
    </section>

    <section class="aw-panel">
      <div class="aw-panel-header">
        <div>
          <h3>Actividad reciente</h3>
          <p>Últimas requests ejecutadas desde API Watchtower.</p>
        </div>

        <a class="aw-icon-button" href="#/history" title="Ver historial completo">
          ◷
        </a>
      </div>

      <div id="dashboard-recent-history">
        ${renderInlineLoading("Cargando actividad reciente...")}
      </div>
    </section>
  `;
}

export function bindDashboardPageEvents() {
  document.removeEventListener("click", handleDashboardClick);
  document.addEventListener("click", handleDashboardClick);

  loadDashboard();
}

function handleDashboardClick(event) {
  const reloadButton = event.target.closest("[data-action='reload-dashboard']");

  if (reloadButton) {
    loadDashboard();
  }
}

async function loadDashboard() {
  await Promise.all([
    loadDashboardSummary(),
    loadDashboardRecentHistory()
  ]);
}

async function loadDashboardSummary() {
  const container = document.querySelector("#dashboard-summary");

  if (!container) {
    return;
  }

  container.innerHTML = renderDashboardLoading();

  try {
    const response = await reportsService.summary();

    dashboardSummaryCache = response?.data || null;

    container.innerHTML = renderDashboardSummary(dashboardSummaryCache);
  } catch (error) {
    container.innerHTML = renderDashboardError(error.message || "No se pudo cargar el resumen.");

    showToast("No se pudo cargar el dashboard.", "error");
  }
}

async function loadDashboardRecentHistory() {
  const container = document.querySelector("#dashboard-recent-history");

  if (!container) {
    return;
  }

  container.innerHTML = renderInlineLoading("Cargando actividad reciente...");

  try {
    const response = await historyService.list();

    dashboardHistoryCache = Array.isArray(response?.data) ? response.data : [];

    container.innerHTML = renderRecentHistory(dashboardHistoryCache.slice(0, 5));
  } catch (error) {
    container.innerHTML = `
      <div class="aw-empty-inline">
        No se pudo cargar la actividad reciente: ${escapeHtml(error.message || "Error desconocido")}
      </div>
    `;
  }
}

function renderDashboardLoading() {
  return `
    <section class="aw-grid aw-grid-4">
      ${Array.from({ length: 4 }).map(() => `
        <article class="aw-card aw-skeleton-card">
          <span class="aw-card-label">Cargando</span>
          <strong class="aw-card-value">...</strong>
          <span class="aw-status aw-status-idle">
            <span></span>
            Consultando
          </span>
        </article>
      `).join("")}
    </section>
  `;
}

function renderDashboardSummary(summary) {
  const totalProjects = summary?.totalProjects || 0;
  const totalEndpoints = summary?.totalEndpoints || 0;
  const totalHistory = summary?.totalHistory || 0;
  const averageResponseTimeMs = summary?.averageResponseTimeMs || 0;

  const statusData = summary?.endpointsByStatus || {};
  const ok = statusData.ok || 0;
  const warning = statusData.warning || 0;
  const error = statusData.error || 0;
  const idle = statusData.idle || 0;

  const healthKind = error > 0 ? "error" : warning > 0 ? "warning" : ok > 0 ? "ok" : "idle";
  const healthLabel = error > 0 ? "Con errores" : warning > 0 ? "Con alertas" : ok > 0 ? "Operativo" : "Sin pruebas";

  return `
    <section class="aw-grid aw-grid-4">
      <article class="aw-card">
        <span class="aw-card-label">Projects</span>
        <strong class="aw-card-value">${escapeHtml(totalProjects)}</strong>
        <span class="aw-status aw-status-ok">
          <span></span>
          Registrados
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Endpoints</span>
        <strong class="aw-card-value">${escapeHtml(totalEndpoints)}</strong>
        <span class="aw-status aw-status-idle">
          <span></span>
          Monitoreables
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Requests</span>
        <strong class="aw-card-value">${escapeHtml(totalHistory)}</strong>
        <span class="aw-status aw-status-ok">
          <span></span>
          Historial local
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Promedio</span>
        <strong class="aw-card-value">${escapeHtml(averageResponseTimeMs)} ms</strong>
        <span class="aw-status aw-status-${escapeHtml(healthKind)}">
          <span></span>
          ${escapeHtml(healthLabel)}
        </span>
      </article>
    </section>

    <section class="aw-grid aw-grid-2 aw-dashboard-panels">
      <article class="aw-panel aw-dashboard-health-panel">
        <div class="aw-panel-header">
          <div>
            <h3>Estado de endpoints</h3>
            <p>Resumen consolidado según la última prueba ejecutada.</p>
          </div>
        </div>

        <div class="aw-health-grid">
          ${renderHealthItem("OK", ok, "ok")}
          ${renderHealthItem("Lentos", warning, "warning")}
          ${renderHealthItem("Error", error, "error")}
          ${renderHealthItem("Sin probar", idle, "idle")}
        </div>
      </article>

      <article class="aw-panel aw-dashboard-health-panel">
        <div class="aw-panel-header">
          <div>
            <h3>Última ejecución</h3>
            <p>Última request registrada en el historial local.</p>
          </div>
        </div>

        ${renderLastRun(summary?.lastRun)}
      </article>
    </section>
  `;
}

function renderHealthItem(label, value, kind) {
  return `
    <div class="aw-health-item aw-health-${escapeHtml(kind)}">
      <span class="aw-status aw-status-${escapeHtml(kind)}">
        <span></span>
        ${escapeHtml(label)}
      </span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderLastRun(lastRun) {
  if (!lastRun) {
    return `
      <div class="aw-empty-inline">
        Todavía no hay requests ejecutadas.
      </div>
    `;
  }

  return `
    <div class="aw-last-run-card">
      <div class="aw-history-line">
        <span class="aw-method-badge">${escapeHtml(lastRun.method || "GET")}</span>

        <span class="aw-status aw-status-${escapeHtml(lastRun.kind || "idle")}">
          <span></span>
          HTTP ${escapeHtml(lastRun.status || "-")} · ${escapeHtml(lastRun.statusText || "Sin status")}
        </span>

        <span class="aw-response-time">${escapeHtml(lastRun.responseTimeMs || 0)} ms</span>
      </div>

      <strong class="aw-history-url">${escapeHtml(lastRun.url || "-")}</strong>

      <div class="aw-history-meta">
        <span>${escapeHtml(lastRun.createdAt ? formatDateTime(lastRun.createdAt) : "-")}</span>
        <span>ID: ${escapeHtml(lastRun.id || "-")}</span>
      </div>
    </div>
  `;
}

function renderRecentHistory(history) {
  if (!history.length) {
    return `
      <div class="aw-empty-inline">
        Todavía no hay actividad reciente.
      </div>
    `;
  }

  return `
    <div class="aw-history-list aw-history-list-compact">
      ${history.map((item) => `
        <article class="aw-history-item aw-history-item-compact">
          <div class="aw-history-main">
            <div class="aw-history-line">
              <span class="aw-method-badge">${escapeHtml(item.method || "GET")}</span>

              <span class="aw-status aw-status-${escapeHtml(item.kind || "idle")}">
                <span></span>
                HTTP ${escapeHtml(item.status || "-")}
              </span>

              <span class="aw-response-time">${escapeHtml(item.responseTimeMs || 0)} ms</span>
            </div>

            <strong class="aw-history-url">${escapeHtml(item.url || "-")}</strong>

            <div class="aw-history-meta">
              <span>${escapeHtml(item.createdAt ? formatDateTime(item.createdAt) : "-")}</span>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderInlineLoading(text) {
  return `
    <div class="aw-empty-inline">
      ${escapeHtml(text)}
    </div>
  `;
}

function renderDashboardError(message) {
  return `
    <div class="aw-empty-state">
      <div class="aw-empty-icon">!</div>
      <h3>No se pudo cargar el dashboard</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}