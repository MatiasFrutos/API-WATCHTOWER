"use strict";

const { DB_FILES } = require("../storage/db");
const { readJson, writeJson } = require("../storage/json-db");
const { createId } = require("../utils/id");

function listProjects() {
  return readJson(DB_FILES.projects, []);
}

function getProjectById(id) {
  const projects = listProjects();
  return projects.find((project) => project.id === id) || null;
}

function createProject(payload) {
  const projects = listProjects();

  const project = {
    id: createId("project"),
    name: String(payload.name || "").trim(),
    description: String(payload.description || "").trim(),
    baseUrl: String(payload.baseUrl || "").trim(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!project.name) {
    const error = new Error("PROJECT_NAME_REQUIRED");
    error.status = 400;
    throw error;
  }

  projects.unshift(project);
  writeJson(DB_FILES.projects, projects);

  return project;
}

function updateProject(id, payload) {
  const projects = listProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    const error = new Error("PROJECT_NOT_FOUND");
    error.status = 404;
    throw error;
  }

  projects[index] = {
    ...projects[index],
    ...payload,
    id: projects[index].id,
    updatedAt: new Date().toISOString()
  };

  writeJson(DB_FILES.projects, projects);

  return projects[index];
}

function removeProject(id) {
  const projects = listProjects();
  const nextProjects = projects.filter((project) => project.id !== id);

  writeJson(DB_FILES.projects, nextProjects);

  return {
    removed: projects.length !== nextProjects.length
  };
}

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  removeProject
};