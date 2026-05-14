"use strict";

const { env } = require("./env");

const allowedOrigins = [
  env.CORS_ORIGIN,
  "http://127.0.0.1:5173",
  "http://localhost:5173"
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

module.exports = {
  corsOptions
};