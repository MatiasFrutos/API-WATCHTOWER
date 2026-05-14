"use strict";

const service = require("../services/settings.service");

function get(_req, res) {
  res.json({
    ok: true,
    data: service.getSettings()
  });
}

function update(req, res) {
  res.json({
    ok: true,
    data: service.updateSettings(req.body)
  });
}

module.exports = {
  get,
  update
};