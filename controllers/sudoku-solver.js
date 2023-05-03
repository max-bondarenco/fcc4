class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81)
      return {
        valid: false,
        error: "Expected puzzle to be 81 characters long",
      };

    if (/[^1-9.]/.test(puzzleString))
      return {
        valid: false,
        error: "Invalid characters in puzzle",
      };

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let col = 0; col < 9; col++)
      if (puzzleString[row * 9 + col] * 1 == value * 1) return false;

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let rw = 0; rw < 9; rw++)
      if (puzzleString[rw * 9 + column] * 1 == value * 1) return false;

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const col = Math.floor(column / 3) * 3;
    const rw = Math.floor(row / 3) * 3;

    for (let i = rw; i < rw + 3; i++)
      for (let j = col; j < col + 3; j++)
        if (puzzleString[i * 9 + j] * 1 == value * 1) return false;

    return true;
  }

  checkIfAlreadyPresent(puzzleString, row, column, value) {
    return puzzleString[row * 9 + column] * 1 == value * 1;
  }

  solve(puzzleString) {
    const grid = [];

    for (let i = 0; i < 81; i++) {
      const toPush = puzzleString[i] === "." ? -1 : puzzleString[i] * 1;
      grid.push(toPush);
    }

    if (this.solveRecursive(grid, 0, 0)) return { data: grid.join("") };
    return { error: "Puzzle cannot be solved" };
  }

  solveRecursive(puzzleString, row, col) {
    if (row == 8 && col == 9) return true;

    if (col == 9) {
      row++;
      col = 0;
    }

    if (row > 8) return false;

    if (puzzleString[row * 9 + col] !== -1)
      return this.solveRecursive(puzzleString, row, col + 1);

    for (let val = 1; val < 10; val++) {
      const colCheck = this.checkColPlacement(puzzleString, row, col, val);
      const regCheck = this.checkRegionPlacement(puzzleString, row, col, val);
      const rowCheck = this.checkRowPlacement(puzzleString, row, col, val);

      if (colCheck && rowCheck && regCheck) {
        puzzleString[row * 9 + col] = val;
        if (this.solveRecursive(puzzleString, row, col + 1)) return true;
        else {
          puzzleString[row * 9 + col] = -1;
        }
      }
    }

    return false;
  }
}

module.exports = SudokuSolver;
