"use strict";

const service = require("../services/projects.service");

function list(req, res) {
  res.json({
    ok: true,
    data: service.listProjects()
  });
}

function getById(req, res) {
  const project = service.getProjectById(req.params.id);

  if (!project) {
    res.status(404).json({
      ok: false,
      message: "PROJECT_NOT_FOUND"
    });
    return;
  }

  res.json({
    ok: true,
    data: project
  });
}

function create(req, res, next) {
  try {
    const project = service.createProject(req.body);

    res.status(201).json({
      ok: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
}

function update(req, res, next) {
  try {
    const project = service.updateProject(req.params.id, req.body);

    res.json({
      ok: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
}

function remove(req, res) {
  res.json({
    ok: true,
    data: service.removeProject(req.params.id)
  });
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};