"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("apiWatchtower", {
  app: {
    getVersion: () => ipcRenderer.invoke("app:get-version"),
    getPlatform: () => ipcRenderer.invoke("app:get-platform")
  },

  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    close: () => ipcRenderer.invoke("window:close")
  },

  system: {
    openExternal: (url) => ipcRenderer.invoke("system:open-external", url)
  }
});