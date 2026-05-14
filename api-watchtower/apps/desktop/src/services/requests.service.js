"use strict";

import { apiClient } from "../core/api.client.js";

export const requestsService = {
  send(payload) {
    return apiClient.post("/requests/send", payload, {
      timeout: payload?.timeout || 30000
    });
  }
};