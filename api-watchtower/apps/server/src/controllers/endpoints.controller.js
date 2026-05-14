"use strict";

const service = require("../services/endpoints.service");

function list(req, res) {
  res.json({
    ok: true,
    data: service.listEndpoints({
      projectId: req.query.projectId || ""
    })
  });
}

function getById(req, res) {
  const endpoint = service.getEndpointById(req.params.id);

  if (!endpoint) {
    res.status(404).json({
      ok: false,
      message: "ENDPOINT_NOT_FOUND"
    });
    return;
  }

  res.json({
    ok: true,
    data: endpoint
  });
}

function create(req, res, next) {
  try {
    const endpoint = service.createEndpoint(req.body);

    res.status(201).json({
      ok: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
}

function update(req, res, next) {
  try {
    const endpoint = service.updateEndpoint(req.params.id, req.body);

    res.json({
      ok: true,
      data: endpoint
    });
  } catch (error) {
    next(error);
  }
}

function remove(req, res) {
  res.json({
    ok: true,
    data: service.removeEndpoint(req.params.id)
  });
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};