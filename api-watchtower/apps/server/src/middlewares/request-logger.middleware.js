"use strict";

function requestLoggerMiddleware(req, _res, next) {
  req.requestStartedAt = Date.now();
  next();
}

module.exports = {
  requestLoggerMiddleware
};