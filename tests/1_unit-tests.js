const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    const result = solver.validate(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    );
    assert.property(result, "valid");
    assert.equal(result.valid, true);
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    const result = solver.validate(
      "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    );
    assert.property(result, "valid");
    assert.equal(result.valid, false);
    assert.property(result, "error");
    assert.equal(result.error, "Invalid characters in puzzle");
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    const result = solver.validate(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37"
    );
    assert.property(result, "valid");
    assert.equal(result.valid, false);
    assert.property(result, "error");
    assert.equal(result.error, "Expected puzzle to be 81 characters long");
    done();
  });

  test("Logic handles a valid row placement", function (done) {
    const result = solver.checkRowPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      3
    );
    assert.equal(result, true);
    done();
  });

  test("Logic handles an invalid row placement", function (done) {
    const result = solver.checkRowPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      1
    );
    assert.equal(result, false);
    done();
  });

  test("Logic handles a valid column placement", function (done) {
    const result = solver.checkColPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      3
    );
    assert.equal(result, true);
    done();
  });

  test("Logic handles an invalid column placement", function (done) {
    const result = solver.checkColPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      2
    );
    assert.equal(result, false);
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    const result = solver.checkRegionPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      3
    );
    assert.equal(result, true);
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    const result = solver.checkRegionPlacement(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      0,
      1,
      1
    );
    assert.equal(result, false);
    done();
  });

  test("Valid puzzle strings pass the solver", function (done) {
    const result = solver.solve(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    );
    assert.property(result, "data");
    done();
  });

  test("Invalid puzzle strings fail the solver", function (done) {
    const result = solver.solve(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a"
    );
    assert.property(result, "error");
    assert.equal(result.error, "Invalid characters in puzzle");
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    const result = solver.solve(
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    );
    assert.property(result, "data");
    assert.equal(
      result.data,
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
    );
    done();
  });
});
