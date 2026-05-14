"use strict";

import { projectsService } from "../services/projects.service.js";
import { openModal, closeModal } from "../components/modal.js";
import { showToast } from "../components/toast.js";

let projectsCache = [];

export function renderProjectsPage() {
  return `
    <div class="aw-page-header">
      <div>
        <p class="aw-eyebrow">Workspace</p>
        <h2>Projects</h2>
        <p>Organizá tus APIs por proyecto, ambiente o cliente.</p>
      </div>

      <button class="aw-primary-button" type="button" data-action="open-project-modal">
        Nuevo proyecto
      </button>
    </div>

    <section id="projects-content">
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◎</div>
        <h3>Cargando proyectos...</h3>
        <p>Estamos consultando el backend local.</p>
      </div>
    </section>
  `;
}

export function bindProjectsPageEvents() {
  document.removeEventListener("click", handleProjectsClick);
  document.removeEventListener("submit", handleProjectsSubmit);

  document.addEventListener("click", handleProjectsClick);
  document.addEventListener("submit", handleProjectsSubmit);

  loadProjects();
}

function handleProjectsClick(event) {
  const openButton = event.target.closest("[data-action='open-project-modal']");
  const deleteButton = event.target.closest("[data-action='delete-project']");

  if (openButton) {
    openCreateProjectModal();
    return;
  }

  if (deleteButton) {
    const projectId = deleteButton.dataset.projectId;

    if (projectId) {
      deleteProject(projectId);
    }
  }
}

function handleProjectsSubmit(event) {
  const form = event.target.closest("#project-form");

  if (!form) {
    return;
  }

  event.preventDefault();
  createProject(form);
}

async function loadProjects() {
  const content = document.querySelector("#projects-content");

  if (!content) {
    return;
  }

  content.innerHTML = `
    <div class="aw-empty-state">
      <div class="aw-empty-icon">◎</div>
      <h3>Cargando proyectos...</h3>
      <p>Estamos consultando el backend local.</p>
    </div>
  `;

  try {
    const response = await projectsService.list();
    projectsCache = Array.isArray(response?.data) ? response.data : [];

    content.innerHTML = renderProjectsContent(projectsCache);
  } catch (error) {
    content.innerHTML = `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">!</div>
        <h3>No se pudieron cargar los proyectos</h3>
        <p>${escapeHtml(error.message || "Error desconocido")}</p>
      </div>
    `;

    showToast("No se pudieron cargar los proyectos.", "error");
  }
}

function renderProjectsContent(projects) {
  if (!projects.length) {
    return `
      <div class="aw-empty-state">
        <div class="aw-empty-icon">◎</div>
        <h3>No hay proyectos</h3>
        <p>Creá tu primer proyecto para empezar a cargar endpoints.</p>
      </div>
    `;
  }

  return `
    <section class="aw-grid aw-grid-3">
      ${projects.map(renderProjectCard).join("")}
    </section>
  `;
}

function renderProjectCard(project) {
  const projectId = project.id || "";
  const endpointsUrl = `#/endpoints?projectId=${encodeURIComponent(projectId)}`;

  return `
    <article class="aw-card aw-project-card">
      <div class="aw-project-card-header">
        <div>
          <span class="aw-card-label">Proyecto</span>
          <strong class="aw-project-title">${escapeHtml(project.name)}</strong>
        </div>

        <span class="aw-status aw-status-ok">
          <span></span>
          Activo
        </span>
      </div>

      <p class="aw-project-description">
        ${escapeHtml(project.description || "Sin descripción.")}
      </p>

      ${
        project.baseUrl
          ? `
            <div class="aw-project-url">
              ${escapeHtml(project.baseUrl)}
            </div>
          `
          : ""
      }

      <div class="aw-project-actions">
        <a class="aw-primary-button" href="${escapeHtml(endpointsUrl)}">
          Abrir proyecto
        </a>

        <button
          class="aw-icon-button"
          type="button"
          title="Eliminar proyecto"
          data-action="delete-project"
          data-project-id="${escapeHtml(projectId)}"
        >
          ×
        </button>
      </div>
    </article>
  `;
}

function openCreateProjectModal() {
  openModal({
    title: "Nuevo proyecto",
    body: `
      <form id="project-form" class="aw-project-form">
        <label class="aw-field">
          <span>Nombre del proyecto</span>
          <input
            class="aw-input"
            name="name"
            type="text"
            placeholder="Ej: API CRM"
            autocomplete="off"
            required
          />
        </label>

        <label class="aw-field">
          <span>URL base</span>
          <input
            class="aw-input"
            name="baseUrl"
            type="url"
            placeholder="https://api.midominio.com"
            autocomplete="off"
          />
        </label>

        <label class="aw-field">
          <span>Descripción</span>
          <textarea
            class="aw-code-input aw-textarea-small"
            name="description"
            placeholder="Descripción breve del proyecto"
          ></textarea>
        </label>

        <div class="aw-modal-footer-actions">
          <button class="aw-icon-button" type="button" data-modal-close>
            Cancelar
          </button>

          <button class="aw-primary-button" type="submit">
            Guardar proyecto
          </button>
        </div>
      </form>
    `,
    footer: ""
  });

  setTimeout(() => {
    document.querySelector("#project-form input[name='name']")?.focus();
  }, 50);
}

async function createProject(form) {
  const submitButton = form.querySelector("button[type='submit']");

  const payload = {
    name: form.name.value.trim(),
    baseUrl: form.baseUrl.value.trim(),
    description: form.description.value.trim()
  };

  if (!payload.name) {
    showToast("El nombre del proyecto es obligatorio.", "error");
    return;
  }

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }

    await projectsService.create(payload);

    closeModal();
    showToast("Proyecto creado correctamente.", "success");

    await loadProjects();
  } catch (error) {
    showToast(error.message || "No se pudo crear el proyecto.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Guardar proyecto";
    }
  }
}

async function deleteProject(projectId) {
  const confirmed = window.confirm("¿Eliminar este proyecto?");

  if (!confirmed) {
    return;
  }

  try {
    await projectsService.remove(projectId);

    showToast("Proyecto eliminado correctamente.", "success");

    await loadProjects();
  } catch (error) {
    showToast(error.message || "No se pudo eliminar el proyecto.", "error");
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}