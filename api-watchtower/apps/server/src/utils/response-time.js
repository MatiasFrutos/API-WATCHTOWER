"use strict";

function nowMs() {
  return Number(process.hrtime.bigint() / 1000000n);
}

function createTimer() {
  const start = nowMs();

  return {
    stop() {
      return nowMs() - start;
    }
  };
}

module.exports = {
  createTimer
};