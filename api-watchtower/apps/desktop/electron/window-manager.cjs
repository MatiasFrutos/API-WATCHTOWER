"use strict";

const path = require("path");
const { BrowserWindow, shell } = require("electron");

async function createMainWindow({ isDev, preloadPath }) {
  const mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: "API Watchtower",
    backgroundColor: "#0f172a",
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    await mainWindow.loadURL("http://127.0.0.1:5173");
  } else {
    await mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  mainWindow.on("closed", () => {
    return null;
  });

  return mainWindow;
}

module.exports = {
  createMainWindow
};