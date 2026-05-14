"use strict";

const express = require("express");
const controller = require("../controllers/requests.controller");

const router = express.Router();

router.post("/send", controller.send);

module.exports = router;