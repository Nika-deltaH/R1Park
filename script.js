// ============================================================
// CONFIGURATION
// ============================================================
const GAME_W = 380;
const GAME_H = 680;
const SAVE_KEY = 'ZookeeperR1_save';
const GAME_TITLE = '阿萬動物樂園';
const GAME_URL = 'https://example.com/zookeeper/';

// ============================================================
// GAME CONSTANTS
// ============================================================
const BOARD_SIZE  = 8;
const CELL_SIZE   = 40;
const BOARD_X     = 30;    // (380-320)/2
const BOARD_Y     = 86;
const BOARD_W     = BOARD_SIZE * CELL_SIZE;  // 320
const BOARD_H     = BOARD_SIZE * CELL_SIZE;  // 320
const SPRITE_SIZE = 32;
const SPRITE_OFF  = (CELL_SIZE - SPRITE_SIZE) / 2;  // 4

const NUM_ANIMAL_TYPES = 13;
const ACTIVE_TYPES     = 8;

const TOTAL_TIME        = 30;
const MAX_TIME          = 90;         // timeLeft hard cap
const FEVER_MAX         = 10;
const FEVER_TIME_NO_QUIZ = 5;
const COMBO_BASE        = 1.5;
const MATCH_SCORES      = { 3: 100, 4: 200, 5: 350 };

// ---- Game balance knobs (tweak here) ----
const TIME_BONUS_PER_GROUP   = 1;   // seconds added per eliminated group (normal play)
const FEVER_BONUS_PER_GROUP  = 0.2;   // fever seconds added per group (during fever time)

const SWAP_DURATION    = 180;  // ms
const EXPLODE_SCALE_MS = 200;  // ms scale 1→1.2
const EXPLODE_FADE_MS  = 200;  // ms alpha 1→0
const EXPLODE_DURATION = EXPLODE_SCALE_MS + EXPLODE_FADE_MS;
const FALL_SPEED       = 600;  // px / sec

// Layout: timer bar
const TIMER_X = BOARD_X;
const TIMER_Y = 58;
const TIMER_W = BOARD_W;
const TIMER_H = 20;

// Layout: fever bar
const FEVER_X = BOARD_X;
const FEVER_Y = 420;
const FEVER_W = BOARD_W;
const FEVER_H = 24;

// Animation phases
const PHASE = {
    IDLE:      'idle',
    SWAPPING:  'swap',
    SWAP_BACK: 'swap_back',
    MATCHING:  'match',
    FALLING:   'fall',
};

// ============================================================
// i18n
// ============================================================
const STRINGS = {
    zh: {
        score: '分數', gameOver: 'Game Over', retry: '再玩一次', share: '分享', saveImg: '儲存圖片',
        settingsTitle: '設定', soundSection: '音效', bgmVolume: 'BGM 音量', sfxVolume: 'SFX 音量',
        autoMute: '自動靜音', saveSection: '存檔', downloadSave: '下載存檔', uploadSave: '讀取存檔',
        langSection: '語言', closeSettings: '關閉',
        confirmTitle: '確定要重新開始嗎？', confirmCancel: '繼續', confirmOk: '重來',
        startMsg: '點擊開始',
        quizChallenge: '開啟衛教挑戰', challengeSection: '衛教挑戰',
        startGame: '開始遊戲', loadGame: '載入進度',
        library: '圖鑑', quizBank: '題庫',
    },
    en: {
        score: 'Score', gameOver: 'Game Over', retry: 'Play Again', share: 'Share', saveImg: 'Save Image',
        settingsTitle: 'Settings', soundSection: 'Sound', bgmVolume: 'BGM Volume', sfxVolume: 'SFX Volume',
        autoMute: 'Auto Mute on Tab Switch', saveSection: 'Save Data', downloadSave: 'Download', uploadSave: 'Load',
        langSection: 'Language', closeSettings: 'Close',
        confirmTitle: 'Restart the game?', confirmCancel: 'Continue', confirmOk: 'Restart',
        startMsg: 'Tap to Start',
        quizChallenge: 'Health Challenge', challengeSection: 'Health Challenge',
        startGame: 'Start Game', loadGame: 'Load Save',
        library: 'Library', quizBank: 'Quiz Bank',
    },
    ja: {
        score: 'スコア', gameOver: 'ゲームオーバー', retry: 'もう一度', share: 'シェア', saveImg: '画像保存',
        settingsTitle: '設定', soundSection: 'サウンド', bgmVolume: 'BGM 音量', sfxVolume: 'SFX 音量',
        autoMute: '自動ミュート', saveSection: 'セーブ', downloadSave: '保存', uploadSave: '読込',
        langSection: '言語', closeSettings: '閉じる',
        confirmTitle: 'ゲームをリスタートしますか？', confirmCancel: 'つづける', confirmOk: 'リスタート',
        startMsg: 'タップしてスタート',
        quizChallenge: '健康チャレンジ', challengeSection: '健康チャレンジ',
        startGame: 'スタート', loadGame: 'ロード',
        library: '図鑑', quizBank: 'クイズ',
    },
};

let currentLang = 'auto';

function detectLang() {
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('zh')) return 'zh';
    return 'en';
}
function getCurrentStrings() {
    const l = currentLang === 'auto' ? detectLang() : currentLang;
    return STRINGS[l] || STRINGS.zh;
}
function applyLanguage(lang) {
    currentLang = lang;
    const s = getCurrentStrings();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (s[key] !== undefined) el.textContent = s[key];
    });
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = lang;
    localStorage.setItem(SAVE_KEY + '_lang', lang);
}

// ============================================================
// SHARED STATE FLAGS
// ============================================================
let score       = 0;
let isPlaying   = false;
let isGameOver  = false;
let isPaused    = false;
let isAutoMuteEnabled = true;

// ============================================================
// GAME STATE VARIABLES
// ============================================================
let canvas, ctx;
let gameScreen    = 'start';   // 'start'|'playing'|'gameover'|'library'|'quizbank'
let board         = [];        // board[r][c] = 0-7 or -1
let sprites       = [];        // sprites[r][c] = visual state object
let selectedTypes = [];        // 8 indices from 0-11 chosen each game

// Animation phase
let phase        = PHASE.IDLE;
let phaseTimer   = 0;
let swapPair     = null;       // {r1,c1,r2,c2}
let swapProgress = 0;          // 0→1
let comboCount   = 0;

// Timer & fever
let timeLeft      = TOTAL_TIME;
let feverBar      = 0;
let feverBarFull  = false;
let feverFlash    = 0;          // oscillating alpha for flash

// Fever time
let isFeverTime   = false;
let feverTimeLeft = 0;
let feverMaxTime  = 0;
let feverRainbowT = 0;         // time accumulator for rainbow hue

// Fever intro animation
let feverIntroActive  = false;
let feverIntroTimer   = 0;     // ms elapsed in intro
let pendingFeverSecs  = 0;     // fever seconds waiting for intro to finish

// Game-over launch animation
let isLaunching  = false;
let launchTimer  = 0;

// Idle hint system
let noMatchTimer = 0;   // seconds since last elimination (in IDLE phase)
let hintMove     = null; // {r1,c1,r2,c2} of the hint pair, null = not showing

// Game-over canvas buttons
let gameOverButtons = [];

// Challenge
let isChallengeEnabled  = true;
let challengeActive     = false;
let challengeQuestions  = [];   // 3 QUIZ_DATA items for this round
let challengeIdx        = 0;
let challengeTimer      = 0;
let challengeTotalTime  = 15;
let challengeCorrect    = 0;
let challengeWaiting    = false; // waiting before showing next question

// Input
let hoverTile    = null;   // {r,c}
let selectedTile = null;   // {r,c}
let dragStart    = null;   // {x,y,r,c}
let pointerDown  = false;
let pointerId    = null;

// Floating texts and particles
let floatingTexts = [];
let particles     = [];

// Save-related
let hasSavedGame     = false;
let hasPlayedBefore  = false;
let seenAnimalTypes  = [];
let seenQuizIds      = [];

// Start screen buttons (hit areas)
let startButtons = [];

// Combo display
let comboDisplay = { count: 0, alpha: 0, timer: 0 };

// Game-over overlay animations
let gameOverTimer = 0;
let gameOverAlpha = 0;

// Time for elapsed animations
let totalElapsed = 0;

// ============================================================
// DOM REFERENCES
// ============================================================
const scoreEl        = document.getElementById('score');
const finalScoreEl   = document.getElementById('final-score');
const gameHeader     = document.getElementById('game-header');
const gameFooter     = document.getElementById('game-footer');
const uiLayer        = document.getElementById('ui-layer');
const retryBtn       = document.getElementById('retry-btn');
const retryBtnTop    = document.getElementById('retry-btn-top');
const shareBtn       = document.getElementById('share-btn');
const screenshotBtn  = document.getElementById('screenshot-btn');
const settingsModal  = document.getElementById('settings-modal');
const bgmSlider      = document.getElementById('bgm-volume');
const sfxSlider      = document.getElementById('sfx-volume');
const loadingScreen  = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const challengeModal = document.getElementById('challenge-modal');

// ============================================================
// AUDIO SYSTEM
// ============================================================
const bgm = new Audio('assets/bgm.mp3');
bgm.loop = true;

let audioCtx = null, bgmGainNode = null, sfxGainNode = null;
let bgmVolume = 0.5, sfxVolume = 0.5;

function initAudioContext() {
    if (audioCtx) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return;
    }
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sfxGainNode = audioCtx.createGain();
        sfxGainNode.gain.value = sfxVolume;
        sfxGainNode.connect(audioCtx.destination);
        bgmGainNode = audioCtx.createGain();
        bgmGainNode.gain.value = bgmVolume;
        const src = audioCtx.createMediaElementSource(bgm);
        src.connect(bgmGainNode);
        bgmGainNode.connect(audioCtx.destination);
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { console.warn('Web Audio API unavailable', e); }
}

// ============================================================
// SOUND SYNTHESIS (Web Audio API oscillators)
// ============================================================
function playSynth(type, freq, duration, gainVal, freqEnd) {
    if (!audioCtx || sfxVolume <= 0) return;
    try {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (freqEnd !== undefined) {
            osc.frequency.linearRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
        }
        gain.gain.setValueAtTime(gainVal * sfxVolume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(sfxGainNode || audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration + 0.01);
    } catch (e) {}
}

function playMatchSound(combo) {
    // Ding: rising pitch with combo level
    const freq = 440 * Math.pow(1.3, Math.min(combo - 1, 6));
    playSynth('sine', freq, 0.25, 0.35);
    if (combo >= 2) setTimeout(() => playSynth('sine', freq * 1.25, 0.2, 0.25), 80);
    if (combo >= 3) setTimeout(() => playSynth('sine', freq * 1.5,  0.18, 0.2), 160);
}

function playSwapSound() {
    playSynth('triangle', 600, 0.08, 0.2);
}

function playSwapBackSound() {
    playSynth('triangle', 400, 0.08, 0.15);
}

function playFailSound() {
    playSynth('sawtooth', 220, 0.35, 0.2, 140);
}

function playFeverSound() {
    const notes = [523, 659, 784]; // C5 E5 G5
    notes.forEach((f, i) => setTimeout(() => playSynth('sine', f, 0.3, 0.4), i * 100));
}

function playFeverReadySound() {
    if (!audioCtx || sfxVolume <= 0) return;
    // Upward 4-note fanfare: C5 → E5 → G5 → C6
    [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const g   = audioCtx.createGain();
        osc.connect(g);
        g.connect(sfxGainNode);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = audioCtx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.28, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.38);
    });
}

// ============================================================
// IMAGE LOADING
// ============================================================
const IMAGES_TO_LOAD = [
    ...Array.from({ length: NUM_ANIMAL_TYPES }, (_, i) =>
        `assets/animal_a_${String(i + 1).padStart(2, '0')}.png`),
    ...Array.from({ length: NUM_ANIMAL_TYPES }, (_, i) =>
        `assets/animal_b_${String(i + 1).padStart(2, '0')}.png`),
    'assets/hovering.png',
    'assets/selected.png',
];
const ASSET_IMAGES = {};

async function preloadAssets() {
    loadingScreen.style.display = 'flex';
    let loaded = 0;
    IMAGES_TO_LOAD.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = () => {
            ASSET_IMAGES[src.replace(/^assets\//, '').replace(/\.\w+$/, '')] = img;
            loaded++;
            loadingProgress.textContent = Math.floor((loaded / IMAGES_TO_LOAD.length) * 100) + '%';
            if (loaded >= IMAGES_TO_LOAD.length) {
                setTimeout(() => { loadingScreen.style.display = 'none'; init(); }, 400);
            }
        };
        img.src = src;
    });
}

// ============================================================
// SAVE / LOAD SYSTEM
// ============================================================
function getCurrentGameState() {
    return {
        score, board, selectedTypes, timeLeft,
        feverBar, isChallengeEnabled, isFeverTime, feverTimeLeft,
        seenQuizIds: [...seenQuizIds],
        seenAnimalTypes: [...seenAnimalTypes],
        hasPlayedBefore,
    };
}

function applyGameState(state) {
    if (!state) return;
    score = state.score || 0;
    board = state.board || [];
    selectedTypes = state.selectedTypes || [];
    timeLeft = state.timeLeft ?? TOTAL_TIME;
    feverBar = state.feverBar ?? 0;
    isChallengeEnabled = state.isChallengeEnabled ?? true;
    isFeverTime = false;
    feverTimeLeft = 0;
    seenQuizIds = state.seenQuizIds || [];
    seenAnimalTypes = state.seenAnimalTypes || [];
    hasPlayedBefore = state.hasPlayedBefore ?? false;
    syncQuizToggle();
    rebuildSprites();
    gameScreen = 'playing';
    updateUIForScreen();
    isPlaying = true;
    isGameOver = false;
    isPaused = false;
    phase = PHASE.IDLE;
    comboCount = 0;
    feverBarFull = feverBar >= FEVER_MAX;
    scoreEl.textContent = score;
    gameHeader.classList.add('hidden');
    gameFooter.classList.add('hidden');
    uiLayer.classList.remove('hidden');
}

function saveGameState() {
    if (!isPlaying || isGameOver) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...getCurrentGameState(), time: Date.now() }));
}

function checkSavedGame() {
    // Check for mid-game save
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            const state = JSON.parse(raw);
            if (Date.now() - (state.time || 0) <= 3600000) hasSavedGame = true;
            else localStorage.removeItem(SAVE_KEY);
        }
    } catch { localStorage.removeItem(SAVE_KEY); }
    // Load persistent unlock data (survives game over)
    try {
        const pRaw = localStorage.getItem(SAVE_KEY + '_progress');
        if (pRaw) {
            const p = JSON.parse(pRaw);
            hasPlayedBefore = p.hasPlayedBefore ?? false;
            seenAnimalTypes = p.seenAnimalTypes || [];
            seenQuizIds     = p.seenQuizIds     || [];
            isChallengeEnabled = p.isChallengeEnabled ?? true;
        }
    } catch {}
}

function loadAndApplySave() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const state = JSON.parse(raw);
        if (Date.now() - (state.time || 0) > 3600000) { localStorage.removeItem(SAVE_KEY); return false; }
        applyGameState(state);
        return true;
    } catch { localStorage.removeItem(SAVE_KEY); return false; }
}

function downloadSave() {
    const state = { ...getCurrentGameState(), time: Date.now() };
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = SAVE_KEY + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function fillRR(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

// Left-rounded rect (for progress bars, fill stops mid-way)
function fillRRLeft(ctx, x, y, w, h, r) {
    if (w <= 0 || h <= 0) return;
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

function getTileAt(px, py) {
    const c = Math.floor((px - BOARD_X) / CELL_SIZE);
    const r = Math.floor((py - BOARD_Y) / CELL_SIZE);
    if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) return { r, c };
    return null;
}

function getCanvasPos(e) {
    const rect = document.getElementById('game-container').getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (GAME_W / rect.width),
        y: (e.clientY - rect.top)  * (GAME_H / rect.height),
    };
}

function syncQuizToggle() {
    const toggle = document.getElementById('quiz-toggle');
    if (toggle) toggle.checked = isChallengeEnabled;
}

function updateUIForScreen() {
    const playing = gameScreen === 'playing';
    const sb = document.getElementById('score-board');
    if (sb) sb.style.display = playing ? '' : 'none';
    if (retryBtnTop) retryBtnTop.style.display = playing ? '' : 'none';
}

// ============================================================
// BOARD LOGIC
// ============================================================
function makeSpriteAt(r, c, type, visualRow) {
    return { type, visualRow: visualRow ?? r, visualCol: c,
             scale: 1, alpha: 1, showB: false, explodeTimer: 0, matched: false,
             shakeX: 0, shakeY: 0 };
}

function initBoard() {
    // Pick 8 unique animal types from 12
    const pool = Array.from({ length: NUM_ANIMAL_TYPES }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    selectedTypes = pool.slice(0, ACTIVE_TYPES);

    // Build board, avoiding 3-in-a-row
    board   = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(-1));
    sprites = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(null));

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            let type;
            let tries = 0;
            do {
                type = Math.floor(Math.random() * ACTIVE_TYPES);
                tries++;
            } while (tries < 50 && wouldMatch(board, r, c, type));
            board[r][c] = type;
            sprites[r][c] = makeSpriteAt(r, c, type, r);
        }
    }
}

function wouldMatch(b, r, c, type) {
    // Check if placing type at (r,c) creates a match
    if (c >= 2 && b[r][c-1] === type && b[r][c-2] === type) return true;
    if (r >= 2 && b[r-1][c] === type && b[r-2][c] === type) return true;
    return false;
}

function rebuildSprites() {
    sprites = Array.from({ length: BOARD_SIZE }, (_, r) =>
        Array.from({ length: BOARD_SIZE }, (_, c) =>
            makeSpriteAt(r, c, board[r][c] ?? 0, r)
        )
    );
}

function findMatches() {
    const matched = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(false));
    // Horizontal
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c <= BOARD_SIZE - 3; c++) {
            const t = board[r][c];
            if (t < 0) continue;
            let len = 1;
            while (c + len < BOARD_SIZE && board[r][c + len] === t) len++;
            if (len >= 3) { for (let i = 0; i < len; i++) matched[r][c + i] = true; c += len - 1; }
        }
    }
    // Vertical
    for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r <= BOARD_SIZE - 3; r++) {
            const t = board[r][c];
            if (t < 0) continue;
            let len = 1;
            while (r + len < BOARD_SIZE && board[r + len][c] === t) len++;
            if (len >= 3) { for (let i = 0; i < len; i++) matched[r + i][c] = true; r += len - 1; }
        }
    }
    return matched;
}

function anyMatch(matched) {
    return matched.some(row => row.some(v => v));
}

// Group contiguous matched cells (BFS); returns array of {cells, size}
function groupMatches(matched) {
    const visited = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(false));
    const groups = [];
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (!matched[r][c] || visited[r][c]) continue;
            const group = { cells: [], size: 0 };
            const queue = [[r, c]];
            visited[r][c] = true;
            while (queue.length) {
                const [cr, cc] = queue.shift();
                group.cells.push({ r: cr, c: cc });
                for (const [dr, dc] of dirs) {
                    const nr = cr + dr, nc = cc + dc;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE
                        && matched[nr][nc] && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
            group.size = group.cells.length;
            groups.push(group);
        }
    }
    return groups;
}

function applyGravity() {
    for (let c = 0; c < BOARD_SIZE; c++) {
        // Collect non-empty tiles (bottom → top)
        const tiles = [];
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
            if (board[r][c] >= 0) {
                tiles.push({ type: board[r][c], vr: sprites[r][c] ? sprites[r][c].visualRow : r });
            }
        }
        const emptyCount = BOARD_SIZE - tiles.length;

        // Place existing tiles at bottom
        for (let i = 0; i < tiles.length; i++) {
            const newRow = BOARD_SIZE - 1 - i;
            board[newRow][c] = tiles[i].type;
            sprites[newRow][c] = makeSpriteAt(newRow, c, tiles[i].type, tiles[i].vr);
        }
        // Spawn new tiles above
        for (let i = 0; i < emptyCount; i++) {
            const newRow = i;
            const type = Math.floor(Math.random() * ACTIVE_TYPES);
            board[newRow][c] = type;
            sprites[newRow][c] = makeSpriteAt(newRow, c, type, newRow - emptyCount);
        }
    }
}

function hasValidMove() {
    return !!findHintMove();
}

function findHintMove() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            for (const [dr, dc] of [[0,1],[1,0]]) {
                const r2 = r + dr, c2 = c + dc;
                if (r2 >= BOARD_SIZE || c2 >= BOARD_SIZE) continue;
                [board[r][c], board[r2][c2]] = [board[r2][c2], board[r][c]];
                const has = anyMatch(findMatches());
                [board[r][c], board[r2][c2]] = [board[r2][c2], board[r][c]];
                if (has) return { r1: r, c1: c, r2, c2 };
            }
        }
    }
    return null;
}

function reshuffleBoard() {
    // Shuffle board until it has at least one valid move
    const flat = board.flat().filter(t => t >= 0);
    let attempts = 0;
    do {
        for (let i = flat.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flat[i], flat[j]] = [flat[j], flat[i]];
        }
        let k = 0;
        for (let r = 0; r < BOARD_SIZE; r++)
            for (let c = 0; c < BOARD_SIZE; c++)
                board[r][c] = flat[k++];
        attempts++;
    } while (!hasValidMove() && attempts < 30);

    // Animate: all tiles fall from above the board
    for (let r = 0; r < BOARD_SIZE; r++)
        for (let c = 0; c < BOARD_SIZE; c++)
            sprites[r][c] = makeSpriteAt(r, c, board[r][c], r - BOARD_SIZE);

    comboCount = 0;
    hintMove   = null;
    phase      = PHASE.FALLING;
    phaseTimer = 0;
}

// ============================================================
// SCORING & COMBO
// ============================================================
function resolveMatches(matched) {
    const groups = groupMatches(matched);
    let totalEarned = 0;
    let centerR = 0, centerC = 0, cellCount = 0;

    groups.forEach(g => {
        const baseScore = g.size >= 5 ? MATCH_SCORES[5]
                        : g.size === 4 ? MATCH_SCORES[4]
                        : MATCH_SCORES[3];
        const mult   = Math.pow(COMBO_BASE, comboCount - 1);
        let earned   = Math.floor(baseScore * mult / 10) * 10;
        if (isFeverTime) earned *= 2;
        totalEarned += earned;

        g.cells.forEach(({ r, c }) => { centerR += r; centerC += c; cellCount++; });

        if (isFeverTime) {
            // During fever: each group extends remaining fever time (no bar fill)
            feverTimeLeft += FEVER_BONUS_PER_GROUP;
        } else {
            feverBar = Math.min(FEVER_MAX, feverBar + comboCount);
            if (feverBar >= FEVER_MAX && !feverBarFull) {
                feverBarFull = true;
                playFeverReadySound();
            }
        }
    });

    if (totalEarned > 0) {
        score += totalEarned;
        scoreEl.textContent = score;
        // Floating score text near center of matched area
        if (cellCount > 0) {
            const avgR = centerR / cellCount;
            const avgC = centerC / cellCount;
            spawnFloatingText(
                '+' + totalEarned,
                BOARD_X + (avgC + 0.5) * CELL_SIZE,
                BOARD_Y + (avgR + 0.5) * CELL_SIZE,
                '#fff176', 1.4
            );
        }
        // Combo display
        if (comboCount >= 2) {
            comboDisplay.count = comboCount;
            comboDisplay.alpha = 1;
            comboDisplay.timer = 1.8;
        }
    }

    // Time bonus per group, capped at MAX_TIME
    const timeBonus = TIME_BONUS_PER_GROUP * groups.length;
    timeLeft = Math.min(MAX_TIME, timeLeft + timeBonus);
    const timeBonusStr = Number.isInteger(timeBonus) ? `+${timeBonus}s` : `+${timeBonus.toFixed(1)}s`;
    spawnFloatingText(timeBonusStr, TIMER_X + TIMER_W / 2, TIMER_Y - 6, '#4caf50', 1.2);

    // Reset idle-hint timer on any elimination
    noMatchTimer = 0;
    hintMove = null;

    playMatchSound(comboCount);
    return groups;
}

// ============================================================
// BOARD PHASE STATE MACHINE
// ============================================================
function markMatched(matched) {
    for (let r = 0; r < BOARD_SIZE; r++)
        for (let c = 0; c < BOARD_SIZE; c++)
            if (matched[r][c] && sprites[r][c]) {
                sprites[r][c].matched   = true;
                sprites[r][c].showB     = true;
                sprites[r][c].explodeTimer = 0;
            }
}

function startSwap(r1, c1, r2, c2) {
    swapPair     = { r1, c1, r2, c2 };
    swapProgress = 0;
    phase        = PHASE.SWAPPING;
    phaseTimer   = 0;
    playSwapSound();
    [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
}

function trySwap(r, c, dir) {
    if (phase !== PHASE.IDLE || isGameOver || challengeActive || feverIntroActive) return;
    const [dr, dc] = { up:[-1,0], down:[1,0], left:[0,-1], right:[0,1] }[dir];
    const r2 = r + dr, c2 = c + dc;
    if (r2 < 0 || r2 >= BOARD_SIZE || c2 < 0 || c2 >= BOARD_SIZE) return;
    // Any swap attempt resets the idle-hint timer
    noMatchTimer = 0;
    hintMove = null;
    startSwap(r, c, r2, c2);
}

function updatePhase(dt) {
    phaseTimer += dt;

    if (phase === PHASE.SWAPPING) {
        swapProgress = Math.min(phaseTimer / SWAP_DURATION, 1);
        if (phaseTimer >= SWAP_DURATION) {
            swapProgress = 1;
            const matched = findMatches();
            if (anyMatch(matched)) {
                comboCount++;
                // Board was already swapped; sync sprites to match the new board positions.
                const { r1, c1, r2, c2 } = swapPair;
                [sprites[r1][c1], sprites[r2][c2]] = [sprites[r2][c2], sprites[r1][c1]];
                // Reset visualRow to the new array row so vertical-swap tiles
                // don't snap back to their origin row during the explosion.
                if (sprites[r1][c1]) sprites[r1][c1].visualRow = r1;
                if (sprites[r2][c2]) sprites[r2][c2].visualRow = r2;
                swapPair     = null;
                swapProgress = 0;
                markMatched(matched);
                resolveMatches(matched);
                phase      = PHASE.MATCHING;
                phaseTimer = 0;
                hoverTile = null;
                selectedTile = null;
            } else {
                // Swap back
                [board[swapPair.r1][swapPair.c1], board[swapPair.r2][swapPair.c2]] =
                    [board[swapPair.r2][swapPair.c2], board[swapPair.r1][swapPair.c1]];
                phase      = PHASE.SWAP_BACK;
                phaseTimer = 0;
                swapProgress = 1;
                playFailSound();
            }
        }
    } else if (phase === PHASE.SWAP_BACK) {
        swapProgress = 1 - Math.min(phaseTimer / SWAP_DURATION, 1);
        if (phaseTimer >= SWAP_DURATION) {
            swapPair  = null;
            phase     = PHASE.IDLE;
        }
    } else if (phase === PHASE.MATCHING) {
        // Advance explode timers on matched sprites
        let allDone = true;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const sp = sprites[r][c];
                if (!sp || !sp.matched) continue;
                sp.explodeTimer = Math.min(sp.explodeTimer + dt, EXPLODE_DURATION);
                if (sp.explodeTimer < EXPLODE_SCALE_MS) {
                    sp.scale = 1 + 0.2 * (sp.explodeTimer / EXPLODE_SCALE_MS);
                    sp.alpha = 1;
                } else {
                    const fadeT = (sp.explodeTimer - EXPLODE_SCALE_MS) / EXPLODE_FADE_MS;
                    sp.scale = 1.2;
                    sp.alpha = Math.max(0, 1 - fadeT);
                }
                if (sp.explodeTimer < EXPLODE_DURATION) allDone = false;
                // Particles on first frame
                if (sp.explodeTimer <= dt + 2) {
                    spawnParticles(
                        BOARD_X + (c + 0.5) * CELL_SIZE,
                        BOARD_Y + (r + 0.5) * CELL_SIZE,
                        sp.type
                    );
                }
            }
        }
        if (allDone) {
            // Clear matched tiles from board
            for (let r = 0; r < BOARD_SIZE; r++)
                for (let c = 0; c < BOARD_SIZE; c++)
                    if (sprites[r][c] && sprites[r][c].matched) {
                        board[r][c] = -1;
                        sprites[r][c] = null;
                    }
            applyGravity();
            phase      = PHASE.FALLING;
            phaseTimer = 0;
        }
    } else if (phase === PHASE.FALLING) {
        let allAtTarget = true;
        const speed = FALL_SPEED / CELL_SIZE; // rows/sec
        const rowDelta = speed * dt / 1000;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const sp = sprites[r][c];
                if (!sp) continue;
                if (Math.abs(sp.visualRow - r) > 0.01) {
                    sp.visualRow = Math.min(sp.visualRow + rowDelta, r);
                    allAtTarget = false;
                } else {
                    sp.visualRow = r;
                }
            }
        }
        if (allAtTarget) {
            // Check for chain combos
            const matched = findMatches();
            if (anyMatch(matched)) {
                comboCount++;
                markMatched(matched);
                resolveMatches(matched);
                phase      = PHASE.MATCHING;
                phaseTimer = 0;
            } else {
                comboCount = 0;
                phase      = PHASE.IDLE;
                // Check deadlock: show hint text then rain tiles from above
                if (!hasValidMove()) {
                    hintMove = null;
                    spawnFloatingText('重新排列！', GAME_W / 2, BOARD_Y + BOARD_H / 2,
                                      '#fff176', 1.6);
                    setTimeout(reshuffleBoard, 700);
                }
            }
        }
    }
}

// ============================================================
// EFFECTS
// ============================================================
function spawnFloatingText(text, x, y, color, scale) {
    floatingTexts.push({ text, x, y, vy: -90, alpha: 1, scale: scale || 1.2, color: color || '#fff', life: 1.2 });
}

function spawnParticles(cx, cy, type) {
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#f06595','#74c0fc'];
    const col = colors[type % colors.length];
    for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.5;
        const speed = 60 + Math.random() * 80;
        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: 3 + Math.random() * 2,
            alpha: 1, color: col, life: 0.45 + Math.random() * 0.2,
        });
    }
}

function updateFloatingTexts(dt) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const f = floatingTexts[i];
        f.life -= dt / 1000;
        f.y    += f.vy * dt / 1000;
        f.alpha = Math.max(0, f.life / 1.2);
        if (f.life <= 0) floatingTexts.splice(i, 1);
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt / 1000;
        p.x    += p.vx * dt / 1000;
        p.y    += p.vy * dt / 1000;
        p.vy   += 300 * dt / 1000; // gravity
        p.alpha = Math.max(0, p.life / 0.5);
        if (p.life <= 0) particles.splice(i, 1);
    }
}

// ============================================================
// FEVER TIME
// ============================================================
function startFeverTime(seconds) {
    // Play intro animation first; fever countdown begins after it finishes
    pendingFeverSecs  = seconds;
    feverIntroActive  = true;
    feverIntroTimer   = 0;
    feverRainbowT     = 0;
    feverBar          = 0;
    feverBarFull      = false;
    playFeverSound();
}

function activateFeverTime() {
    feverIntroActive  = false;
    isFeverTime       = true;
    feverTimeLeft     = pendingFeverSecs;
    feverMaxTime      = pendingFeverSecs;
}

function endFeverTime() {
    isFeverTime   = false;
    feverTimeLeft = 0;
}

// ============================================================
// CHALLENGE / QUIZ SYSTEM
// ============================================================
function startChallenge() {
    if (!isChallengeEnabled) {
        startFeverTime(FEVER_TIME_NO_QUIZ);
        return;
    }
    feverBarFull    = false;
    feverBar        = 0;
    challengeActive = true;
    challengeIdx    = 0;
    challengeCorrect = 0;
    challengeTimer  = challengeTotalTime;
    challengeWaiting = false;

    // Pick 3 random questions
    const pool = [...QUIZ_DATA];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    challengeQuestions = pool.slice(0, 3);

    challengeModal.classList.remove('hidden');
    showChallengeQuestion(0);
    document.getElementById('ch-timer-fill').style.width = '100%';
    document.getElementById('ch-timer-text').textContent = Math.ceil(challengeTotalTime) + 's';
}

function showChallengeQuestion(idx) {
    const q = challengeQuestions[idx];
    document.getElementById('ch-progress').textContent = `${idx} / 3`;
    document.getElementById('ch-question').textContent = q.question;
    document.getElementById('ch-result').textContent = '';
    document.getElementById('ch-result').className = '';
    const opts = document.querySelectorAll('.ch-opt');
    opts.forEach((btn, i) => {
        btn.textContent = q.options[i] || '';
        btn.className   = 'ch-opt';
        btn.disabled    = false;
    });
}

function answerQuestion(idx) {
    if (challengeWaiting) return;
    const q = challengeQuestions[challengeIdx];
    const opts = document.querySelectorAll('.ch-opt');
    opts.forEach(btn => btn.disabled = true);
    const correct = idx === q.correctIndex;
    opts[idx].classList.add(correct ? 'correct' : 'wrong');
    if (!correct) opts[q.correctIndex].classList.add('correct');

    if (correct) {
        challengeCorrect++;
        // +3 / +5 / +7 for 1st / 2nd / 3rd correct answer
        const bonusMap  = [3, 5, 7];
        const bonusSecs = bonusMap[challengeCorrect - 1] || 0;
        // Floating text from answer button → fever bar area
        spawnFloatingText(
            `+${bonusSecs}秒`,
            GAME_W / 2, GAME_H * 0.6,
            '#ff9800', 1.6
        );
        document.getElementById('ch-result').textContent = '✓ 正確！';
    } else {
        document.getElementById('ch-result').textContent = '✗ 答錯了';
    }

    if (!seenQuizIds.includes(q.id)) {
        seenQuizIds.push(q.id);
        // Persist so 題庫 unlocks even mid-session
        try {
            const pRaw = localStorage.getItem(SAVE_KEY + '_progress') || '{}';
            const p = JSON.parse(pRaw);
            p.seenQuizIds = seenQuizIds;
            localStorage.setItem(SAVE_KEY + '_progress', JSON.stringify(p));
        } catch {}
    }

    challengeWaiting = true;
    setTimeout(() => {
        challengeWaiting = false;
        challengeIdx++;
        if (challengeIdx >= 3) {
            endChallenge();
        } else {
            showChallengeQuestion(challengeIdx);
        }
    }, 900);
}

function endChallenge() {
    challengeModal.classList.add('hidden');
    challengeActive = false;

    const feverSeconds = [0, 3, 8, 15][challengeCorrect];
    if (feverSeconds > 0) {
        startFeverTime(feverSeconds);
        document.getElementById('ch-progress').textContent = '0 / 3';
    } else {
        // All wrong: show overlay text
        spawnFloatingText('Challenge Failed', GAME_W / 2, GAME_H / 2 - 20, '#1a3a6b', 1.5);
    }
}

function updateChallenge(dt) {
    if (!challengeActive || challengeWaiting) return;
    challengeTimer = Math.max(0, challengeTimer - dt / 1000);
    const ratio = challengeTimer / challengeTotalTime;
    const fill  = document.getElementById('ch-timer-fill');
    const text  = document.getElementById('ch-timer-text');
    if (fill) fill.style.width = (ratio * 100) + '%';
    if (text) text.textContent = Math.ceil(challengeTimer) + 's';
    if (challengeTimer <= 0) {
        // Time's up - force end
        const opts = document.querySelectorAll('.ch-opt');
        opts.forEach(btn => btn.disabled = true);
        endChallenge();
    }
}

// ============================================================
// RENDERING
// ============================================================
function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    if (gameScreen === 'start') {
        renderStartScreen();
    } else if (gameScreen === 'library') {
        renderLibrary();
    } else if (gameScreen === 'quizbank') {
        renderQuizBank();
    } else {
        renderGame();
        if (isGameOver && !isLaunching) renderGameOverOverlay();
    }
}

function renderBackground(grad1, grad2) {
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H);
    grad.addColorStop(0, grad1);
    grad.addColorStop(1, grad2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_W, GAME_H);
}

function renderStartScreen() {
    renderBackground('#c8e9f7', '#d4f0e4');

    // Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#1a5f7a';
    ctx.shadowColor = 'rgba(255,255,255,0.7)';
    ctx.shadowBlur = 8;
    ctx.fillText('阿萬動物樂園', GAME_W / 2, 80);
    ctx.shadowBlur = 0;

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#4a8fa8';
    ctx.fillText('拯救過勞的阿萬園長', GAME_W / 2, 108);

    // Decorative animals (first 4 types loaded)
    const deco = [0, 1, 2, 3];
    const decoPos = [[60, 140], [280, 140], [40, 220], [300, 220]];
    deco.forEach((t, i) => {
        const key = `animal_a_${String(selectedTypes[t] + 1).padStart(2, '0')}`;
        const img = ASSET_IMAGES[key];
        if (img) {
            const [dx, dy] = decoPos[i];
            ctx.globalAlpha = 0.55;
            ctx.drawImage(img, dx - 16, dy - 16, 32, 32);
            ctx.globalAlpha = 1;
        }
    });

    // Buttons (vertical column)
    startButtons = [];
    const btnDefs = [
        { label: '開始遊戲', action: 'start',    enabled: true },
        { label: '載入進度', action: 'load',     enabled: hasSavedGame },
        { label: '（圖鑑）', action: 'library',  enabled: hasPlayedBefore },
        { label: '（題庫）', action: 'quizbank', enabled: seenQuizIds.length > 0 },
    ];

    const btnW = 200, btnH = 46, btnX = GAME_W / 2 - btnW / 2;
    let btnY = 260;

    btnDefs.forEach(def => {
        const enabled = def.enabled;
        ctx.fillStyle = enabled ? '#5bb8e8' : '#b8cfd8';
        fillRR(ctx, btnX, btnY, btnW, btnH, 23);

        ctx.fillStyle = enabled ? 'white' : '#8aa5b0';
        ctx.font = `bold 17px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(def.label, GAME_W / 2, btnY + 29);

        if (enabled) {
            startButtons.push({ x: btnX, y: btnY, w: btnW, h: btnH, action: def.action });
        }

        btnY += btnH + 14;
    });

    // Footer hint
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#4a8fa8';
    ctx.fillText('拖曳方塊交換位置，三個相連即可消除', GAME_W / 2, GAME_H - 30);

    renderFloatingTexts();
}

function renderLibrary() {
    renderBackground('#c8e9f7', '#d4f0e4');
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#1a5f7a';
    ctx.fillText('動物圖鑑', GAME_W / 2, 45);

    // Back button
    ctx.fillStyle = '#5bb8e8';
    fillRR(ctx, 10, 10, 60, 28, 14);
    ctx.fillStyle = 'white';
    ctx.font = '13px sans-serif';
    ctx.fillText('← 返回', 40, 28);

    // 4x3 grid of all 12 animals
    const cols = 4, rows = 3;
    const cellW = 72, cellH = 80;
    const startX = (GAME_W - cols * cellW) / 2;
    const startY = 70;

    for (let i = 0; i < NUM_ANIMAL_TYPES; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellW;
        const y = startY + row * cellH;
        const seen = seenAnimalTypes.includes(i);
        const key = `animal_a_${String(i + 1).padStart(2, '0')}`;
        const img = ASSET_IMAGES[key];

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        fillRR(ctx, x + 4, y + 4, cellW - 8, cellH - 12, 10);

        if (img && seen) {
            ctx.drawImage(img, x + cellW / 2 - 16, y + 8, 32, 32);
        } else {
            ctx.fillStyle = '#b0ccd8';
            ctx.font = '20px sans-serif';
            ctx.fillText('?', x + cellW / 2, y + 28);
        }
        ctx.fillStyle = seen ? '#1a5f7a' : '#aaa';
        ctx.font = '10px sans-serif';
        ctx.fillText(`No.${i + 1}`, x + cellW / 2, y + 56);
    }

    renderFloatingTexts();
}

function renderQuizBank() {
    renderBackground('#c8e9f7', '#d4f0e4');
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#1a5f7a';
    ctx.fillText('衛教題庫', GAME_W / 2, 45);

    ctx.fillStyle = '#5bb8e8';
    fillRR(ctx, 10, 10, 60, 28, 14);
    ctx.fillStyle = 'white';
    ctx.font = '13px sans-serif';
    ctx.fillText('← 返回', 40, 28);

    const seen = QUIZ_DATA.filter(q => seenQuizIds.includes(q.id));
    if (seen.length === 0) {
        ctx.fillStyle = '#4a8fa8';
        ctx.font = '14px sans-serif';
        ctx.fillText('完成衛教挑戰後題目會顯示在這裡', GAME_W / 2, 200);
    } else {
        ctx.textAlign = 'left';
        let y = 75;
        seen.forEach((q, i) => {
            if (y > GAME_H - 40) return;
            ctx.fillStyle = '#1a5f7a';
            ctx.font = 'bold 12px sans-serif';
            const lines = wrapText(ctx, `Q${i+1}. ${q.question}`, 340);
            lines.forEach(line => { ctx.fillText(line, 20, y); y += 16; });
            ctx.fillStyle = '#4caf50';
            ctx.font = '11px sans-serif';
            ctx.fillText(`✓ ${q.options[q.correctIndex]}`, 24, y); y += 14;
            ctx.fillStyle = '#4a8fa8';
            ctx.font = '11px sans-serif';
            const expLines = wrapText(ctx, q.explanation, 336);
            expLines.forEach(line => { ctx.fillText(line, 22, y); y += 14; });
            y += 8;
        });
    }
    renderFloatingTexts();
}

function wrapText(ctx, text, maxW) {
    const words = text.split('');
    const lines = [];
    let current = '';
    for (const ch of words) {
        const test = current + ch;
        if (ctx.measureText(test).width > maxW && current.length > 0) {
            lines.push(current);
            current = ch;
        } else {
            current = test;
        }
    }
    if (current) lines.push(current);
    return lines;
}

function renderGame() {
    renderBackground('#c8e9f7', '#d0f0e8');
    renderTimerBar();
    renderBoardGrid();
    renderTiles();
    if (!isLaunching) renderOverlays();
    renderFeverBar();
    renderComboDisplay();
    if (feverIntroActive) renderFeverIntro();
    // Red vignette pulse when ≤ 5s remaining
    if (timeLeft <= 5 && timeLeft > 0 && !isFeverTime && !isLaunching) {
        const t         = Math.max(0, (5 - timeLeft) / 5);
        const intensity = t * t * 0.18;
        const pulse     = 0.5 + 0.5 * Math.sin(totalElapsed / 220);
        ctx.fillStyle   = `rgba(210,20,20,${intensity * pulse})`;
        ctx.fillRect(0, 0, GAME_W, GAME_H);
    }
    renderFloatingTexts();
    renderParticles();
}

function renderTimerBar() {
    const ratio = Math.max(0, Math.min(1, timeLeft / TOTAL_TIME));
    // Background
    ctx.fillStyle = '#b8daf0';
    fillRR(ctx, TIMER_X, TIMER_Y, TIMER_W, TIMER_H, TIMER_H / 2);

    // Fill color: green → amber → red
    if (ratio > 0) {
        const h = Math.round(ratio * 120);
        ctx.fillStyle = `hsl(${h}, 70%, 45%)`;
        const fillW = TIMER_W * ratio;
        if (fillW >= TIMER_W - 0.5) {
            fillRR(ctx, TIMER_X, TIMER_Y, TIMER_W, TIMER_H, TIMER_H / 2);
        } else {
            fillRRLeft(ctx, TIMER_X, TIMER_Y, fillW, TIMER_H, TIMER_H / 2);
        }
    }

    // Text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(timeLeft) + 's', TIMER_X + TIMER_W / 2, TIMER_Y + TIMER_H / 2 + 4);
}

function renderBoardGrid() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const x = BOARD_X + c * CELL_SIZE;
            const y = BOARD_Y + r * CELL_SIZE;
            ctx.fillStyle = (r + c) % 2 === 0 ? '#daeef8' : '#c4e2f4';
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
    // Border
    ctx.strokeStyle = '#a0ccec';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(BOARD_X, BOARD_Y, BOARD_W, BOARD_H);
}

function renderTiles() {
    ctx.save();
    // During launch tiles fly everywhere; skip board clip
    if (!isLaunching) {
        ctx.beginPath();
        ctx.rect(BOARD_X, BOARD_Y - CELL_SIZE * 2, BOARD_W, BOARD_H + CELL_SIZE * 2);
        ctx.clip();
    }

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const sp = sprites[r][c];
            if (!sp || sp.alpha <= 0.01) continue;

            let cx, cy;
            if (isLaunching) {
                cx = sp.launchX || 0;
                cy = sp.launchY || 0;
            } else {
                // Compute grid position
                let px = BOARD_X + c * CELL_SIZE;
                let py = BOARD_Y + sp.visualRow * CELL_SIZE;

                // Apply swap animation offset
                if (swapPair && (r === swapPair.r1 && c === swapPair.c1 || r === swapPair.r2 && c === swapPair.c2)) {
                    const isFirst = r === swapPair.r1 && c === swapPair.c1;
                    const dr = isFirst ? swapPair.r2 - swapPair.r1 : swapPair.r1 - swapPair.r2;
                    const dc = isFirst ? swapPair.c2 - swapPair.c1 : swapPair.c1 - swapPair.c2;
                    px += dc * CELL_SIZE * swapProgress;
                    py += dr * CELL_SIZE * swapProgress;
                }

                // Countdown shake offset
                px += sp.shakeX || 0;
                py += sp.shakeY || 0;

                cx = px + CELL_SIZE / 2;
                cy = py + CELL_SIZE / 2;
            }

            ctx.save();
            ctx.globalAlpha = sp.alpha;
            ctx.translate(cx, cy);
            ctx.scale(sp.scale, sp.scale);

            const animalIdx = selectedTypes[sp.type] + 1;
            const prefix = sp.showB ? 'animal_b_' : 'animal_a_';
            const key = prefix + String(animalIdx).padStart(2, '0');
            const img = ASSET_IMAGES[key];

            if (img && img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, -SPRITE_SIZE / 2, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
            } else {
                // Fallback colored circle
                const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#f06595','#74c0fc'];
                ctx.fillStyle = colors[sp.type % colors.length];
                ctx.beginPath();
                ctx.arc(0, 0, 13, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }
    ctx.restore();
}

function renderOverlays() {
    // Idle hint: flash two tiles that form a valid swap after 5s of no match
    if (hintMove && phase === PHASE.IDLE && !isGameOver) {
        const flash = 0.35 + 0.35 * Math.sin(totalElapsed / 180);
        ctx.fillStyle = `rgba(255,240,60,${flash})`;
        [[hintMove.r1, hintMove.c1], [hintMove.r2, hintMove.c2]].forEach(([r, c]) => {
            fillRR(ctx,
                BOARD_X + c * CELL_SIZE + 2,
                BOARD_Y + r * CELL_SIZE + 2,
                CELL_SIZE - 4, CELL_SIZE - 4, 7);
        });
    }
    // Hover
    if (hoverTile && phase === PHASE.IDLE) {
        const img = ASSET_IMAGES['hovering'];
        if (img) {
            const x = BOARD_X + hoverTile.c * CELL_SIZE + SPRITE_OFF;
            const y = BOARD_Y + hoverTile.r * CELL_SIZE + SPRITE_OFF;
            ctx.globalAlpha = 0.7;
            ctx.drawImage(img, x, y, SPRITE_SIZE, SPRITE_SIZE);
            ctx.globalAlpha = 1;
        }
    }
    // Selected
    if (selectedTile) {
        const img = ASSET_IMAGES['selected'];
        if (img) {
            const x = BOARD_X + selectedTile.c * CELL_SIZE + SPRITE_OFF;
            const y = BOARD_Y + selectedTile.r * CELL_SIZE + SPRITE_OFF;
            ctx.drawImage(img, x, y, SPRITE_SIZE, SPRITE_SIZE);
        } else {
            // Fallback highlight
            ctx.strokeStyle = '#fff176';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                BOARD_X + selectedTile.c * CELL_SIZE + 2,
                BOARD_Y + selectedTile.r * CELL_SIZE + 2,
                CELL_SIZE - 4, CELL_SIZE - 4
            );
        }
    }
}

function renderFeverIntro() {
    const t = Math.min(feverIntroTimer / 1200, 1); // 0 → 1 over 1.2s
    let alpha, scale, y;

    if (t < 0.25) {
        // Appear: fade + scale in
        const p = t / 0.25;
        alpha = p;
        scale = 0.6 + p * 1.4;
        y = GAME_H * 0.42;
    } else if (t < 0.60) {
        // Hold at peak
        alpha = 1;
        scale = 2.0;
        y = GAME_H * 0.42;
    } else {
        // Fly down toward fever bar and shrink out
        const p = (t - 0.60) / 0.40;
        alpha = 1 - p;
        scale = 2.0 - p * 1.3;
        y = GAME_H * 0.42 + p * (FEVER_Y + FEVER_H / 2 - GAME_H * 0.42);
    }

    const hue = (feverRainbowT * 120) % 360;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.textAlign = 'center';
    ctx.font = `bold ${Math.round(34 * scale)}px sans-serif`;

    // Rainbow horizontal gradient
    const grad = ctx.createLinearGradient(GAME_W * 0.1, 0, GAME_W * 0.9, 0);
    for (let i = 0; i <= 6; i++) {
        grad.addColorStop(i / 6, `hsl(${(hue + i * 55) % 360}, 90%, 62%)`);
    }
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(255,220,60,0.85)';
    ctx.shadowBlur  = 24;
    ctx.fillText('FEVER TIME!', GAME_W / 2, y);
    ctx.shadowBlur = 0;
    ctx.restore();
}

function renderFeverBar() {
    if (isGameOver) return; // hidden during game over (canvas UI takes over)

    // Background
    ctx.fillStyle = '#b8daf0';
    fillRR(ctx, FEVER_X, FEVER_Y, FEVER_W, FEVER_H, FEVER_H / 2);

    let fillW;
    if (isFeverTime) {
        fillW = FEVER_W * Math.max(0, Math.min(1, feverTimeLeft / feverMaxTime));
        if (fillW > 0) {
            const grad = ctx.createLinearGradient(FEVER_X, 0, FEVER_X + FEVER_W, 0);
            for (let i = 0; i <= 6; i++) {
                grad.addColorStop(i / 6, `hsl(${(feverRainbowT * 90 + i * 60) % 360}, 80%, 55%)`);
            }
            ctx.fillStyle = grad;
            if (fillW >= FEVER_W - 0.5) {
                fillRR(ctx, FEVER_X, FEVER_Y, FEVER_W, FEVER_H, FEVER_H / 2);
            } else {
                fillRRLeft(ctx, FEVER_X, FEVER_Y, fillW, FEVER_H, FEVER_H / 2);
            }
        }
    } else {
        fillW = FEVER_W * Math.min(1, feverBar / FEVER_MAX);
        if (fillW > 0) {
            const grad = ctx.createLinearGradient(FEVER_X, 0, FEVER_X + FEVER_W, 0);
            grad.addColorStop(0, '#2196F3');
            grad.addColorStop(1, '#42A5F5');
            ctx.fillStyle = grad;
            if (fillW >= FEVER_W - 0.5) {
                fillRR(ctx, FEVER_X, FEVER_Y, FEVER_W, FEVER_H, FEVER_H / 2);
            } else {
                fillRRLeft(ctx, FEVER_X, FEVER_Y, fillW, FEVER_H, FEVER_H / 2);
            }
        }
        // Full: pulsing golden glow + bright white shimmer
        if (feverBarFull) {
            const pulse = 0.5 + 0.5 * Math.sin(totalElapsed / 130);
            // Outer golden glow
            ctx.shadowColor = `rgba(255,200,30,${0.7 + 0.3 * pulse})`;
            ctx.shadowBlur  = 18 + 10 * pulse;
            ctx.fillStyle   = 'rgba(0,0,0,0)';
            fillRR(ctx, FEVER_X - 1, FEVER_Y - 1, FEVER_W + 2, FEVER_H + 2, FEVER_H / 2 + 1);
            ctx.shadowBlur  = 0;
            // Bright white shimmer overlay
            ctx.fillStyle = `rgba(255,255,220,${0.28 + 0.28 * pulse})`;
            fillRR(ctx, FEVER_X, FEVER_Y, FEVER_W, FEVER_H, FEVER_H / 2);
        }
    }

    // Label
    ctx.textAlign = 'center';
    if (feverBarFull && !isFeverTime) {
        // Bouncing, bright "READY!" label
        const bounce = Math.sin(totalElapsed / 230) * 2;
        const pulse  = 0.5 + 0.5 * Math.sin(totalElapsed / 130);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = `rgb(255,${Math.round(220 + 35 * pulse)},60)`;
        ctx.shadowColor = 'rgba(255,160,0,0.9)';
        ctx.shadowBlur  = 8;
        ctx.fillText('✨ 點擊觸發！', FEVER_X + FEVER_W / 2, FEVER_Y + FEVER_H / 2 + 4 + bounce);
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = 'bold 11px sans-serif';
        const label = isFeverTime
            ? `FEVER! ${Math.ceil(feverTimeLeft)}s`
            : `FEVER ${feverBar}/${FEVER_MAX}`;
        ctx.fillText(label, FEVER_X + FEVER_W / 2, FEVER_Y + FEVER_H / 2 + 4);
    }
}

function renderComboDisplay() {
    if (comboDisplay.alpha <= 0.01 || comboDisplay.count < 2) return;
    const cx = GAME_W / 2;
    const cy = FEVER_Y + FEVER_H + 35;
    ctx.globalAlpha = comboDisplay.alpha;
    ctx.textAlign = 'center';
    ctx.font = `bold 26px sans-serif`;
    ctx.fillStyle = '#ff9800';
    ctx.shadowColor = 'rgba(255,152,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.fillText(`COMBO ×${comboDisplay.count}`, cx, cy);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

function renderFloatingTexts() {
    floatingTexts.forEach(f => {
        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.round(18 * f.scale)}px sans-serif`;
        ctx.fillStyle = f.color || 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillText(f.text, f.x, f.y);
        ctx.shadowBlur = 0;
        ctx.restore();
    });
}

function renderParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function renderGameOverOverlay() {
    // Dark overlay (fade in)
    const oa = Math.min(0.80, gameOverAlpha * 0.80);
    ctx.fillStyle = `rgba(10,28,55,${oa})`;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    if (gameOverAlpha < 0.6) return; // wait before showing UI

    const uiAlpha = Math.min(1, (gameOverAlpha - 0.5) / 0.5);
    ctx.save();
    ctx.globalAlpha = uiAlpha;

    // "Game Over" title
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(140,200,255,0.9)';
    ctx.shadowBlur = 18;
    ctx.fillText('Game Over', GAME_W / 2, 192);
    ctx.shadowBlur = 0;

    // Score label
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'rgba(200,235,255,0.88)';
    ctx.fillText('最終分數', GAME_W / 2, 226);

    // Score value
    ctx.font = 'bold 46px sans-serif';
    ctx.fillStyle = '#fff176';
    ctx.shadowColor = 'rgba(255,200,0,0.7)';
    ctx.shadowBlur = 14;
    ctx.fillText(score, GAME_W / 2, 282);
    ctx.shadowBlur = 0;

    // Three buttons: 再玩一次 / 分享 / 儲存圖片
    gameOverButtons = [];
    const btnDefs = [
        { label: '再玩一次', action: 'retry',  color: '#3a9ed4', hover: '#5bb8e8' },
        { label: '分享',     action: 'share',  color: '#3a9e6a', hover: '#4caf80' },
        { label: '儲存圖片', action: 'save',   color: '#7060c8', hover: '#8878e8' },
    ];
    const btnW = 88, btnH = 44, gap = 12;
    const totalBtnW = btnDefs.length * btnW + (btnDefs.length - 1) * gap;
    let bx = (GAME_W - totalBtnW) / 2;
    const by = 320;

    btnDefs.forEach(def => {
        // Button shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        fillRR(ctx, bx + 2, by + 4, btnW, btnH, btnH / 2);
        // Button face
        ctx.fillStyle = def.color;
        fillRR(ctx, bx, by, btnW, btnH, btnH / 2);
        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(def.label, bx + btnW / 2, by + btnH / 2 + 5);

        gameOverButtons.push({ x: bx, y: by, w: btnW, h: btnH, action: def.action });
        bx += btnW + gap;
    });

    ctx.restore();
}

// ============================================================
// CONFIRM RESET
// ============================================================
function showConfirmReset() {
    if (gameScreen !== 'playing') return;
    document.getElementById('confirm-reset-modal').classList.remove('hidden');
    isPaused = true;
}

// ============================================================
// GAME LOOP
// ============================================================
let lastTime = 0;
let animFrameId = null;

function startLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    const dt = Math.min(timestamp - lastTime, 100); // cap dt to avoid huge jumps
    lastTime = timestamp;
    if (!isPaused && (!isGameOver || isLaunching || gameOverAlpha < 1)) {
        update(dt);
    } else if (challengeActive) {
        updateChallenge(dt);
        updateFloatingTexts(dt);
        updateParticles(dt);
    }
    render();
    animFrameId = requestAnimationFrame(gameLoop);
}

// ============================================================
// CORE GAME FUNCTIONS
// ============================================================
function init() {
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width  = GAME_W;
    canvas.height = GAME_H;
    canvas.style.cssText = 'position:absolute;top:0;left:0;';
    document.getElementById('game-container').insertBefore(canvas, uiLayer);
    ctx = canvas.getContext('2d');

    checkSavedGame();
    syncQuizToggle();

    // Default to start screen
    gameScreen = 'start';
    isPlaying  = false;
    isGameOver = false;
    updateUIForScreen();

    // Keep ui-layer visible for settings button on start screen
    uiLayer.classList.remove('hidden');
    gameHeader.classList.add('hidden');
    gameFooter.classList.add('hidden');

    // Pre-populate selectedTypes so decoration animals can show
    const pool = Array.from({ length: NUM_ANIMAL_TYPES }, (_, i) => i);
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    selectedTypes = pool.slice(0, ACTIVE_TYPES);

    startLoop();
}

function update(dt) {
    totalElapsed += dt;

    if (gameScreen === 'start') {
        updateFloatingTexts(dt);
        return;
    }
    if (gameScreen === 'library' || gameScreen === 'quizbank') {
        updateFloatingTexts(dt);
        return;
    }
    if (isGameOver) {
        if (isLaunching) {
            launchTimer += dt;
            const s = dt / 1000;
            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    const sp = sprites[r][c];
                    if (!sp) continue;
                    sp.launchX = (sp.launchX || 0) + sp.vx * s;
                    sp.launchY = (sp.launchY || 0) + sp.vy * s;
                    sp.vy += 900 * s;
                    sp.alpha = Math.max(0, 1 - Math.max(0, launchTimer - 400) / 550);
                }
            }
            if (launchTimer >= 950) {
                isLaunching = false;
                showGameOverUI();
            }
        } else {
            gameOverAlpha = Math.min(1, gameOverAlpha + dt / 600);
        }
        updateFloatingTexts(dt);
        updateParticles(dt);
        return;
    }

    if (challengeActive) {
        updateChallenge(dt);
        updateFloatingTexts(dt);
        updateParticles(dt);
        return;
    }

    // Fever intro: advance timer, pause game countdown
    if (feverIntroActive) {
        feverIntroTimer += dt;
        feverRainbowT   += dt / 1000;
        if (feverIntroTimer >= 1200) activateFeverTime();
        // Game timer paused during intro — skip to phase/float/particle updates
        updatePhase(dt);
        updateFloatingTexts(dt);
        updateParticles(dt);
        return;
    }

    // Game timer
    if (isFeverTime) {
        feverTimeLeft -= dt / 1000;
        feverRainbowT += dt / 1000;
        if (feverTimeLeft <= 0) endFeverTime();
    }

    timeLeft -= dt / 1000;
    if (timeLeft <= 0) {
        timeLeft = 0;
        endGame();
        return;
    }

    // Countdown shake: tiles jitter when ≤ 5s left (quadratic — barely noticeable at start)
    if (timeLeft <= 5 && !isFeverTime) {
        const t   = Math.max(0, (5 - timeLeft) / 5); // 0 → 1
        const mag = t * t * 10;                       // 0 → 10px (accelerates near end)
        if (mag > 0.05) {
            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    const sp = sprites[r][c];
                    if (sp) {
                        sp.shakeX = (Math.random() - 0.5) * 2 * mag;
                        sp.shakeY = (Math.random() - 0.5) * 2 * mag;
                    }
                }
            }
        }
    } else if (isFeverTime) {
        for (let r = 0; r < BOARD_SIZE; r++)
            for (let c = 0; c < BOARD_SIZE; c++)
                if (sprites[r][c]) { sprites[r][c].shakeX = 0; sprites[r][c].shakeY = 0; }
    }

    // Combo display decay
    if (comboDisplay.timer > 0) {
        comboDisplay.timer -= dt / 1000;
        comboDisplay.alpha = clamp(comboDisplay.timer / 0.5, 0, 1);
    }

    // Idle hint: show valid swap after 5s of no elimination
    if (phase === PHASE.IDLE && !feverIntroActive) {
        noMatchTimer += dt / 1000;
        if (noMatchTimer >= 5 && !hintMove) {
            hintMove = findHintMove();
        }
    }

    updatePhase(dt);
    updateFloatingTexts(dt);
    updateParticles(dt);
}

function startGame() {
    initBoard();
    score       = 0;
    timeLeft    = TOTAL_TIME;
    feverBar    = 0;
    feverBarFull = false;
    isFeverTime  = false;
    feverTimeLeft = 0;
    feverIntroActive = false;
    feverIntroTimer  = 0;
    isLaunching  = false;
    launchTimer  = 0;
    noMatchTimer = 0;
    hintMove     = null;
    gameOverButtons = [];
    comboCount  = 0;
    phase       = PHASE.IDLE;
    floatingTexts = [];
    particles   = [];
    comboDisplay = { count: 0, alpha: 0, timer: 0 };
    gameOverAlpha = 0;
    hoverTile   = null;
    selectedTile = null;
    dragStart   = null;
    scoreEl.textContent = '0';

    isPlaying   = true;
    isGameOver  = false;
    isPaused    = false;
    gameScreen  = 'playing';
    updateUIForScreen();

    gameHeader.classList.add('hidden');
    gameFooter.classList.add('hidden');
    uiLayer.classList.remove('hidden');

    if (bgmVolume > 0) bgm.play().catch(() => {});
}

function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    hasSavedGame = false;
    gameScreen   = 'start';
    isPlaying    = false;
    isGameOver   = false;
    isPaused     = false;
    challengeActive = false;
    isLaunching  = false;
    launchTimer  = 0;
    updateUIForScreen();
    challengeModal.classList.add('hidden');
    score = 0;
    scoreEl.textContent = '0';
    gameHeader.classList.add('hidden');
    gameFooter.classList.add('hidden');
    uiLayer.classList.remove('hidden');
    document.getElementById('end-modal').classList.add('hidden');
    document.getElementById('confirm-reset-modal').classList.add('hidden');
    floatingTexts = [];
    particles     = [];
}

function handleGameOverButton(action) {
    if (action === 'retry') {
        resetGame();
        return;
    }
    const shareText = `${GAME_TITLE} 我得了 ${score} 分！`;
    if (action === 'share') {
        if (navigator.share) {
            navigator.share({ title: GAME_TITLE, text: shareText, url: GAME_URL }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(`${shareText} ${GAME_URL}`);
        }
        return;
    }
    if (action === 'save') {
        const dataURL = canvas.toDataURL('image/png');
        const fileName = `${SAVE_KEY}_${score}.png`;
        if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            fetch(dataURL).then(r => r.blob()).then(blob => {
                const file = new File([blob], fileName, { type: 'image/png' });
                if (navigator.canShare?.({ files: [file] })) {
                    navigator.share({ files: [file], title: GAME_TITLE });
                } else {
                    _downloadDataURL(dataURL, fileName);
                }
            }).catch(() => _downloadDataURL(dataURL, fileName));
        } else {
            _downloadDataURL(dataURL, fileName);
        }
    }
}

function _downloadDataURL(dataURL, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = dataURL;
    a.click();
}

function showGameOverUI() {
    // Game over UI is drawn on canvas — just hide the in-game UI layer
    uiLayer.classList.add('hidden');
}

function endGame() {
    if (isGameOver) return;
    isGameOver = true;
    isPlaying  = false;
    gameScreen = 'gameover';
    updateUIForScreen();
    bgm.pause();

    hasPlayedBefore = true;
    selectedTypes.forEach(t => { if (!seenAnimalTypes.includes(t)) seenAnimalTypes.push(t); });

    // Persist unlock data and clear mid-game save
    try {
        localStorage.setItem(SAVE_KEY + '_progress', JSON.stringify({
            hasPlayedBefore, seenAnimalTypes, seenQuizIds, isChallengeEnabled,
        }));
    } catch {}
    localStorage.removeItem(SAVE_KEY);
    hasSavedGame = false;

    // Launch all tiles off screen; game-over DOM shown after animation finishes
    isLaunching = true;
    launchTimer = 0;
    const cx0 = GAME_W / 2;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const sp = sprites[r][c];
            if (!sp) continue;
            const tx = BOARD_X + (c + 0.5) * CELL_SIZE;
            const ty = BOARD_Y + ((sp.visualRow != null ? sp.visualRow : r) + 0.5) * CELL_SIZE;
            sp.launchX = tx;
            sp.launchY = ty;
            const outward = (tx - cx0) / (GAME_W / 2); // −1 … +1
            sp.vx = outward * 200 + (Math.random() - 0.5) * 380;
            sp.vy = -160 - Math.random() * 460;
            sp.shakeX = 0;
            sp.shakeY = 0;
        }
    }
}

// ============================================================
// INPUT — POINTER EVENTS
// ============================================================
document.addEventListener('pointerdown', (e) => {
    initAudioContext();

    // Block if modals are open
    if (!settingsModal.classList.contains('hidden')) return;
    if (!document.getElementById('confirm-reset-modal').classList.contains('hidden')) return;
    if (challengeActive) return;

    pointerDown = true;
    pointerId   = e.pointerId;

    const pos = getCanvasPos(e);

    // Start screen clicks
    if (gameScreen === 'start') {
        for (const btn of startButtons) {
            if (pos.x >= btn.x && pos.x <= btn.x + btn.w &&
                pos.y >= btn.y && pos.y <= btn.y + btn.h) {
                if (!audioCtx) initAudioContext();
                if (btn.action === 'start') {
                    startGame();
                } else if (btn.action === 'load') {
                    if (!loadAndApplySave()) {
                        spawnFloatingText('無存檔', GAME_W / 2, 350, '#ff6b6b', 1.3);
                    }
                } else if (btn.action === 'library') {
                    gameScreen = 'library';
                    updateUIForScreen();
                } else if (btn.action === 'quizbank') {
                    gameScreen = 'quizbank';
                    updateUIForScreen();
                }
                return;
            }
        }
        return;
    }

    // Library / quizbank back button
    if (gameScreen === 'library' || gameScreen === 'quizbank') {
        if (pos.x >= 10 && pos.x <= 70 && pos.y >= 10 && pos.y <= 38) {
            gameScreen = 'start';
            updateUIForScreen();
        }
        return;
    }

    // Game over canvas buttons
    if (isGameOver && !isLaunching) {
        for (const btn of gameOverButtons) {
            if (pos.x >= btn.x && pos.x <= btn.x + btn.w &&
                pos.y >= btn.y && pos.y <= btn.y + btn.h) {
                handleGameOverButton(btn.action);
                return;
            }
        }
        return;
    }

    // Fever bar tap
    if (feverBarFull && !isFeverTime &&
        pos.x >= FEVER_X && pos.x <= FEVER_X + FEVER_W &&
        pos.y >= FEVER_Y && pos.y <= FEVER_Y + FEVER_H) {
        startChallenge();
        return;
    }

    // Board input
    const tile = getTileAt(pos.x, pos.y);
    if (tile && phase === PHASE.IDLE) {
        selectedTile = tile;
        dragStart    = { x: pos.x, y: pos.y, r: tile.r, c: tile.c };
    }
});

document.addEventListener('pointermove', (e) => {
    if (!pointerDown || e.pointerId !== pointerId) {
        // Hover (no button pressed or different pointer — mouse hover)
        if (!pointerDown) {
            const pos = getCanvasPos(e);
            hoverTile = getTileAt(pos.x, pos.y);
        }
        return;
    }

    if (gameScreen !== 'playing' || isGameOver || challengeActive) return;
    if (!dragStart || phase !== PHASE.IDLE) return;

    const pos = getCanvasPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    if (Math.hypot(dx, dy) > 16) {
        const dir = Math.abs(dx) > Math.abs(dy)
            ? (dx > 0 ? 'right' : 'left')
            : (dy > 0 ? 'down' : 'up');
        trySwap(dragStart.r, dragStart.c, dir);
        dragStart    = null;
        selectedTile = null;
        pointerDown  = false;
    }
});

document.addEventListener('pointerup', (e) => {
    if (e.pointerId === pointerId) {
        pointerDown  = false;
        pointerId    = null;
        dragStart    = null;
    }
});

// ============================================================
// TAB VISIBILITY — AUTO MUTE + AUTO SAVE
// ============================================================
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        if (isAutoMuteEnabled) bgm.pause();
        saveGameState();
    } else {
        lastTime = performance.now();
        if (audioCtx?.state === 'suspended') audioCtx.resume();
        if (isAutoMuteEnabled && isPlaying && bgmVolume > 0) bgm.play().catch(() => {});
    }
});

// ============================================================
// SETTINGS EVENT HANDLERS
// ============================================================
document.getElementById('settings-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    settingsModal.classList.remove('hidden');
    settingsModal.style.display = 'flex';
    isPaused = true;
});

document.getElementById('close-settings').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    settingsModal.style.display = 'none';
    isPaused = false;
    if (bgm.paused && bgmVolume > 0 && isPlaying) bgm.play().catch(() => {});
});

bgmSlider.addEventListener('input', (e) => {
    bgmVolume = e.target.value / 100;
    if (bgmGainNode) bgmGainNode.gain.setTargetAtTime(bgmVolume, audioCtx.currentTime, 0.01);
    else bgm.volume = bgmVolume;
    if (bgmVolume > 0 && bgm.paused && isPlaying) bgm.play().catch(() => {});
});

sfxSlider.addEventListener('input', (e) => {
    sfxVolume = e.target.value / 100;
    if (sfxGainNode) sfxGainNode.gain.setTargetAtTime(sfxVolume, audioCtx.currentTime, 0.01);
});

document.getElementById('auto-mute-toggle').addEventListener('change', (e) => {
    isAutoMuteEnabled = e.target.checked;
});

document.getElementById('lang-select').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});

document.getElementById('quiz-toggle').addEventListener('change', (e) => {
    isChallengeEnabled = e.target.checked;
    try {
        const pRaw = localStorage.getItem(SAVE_KEY + '_progress') || '{}';
        const p = JSON.parse(pRaw);
        p.isChallengeEnabled = isChallengeEnabled;
        localStorage.setItem(SAVE_KEY + '_progress', JSON.stringify(p));
    } catch {}
});

document.getElementById('download-save-btn').addEventListener('click', downloadSave);

document.getElementById('upload-save-btn').addEventListener('click', () => {
    document.getElementById('upload-save-input').click();
});

document.getElementById('upload-save-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            applyGameState(JSON.parse(ev.target.result));
            settingsModal.classList.add('hidden');
            settingsModal.style.display = 'none';
            isPaused = false;
        } catch { console.error('Invalid save file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
});

// Confirm Reset
if (retryBtnTop) retryBtnTop.addEventListener('click', showConfirmReset);
if (retryBtn)    retryBtn.addEventListener('click', () => { resetGame(); });

document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
    document.getElementById('confirm-reset-modal').classList.add('hidden');
    isPaused = false;
});

document.getElementById('confirm-ok-btn').addEventListener('click', () => {
    document.getElementById('confirm-reset-modal').classList.add('hidden');
    isPaused = false;
    resetGame();
});

document.getElementById('close-end').addEventListener('click', () => {
    document.getElementById('end-modal').classList.add('hidden');
});

// Challenge option buttons
document.querySelectorAll('.ch-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!challengeActive) return;
        answerQuestion(parseInt(btn.getAttribute('data-idx')));
    });
});

// ============================================================
// SCREENSHOT / SHARE
// ============================================================
if (screenshotBtn) {
    screenshotBtn.addEventListener('click', async () => {
        if (!canvas) return;
        try {
            const dataURL = canvas.toDataURL('image/png');
            if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const blob = await (await fetch(dataURL)).blob();
                const file = new File([blob], `${SAVE_KEY}_${score}.png`, { type: 'image/png' });
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ files: [file], title: GAME_TITLE });
                    return;
                }
            }
            const a = document.createElement('a');
            a.download = `${SAVE_KEY}_${score}.png`;
            a.href = dataURL;
            a.click();
        } catch (err) { console.error('Screenshot failed', err); }
    });
}

if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const text = `${GAME_TITLE} 我得了 ${score} 分！`;
        if (navigator.share) {
            navigator.share({ title: GAME_TITLE, text, url: GAME_URL }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(`${text} ${GAME_URL}`);
        }
    });
}

// ============================================================
// RESPONSIVE SCALING
// ============================================================
function updateContainerScale() {
    const wrapper   = document.getElementById('main-wrapper');
    const container = document.getElementById('game-container');
    if (!wrapper || !container) return;
    const style  = window.getComputedStyle(wrapper);
    const availW = wrapper.clientWidth  - parseFloat(style.paddingLeft)  - parseFloat(style.paddingRight);
    const availH = wrapper.clientHeight - parseFloat(style.paddingTop)   - parseFloat(style.paddingBottom);
    const scale  = Math.min(availW / GAME_W, availH / GAME_H, 1);
    container.style.transform = `scale(${scale})`;
    wrapper.style.alignItems  = scale < 1 ? 'flex-start' : 'center';
}

window.addEventListener('resize', updateContainerScale);
window.addEventListener('orientationchange', updateContainerScale);
updateContainerScale();

// ============================================================
// INIT
// ============================================================
applyLanguage(localStorage.getItem(SAVE_KEY + '_lang') || 'auto');
preloadAssets();
