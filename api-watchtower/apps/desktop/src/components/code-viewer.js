"use strict";

export function renderCodeViewer(value = "", language = "json") {
  const safeValue = String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  return `
    <pre class="aw-code-viewer" data-language="${language}"><code>${safeValue}</code></pre>
  `;
}