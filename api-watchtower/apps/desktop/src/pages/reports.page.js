"use strict";

import { reportsService } from "../services/reports.service.js";
import { historyService } from "../services/history.service.js";
import { showToast } from "../components/toast.js";
import { prettyJson } from "../utils/json.util.js";
import { formatDateTime } from "../utils/date.util.js";

let reportsSummaryCache = null;
let reportsHistoryCache = [];

export function renderReportsPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Insights</p>
        <h2>Reports</h2>
        <p>Reportes de disponibilidad, errores, tiempos de respuesta y actividad local.</p>
      </div>

      <div class="aw-history-actions">
        <button class="aw-icon-button" type="button" data-action="reload-reports" title="Actualizar reportes">
          ↻
        </button>

        <button class="aw-primary-button" type="button" data-action="copy-reports">
          Copiar reporte
        </button>
      </div>
    </div>

    <section id="reports-content">
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◎</div>
        <h3>Cargando reportes...</h3>
        <p>Estamos consolidando la información local.</p>
      </div>
    </section>
  `;
}

export function bindReportsPageEvents() {
  document.removeEventListener("click", handleReportsClick);
  document.addEventListener("click", handleReportsClick);

  loadReports();
}

function handleReportsClick(event) {
  const reloadButton = event.target.closest("[data-action='reload-reports']");
  const copyButton = event.target.closest("[data-action='copy-reports']");

  if (reloadButton) {
    loadReports();
    return;
  }

  if (copyButton) {
    copyReports();
  }
}

async function loadReports() {
  const container = document.querySelector("#reports-content");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="aw-empty-state">
      <div class="aw-empty-icon">◎</div>
      <h3>Cargando reportes...</h3>
      <p>Estamos consolidando la información local.</p>
    </div>
  `;

  try {
    const [summaryResponse, historyResponse] = await Promise.all([
      reportsService.summary(),
      historyService.list()
    ]);

    reportsSummaryCache = summaryResponse?.data || null;
    reportsHistoryCache = Array.isArray(historyResponse?.data) ? historyResponse.data : [];

    container.innerHTML = renderReportsContent(reportsSummaryCache, reportsHistoryCache);
  } catch (error) {
    container.innerHTML = `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">!</div>
        <h3>No se pudieron cargar los reportes</h3>
        <p>${escapeHtml(error.message || "Error desconocido")}</p>
      </div>
    `;

    showToast("No se pudieron cargar los reportes.", "error");
  }
}

function renderReportsContent(summary, history) {
  const totalProjects = summary?.totalProjects || 0;
  const totalEndpoints = summary?.totalEndpoints || 0;
  const totalHistory = summary?.totalHistory || 0;
  const averageResponseTimeMs = summary?.averageResponseTimeMs || 0;

  const statusData = summary?.endpointsByStatus || {};
  const ok = statusData.ok || 0;
  const warning = statusData.warning || 0;
  const error = statusData.error || 0;
  const idle = statusData.idle || 0;

  const availability = calculateAvailability(history);
  const slowest = getSlowestRequest(history);
  const fastest = getFastestRequest(history);
  const errors = history.filter((item) => Number(item.status || 0) >= 400 || item.kind === "error");
  const recent = history.slice(0, 8);

  return `
    <section class="aw-grid aw-grid-4">
      <article class="aw-card">
        <span class="aw-card-label">Disponibilidad</span>
        <strong class="aw-card-value">${escapeHtml(availability)}%</strong>
        <span class="aw-status aw-status-${availability >= 90 ? "ok" : availability >= 70 ? "warning" : "error"}">
          <span></span>
          Según historial
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Requests</span>
        <strong class="aw-card-value">${escapeHtml(totalHistory)}</strong>
        <span class="aw-status aw-status-ok">
          <span></span>
          Ejecutadas
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Promedio</span>
        <strong class="aw-card-value">${escapeHtml(averageResponseTimeMs)} ms</strong>
        <span class="aw-status aw-status-${averageResponseTimeMs > 1000 ? "warning" : "ok"}">
          <span></span>
          Tiempo medio
        </span>
      </article>

      <article class="aw-card">
        <span class="aw-card-label">Errores</span>
        <strong class="aw-card-value">${escapeHtml(errors.length)}</strong>
        <span class="aw-status aw-status-${errors.length ? "error" : "ok"}">
          <span></span>
          Historial
        </span>
      </article>
    </section>

    <section class="aw-grid aw-grid-2 aw-dashboard-panels">
      <article class="aw-panel">
        <div class="aw-panel-header">
          <div>
            <h3>Resumen general</h3>
            <p>Vista ejecutiva de proyectos, endpoints y estados.</p>
          </div>
        </div>

        <div class="aw-report-summary-list">
          ${renderReportRow("Proyectos registrados", totalProjects)}
          ${renderReportRow("Endpoints registrados", totalEndpoints)}
          ${renderReportRow("Endpoints OK", ok)}
          ${renderReportRow("Endpoints lentos / warning", warning)}
          ${renderReportRow("Endpoints con error", error)}
          ${renderReportRow("Endpoints sin probar", idle)}
        </div>
      </article>

      <article class="aw-panel">
        <div class="aw-panel-header">
          <div>
            <h3>Performance</h3>
            <p>Mejores y peores tiempos detectados.</p>
          </div>
        </div>

        <div class="aw-report-summary-list">
          ${renderPerformanceRow("Request más rápida", fastest)}
          ${renderPerformanceRow("Request más lenta", slowest)}
          ${renderReportRow("Tiempo promedio", `${averageResponseTimeMs} ms`)}
          ${renderReportRow("Total muestras", totalHistory)}
        </div>
      </article>
    </section>

    <section class="aw-panel">
      <div class="aw-panel-header">
        <div>
          <h3>Actividad reciente</h3>
          <p>Últimas requests usadas para construir el reporte.</p>
        </div>
      </div>

      ${renderRecentReportHistory(recent)}
    </section>
  `;
}

function renderReportRow(label, value) {
  return `
    <div class="aw-report-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderPerformanceRow(label, item) {
  if (!item) {
    return renderReportRow(label, "Sin datos");
  }

  return `
    <div class="aw-report-row aw-report-row-stack">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(item.responseTimeMs || 0)} ms</strong>
      <small>${escapeHtml(item.method || "GET")} · ${escapeHtml(item.url || "-")}</small>
    </div>
  `;
}

function renderRecentReportHistory(history) {
  if (!history.length) {
    return `
      <div class="aw-empty-inline">
        Todavía no hay requests para reportar.
      </div>
    `;
  }

  return `
    <div class="aw-history-list">
      ${history.map((item) => `
        <article class="aw-history-item aw-history-item-compact">
          <div class="aw-history-main">
            <div class="aw-history-line">
              <span class="aw-method-badge">${escapeHtml(item.method || "GET")}</span>

              <span class="aw-status aw-status-${escapeHtml(item.kind || "idle")}">
                <span></span>
                HTTP ${escapeHtml(item.status || "-")} · ${escapeHtml(item.statusText || "Sin status")}
              </span>

              <span class="aw-response-time">${escapeHtml(item.responseTimeMs || 0)} ms</span>
            </div>

            <strong class="aw-history-url">${escapeHtml(item.url || "-")}</strong>

            <div class="aw-history-meta">
              <span>${escapeHtml(item.createdAt ? formatDateTime(item.createdAt) : "-")}</span>
              <span>ID: ${escapeHtml(item.id || "-")}</span>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function calculateAvailability(history) {
  if (!history.length) {
    return 0;
  }

  const success = history.filter((item) => Number(item.status || 0) >= 200 && Number(item.status || 0) < 400).length;

  return Math.round((success / history.length) * 100);
}

function getFastestRequest(history) {
  const valid = history
    .filter((item) => Number(item.responseTimeMs || 0) > 0)
    .sort((a, b) => Number(a.responseTimeMs || 0) - Number(b.responseTimeMs || 0));

  return valid[0] || null;
}

function getSlowestRequest(history) {
  const valid = history
    .filter((item) => Number(item.responseTimeMs || 0) > 0)
    .sort((a, b) => Number(b.responseTimeMs || 0) - Number(a.responseTimeMs || 0));

  return valid[0] || null;
}

async function copyReports() {
  const payload = {
    generatedAt: new Date().toISOString(),
    summary: reportsSummaryCache,
    availability: calculateAvailability(reportsHistoryCache),
    fastestRequest: getFastestRequest(reportsHistoryCache),
    slowestRequest: getSlowestRequest(reportsHistoryCache),
    recentHistory: reportsHistoryCache.slice(0, 10)
  };

  try {
    await navigator.clipboard.writeText(prettyJson(payload));
    showToast("Reporte copiado.", "success");
  } catch {
    showToast("No se pudo copiar el reporte.", "error");
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}