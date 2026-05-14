"use strict";

const service = require("../services/reports.service");

function summary(_req, res) {
  res.json({
    ok: true,
    data: service.getReportsSummary()
  });
}

module.exports = {
  summary
};