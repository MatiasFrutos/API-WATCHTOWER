"use strict";

import { apiClient } from "../core/api.client.js";

export const endpointsService = {
  list(projectId = "") {
    const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
    return apiClient.get(`/endpoints${query}`);
  },

  create(payload) {
    return apiClient.post("/endpoints", payload);
  },

  update(id, payload) {
    return apiClient.put(`/endpoints/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`/endpoints/${id}`);
  }
};