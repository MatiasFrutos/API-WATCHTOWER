"use strict";

const express = require("express");
const controller = require("../controllers/history.controller");

const router = express.Router();

router.get("/", controller.list);
router.delete("/", controller.clear);

module.exports = router;