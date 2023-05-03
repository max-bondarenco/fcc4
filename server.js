require("dotenv").config();

const app = require("./app");
const runner = require("./test-runner");

//Start our server and tests!
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});
