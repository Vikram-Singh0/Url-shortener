const { v4: uuidv4 } = require("uuid");
const URL = require("../models/url");
async function handleGeneratedNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) return res.status(400).json({ err: "pls enter an url" });
  const shortId = uuidv4().slice(0, 6);
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", {
    id: shortId,
  });
}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  console.log(result);
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
module.exports = {
  handleGeneratedNewShortURL,
  handleGetAnalytics,
};
