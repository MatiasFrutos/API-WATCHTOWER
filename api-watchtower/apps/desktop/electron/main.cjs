"use strict";

const { app } = require("electron");
const path = require("path");

const { createMainWindow } = require("./window-manager.cjs");
const { registerIpcHandlers } = require("./ipc-handlers.cjs");
const { startLocalServer, stopLocalServer } = require("./server-manager.cjs");

let mainWindow = null;

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

app.setName("API Watchtower");

async function bootstrap() {
  registerIpcHandlers();

  if (!isDev) {
    await startLocalServer();
  }

  mainWindow = await createMainWindow({
    isDev,
    preloadPath: path.join(__dirname, "preload.cjs")
  });
}

app.whenReady().then(bootstrap);

app.on("activate", async () => {
  if (mainWindow === null) {
    mainWindow = await createMainWindow({
      isDev,
      preloadPath: path.join(__dirname, "preload.cjs")
    });
  }
});

app.on("window-all-closed", async () => {
  await stopLocalServer();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async () => {
  await stopLocalServer();
});