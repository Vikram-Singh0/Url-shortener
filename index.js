const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./Middlewares/auth");
const app = express();
const PORT = 7000;

//Connection to mongoDb
connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner")
  .then(() => {
    console.log("Mongodb connected sucessfully");
  })
  .catch((err) => {
    console.log("Error in connecting mongoDb", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
