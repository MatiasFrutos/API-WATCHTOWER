"use strict";

const { app, BrowserWindow, ipcMain, shell } = require("electron");

function getFocusedWindow() {
  return BrowserWindow.getFocusedWindow();
}

function registerIpcHandlers() {
  ipcMain.handle("app:get-version", () => {
    return app.getVersion();
  });

  ipcMain.handle("app:get-platform", () => {
    return process.platform;
  });

  ipcMain.handle("window:minimize", () => {
    const win = getFocusedWindow();

    if (win) {
      win.minimize();
    }

    return true;
  });

  ipcMain.handle("window:maximize", () => {
    const win = getFocusedWindow();

    if (!win) {
      return false;
    }

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }

    return true;
  });

  ipcMain.handle("window:close", () => {
    const win = getFocusedWindow();

    if (win) {
      win.close();
    }

    return true;
  });

  ipcMain.handle("system:open-external", async (_event, url) => {
    if (!url || typeof url !== "string") {
      return false;
    }

    await shell.openExternal(url);
    return true;
  });
}

module.exports = {
  registerIpcHandlers
};