"use strict";

const { listProjects } = require("./projects.service");
const { listEndpoints } = require("./endpoints.service");
const { listHistory } = require("./history.service");

function getWatchtowerOverview() {
  const projects = listProjects();
  const endpoints = listEndpoints();
  const history = listHistory();

  return {
    app: "API Watchtower",
    status: "online",
    totals: {
      projects: projects.length,
      endpoints: endpoints.length,
      history: history.length
    },
    lastActivity: history[0] || null,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  getWatchtowerOverview
};