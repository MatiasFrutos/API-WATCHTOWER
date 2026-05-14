"use strict";

const { createApp } = require("./app");
const { env } = require("./config/env");
const { seedDatabase } = require("./storage/seed");

async function bootstrap() {
  try {
    seedDatabase();

    const app = createApp();

    app.listen(env.PORT, env.HOST, () => {
      console.log("============================================================");
      console.log(" API WATCHTOWER SERVER ONLINE");
      console.log("============================================================");
      console.log(` Environment: ${env.NODE_ENV}`);
      console.log(` Server:      http://${env.HOST}:${env.PORT}`);
      console.log(` Health:      http://${env.HOST}:${env.PORT}/api/health`);
      console.log("============================================================");
    });
  } catch (error) {
    console.error("[API Watchtower] Server boot failed:", error);
    process.exit(1);
  }
}

bootstrap();