"use strict";

import { apiClient } from "../core/api.client.js";

export const projectsService = {
  list() {
    return apiClient.get("/projects");
  },

  create(payload) {
    return apiClient.post("/projects", payload);
  },

  update(id, payload) {
    return apiClient.put(`/projects/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`/projects/${id}`);
  }
};