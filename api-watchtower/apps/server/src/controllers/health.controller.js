"use strict";

const { getWatchtowerOverview } = require("../services/watchtower.service");

function healthCheck(_req, res) {
  res.json({
    ok: true,
    message: "API Watchtower API online",
    ...getWatchtowerOverview()
  });
}

module.exports = {
  healthCheck
};