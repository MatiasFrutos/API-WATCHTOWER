"use strict";

const express = require("express");

const healthRoutes = require("./health.routes");
const projectsRoutes = require("./projects.routes");
const endpointsRoutes = require("./endpoints.routes");
const requestsRoutes = require("./requests.routes");
const historyRoutes = require("./history.routes");
const reportsRoutes = require("./reports.routes");
const settingsRoutes = require("./settings.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/projects", projectsRoutes);
router.use("/endpoints", endpointsRoutes);
router.use("/requests", requestsRoutes);
router.use("/history", historyRoutes);
router.use("/reports", reportsRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;