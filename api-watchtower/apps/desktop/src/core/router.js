"use strict";

import { APP_CONFIG } from "./config.js";

function normalizePath(hash) {
  const clean = String(hash || "")
    .replace(/^#/, "")
    .trim();

  if (!clean || clean === "/") {
    return APP_CONFIG.defaultRoute;
  }

  return clean.startsWith("/") ? clean : `/${clean}`;
}

function getRouteBase(path) {
  const cleanPath = String(path || APP_CONFIG.defaultRoute).trim();
  const withoutQuery = cleanPath.split("?")[0];

  return withoutQuery || APP_CONFIG.defaultRoute;
}

export const router = {
  routes: {},
  fallback: null,
  outlet: null,
  afterRender: null,

  init({ routes, fallback, outlet, afterRender }) {
    this.routes = routes || {};
    this.fallback = fallback;
    this.outlet = document.querySelector(outlet);
    this.afterRender = afterRender;

    if (!this.outlet) {
      throw new Error("ROUTER_OUTLET_NOT_FOUND");
    }

    window.addEventListener("hashchange", () => {
      this.render();
    });

    if (!window.location.hash) {
      this.go(APP_CONFIG.defaultRoute);
      return;
    }

    this.render();
  },

  getCurrentPath() {
    return normalizePath(window.location.hash);
  },

  getRouteBase(path = "") {
    return getRouteBase(path || this.getCurrentPath());
  },

  getQueryParams(path = "") {
    const currentPath = path || this.getCurrentPath();
    const queryIndex = currentPath.indexOf("?");

    if (queryIndex === -1) {
      return new URLSearchParams();
    }

    return new URLSearchParams(currentPath.slice(queryIndex + 1));
  },

  go(path) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    window.location.hash = clean;
  },

  render() {
    const path = this.getCurrentPath();
    const routeBase = getRouteBase(path);
    const pageRenderer = this.routes[path] || this.routes[routeBase] || this.fallback;

    if (!pageRenderer) {
      this.outlet.innerHTML = "";
      return;
    }

    this.outlet.innerHTML = pageRenderer({
      path,
      routeBase,
      query: this.getQueryParams(path),
      router: this
    });

    if (typeof this.afterRender === "function") {
      this.afterRender(path);
    }
  }
};