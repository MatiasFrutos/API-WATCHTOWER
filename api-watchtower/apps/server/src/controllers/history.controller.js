"use strict";

const service = require("../services/history.service");

function list(_req, res) {
  res.json({
    ok: true,
    data: service.listHistory()
  });
}

function clear(_req, res) {
  res.json({
    ok: true,
    data: service.clearHistory()
  });
}

module.exports = {
  list,
  clear
};