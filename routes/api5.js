const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

// Env vars
const API_BASE_URL = process.env.API_BASE_URL_5;
const API_KEY_NAME = process.env.API_KEY_NAME_5;
const API_KEY_VALUE = process.env.API_KEY_VALUE_5;

// Init cache
let cache = apicache.middleware;

router.get("/", cache("5 seconds"), async (req, res, next) => {
  try {
    const { location } = req.query;

    const params = new URLSearchParams({
      // query: location,
      [API_KEY_NAME]: API_KEY_VALUE,

      unitGroup: "metric",

      contentType: "json",
    });

    // const apiRes = await needle('get', `${API_BASE_URL}?${params}`)

    const apiRes = await needle("get", `${API_BASE_URL}/${location}?${params}`);
    const data = apiRes.body;

    // Log the request to the public API
    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
