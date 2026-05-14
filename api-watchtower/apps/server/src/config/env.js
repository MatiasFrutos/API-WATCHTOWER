"use strict";

require("dotenv").config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3567),
  HOST: process.env.HOST || "127.0.0.1",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://127.0.0.1:5173",
  REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS || 30000)
};

module.exports = {
  env
};