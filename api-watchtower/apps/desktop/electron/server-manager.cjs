"use strict";

const path = require("path");
const { spawn } = require("child_process");

let serverProcess = null;

function getServerEntry() {
  return path.join(__dirname, "..", "..", "server", "src", "server.js");
}

function startLocalServer() {
  return new Promise((resolve) => {
    if (serverProcess) {
      resolve(true);
      return;
    }

    const serverEntry = getServerEntry();

    serverProcess = spawn(process.execPath, [serverEntry], {
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: process.env.PORT || "3567"
      },
      stdio: "pipe",
      windowsHide: true
    });

    serverProcess.stdout.on("data", (data) => {
      console.log(`[API Watchtower Server] ${String(data).trim()}`);
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`[API Watchtower Server Error] ${String(data).trim()}`);
    });

    serverProcess.on("exit", () => {
      serverProcess = null;
    });

    setTimeout(() => {
      resolve(true);
    }, 700);
  });
}

function stopLocalServer() {
  return new Promise((resolve) => {
    if (!serverProcess) {
      resolve(true);
      return;
    }

    serverProcess.kill();
    serverProcess = null;
    resolve(true);
  });
}

module.exports = {
  startLocalServer,
  stopLocalServer
};