"use strict";

import { router } from "../core/router.js";

function icon(name) {
  const icons = {
    dashboard: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 13h6V4H4v9Z"></path>
        <path d="M14 20h6V4h-6v16Z"></path>
        <path d="M4 20h6v-3H4v3Z"></path>
      </svg>
    `,
    projects: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"></path>
      </svg>
    `,
    endpoints: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M7 7h10"></path>
        <path d="M7 12h10"></path>
        <path d="M7 17h10"></path>
        <path d="M4 7h.01"></path>
        <path d="M4 12h.01"></path>
        <path d="M4 17h.01"></path>
      </svg>
    `,
    tester: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m8 5 9 7-9 7V5Z"></path>
      </svg>
    `,
    history: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12a9 9 0 1 0 3-6.7"></path>
        <path d="M3 4v5h5"></path>
        <path d="M12 7v5l3 2"></path>
      </svg>
    `,
    reports: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19V5"></path>
        <path d="M8 19v-7"></path>
        <path d="M12 19V8"></path>
        <path d="M16 19v-4"></path>
        <path d="M20 19V9"></path>
      </svg>
    `,
    settings: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"></path>
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 0 1-2.82 2.82l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.5 1.3V21a2 2 0 0 1-4 0v-.06A1.8 1.8 0 0 0 8 19.4a1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.82-2.82l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.3-.5H2.6a2 2 0 0 1 0-4h.06A1.8 1.8 0 0 0 4.6 8a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2 2 0 1 1 2.82-2.82l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .5-1.3V2.6a2 2 0 0 1 4 0v.06A1.8 1.8 0 0 0 16 4.6a1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.82 2.82l-.04.04A1.8 1.8 0 0 0 19.4 9c.2.36.5.7.9.9.34.18.73.27 1.12.27H21.4a2 2 0 0 1 0 4h-.06A1.8 1.8 0 0 0 19.4 15Z"></path>
      </svg>
    `
  };

  return icons[name] || icons.dashboard;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard"
  },
  {
    label: "Projects",
    path: "/projects",
    icon: "projects"
  },
  {
    label: "Endpoints",
    path: "/endpoints",
    icon: "endpoints"
  },
  {
    label: "Tester",
    path: "/tester",
    icon: "tester"
  },
  {
    label: "History",
    path: "/history",
    icon: "history"
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "reports"
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "settings"
  }
];

export function renderSidebar() {
  const currentPath = getRouteBase(window.location.hash.replace("#", "") || "/dashboard");

  return `
    <aside class="aw-sidebar" id="aw-sidebar">
      <div class="aw-sidebar-brand">
        <div class="aw-brand-mark">AW</div>
        <div>
          <strong>API Watchtower</strong>
          <span>Local API monitor</span>
        </div>
      </div>

      <nav class="aw-sidebar-nav">
        ${NAV_ITEMS.map((item) => {
          const active = currentPath === item.path ? "is-active" : "";

          return `
            <button class="aw-nav-item ${active}" data-route="${item.path}" title="${item.label}">
              <span class="aw-nav-icon">${icon(item.icon)}</span>
              <span>${item.label}</span>
            </button>
          `;
        }).join("")}
      </nav>
    </aside>
  `;
}

export function bindSidebarEvents() {
  document.removeEventListener("click", handleSidebarClick);
  document.addEventListener("click", handleSidebarClick);
}

function handleSidebarClick(event) {
  const button = event.target.closest("[data-route]");

  if (!button) {
    return;
  }

  const route = button.dataset.route;

  if (!route) {
    return;
  }

  router.go(route);
}

function getRouteBase(path) {
  const cleanPath = String(path || "/dashboard").trim();
  const withoutQuery = cleanPath.split("?")[0];

  return withoutQuery || "/dashboard";
}