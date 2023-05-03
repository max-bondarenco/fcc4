"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/AppError");

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route("/api/check").post(
    catchAsync(async (req, res, next) => {
      if (!req.body.coordinate || !req.body.value || !req.body.puzzle)
        return next(new AppError(400, "Required field(s) missing"));

      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (isNaN(value) || value > 9 || value < 1)
        return next(new AppError(400, "Invalid value"));

      const validate = solver.validate(puzzleString);
      if (!validate.valid) return next(new AppError(400, validate.error));

      const row = coordinate.toUpperCase().charCodeAt(0) - 64;
      const col = coordinate.substring(1) * 1;
      if (row > 9 || row < 1 || col > 9 || col < 1)
        return next(new AppError(400, "Invalid coordinate"));

      if (solver.checkIfAlreadyPresent(puzzleString, row - 1, col - 1, value))
        return res.status(200).json({ valid: true });

      const conflict = [];
      if (!solver.checkRowPlacement(puzzleString, row - 1, col - 1, value))
        conflict.push("row");
      if (!solver.checkColPlacement(puzzleString, row - 1, col - 1, value))
        conflict.push("column");
      if (!solver.checkRegionPlacement(puzzleString, row - 1, col - 1, value))
        conflict.push("region");

      if (conflict.length != 0)
        return res.status(200).json({
          valid: false,
          conflict,
        });

      res.status(200).json({ valid: true });
    })
  );

  app.route("/api/solve").post(
    catchAsync(async (req, res, next) => {
      const puzzle = req.body.puzzle;

      if (!puzzle) return next(new AppError(400, "Required field missing"));

      const result = solver.solve(puzzle);
      if (result.error) return next(new AppError(400, result.error));

      res.status(200).json({
        solution: result.data,
      });
    })
  );
};
