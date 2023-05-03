const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const app = require("../app");

chai.use(chaiHttp);

suite("Functional Tests", () => {});

after(() => {
  chai.request(app).get("/");
});
