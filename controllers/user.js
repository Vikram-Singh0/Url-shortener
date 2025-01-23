const user = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../Service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await user.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const User = await user.findOne({ email, password });
  if (!User) {
    return res.render("login", {
      error: "Invalid Username or Password",
    });
  }

  const sessionId = uuidv4();
  setUser(sessionId, User);
  res.cookie("uid", sessionId);
  return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
