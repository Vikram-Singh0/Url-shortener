const express = require("express");
const {
  handleGeneratedNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/", handleGeneratedNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
