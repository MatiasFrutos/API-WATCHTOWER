"use strict";

import { router } from "./core/router.js";
import { emitAppEvent } from "./core/events.js";

import { renderNavbar, bindNavbarEvents } from "./components/navbar.js";
import { renderSidebar, bindSidebarEvents } from "./components/sidebar.js";
import { renderFooter } from "./components/footer.js";
import { renderToastHost } from "./components/toast.js";
import { renderModalHost } from "./components/modal.js";

import { renderDashboardPage, bindDashboardPageEvents } from "./pages/dashboard.page.js";
import { renderProjectsPage, bindProjectsPageEvents } from "./pages/projects.page.js";
import { renderEndpointsPage, bindEndpointsPageEvents } from "./pages/endpoints.page.js";
import { renderTesterPage, bindTesterPageEvents } from "./pages/tester.page.js";
import { renderHistoryPage, bindHistoryPageEvents } from "./pages/history.page.js";
import { renderReportsPage, bindReportsPageEvents } from "./pages/reports.page.js";
import { renderSettingsPage } from "./pages/settings.page.js";
import { renderNotFoundPage } from "./pages/not-found.page.js";

const ROUTES = {
  "/": renderDashboardPage,
  "/dashboard": renderDashboardPage,
  "/projects": renderProjectsPage,
  "/endpoints": renderEndpointsPage,
  "/tester": renderTesterPage,
  "/history": renderHistoryPage,
  "/reports": renderReportsPage,
  "/settings": renderSettingsPage
};

const ROUTE_BINDERS = {
  "/dashboard": bindDashboardPageEvents,
  "/": bindDashboardPageEvents,
  "/projects": bindProjectsPageEvents,
  "/endpoints": bindEndpointsPageEvents,
  "/tester": bindTesterPageEvents,
  "/history": bindHistoryPageEvents,
  "/reports": bindReportsPageEvents
};

export function startApp() {
  const app = document.querySelector("#app");

  if (!app) {
    throw new Error("APP_ROOT_NOT_FOUND");
  }

  app.innerHTML = `
    <div class="aw-shell">
      ${renderSidebar()}
      <main class="aw-main">
        ${renderNavbar()}
        <section id="aw-page" class="aw-page"></section>
        ${renderFooter()}
      </main>
      ${renderToastHost()}
      ${renderModalHost()}
    </div>
  `;

  bindNavbarEvents();
  bindSidebarEvents();

  router.init({
    routes: ROUTES,
    fallback: renderNotFoundPage,
    outlet: "#aw-page",
    afterRender: (path) => {
      const currentPath = path || router.getCurrentPath();
      const routeBase = getRouteBase(currentPath);
      const binder = ROUTE_BINDERS[routeBase];

      if (typeof binder === "function") {
        binder();
      }

      updateActiveNavigation(routeBase);

      emitAppEvent("route:changed", {
        path: currentPath
      });
    }
  });
}

function getRouteBase(path) {
  const cleanPath = String(path || "/dashboard").trim();
  const withoutQuery = cleanPath.split("?")[0];

  return withoutQuery || "/dashboard";
}

function updateActiveNavigation(path) {
  const normalizedPath = path === "/" ? "/dashboard" : path;

  document.querySelectorAll("[data-route]").forEach((button) => {
    const route = button.dataset.route;

    if (route === normalizedPath) {
      button.classList.add("is-active");
    } else {
      button.classList.remove("is-active");
    }
  });
}