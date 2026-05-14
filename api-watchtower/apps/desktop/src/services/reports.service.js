"use strict";

import { apiClient } from "../core/api.client.js";

export const reportsService = {
  summary() {
    return apiClient.get("/reports/summary");
  }
};