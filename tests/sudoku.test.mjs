import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

function loadGameModule() {
  const exports = {};
  const sandbox = `
    const document = {
      getElementById: () => ({ textContent: '', className: '', appendChild: () => {}, onclick: null, innerHTML: '', setAttribute: () => {} }),
      createElement: () => ({ className: '', textContent: '', appendChild: () => {}, onclick: null, setAttribute: () => {} }),
      addEventListener: () => {}
    };
    const setInterval = () => 0;
    const clearInterval = () => {};
    ${script.replace(/newGame\(\);\s*$/, '')}
    __exports.validPlacement = validPlacement;
    __exports.shuffle = shuffle;
    __exports.fullGrid = fullGrid;
    __exports.countSolutions = countSolutions;
    __exports.makePuzzle = makePuzzle;
  `;
  const runner = new Function('__exports', sandbox);
  runner(exports);
  return exports;
}

const game = loadGameModule();

function isValidSolution(grid) {
  const required = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let row = 0; row < 9; row++) {
    assert.deepEqual(new Set(grid.slice(row * 9, row * 9 + 9)), required);
  }
  for (let col = 0; col < 9; col++) {
    assert.deepEqual(new Set(Array.from({ length: 9 }, (_, row) => grid[row * 9 + col])), required);
  }
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const box = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          box.push(grid[(boxRow * 3 + row) * 9 + boxCol * 3 + col]);
        }
      }
      assert.deepEqual(new Set(box), required);
    }
  }
}

test('shuffle preserves all values', () => {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = game.shuffle([...values]);
  assert.equal(shuffled.length, 9);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), values);
});

test('validPlacement rejects duplicate values in a row, column, and box', () => {
  const grid = Array(81).fill(0);
  grid[0] = 5;
  assert.equal(game.validPlacement(grid, 0, 8, 5), false);
  assert.equal(game.validPlacement(grid, 8, 0, 5), false);
  assert.equal(game.validPlacement(grid, 1, 1, 5), false);
  assert.equal(game.validPlacement(grid, 0, 1, 5), true);
});

test('fullGrid creates a valid completed Sudoku grid', () => {
  const grid = game.fullGrid();
  isValidSolution(grid);
});

test('easy puzzle has 45 givens and one solution', () => {
  const { puzzle, solution } = game.makePuzzle(45);
  const givens = puzzle.filter(value => value !== 0).length;
  assert.equal(givens, 45);
  assert.equal(game.countSolutions([...puzzle]), 1);
  isValidSolution(solution);
});
