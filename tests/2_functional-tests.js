const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const app = require("../app");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Testing /api/solve", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(app)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(
            res.body.solution,
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
          );
        });

      done();
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(app)
        .post("/api/solve")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
        });

      done();
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
      chai
        .request(app)
        .post("/api/solve")
        .send({
          puzzle:
            "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
        });

      done();
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
      chai
        .request(app)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
        });

      done();
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
      chai
        .request(app)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.375",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Puzzle cannot be solved");
        });

      done();
    });
  });

  suite("Testing /api/check", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: 3,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);
        });

      done();
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: 9,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 1);
        });

      done();
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: 1,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 2);
        });

      done();
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 3);
        });

      done();
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
        });

      done();
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5..a..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
        });

      done();
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
          coordinate: "A2",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
        });

      done();
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "K17",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
        });

      done();
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
      chai
        .request(app)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2",
          value: "A",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
        });

      done();
    });
  });
});

after(() => {
  chai.request(app).get("/");
});
