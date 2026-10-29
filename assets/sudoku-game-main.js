(function (global) {
	'use strict';

const $ = (id) => document.getElementById(id);
const BOARD_SIZE = 9,
CELL_COUNT = 81,
EASY_CLUES = 45,
STATS_KEY = "sudoku-html5-game-stats",
COLOR_KEY = "sudoku-html5-game-color-mode",
MAX_HISTORY = 10,
GOLD_API = "https://www.goldapi.io/api/price/XAU/USD",
GOLD_API_KEY = "goldapi-cd2463b5a72f05b7f0a514139fb37d27-io",
GOLD_CACHE_KEY = "sudoku-html5-game-gold-cache",
GOLD_REFRESH_MS = 21600000,
GOLD_DAILY_HOUR = 7,
board = $("board"),
pad = $("pad"),
messageEl = $("message"),
colorModeButton = $("color-mode"),
statsModal = $("stats-modal"),
statsGrid = $("stats-grid"),
historyList = $("history"),
goldModal = $("gold-modal"),
goldDetails = $("gold-details"),
celebration = $("celebration"),
celebrationMessage = $("celebration-message"),
quoteCard = $("quote"),
quoteText = $("quote-text"),
themeColorMeta = typeof document.querySelector === "function" ? document.querySelector('meta[name="theme-color"]') : null,
goldPriceEl = $("gold-price"),
goldBar = $("gold-bar");

const QUOTES = [
["天行健，君子以自強不息；地勢坤，君子以厚德載物。", "《周易》"],
["學而時習之，不亦說乎？", "《論語》"],
["己所不欲，勿施於人。", "《論語》"],
["三人行，必有我師焉。", "《論語》"],
["知之為知之，不知為不知，是知也。", "《論語》"],
["士不可以不弘毅，任重而道遠。", "《論語》"],
["見賢思齊焉，見不賢而內自省。", "《論語》"],
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

let puzzle = [],
	solution = [],
	current = [],
	selected = null,
	hintsUsed = 0,
	startTime = null,
	timerId = null,
	solved = false,
	checked = false,
	lastGoldData = null;

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
	quoteText.textContent = quote + "" + source;
}
function validPlacement(grid, row, col, value) {
	for (let i = 0; i < BOARD_SIZE; i++) {
		if (i !== col && grid[idx(row, i)] === value) return false;
		if (i !== row && grid[idx(i, col)] === value) return false;
	}
	const boxRow = Math.floor(row / 3) * 3,
		boxCol = Math.floor(col / 3) * 3;
	for (let r = boxRow; r < boxRow + 3; r++)
		for (let c = boxCol; c < boxCol + 3; c++)
			if ((r !== row || c !== col) && grid[idx(r, c)] === value) return false;
	return true;
}
function fullGrid() {
	const grid = Array(CELL_COUNT).fill(0);
	function fill(position) {
		if (position === CELL_COUNT) return true;
		const row = Math.floor(position / BOARD_SIZE),
			col = position % BOARD_SIZE;
		for (const value of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]))
			if (validPlacement(grid, row, col, value)) {
				grid[position] = value;
				if (fill(position + 1)) return true;
				grid[position] = 0;
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
				const row = Math.floor(position / BOARD_SIZE),
					col = position % BOARD_SIZE;
				for (let value = 1; value <= BOARD_SIZE; value++)
					if (validPlacement(grid, row, col, value)) {
						grid[position] = value;
						search();
						grid[position] = 0;
						if (count >= limit) return;
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
	const grid = fullGrid(),
		solutionGrid = [...grid],
		cells = shuffle([...Array(CELL_COUNT).keys()]);
	let removed = 0;
	for (const position of cells) {
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
			history: Array.isArray(parsed?.history) ? parsed.history : [],
		};
	} catch {
		return {
			gamesStarted: 0,
			gamesSolved: 0,
			bestTimeSeconds: null,
			totalTimeSeconds: 0,
			totalHints: 0,
			history: [],
		};
	}
}
function saveStats(stats) {
	try {
		localStorage.setItem(STATS_KEY, JSON.stringify(stats));
	} catch {}
}
function getStats() {
	return loadStats();
}
function recordGameStarted() {
	const stats = getStats();
	stats.gamesStarted++;
	saveStats(stats);
}
function recordGameSolved() {
	const seconds = Math.floor((Date.now() - startTime) / 1000),
		stats = getStats();
	stats.gamesSolved++;
	stats.totalTimeSeconds += seconds;
	stats.totalHints += hintsUsed;
	if (stats.bestTimeSeconds === null || seconds < stats.bestTimeSeconds) stats.bestTimeSeconds = seconds;
	stats.history.unshift({
		completedAt: new Date().toISOString(),
		timeSeconds: seconds,
		hints: hintsUsed,
	});
	stats.history = stats.history.slice(0, MAX_HISTORY);
	saveStats(stats);
}
function newGame(countStart = true) {
	const { puzzle: newPuzzle, solution: newSolution } = makePuzzle(EASY_CLUES);
	puzzle = newPuzzle;
	solution = newSolution;
	current = [...puzzle];
	selected = null;
	hintsUsed = 0;
	solved = false;
	checked = false;
	$("timer").style.visibility = "visible";
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
function elapsedTime() {
	const seconds = Math.floor((Date.now() - startTime) / 1000);
	return formatTime(seconds);
}
function formatTime(seconds) {
	return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
}
function formatGoldTime(timestamp) {
	const date = new Date(timestamp * 1000),
		pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function setMessage(text, type = "") {
	messageEl.textContent = text;
	messageEl.className = "message" + (type ? " " + type : "");
}
function updateThemeColor() {
	if (themeColorMeta)
		themeColorMeta.setAttribute(
			"content",
			document.body.classList.contains("light-mode") ? "#f1f5f9" : "#0f172a"
		);
}
function render() {
	board.innerHTML = "";
	for (let row = 0; row < BOARD_SIZE; row++)
		for (let col = 0; col < BOARD_SIZE; col++) {
			const position = idx(row, col),
				boxAlt = (Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 1,
				label = `第 ${row + 1} 列，第 ${col + 1} 欄` + (current[position] ? "，" + current[position] : ""),
				isError = checked && current[position] && current[position] !== solution[position],
				cell = document.createElement("div");
			cell.className =
				"cell" +
				(boxAlt ? " box-alt" : "") +
				(col % 3 === 2 && col !== 8 ? " b-right" : "") +
				(row % 3 === 2 && row !== 8 ? " b-bottom" : "") +
				(puzzle[position] ? " given" : "") +
				(position === selected ? " selected" : "") +
				(isError ? " error" : "");
			cell.setAttribute("role", "gridcell");
			cell.setAttribute("tabindex", "0");
			cell.setAttribute("aria-label", label);
			if (current[position]) cell.textContent = current[position];
			cell.onclick = () => {
				selected = position;
				render();
			};
			cell.onkeydown = (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					selected = position;
					render();
				}
			};
			board.appendChild(cell);
		}
}
function showCelebration() {
	const seconds = Math.floor((Date.now() - startTime) / 1000);
	celebrationMessage.textContent = `你在 ${formatTime(seconds)} 內完成，使用提示 ${hintsUsed} 次。`;
	celebration.classList.add("open");
	const colors = ["#38bdf8", "#f472b6", "#facc15", "#4ade80", "#a78bfa", "#fb923c"];
	for (let i = 0; i < 60; i++) {
		const piece = document.createElement("div");
		piece.className = "confetti";
		piece.style.left = Math.random() * 100 + "%";
		piece.style.background = colors[i % colors.length];
		piece.style.animationDelay = Math.random() * 0.8 + "s";
		piece.style.animationDuration = 2.2 + Math.random() * 1.4 + "s";
		celebration.appendChild(piece);
	}
	setTimeout(() => {
		celebration.querySelectorAll(".confetti").forEach((piece) => piece.remove());
	}, 4200);
}
function finishGame() {
	solved = true;
	clearInterval(timerId);
	recordGameSolved();
	setMessage("完成！時間：" + elapsedTime(), "success");
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
	if (current.every((entry, index) => entry === solution[index])) {
		finishGame();
	} else if (current.every((entry) => entry !== 0)) {
		checkIncorrect();
	}
	render();
}

for (let value = 1; value <= BOARD_SIZE; value++) {
	const button = document.createElement("button");
	button.textContent = value;
	button.setAttribute("aria-label", "輸入 " + value);
	button.onclick = () => input(value);
	pad.appendChild(button);
}
const erase = document.createElement("button");
erase.className = "erase";
erase.textContent = "⌫";
erase.setAttribute("aria-label", "清除格子");
erase.onclick = () => {
	if (selected !== null && !puzzle[selected]) {
		current[selected] = 0;
		checked = false;
		setMessage("", "");
		render();
	}
};
pad.appendChild(erase);

$("new").onclick = () => {
	if (solved || confirm("開始新遊戲？")) newGame();
};
$("check").onclick = checkIncorrect;
$("hint").onclick = () => {
	if (solved) return;
	const emptyPositions = current
		.map((entry, position) => (entry ? null : position))
		.filter((position) => position !== null);
	if (!emptyPositions.length) return;
	const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
	current[position] = solution[position];
	selected = position;
	checked = false;
	setMessage("", "");
	hintsUsed++;
	$("hint").textContent = "提示：" + hintsUsed;
	if (current.every((entry, index) => entry === solution[index])) finishGame();
	if (current.every((entry) => entry !== 0)) checkIncorrect();
	render();
};
colorModeButton.onclick = () => {
	document.body.classList.toggle("light-mode");
	const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
	try {
		localStorage.setItem(COLOR_KEY, mode);
	} catch {}
	updateThemeColor();
};
try {
	if (localStorage.getItem(COLOR_KEY) === "light") document.body.classList.add("light-mode");
} catch {}
updateThemeColor();
quoteCard.onclick = showQuote;
quoteCard.addEventListener("keydown", (event) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		showQuote();
	}
});

function readGoldCache() {
	try {
		return JSON.parse(localStorage.getItem(GOLD_CACHE_KEY));
	} catch {
		return null;
	}
}
function writeGoldCache(data) {
	try {
		localStorage.setItem(GOLD_CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
	} catch {}
}
function clearGoldCache() {
	try {
		localStorage.removeItem(GOLD_CACHE_KEY);
	} catch {}
}
function todayRefreshTime() {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), GOLD_DAILY_HOUR, 0, 0, 0);
}
function shouldRefreshDaily(cache) {
	const now = new Date();
	if (now < todayRefreshTime()) return false;
	const fetchedAt = cache?.fetchedAt || 0;
	return fetchedAt < todayRefreshTime().getTime();
}
function renderGold(data) {
	if (data && typeof data.price === "number") {
		lastGoldData = data;
		goldPriceEl.innerHTML = `金價：<strong>$${data.price.toFixed(2)}</strong>（${formatGoldTime(data.timestamp)}）`;
	} else goldPriceEl.textContent = "金價資料無法取得";
}
function fetchGoldPrice(force = false, showDetails = false) {
	const cache = readGoldCache();
	if (
		!force &&
		cache?.data &&
		Date.now() - cache.fetchedAt < GOLD_REFRESH_MS &&
		!shouldRefreshDaily(cache)
	) {
		renderGold(cache.data);
		return;
	}
	if (typeof fetch !== "function") return;
	if (showDetails) showGoldDetails();
	fetch(GOLD_API, {
		method: "GET",
		headers: { "x-access-token": GOLD_API_KEY, "Content-Type": "application/json" },
		redirect: "follow",
	})
		.then((response) => {
			if (!response.ok) throw new Error("HTTP " + response.status);
			return response.json();
		})
		.then((data) => {
			if (data && typeof data.price === "number") {
				writeGoldCache(data);
				renderGold(data);
				if (showDetails) showGoldDetails();
			} else renderGold(null);
		})
		.catch(() => {
			if (cache?.data) renderGold(cache.data);
			else goldPriceEl.textContent = "金價資料無法取得";
		});
}
function goldStat(label, value, cls = "") {
	return `<div class="stat ${cls}"><span>${label}</span><strong>${value}</strong></div>`;
}
function showGoldDetails() {
	if (!lastGoldData) {
		goldDetails.innerHTML = '<p class="empty">金價資料尚未載入。</p>';
	} else {
		const d = lastGoldData,
			metalNames = { XAU: "黃金", XAG: "白銀", XPT: "鉑金", XPD: "鈀金" },
			changeCls = (d.change > 0) ? "up" : (d.change < 0) ? "down" : "",
			changeText = `${(d.change > 0) ? "+" : ""}${Number(d.change).toFixed(2)}（${(d.change > 0) ? "+" : ""}${Number(d.change_percent).toFixed(2)}%）`,
			melt = d.melt_price_per_gram || {},
			unitPrice = d.price_per_unit || {},
			currency = d.currency_info || {};
		goldDetails.innerHTML = `<div class="stats-grid">${goldStat("金屬", metalNames[d.metal] || d.metal)}${goldStat("貨幣", currency.name ? `${currency.name}（${currency.symbol || currency.code || d.currency}）` : d.currency)}${goldStat("目前價格", `$${d.price.toFixed(2)}`)}${goldStat("更新時間", formatGoldTime(d.timestamp))}</div><div class="gold-section">市場行情</div><div class="stats-grid">${goldStat("漲跌", changeText, changeCls)}${goldStat("前收盤", `$${Number(d.prev_close_price).toFixed(2)}`)}${goldStat("開盤價", `$${Number(d.open_price).toFixed(2)}`)}${goldStat("當日最高", `$${Number(d.high_price).toFixed(2)}`)}${goldStat("當日最低", `$${Number(d.low_price).toFixed(2)}`)}${goldStat("開盤時間", formatGoldTime(d.open_time))}</div><div class="gold-section">買賣價</div><div class="stats-grid">${goldStat("買入價（Bid）", `$${Number(d.bid).toFixed(2)}`)}${goldStat("賣出價（Ask）", `$${Number(d.ask).toFixed(2)}`)}</div><div class="gold-section">單位換算</div><div class="stats-grid">${goldStat("每金衡盎司", `$${Number(unitPrice.troy_ounce).toFixed(2)}`)}${goldStat("每克", `$${Number(unitPrice.gram).toFixed(2)}`)}${goldStat("每公斤", `$${Number(unitPrice.kilogram).toFixed(2)}`)}${goldStat("報價單位", d.unit === "troy_ounce" ? "金衡盎司" : d.unit)}</div><div class="gold-section">成色每克價</div><div class="stats-grid">${goldStat("24K", `$${Number(melt["24k"]).toFixed(2)}`)}${goldStat("22K", `$${Number(melt["22k"]).toFixed(2)}`)}${goldStat("18K", `$${Number(melt["18k"]).toFixed(2)}`)}${goldStat("交易所", d.exchange || "—")}</div>`;
	}
	goldModal.classList.add("open");
}
function fetchAndShowGoldDetails() {
	fetchGoldPrice(true, true);
}
function closeGold() {
	goldModal.classList.remove("open");
}
goldBar.onclick = fetchAndShowGoldDetails;
goldBar.addEventListener("keydown", (event) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		showGoldDetails();
	}
});
$("close-gold").onclick = closeGold;
goldModal.addEventListener("click", (event) => {
	if (event.target === goldModal) closeGold();
});
fetchGoldPrice();
setInterval(() => {
	const cache = readGoldCache();
	if (shouldRefreshDaily(cache)) {
		clearGoldCache();
		fetchGoldPrice(true);
	}
}, 60000);

function renderStats() {
	const stats = getStats(),
		average = stats.gamesSolved ? Math.round(stats.totalTimeSeconds / stats.gamesSolved) : null,
		completionRate = stats.gamesStarted ? Math.round((stats.gamesSolved / stats.gamesStarted) * 100) : 0;
	statsGrid.innerHTML = `<div class="stat"><span>已開始遊戲</span><strong>${stats.gamesStarted}</strong></div><div class="stat"><span>已完成遊戲</span><strong>${stats.gamesSolved}</strong></div><div class="stat"><span>完成率</span><strong>${completionRate}%</strong></div><div class="stat"><span>最佳時間</span><strong>${stats.bestTimeSeconds === null ? "—" : formatTime(stats.bestTimeSeconds)}</strong></div><div class="stat"><span>平均時間</span><strong>${average === null ? "—" : formatTime(average)}</strong></div><div class="stat"><span>使用提示</span><strong>${stats.totalHints}</strong></div><div class="stat"><span>總遊玩時間</span><strong>${formatTime(stats.totalTimeSeconds)}</strong></div>`;
	historyList.innerHTML = (stats.history.length) ? "" : '<li class="empty">尚無已完成遊戲。</li>';
	stats.history.forEach((entry) => {
		const item = document.createElement("li");
		const date = new Date(entry.completedAt).toLocaleString();
		item.innerHTML = `<span>${date}</span><span>${formatTime(entry.timeSeconds)} · ${entry.hints} 次提示</span>`;
		historyList.appendChild(item);
	});
}
function openStats() {
	renderStats();
	statsModal.classList.add("open");
}
function closeStats() {
	statsModal.classList.remove("open");
}
$("stats").onclick = openStats;
$("close-stats").onclick = closeStats;
$("clear-stats").onclick = () => {
	if (confirm("清除所有已儲存的數獨統計與紀錄？")) {
		localStorage.removeItem(STATS_KEY);
		renderStats();
	}
};
statsModal.addEventListener("click", (event) => {
	if (event.target === statsModal) closeStats();
});

$("close-celebration").onclick = () => {
	celebration.classList.remove("open");
	celebration.querySelectorAll(".confetti").forEach((piece) => piece.remove());
};
celebration.addEventListener("click", (event) => {
	if (event.target === celebration) {
		celebration.classList.remove("open");
		celebration.querySelectorAll(".confetti").forEach((piece) => piece.remove());
	}
});
document.addEventListener("keydown", (event) => {
	const overlayOpen =
		statsModal.classList.contains("open") ||
		celebration.classList.contains("open") ||
		goldModal.classList.contains("open");
	if (event.key === "Escape") {
		closeStats();
		closeGold();
		celebration.classList.remove("open");
		return;
	}
	if (overlayOpen) return;
	if (event.key >= "1" && event.key <= "9") input(+event.key);
	if (event.key === "Backspace" || event.key === "Delete") {
		if (selected !== null && !puzzle[selected]) {
			current[selected] = 0;
			checked = false;
			setMessage("", "");
			render();
		}
	}
});

global.SudokuGameMain = {
	newGame,
	validPlacement,
	shuffle,
	fullGrid,
	countSolutions,
	makePuzzle,
};
})(window);