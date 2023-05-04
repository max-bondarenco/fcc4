const express = require("express");
const cors = require("cors");

const fccTestingRoutes = require("./routes/fcctesting.js");
const apiRoutes = require("./routes/api.js");

const app = express();

app.use("/public", express.static(`${__dirname}/public`));
app.use(cors({ origin: "*" })); //For FCC testing purposes only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(`${__dirname}/views/index.html`);
});

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Error handling middleware
app.use(function (err, req, res, next) {
  if (err.custom)
    return res.status(err.statusCode).json({ error: err.message });
  console.log(err);
});

module.exports = app; // for testing
