"use strict";

import { apiClient } from "../core/api.client.js";

export const historyService = {
  list() {
    return apiClient.get("/history");
  },

  clear() {
    return apiClient.delete("/history");
  }
};