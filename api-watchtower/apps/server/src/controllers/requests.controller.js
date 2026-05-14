"use strict";

const service = require("../services/requests.service");

async function send(req, res, next) {
  try {
    const result = await service.sendRequest(req.body);

    res.json({
      ok: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  send
};