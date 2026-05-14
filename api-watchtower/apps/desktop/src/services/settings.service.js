"use strict";

import { apiClient } from "../core/api.client.js";

export const settingsService = {
  get() {
    return apiClient.get("/settings");
  },

  update(payload) {
    return apiClient.put("/settings", payload);
  }
};