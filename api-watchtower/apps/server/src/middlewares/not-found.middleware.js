"use strict";

function notFoundMiddleware(req, res) {
  res.status(404).json({
    ok: false,
    message: "ROUTE_NOT_FOUND",
    path: req.originalUrl
  });
}

module.exports = {
  notFoundMiddleware
};