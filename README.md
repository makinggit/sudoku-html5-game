# HTML5 Sudoku

A lightweight, single-file Sudoku game built with HTML5, CSS, and vanilla JavaScript.

## Live demo

https://makinggit.github.io/sudoku-html5-game/

## Features

- 9x9 Sudoku board with a responsive layout
- Always generates an easy puzzle with 45 given numbers
- Every puzzle has exactly one solution
- Manual error checking via the Check button
- Hint reveals one correct value
- Game timer and mistake counter
- Keyboard and mouse support
- No dependencies, build tools, or backend required

## How to play

1. Open `index.html` in a browser, or visit the live demo.
2. Click an empty cell.
3. Enter a number from 1 to 9 using the on-screen keypad or keyboard.
4. Fill every row, column, and 3x3 box with the numbers 1 through 9.
5. Use **Check** to identify incorrect entries; incorrect cells turn red.
6. Use **Hint** if you need help.

## Controls

| Action | Control |
|---|---|
| Select a cell | Click it |
| Enter a number | Click 1-9 or press `1`-`9` |
| Clear a cell | Click `⌫`, press `Backspace`, or press `Delete` |
| Check answers | Click **Check** |
| Get a hint | Click **Hint** |
| Start a new puzzle | Click **New Game** |

## Checking answers

The game does **not** automatically validate entries while you play.

Press **Check** to compare your current entries with the puzzle solution. Incorrect cells are highlighted in red, and the message area shows how many incorrect cells were found. Editing or erasing a highlighted cell removes its red highlight; press **Check** again to recheck the board.

## Technical details

- **Language:** HTML5, CSS3, JavaScript (ES6+)
- **Architecture:** Single-page, single-file application
- **Puzzle generation:** Random complete-grid generation with backtracking
- **Solution guarantee:** Removal is validated with a solution-counting solver
- **Storage:** None; game state is held in memory
- **Dependencies:** None

## Project structure

```text
.
├── index.html   # Complete Sudoku game
└── README.md    # Project documentation
```

## Run locally

Clone the repository:

```bash
git clone https://github.com/makinggit/sudoku-html5-game.git
cd sudoku-html5-game
```

Open `index.html` directly in your browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then open: http://localhost:8000

## Browser support

Works in modern versions of Chrome, Edge, Firefox, and Safari.

## License

MIT License.
