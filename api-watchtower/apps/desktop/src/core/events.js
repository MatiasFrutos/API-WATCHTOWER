"use strict";

export function emitAppEvent(name, detail = {}) {
  window.dispatchEvent(
    new CustomEvent(`api-watchtower:${name}`, {
      detail
    })
  );
}

export function onAppEvent(name, handler) {
  const eventName = `api-watchtower:${name}`;

  window.addEventListener(eventName, handler);

  return () => {
    window.removeEventListener(eventName, handler);
  };
}