(function (global) {
	'use strict';

const $ = (id) => document.getElementById(id);
const BOARD_SIZE = 9;
const CELL_COUNT = 81;
const EASY_CLUES = 45;
const STATS_KEY = "sudoku-html5-game-stats";
const COLOR_KEY = "sudoku-html5-game-color-mode";
const MAX_HISTORY = 10;
const GOLD_CACHE_KEY = "sudoku-html5-game-gold-cache";
const GOLD_REFRESH_MS = 1800000;
const METALS = [
	{ key: "XAU", name: "黃金", api: "https://api.gold-api.com/price/XAU/USD" },
	{ key: "XPT", name: "鉑金", api: "https://api.gold-api.com/price/XPT/USD" },
	{ key: "XPD", name: "鈀金", api: "https://api.gold-api.com/price/XPD/USD" },
	{ key: "XAG", name: "白銀", api: "https://api.gold-api.com/price/XAG/USD" }
];
const pad = $("pad");
const messageEl = $("message");
const cells = Array.from({ length: CELL_COUNT }, (_, index) => $(`cell-${index}`));
const padButtons = Array.from(pad.querySelectorAll("button"));
const historyItems = Array.from(document.querySelectorAll(".history-item"));
const historyEmpty = $("history-empty");
const confettiPieces = Array.from(document.querySelectorAll(".confetti"));

const QUOTES = [
["天行健，君子以自強不息；地勢坤，君子以厚德載物。", "《周易》"],
["學而時習之，不亦說乎？", "《論語》"],
["己所不欲，勿施於人。", "《論語》"],
["三人行，必有我師焉。", "《論語》"],
["知之為知之，不知為不知，是知也。", "《論語》"],
["士不可以不弘毅，任重而道遠。", "《論語》"],
["見賢思齊焉，見不賢而內自省也。", "《論語》"],
["君子和而不同，小人同而不和。", "《論語》"],
["工欲善其事，必先利其器。", "《論語》"],
["人無遠慮，必有近憂。", "《論語》"],
["歲寒，然後知松柏之後彫也。", "《論語》"],
["君子坦蕩蕩，小人長戚戚。", "《論語》"],
["過而不改，是謂過矣。", "《論語》"],
["欲速則不達，見小利則大事不成。", "《論語》"],
["躬自厚而薄責於人，則遠怨矣。", "《論語》"],
["老吾老，以及人之老；幼吾幼，以及人之幼。", "《孟子》"],
["富貴不能淫，貧賤不能移，威武不能屈。", "《孟子》"],
["天將降大任於是人也，必先苦其心志，勞其筋骨。", "《孟子》"],
["生於憂患，死於安樂。", "《孟子》"],
["盡信書，則不如無書。", "《孟子》"],
["民為貴，社稷次之，君為輕。", "《孟子》"],
["窮則獨善其身，達則兼善天下。", "《孟子》"],
["人有不為也，而後可以有為。", "《孟子》"],
["愛人者，人恆愛之；敬人者，人恆敬之。", "《孟子》"],
["自勝者強，知足者富。", "《老子》"],
["千里之行，始於足下。", "《老子》"],
["上善若水，水善利萬物而不爭。", "《老子》"],
["知人者智，自知者明。", "《老子》"],
["大直若屈，大巧若拙，大辯若訥。", "《老子》"],
["禍兮福之所倚，福兮禍之所伏。", "《老子》"],
["合抱之木，生於毫末；九層之臺，起於累土。", "《老子》"],
["夫唯不爭，故天下莫能與之爭。", "《老子》"],
["知足不辱，知止不殆。", "《老子》"],
["天道無親，常與善人。", "《老子》"],
["靜勝躁，寒勝熱。", "《老子》"],
["至人無己，神人無功，聖人無名。", "《莊子》"],
["吾生也有涯，而知也無涯。", "《莊子》"],
["君子之交淡若水，小人之交甘若醴。", "《莊子》"],
["天地與我並生，而萬物與我為一。", "《莊子》"],
["安時而處順，哀樂不能入也。", "《莊子》"],
["路漫漫其修遠兮，吾將上下而求索。", "《離騷》"],
["亦余心之所善兮，雖九死其猶未悔。", "《離騷》"],
["尺有所短，寸有所長。", "《楚辭》"],
["滿招損，謙受益。", "《尚書》"],
["民惟邦本，本固邦寧。", "《尚書》"],
["好問則裕，自用則小。", "《尚書》"],
["天視自我民視，天聽自我民聽。", "《尚書》"],
["博學之，審問之，慎思之，明辨之，篤行之。", "《中庸》"],
["誠者，天之道也；誠之者，人之道也。", "《中庸》"],
["凡事豫則立，不豫則廢。", "《中庸》"],
["君子慎其獨也。", "《中庸》"],
["大學之道，在明明德，在親民，在止於至善。", "《大學》"],
["物有本末，事有終始，知所先後，則近道矣。", "《大學》"],
["苟日新，日日新，又日新。", "《大學》"],
["修身齊家治國平天下。", "《大學》"],
["君子務本，本立而道生。", "《論語》"],
["君子喻於義，小人喻於利。", "《論語》"],
["君子成人之美，不成人之惡。", "《論語》"],
["君子欲訥於言而敏於行。", "《論語》"],
["君子恥其言而過其行。", "《論語》"],
["君子求諸己，小人求諸人。", "《論語》"],
["君子泰而不驕，小人驕而不泰。", "《論語》"],
["君子貞而不諒。", "《論語》"],
["君子義以為上。", "《論語》"],
["君子周而不比，小人比而不周。", "《論語》"],
["君子不以言舉人，不以人廢言。", "《論語》"],
["君子病無能焉，不病人之不己知也。", "《論語》"],
["君子謀道不謀食。", "《論語》"],
["君子憂道不憂貧。", "《論語》"],
["君子有三戒：戒色、戒鬥、戒得。", "《論語》"],
["君子有九思：視思明，聽思聰，色思溫。", "《論語》"],
["君子不器。", "《論語》"],
["君子矜而不爭，群而不黨。", "《論語》"],
["君子貞而不諒，貞者正也。", "《論語》"],
["君子不重則不威，學則不固。", "《論語》"],
["君子篤於親，則民興於仁。", "《論語》"],
["君子懷德，小人懷土。", "《論語》"],
["君子懷刑，小人懷惠。", "《論語》"],
["君子先行其言而後從之。", "《論語》"],
["君子周急不繼富。", "《論語》"],
["君子無所爭，必也射乎。", "《論語》"],
["君子居之，何陋之有？", "《論語》"],
["君子居易以俟命，小人行險以徼幸。", "《中庸》"],
["君子素其位而行，不願乎其外。", "《中庸》"],
["君子之道，辟如行遠必自邇。", "《中庸》"],
["君子之道，淡而不厭，簡而文，溫而理。", "《中庸》"],
["君子內省不疚，無惡於志。", "《中庸》"],
["君子戒慎乎其所不睹，恐懼乎其所不聞。", "《中庸》"],
["君子不可以不修身；思修身，不可以不事親。", "《中庸》"],
["君子動而世為天下道，行而世為天下法。", "《中庸》"],
["君子尊德性而道問學。", "《中庸》"],
["君子敦厚以崇禮。", "《中庸》"],
["君子篤恭而天下平。", "《中庸》"],
];

let puzzle = [];
let solution = [];
let current = [];
let selected = null;
let hintsUsed = 0;
let startTime = null;
let timerId = null;
let solved = false;
let checked = false;

function idx(row, col) {
	return row * BOARD_SIZE + col;
}
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function showQuote() {
	const [quote, source] = QUOTES[Math.floor(Math.random() * QUOTES.length)];
	$("quote-text").textContent = `${quote} ${source}`;
}
function validPlacement(grid, row, col, value) {
	for (let i = 0; i < BOARD_SIZE; i++) {
		if (i !== col && grid[idx(row, i)] === value) return false;
		if (i !== row && grid[idx(i, col)] === value) return false;
	}
	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	for (let r = boxRow; r < boxRow + 3; r++) {
		for (let c = boxCol; c < boxCol + 3; c++) {
			if ((r !== row || c !== col) && grid[idx(r, c)] === value) return false;
		}
	}
	return true;
}
function fullGrid() {
	const grid = Array(CELL_COUNT).fill(0);
	function fill(position) {
		if (position === CELL_COUNT) return true;
		const row = Math.floor(position / BOARD_SIZE);
		const col = position % BOARD_SIZE;
		for (const value of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
			if (validPlacement(grid, row, col, value)) {
				grid[position] = value;
				if (fill(position + 1)) return true;
				grid[position] = 0;
			}
		}
		return false;
	}
	fill(0);
	return grid;
}
function countSolutions(grid, limit = 2) {
	let count = 0;
	function search() {
		for (let position = 0; position < CELL_COUNT; position++) {
			if (!grid[position]) {
				const row = Math.floor(position / BOARD_SIZE);
				const col = position % BOARD_SIZE;
				for (let value = 1; value <= BOARD_SIZE; value++) {
					if (validPlacement(grid, row, col, value)) {
						grid[position] = value;
						search();
						grid[position] = 0;
						if (count >= limit) return;
					}
				}
				return;
			}
		}
		count++;
	}
	search();
	return count;
}
function makePuzzle(clueCount) {
	const grid = fullGrid();
	const solutionGrid = [...grid];
	const positions = shuffle([...Array(CELL_COUNT).keys()]);
	let removed = 0;
	for (const position of positions) {
		if (removed >= CELL_COUNT - clueCount) break;
		const backup = grid[position];
		grid[position] = 0;
		if (countSolutions([...grid]) !== 1) grid[position] = backup;
		else removed++;
	}
	return { puzzle: grid, solution: solutionGrid };
}
function loadStats() {
	try {
		const parsed = JSON.parse(localStorage.getItem(STATS_KEY));
		return {
			gamesStarted: parsed?.gamesStarted || 0,
			gamesSolved: parsed?.gamesSolved || 0,
			bestTimeSeconds: parsed?.bestTimeSeconds || null,
			totalTimeSeconds: parsed?.totalTimeSeconds || 0,
			totalHints: parsed?.totalHints || 0,
			history: Array.isArray(parsed?.history) ? parsed.history : []
		};
	} catch {
		return { gamesStarted: 0, gamesSolved: 0, bestTimeSeconds: null, totalTimeSeconds: 0, totalHints: 0, history: [] };
	}
}
function saveStats(stats) {
	try {
		localStorage.setItem(STATS_KEY, JSON.stringify(stats));
	} catch {}
}
function recordGameStarted() {
	const stats = loadStats();
	stats.gamesStarted++;
	saveStats(stats);
}
function recordGameSolved() {
	const seconds = Math.floor((Date.now() - startTime) / 1000);
	const stats = loadStats();
	stats.gamesSolved++;
	stats.totalTimeSeconds += seconds;
	stats.totalHints += hintsUsed;
	if (stats.bestTimeSeconds === null || seconds < stats.bestTimeSeconds) stats.bestTimeSeconds = seconds;
	stats.history.unshift({ completedAt: new Date().toISOString(), timeSeconds: seconds, hints: hintsUsed });
	stats.history = stats.history.slice(0, MAX_HISTORY);
	saveStats(stats);
}
function formatTime(seconds) {
	return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function elapsedTime() {
	return formatTime(Math.floor((Date.now() - startTime) / 1000));
}
function formatGoldTime(timestamp) {
	const date = new Date(timestamp);
	const pad = (value) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function setMessage(text, type = "") {
	messageEl.textContent = text;
	messageEl.className = `message${type ? ` ${type}` : ""}`;
}
function updateThemeColor() {
	const themeColorMeta = document.querySelector('meta[name="theme-color"]');
	if (themeColorMeta) {
		themeColorMeta.setAttribute("content", document.body.classList.contains("light-mode") ? "#f1f5f9" : "#0f172a");
	}
}
function renderCell(position) {
	const row = Math.floor(position / BOARD_SIZE);
	const col = position % BOARD_SIZE;
	const cell = cells[position];
	const value = current[position];
	const boxAlt = (Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 1;
	const isError = checked && value && value !== solution[position];
	cell.textContent = value ? String(value) : "";
	cell.className = [
		"cell",
		boxAlt ? "box-alt" : "",
		col % 3 === 2 && col !== 8 ? "b-right" : "",
		row % 3 === 2 && row !== 8 ? "b-bottom" : "",
		puzzle[position] ? "given" : "",
		position === selected ? "selected" : "",
		isError ? "error" : ""
	].filter(Boolean).join(" ");
	cell.setAttribute("aria-label", `第 ${row + 1} 列，第 ${col + 1} 欄${value ? `，${value}` : ""}`);
}
function render() {
	for (let position = 0; position < CELL_COUNT; position++) renderCell(position);
}
function showCelebration() {
	const seconds = Math.floor((Date.now() - startTime) / 1000);
	$("celebration-message").textContent = `你在 ${formatTime(seconds)} 內完成，使用提示 ${hintsUsed} 次。`;
	$("celebration").classList.add("open");
	const colors = ["#38bdf8", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c"];
	confettiPieces.forEach((piece, index) => {
		piece.style.left = `${Math.random() * 100}%`;
		piece.style.background = colors[index % colors.length];
		piece.style.animationDelay = `${Math.random() * 0.8}s`;
		piece.style.animationDuration = `${2.2 + Math.random() * 1.4}s`;
		piece.hidden = false;
	});
	setTimeout(() => {
		confettiPieces.forEach((piece) => {
			piece.hidden = true;
		});
	}, 4200);
}
function finishGame() {
	solved = true;
	clearInterval(timerId);
	recordGameSolved();
	setMessage(`完成！時間：${elapsedTime()}`, "success");
	$("timer").style.visibility = "hidden";
	showCelebration();
}
function checkIncorrect() {
	checked = true;
	const incorrect = current.reduce(
		(total, entry, position) => total + (entry && entry !== solution[position] ? 1 : 0),
		0
	);
	setMessage(incorrect ? `有 ${incorrect} 個錯誤格子。` : "目前沒有錯誤。", incorrect ? "error" : "info");
	render();
}
function input(value) {
	if (selected === null || solved || puzzle[selected]) return;
	current[selected] = value;
	checked = false;
	setMessage("", "");
	if (current.every((entry, index) => entry === solution[index])) finishGame();
	else if (current.every((entry) => entry !== 0)) checkIncorrect();
	render();
}
function eraseSelected() {
	if (selected !== null && !puzzle[selected]) {
		current[selected] = 0;
		checked = false;
		setMessage("", "");
		render();
	}
}
function newGame(countStart = true) {
	const result = makePuzzle(EASY_CLUES);
	puzzle = result.puzzle;
	solution = result.solution;
	current = [...puzzle];
	selected = null;
	hintsUsed = 0;
	solved = false;
	checked = false;
	$("timer").style.visibility = "visible";
	$("timer").textContent = "00:00";
	$("hint").textContent = "提示：0";
	setMessage("", "");
	startTimer();
	if (countStart) recordGameStarted();
	showQuote();
	render();
}
function startTimer() {
	clearInterval(timerId);
	startTime = Date.now();
	timerId = setInterval(() => {
		$("timer").textContent = elapsedTime();
	}, 1000);
}
function metalCacheKey(metalKey) {
	return `${GOLD_CACHE_KEY}-${metalKey}`;
}
function readGoldCache(metalKey) {
	try {
		return JSON.parse(localStorage.getItem(metalCacheKey(metalKey)));
	} catch {
		return null;
	}
}
function writeGoldCache(metalKey, data) {
	try {
		localStorage.setItem(metalCacheKey(metalKey), JSON.stringify({ data, fetchedAt: Date.now() }));
	} catch {}
}
function renderGold(metal, data) {
	const priceEl = $(`gold-price-${metal.key}`);
	if (data && typeof data.price === "number") {
		const decimals = metal.key === "XAG" ? 4 : 2;
		priceEl.textContent = `$${data.price.toFixed(decimals)}`;
		priceEl.title = `更新於 ${formatGoldTime(data.fetchedAt)}`;
		priceEl.classList.remove("pop");
		void priceEl.offsetWidth;
		priceEl.classList.add("pop");
	} else {
		priceEl.textContent = "按此更新";
		priceEl.title = "";
		priceEl.classList.remove("pop");
	}
}
function fetchGoldPrice(metal, force = false) {
	const cache = readGoldCache(metal.key);
	if (!force && cache?.data && Date.now() - cache.fetchedAt < GOLD_REFRESH_MS) {
		renderGold(metal, cache.data);
		return;
	}
	if (typeof fetch !== "function") return;
	fetch(metal.api)
		.then((response) => {
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			return response.json();
		})
		.then((data) => {
			if (data && typeof data.price === "number") {
				const enriched = { ...data, fetchedAt: Date.now() };
				writeGoldCache(metal.key, enriched);
				renderGold(metal, enriched);
			} else {
				renderGold(metal, null);
			}
		})
		.catch(() => {
			renderGold(metal, readGoldCache(metal.key)?.data || null);
		});
}
function renderStats() {
	const stats = loadStats();
	const average = stats.gamesSolved ? Math.round(stats.totalTimeSeconds / stats.gamesSolved) : null;
	const completionRate = stats.gamesStarted ? Math.round((stats.gamesSolved / stats.gamesStarted) * 100) : 0;
	$("stat-started").textContent = String(stats.gamesStarted);
	$("stat-solved").textContent = String(stats.gamesSolved);
	$("stat-completion").textContent = `${completionRate}%`;
	$("stat-best").textContent = stats.bestTimeSeconds === null ? "—" : formatTime(stats.bestTimeSeconds);
	$("stat-average").textContent = average === null ? "—" : formatTime(average);
	$("stat-hints").textContent = String(stats.totalHints);
	$("stat-total-time").textContent = formatTime(stats.totalTimeSeconds);
	$("history-empty").hidden = stats.history.length > 0;
	stats.history.forEach((entry, index) => {
		const item = historyItems[index];
		if (!item) return;
		item.hidden = false;
		item.querySelector(".history-date").textContent = new Date(entry.completedAt).toLocaleString();
		item.querySelector(".history-meta").textContent = `${formatTime(entry.timeSeconds)} · ${entry.hints} 次提示`;
	});
	for (let index = stats.history.length; index < historyItems.length; index++) {
		historyItems[index].hidden = true;
	}
}
function openStats() {
	renderStats();
	$("stats-modal").classList.add("open");
}
function closeStats() {
	$("stats-modal").classList.remove("open");
}
function init() {
	cells.forEach((cell, position) => {
		cell.addEventListener("click", () => {
			if (puzzle[position]) return;
			selected = position;
			render();
		});
		cell.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				if (puzzle[position]) return;
				selected = position;
				render();
			}
		});
	});
	padButtons.forEach((button) => {
		const value = Number(button.dataset.value);
		button.addEventListener("click", () => {
			if (value === 0) eraseSelected();
			else input(value);
		});
	});
	$("new").addEventListener("click", () => {
		if (solved || confirm("開始新遊戲？")) newGame();
	});
	$("check").addEventListener("click", checkIncorrect);
	$("hint").addEventListener("click", () => {
		if (solved) return;
		const emptyPositions = current.map((entry, position) => entry ? null : position).filter((position) => position !== null);
		if (!emptyPositions.length) return;
		const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
		current[position] = solution[position];
		selected = position;
		checked = false;
		setMessage("", "");
		hintsUsed++;
		$("hint").textContent = `提示：${hintsUsed}`;
		if (current.every((entry, index) => entry === solution[index])) finishGame();
		else if (current.every((entry) => entry !== 0)) checkIncorrect();
		render();
	});
	$("color-mode").addEventListener("click", () => {
		document.body.classList.toggle("light-mode");
		try {
			localStorage.setItem(COLOR_KEY, document.body.classList.contains("light-mode") ? "light" : "dark");
		} catch {}
		updateThemeColor();
	});
	try {
		if (localStorage.getItem(COLOR_KEY) === "light") document.body.classList.add("light-mode");
	} catch {}
	updateThemeColor();
	$("quote").addEventListener("click", showQuote);
	$("quote").addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			showQuote();
		}
	});
	METALS.forEach((metal) => {
		const button = $(`gold-metal-${metal.key}`);
		button.addEventListener("click", () => fetchGoldPrice(metal, true));
		fetchGoldPrice(metal);
	});
	setInterval(() => {
		METALS.forEach((metal) => {
			const cache = readGoldCache(metal.key);
			if (!cache?.data || Date.now() - cache.fetchedAt >= GOLD_REFRESH_MS) fetchGoldPrice(metal, true);
		});
	}, 60000);
	$("stats").addEventListener("click", openStats);
	$("close-stats").addEventListener("click", closeStats);
	$("clear-stats").addEventListener("click", () => {
		if (confirm("清除所有已儲存的數獨統計與紀錄？")) {
			localStorage.removeItem(STATS_KEY);
			renderStats();
		}
	});
	$("stats-modal").addEventListener("click", (event) => {
		if (event.target === $("stats-modal")) closeStats();
	});
	$("close-celebration").addEventListener("click", () => {
		$("celebration").classList.remove("open");
		confettiPieces.forEach((piece) => {
			piece.hidden = true;
		});
	});
	$("celebration").addEventListener("click", (event) => {
		if (event.target === $("celebration")) {
			$("celebration").classList.remove("open");
			confettiPieces.forEach((piece) => {
				piece.hidden = true;
			});
		}
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeStats();
			$("celebration").classList.remove("open");
			return;
		}
		if (event.key >= "1" && event.key <= "9") input(Number(event.key));
		if (event.key === "Backspace" || event.key === "Delete") eraseSelected();
	});
}

global.SudokuGameMain = {
	newGame,
	validPlacement,
	shuffle,
	fullGrid,
	countSolutions,
	makePuzzle,
	init
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})(window);