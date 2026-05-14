"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { corsOptions } = require("./config/cors");
const routes = require("./routes/index.routes");
const { requestLoggerMiddleware } = require("./middlewares/request-logger.middleware");
const { notFoundMiddleware } = require("./middlewares/not-found.middleware");
const { errorMiddleware } = require("./middlewares/error.middleware");

function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(morgan("dev"));
  app.use(requestLoggerMiddleware);

  app.get("/", (_req, res) => {
    res.json({
      app: "API Watchtower",
      message: "Local API server online",
      api: "/api",
      health: "/api/health"
    });
  });

  app.use("/api", routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = {
  createApp
};