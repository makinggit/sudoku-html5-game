# HTML5 Sudoku

A lightweight, single-file Sudoku game built with HTML5, CSS, and vanilla JavaScript. The interface is in Traditional Chinese.

## Live demo

https://makinggit.github.io/sudoku-html5-game/

## Features

- 9x9 Sudoku board with a responsive layout
- Easy puzzles only, with 45 given numbers
- Every puzzle has exactly one solution
- Automatic error checking once all cells are filled
- Manual error checking via the Check button
- Hint counter instead of a mistake counter
- Game timer
- Alternating light/dark shading for the nine 3x3 boxes
- Live gold price (XAU/USD) with a details view
- Light and dark color modes, with the preference saved locally
- Game statistics and recent-game history
- Keyboard and mouse support
- No dependencies, build tools, or backend required

## How to play

1. Open `index.html` in a browser, or visit the live demo.
2. Click an empty cell.
3. Enter a number from 1 to 9 using the on-screen keypad or keyboard. The number appears immediately.
4. Fill every row, column, and 3x3 box with the numbers 1 through 9.
5. When every cell is filled, the game automatically checks your entries; incorrect cells turn red.
6. You can also press **Check** at any time to check the current board manually.
7. Use **Hint** (in the status bar) if you need help; each use increments the hint counter.

## Controls

| Action | Control |
|---|---|
| Select a cell | Click it, or focus it and press `Enter` or `Space` |
| Enter a number | Click 1-9 or press `1`-`9` |
| Clear a cell | Click `⌫`, press `Backspace`, or press `Delete` |
| Check answers | Click **Check**, or fill the last empty cell |
| Get a hint | Click **Hint** in the status bar |
| Start a new puzzle | Click **New Game** |
| Switch color mode | Click **Color** |
| View statistics | Click **Stats** |
| View gold price details | Click the gold price bar |

## Checking answers

The game does **not** highlight errors while you play.

When you fill the last empty cell, the game automatically compares your entries with the puzzle solution. Incorrect cells are highlighted in red, and the message area shows how many incorrect cells were found. Editing or erasing a highlighted cell removes its red highlight and clears the message.

You can also press **Check** at any time to check the current board manually.

## Gold price

The gold price bar shows the live XAU/USD price and its last update time.

- Click the bar to view detailed market information, including change, open/high/low prices, bid/ask, unit conversions, and 24K/22K/18K per-gram prices.
- Prices are cached in the browser to avoid unnecessary API calls.
- The cache is refreshed once per day at 07:00 in your browser's local time.

## Hints

Each use of **Hint** fills one empty cell with its correct value and increments the hint counter shown in the status bar. There is no mistake counter in this game.

## Statistics

Click **Stats** to view:

- Games started
- Games solved
- Completion rate
- Best time
- Average time
- Total hints used
- Total play time
- Recent game history

Statistics and history are stored in the browser using `localStorage`. Use **Clear stats** in the modal to remove them.

## Technical details

- **Language:** HTML5, CSS3, JavaScript (ES6+)
- **Architecture:** Single-page, single-file application
- **Puzzle generation:** Random complete-grid generation with backtracking
- **Solution guarantee:** Removal is validated with a solution-counting solver
- **Gold price data:** GoldAPI.io (XAU/USD)
- **Storage:** `localStorage` for statistics, history, color-mode preference, and gold-price cache
- **Dependencies:** None

## Encoding

All source files use:

- **Character encoding:** UTF-8, without Byte Order Mark (BOM)
- **Line endings:** LF (`\n`)
- **HTML charset declaration:** `<meta charset="utf-8">`

When editing this project, configure your editor to save files as UTF-8 without BOM and use LF line endings to avoid rendering or diff issues.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions test workflow
├── tests/
│   └── sudoku.test.mjs     # Node.js built-in test suite
├── index.html              # Complete Sudoku game
└── README.md               # Project documentation
```

## Testing

Run the test suite locally with Node.js 20 or later:

```bash
node --test tests/sudoku.test.mjs
```

The tests cover:

- Shuffle behavior
- Sudoku placement rules
- Complete-grid generation
- Easy puzzle generation
- Unique-solution validation
- Gold price display and caching

## CI

GitHub Actions runs the test suite on every push and pull request targeting `main`.

The workflow tests the project on:

- Node.js 20
- Node.js 22

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
