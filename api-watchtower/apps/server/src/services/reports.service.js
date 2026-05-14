"use strict";

const { listEndpoints } = require("./endpoints.service");
const { listHistory } = require("./history.service");
const { listProjects } = require("./projects.service");

function getReportsSummary() {
  const projects = listProjects();
  const endpoints = listEndpoints();
  const history = listHistory();

  const ok = endpoints.filter((endpoint) => endpoint.status === "ok").length;
  const warning = endpoints.filter((endpoint) => endpoint.status === "warning").length;
  const error = endpoints.filter((endpoint) => endpoint.status === "error").length;

  const responseTimes = history
    .map((entry) => Number(entry.responseTimeMs || 0))
    .filter((value) => value > 0);

  const averageResponseTimeMs = responseTimes.length
    ? Math.round(responseTimes.reduce((acc, item) => acc + item, 0) / responseTimes.length)
    : 0;

  return {
    totalProjects: projects.length,
    totalEndpoints: endpoints.length,
    totalHistory: history.length,
    endpointsByStatus: {
      ok,
      warning,
      error,
      idle: endpoints.length - ok - warning - error
    },
    averageResponseTimeMs,
    lastRun: history[0] || null
  };
}

module.exports = {
  getReportsSummary
};