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
        library: '動物圖鑑', quizBank: '衛教題庫',
        subtitle: '拯救過勞的阿萬園長',
        footerLine1: '拖曳動物朋友們的位置，讓他們三隻以上相連',
        footerLine2: '幫助阿萬園長恢復動物園的秩序',
        soundPromptTitle: '開啟聲音？', soundYes: '是', soundNo: '否',
        quizHint: '關閉後 Fever Time 固定為5秒',
        contactNIKA: '聯絡 NIKA', supportNIKA: '贊助 NIKA',
        creditsLabel: '製作‧美術',
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
        library: 'Library', quizBank: 'Quiz List',
        subtitle: 'Save R1, the Overworked Zookeeper',
        footerLine1: 'Drag animals to connect 3 or more of the same kind',
        footerLine2: 'Help Zookeeper R1 restore order to the zoo',
        soundPromptTitle: 'Enable Sound?', soundYes: 'Yes', soundNo: 'No',
        quizHint: 'Disabled: Fever Time is fixed at 5 seconds',
        contactNIKA: 'Contact', supportNIKA: 'Support',
        creditsLabel: 'Design & Art',
    },
    ja: {
        score: 'スコア', gameOver: 'ゲームオーバー', retry: 'もう一度', share: 'シェア', saveImg: '画像保存',
        settingsTitle: '設定', soundSection: 'サウンド', bgmVolume: 'BGM 音量', sfxVolume: 'SFX 音量',
        autoMute: '非表示時ミュート', saveSection: 'セーブデータ', downloadSave: '保存', uploadSave: '読込',
        langSection: '言語', closeSettings: '閉じる',
        confirmTitle: 'ゲームをリスタートしますか？', confirmCancel: 'つづける', confirmOk: 'リスタート',
        startMsg: 'タップしてスタート',
        quizChallenge: 'クイズチャレンジ', challengeSection: 'クイズチャレンジ',
        startGame: 'スタート', loadGame: 'ロード',
        library: '動物図鑑', quizBank: 'クイズ一覧',
        subtitle: '園長R1を過労から救え',
        footerLine1: '同じ動物を3匹以上つなげて',
        footerLine2: '動物園に平和を取り戻そう',
        soundPromptTitle: 'サウンドを有効にする？', soundYes: 'はい', soundNo: 'いいえ',
        quizHint: 'オフ時 Fever Timeは5秒固定',
        contactNIKA: 'お問い合わせ', supportNIKA: 'NIKAを応援',
        creditsLabel: '制作・アート',
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
let challengeQuestions      = [];   // 3 QUIZ_DATA items for this round
let challengeShuffledOrders = [];   // shuffled option order per question [[0,2,1], ...]
let challengeIdx        = 0;
let challengeTimer      = 0;
let challengeTotalTime  = 15;
let challengeCorrect    = 0;
let challengeWaiting    = false; // waiting before showing next question
let challengeOpenTime   = 0;    // timestamp when challenge modal opened (for touch bleed guard)

// Input
let hoverTile    = null;   // {r,c}
let selectedTile = null;   // {r,c}
let dragStart    = null;   // {x,y,r,c}
let pointerDown  = false;
let pointerId    = null;

// Floating texts and particles
let floatingTexts = [];
let particles     = [];

// Start screen animated animals
let decoAnimals = [];

// Save-related
let hasSavedGame     = false;
let hasPlayedBefore  = false;
let seenAnimalTypes  = [];
let seenQuizIds      = [];
let quizBankScrollY  = 0;   // scroll offset for 衛教題庫 screen
let quizBankMaxScroll = 0;  // updated each render frame

// Animal EXP / level (persisted cross-game)
let animalExp = {};   // { animalIdx: totalExp }

// Quiz priority tracking (persisted cross-game)
let quizWrongIds          = [];   // IDs answered wrong at least once
let quizCorrectAfterWrong = {};   // { id: countOfCorrectAnswersAfterFirstWrong }

// Fever hint (arrow shown first time fever bar fills)
let feverHintShown = false;

// Level-up effects queued during quiz challenge (show after modal closes)
let pendingLevelUpEffects = [];

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
const bgm         = new Audio('assets/HappyZoo_loop.mp3');
bgm.loop = true;
const feverBgm    = new Audio('assets/ZooFever_loop.mp3');
feverBgm.loop     = true;
const gameOverBgm = new Audio('assets/GameOver.mp3');
gameOverBgm.loop  = false;

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
        const bgmSrc = audioCtx.createMediaElementSource(bgm);
        bgmSrc.connect(bgmGainNode);
        const feverSrc = audioCtx.createMediaElementSource(feverBgm);
        feverSrc.connect(bgmGainNode);
        const gameOverSrc = audioCtx.createMediaElementSource(gameOverBgm);
        gameOverSrc.connect(bgmGainNode);
        bgmGainNode.connect(audioCtx.destination);
        if (audioCtx.state === 'suspended') audioCtx.resume();
        // 第一次使用者互動後立即播放 BGM（開始畫面也有音樂）
        if (bgmVolume > 0) bgm.play().catch(() => {});
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
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(sfxGainNode || audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration + 0.01);
    } catch (e) {}
}

function playMatchSound(combo) {
    // All combos: two-note ascending ding (combo 1 = lower pitch, higher combos rise further)
    const freq = 440 * Math.pow(1.3, Math.min(combo - 1, 6));
    playSynth('sine', freq, 0.25, 0.75);
    setTimeout(() => playSynth('sine', freq * 1.25, 0.2, 0.55), 80);
    if (combo >= 3) setTimeout(() => playSynth('sine', freq * 1.5, 0.18, 0.45), 160);
}

function playSwapSound() {
    playSynth('triangle', 600, 0.08, 0.45);
}

function playSwapBackSound() {
    playSynth('triangle', 400, 0.08, 0.35);
}

function playFailSound() {
    playSynth('sawtooth', 220, 0.35, 0.45, 140);
}

function playGameOverExplosion() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // White noise burst
    const bufLen = Math.floor(audioCtx.sampleRate * 0.6);
    const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.07));
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    const ng = audioCtx.createGain();
    ng.gain.setValueAtTime(0.9, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    noise.connect(ng); ng.connect(sfxGainNode);
    noise.start(now);
    // Low thud oscillator
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.45);
    const og = audioCtx.createGain();
    og.gain.setValueAtTime(0.7, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(og); og.connect(sfxGainNode);
    osc.start(now); osc.stop(now + 0.45);
}

function playFeverSound() {
    const notes = [523, 659, 784]; // C5 E5 G5
    notes.forEach((f, i) => setTimeout(() => playSynth('sine', f, 0.3, 0.8), i * 100));
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
        g.gain.linearRampToValueAtTime(0.6, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.38);
    });
}

function playQuizCorrectSound() {
    playSynth('sine', 880, 0.12, 0.65);
    setTimeout(() => playSynth('sine', 1318, 0.22, 0.55), 110);
}

function playQuizWrongSound() {
    playSynth('square', 200, 0.12, 0.38, 140);
    setTimeout(() => playSynth('sawtooth', 150, 0.18, 0.32, 100), 110);
}

function playLevelUpSound() {
    if (!audioCtx || sfxVolume <= 0) return;
    try {
        // 充能掃頻 + 上行音階 C5 E5 G5 C6（boost 升級感）
        const now = audioCtx.currentTime;

        // 掃頻噪音：低→高 glide（power-up 衝刺感）
        const sweep = audioCtx.createOscillator();
        const sweepG = audioCtx.createGain();
        sweep.type = 'sawtooth';
        sweep.frequency.setValueAtTime(220, now);
        sweep.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        sweepG.gain.setValueAtTime(0.4, now);
        sweepG.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
        sweep.connect(sweepG);
        sweepG.connect(sfxGainNode);
        sweep.start(now);
        sweep.stop(now + 0.21);

        // 上行琶音 C5 E5 G5 C6
        [[523, 0.15], [659, 0.24], [784, 0.32], [1047, 0.40]].forEach(([freq, delay]) => {
            const osc = audioCtx.createOscillator();
            const g   = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            const t = now + delay;
            const dur = freq === 1047 ? 0.50 : 0.14;
            g.gain.setValueAtTime(0.65, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            osc.connect(g);
            g.connect(sfxGainNode);
            osc.start(t);
            osc.stop(t + dur + 0.01);
        });
    } catch (e) {}
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
    'assets/R1.png',
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
        animalExp: { ...animalExp },
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
    if (state.animalExp) Object.assign(animalExp, state.animalExp);
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
            hasPlayedBefore   = p.hasPlayedBefore ?? false;
            seenAnimalTypes   = p.seenAnimalTypes || [];
            seenQuizIds       = p.seenQuizIds     || [];
            isChallengeEnabled = p.isChallengeEnabled ?? true;
            if (p.animalExp) Object.assign(animalExp, p.animalExp);
            quizWrongIds          = p.quizWrongIds          || [];
            quizCorrectAfterWrong = p.quizCorrectAfterWrong || {};
            feverHintShown        = p.feverHintShown        ?? false;
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
// ANIMAL LEVEL HELPERS
// ============================================================
// Cumulative EXP required to REACH level `lv` (lv1→2 costs 100, lv2→3 costs 200…)
function expForLevel(lv) {
    return lv <= 1 ? 0 : 100 * (lv - 1) * lv / 2;
}
function getAnimalLevel(animalIdx) {
    const exp = animalExp[animalIdx] || 0;
    for (let lv = 10; lv >= 2; lv--) {
        if (exp >= expForLevel(lv)) return lv;
    }
    return 1;
}
// Score multiplier from level: Lv1=1.00, Lv2=1.05, Lv3=1.10 …
function lvScoreMult(animalIdx) {
    return 1 + 0.05 * (getAnimalLevel(animalIdx) - 1);
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
        const logicalType = board[g.cells[0].r][g.cells[0].c];
        const animalIdx   = selectedTypes[logicalType];

        // EXP: +1 per eliminated tile; detect level-up
        const prevLv = getAnimalLevel(animalIdx);
        animalExp[animalIdx] = (animalExp[animalIdx] || 0) + g.size;
        const newLv  = getAnimalLevel(animalIdx);
        if (newLv > prevLv) {
            const sumR = g.cells.reduce((s, { r }) => s + r, 0);
            const sumC = g.cells.reduce((s, { c }) => s + c, 0);
            const fx = BOARD_X + (sumC / g.cells.length + 0.5) * CELL_SIZE;
            const fy = BOARD_Y + (sumR / g.cells.length + 0.5) * CELL_SIZE;
            const lvStr = newLv >= 10 ? 'MAX' : `Lv.${newLv}`;
            floatingTexts.push({ text: `↑${lvStr} UP↑`, x: fx, y: fy, vy: -55, alpha: 1, scale: 1.7, color: '#ffd700', life: 2.2, fadeStart: 1.0 });
            playLevelUpSound();
        }

        const baseScore = g.size >= 5 ? MATCH_SCORES[5]
                        : g.size === 4 ? MATCH_SCORES[4]
                        : MATCH_SCORES[3];
        const mult   = Math.pow(COMBO_BASE, comboCount - 1);
        // Level multiplier (Lv1=×1.00, Lv2=×1.05 …)
        const lmult  = lvScoreMult(animalIdx);
        // Round UP to nearest 10 (changed from floor)
        let earned   = Math.ceil(baseScore * mult * lmult / 10) * 10;
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

    // Time bonus: scales with combo count (combo 1×, combo 2×2, combo 3×3 …)
    const timeBonus = TIME_BONUS_PER_GROUP * groups.length * comboCount;
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
        const fadeWindow = f.fadeStart ?? 1.2;
        f.alpha = Math.max(0, Math.min(1, f.life / fadeWindow));
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
    bgm.pause();
    if (bgmVolume > 0) { feverBgm.currentTime = 0; feverBgm.play().catch(() => {}); }
}

function endFeverTime() {
    isFeverTime   = false;
    feverTimeLeft = 0;
    feverBgm.pause();
    feverBgm.currentTime = 0;
    if (bgmVolume > 0) bgm.play().catch(() => {});
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
    challengeOpenTime = Date.now();
    challengeIdx    = 0;
    challengeCorrect = 0;
    challengeTimer  = challengeTotalTime;
    challengeWaiting = false;
    pendingLevelUpEffects = [];

    // Mark first-fever hint as shown (arrow disappears after first tap)
    if (!feverHintShown) {
        feverHintShown = true;
        try {
            const pRaw = localStorage.getItem(SAVE_KEY + '_progress') || '{}';
            const p = JSON.parse(pRaw);
            p.feverHintShown = true;
            localStorage.setItem(SAVE_KEY + '_progress', JSON.stringify(p));
        } catch {}
    }

    // Weighted question selection: unseen + unatoned-wrong questions get weight 5
    const isPriority = q =>
        !seenQuizIds.includes(q.id) ||
        (quizWrongIds.includes(q.id) && (quizCorrectAfterWrong[q.id] || 0) < 2);
    const weighted = [];
    QUIZ_DATA.forEach(q => {
        const w = isPriority(q) ? 5 : 1;
        for (let i = 0; i < w; i++) weighted.push(q);
    });
    // Shuffle weighted pool
    for (let i = weighted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
    }
    // Pick 3 unique questions
    challengeQuestions = [];
    const pickedIds = new Set();
    for (const q of weighted) {
        if (!pickedIds.has(q.id)) {
            pickedIds.add(q.id);
            challengeQuestions.push(q);
            if (challengeQuestions.length === 3) break;
        }
    }
    // Fallback if not enough unique questions
    if (challengeQuestions.length < 3) {
        const remaining = QUIZ_DATA.filter(q => !pickedIds.has(q.id));
        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        challengeQuestions.push(...remaining.slice(0, 3 - challengeQuestions.length));
    }

    // Shuffle option order for each question independently
    challengeShuffledOrders = challengeQuestions.map(() => {
        const order = [0, 1, 2];
        for (let i = 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }
        return order;
    });

    challengeModal.classList.remove('hidden');
    showChallengeQuestion(0);
    document.getElementById('ch-timer-fill').style.width = '100%';
    document.getElementById('ch-timer-text').textContent = Math.ceil(challengeTotalTime) + 's';
}

function showChallengeQuestion(idx) {
    const q     = challengeQuestions[idx];
    const order = challengeShuffledOrders[idx];
    document.getElementById('ch-progress').textContent = `${idx} / 3`;
    document.getElementById('ch-question').textContent = q.question;
    document.getElementById('ch-result').textContent = '';
    document.getElementById('ch-result').className = '';
    const opts = document.querySelectorAll('.ch-opt');
    opts.forEach((btn, i) => {
        btn.textContent = q.options[order[i]] || '';
        btn.className   = 'ch-opt';
        btn.disabled    = false;
    });
}

function answerQuestion(idx) {
    if (challengeWaiting) return;
    if (Date.now() - challengeOpenTime < 400) return; // 防止按Fever條的觸控穿透到選項
    const q     = challengeQuestions[challengeIdx];
    const order = challengeShuffledOrders[challengeIdx];
    const opts  = document.querySelectorAll('.ch-opt');
    opts.forEach(btn => btn.disabled = true);
    const correct = order[idx] === q.correctIndex;
    opts[idx].classList.add(correct ? 'correct' : 'wrong');
    if (!correct) opts[order.indexOf(q.correctIndex)].classList.add('correct');

    if (correct) {
        challengeCorrect++;
        playQuizCorrectSound();
        // +10 EXP to all selected animal types; queue level-up effects for after modal closes
        selectedTypes.forEach((t, si) => {
            const prevLv = getAnimalLevel(t);
            animalExp[t] = (animalExp[t] || 0) + 10;
            const newLv  = getAnimalLevel(t);
            if (newLv > prevLv) {
                const lvStr = newLv >= 10 ? 'MAX' : `Lv.${newLv}`;
                const col = si % 4;
                const row = Math.floor(si / 4);
                const fx = BOARD_X + (col * 2 + 1) * CELL_SIZE;
                const fy = BOARD_Y + (row * 4 + 2) * CELL_SIZE;
                pendingLevelUpEffects.push({ text: `↑${lvStr} UP↑`, x: fx, y: fy });
            }
        });
        // Track correct-after-wrong for priority system
        if (quizWrongIds.includes(q.id)) {
            quizCorrectAfterWrong[q.id] = (quizCorrectAfterWrong[q.id] || 0) + 1;
        }
        // +3 / +5 / +7 for 1st / 2nd / 3rd correct answer
        const bonusMap  = [3, 5, 7];
        const bonusSecs = bonusMap[challengeCorrect - 1] || 0;
        spawnFloatingText(
            `+${bonusSecs}秒`,
            GAME_W / 2, GAME_H * 0.6,
            '#ff9800', 1.6
        );
        document.getElementById('ch-result').textContent = '✓ 正確！';
    } else {
        playQuizWrongSound();
        // Track wrong answer for priority
        if (!quizWrongIds.includes(q.id)) quizWrongIds.push(q.id);
        document.getElementById('ch-result').textContent = '✗ 答錯了';
    }

    if (!seenQuizIds.includes(q.id)) {
        seenQuizIds.push(q.id);
        // Persist so 題庫 unlocks even mid-session
        try {
            const pRaw = localStorage.getItem(SAVE_KEY + '_progress') || '{}';
            const p = JSON.parse(pRaw);
            p.seenQuizIds = seenQuizIds;
            p.quizWrongIds = quizWrongIds;
            p.quizCorrectAfterWrong = quizCorrectAfterWrong;
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

    // 結算衛教挑戰期間累積的升級效果（modal 消失後才顯示）
    if (pendingLevelUpEffects.length > 0) {
        pendingLevelUpEffects.forEach(e => {
            floatingTexts.push({ text: e.text, x: e.x, y: e.y, vy: -55, alpha: 1, scale: 1.7, color: '#ffd700', life: 2.2, fadeStart: 1.0 });
        });
        playLevelUpSound();
        pendingLevelUpEffects = [];
    }

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
    ctx.fillText(getCurrentStrings().subtitle, GAME_W / 2, 108);

    const cx = GAME_W / 2;

    // Decorative animals — behind R1 (squash & stretch bounce + flip transition)
    decoAnimals.forEach(a => {
        const key = `animal_a_${String(selectedTypes[a.typeIdx] + 1).padStart(2, '0')}`;
        const img = ASSET_IMAGES[key];
        if (!img) return;

        // Squash & stretch: bob = -1 (top/stretch) .. +1 (bottom/squash)
        const bob = Math.sin(totalElapsed / 120 + a.bobOffset); // ~750ms cycle
        const bobY = bob * 6;       // ±6px vertical
        const sqX  = 1 + 0.13 * bob;  // wider at bottom
        const sqY  = 1 - 0.13 * bob;  // shorter at bottom

        // Flip scaleX: 1→0 (phase 1) or 0→1 (phase 2)
        let flipSX = 1;
        if (a.flip) {
            const t = Math.min(1, a.flip.timer / 120);
            flipSX = a.flip.phase === 1 ? (1 - t) : t;
        }

        ctx.save();
        ctx.translate(a.x, a.y + bobY);
        if (a.vx < 0) ctx.scale(-1, 1);
        ctx.scale(sqX * flipSX, sqY);
        ctx.drawImage(img, -16, -16, 32, 32);
        ctx.restore();
    });

    // R1.png logo — 64px, centered, on top of animals
    const r1img = ASSET_IMAGES['R1'];
    if (r1img) ctx.drawImage(r1img, cx - 32, 168, 64, 64);

    // Buttons (vertical column)
    startButtons = [];
    const s = getCurrentStrings();
    const btnDefs = [
        { label: s.startGame,                                action: 'start',    enabled: true },
        { label: s.loadGame,                                 action: 'load',     enabled: true },
        { label: hasPlayedBefore ? s.library : '???',        action: 'library',  enabled: hasPlayedBefore },
        { label: seenQuizIds.length > 0 ? s.quizBank : '???', action: 'quizbank', enabled: seenQuizIds.length > 0 },
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

    // Footer hint（兩行）
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#4a8fa8';
    ctx.fillText(s.footerLine1, GAME_W / 2, GAME_H - 40);
    ctx.fillText(s.footerLine2, GAME_W / 2, GAME_H - 24);


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

    const ANIMAL_NAMES = [
        'Matsuko','豹子頭','貓下去','瓦哈哈','花雕雞',
        '鼠き雅','美兔子','查布朗','帝王謝','狗MAN',
        '雪倫菈比','喵惠妹','馬鈴鼠'
    ];

    // 4-col grid (4 rows for 13 animals)
    const cols  = 4;
    const cellW = 82, cellH = 95;
    const startX = (GAME_W - cols * cellW) / 2;
    const startY = 60;

    for (let i = 0; i < NUM_ANIMAL_TYPES; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellW;
        const y = startY + row * cellH;
        const seen = seenAnimalTypes.includes(i);
        const key  = `animal_a_${String(i + 1).padStart(2, '0')}`;
        const img  = ASSET_IMAGES[key];
        const lv   = getAnimalLevel(i);
        const isMax = lv >= 10;

        // Card background
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        fillRR(ctx, x + 3, y + 3, cellW - 6, cellH - 6, 10);

        // Animal image (32px, y+10) or ?
        if (img && seen) {
            ctx.drawImage(img, x + cellW / 2 - 16, y + 10, 32, 32);
        } else {
            ctx.fillStyle = '#b0ccd8';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('?', x + cellW / 2, y + 30);
        }

        // Animal name (y+56, image bottom y+42, gap 14px)
        ctx.fillStyle = seen ? '#1a5f7a' : '#aaa';
        ctx.font = '11px sans-serif';
        ctx.fillText(seen ? ANIMAL_NAMES[i] : `No.${i + 1}`, x + cellW / 2, y + 56);

        // EXP progress bar (y+67)
        const barX = x + 8, barY = y + 67, barW = cellW - 16, barH = 6;
        ctx.fillStyle = 'rgba(180,210,230,0.7)';
        fillRR(ctx, barX, barY, barW, barH, 3);
        if (seen) {
            const exp     = animalExp[i] || 0;
            const lvStart = expForLevel(lv);
            const lvEnd   = expForLevel(lv + 1);
            const pct     = isMax ? 1 : Math.min(1, (exp - lvStart) / (lvEnd - lvStart));
            const fillW   = barW * pct;
            if (fillW > 0) {
                const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grad.addColorStop(0, '#42a5f5');
                grad.addColorStop(1, isMax ? '#ffd700' : '#66bb6a');
                ctx.fillStyle = grad;
                if (fillW >= barW - 0.5) fillRR(ctx, barX, barY, fillW, barH, 3);
                else fillRRLeft(ctx, barX, barY, fillW, barH, 3);
            }
        }

        // Level label 壓在進度條上方
        const lvLabel = isMax ? 'Lv.Max' : `Lv.${lv}`;
        ctx.font = `bold 9px sans-serif`;
        ctx.fillStyle = seen ? (isMax ? '#b8860b' : '#1a5f7a') : '#aaa';
        ctx.fillText(lvLabel, x + cellW / 2, barY + barH + 10);
    }

    renderFloatingTexts();
}

function renderQuizBank() {
    renderBackground('#c8e9f7', '#d4f0e4');

    // Fixed header
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#1a5f7a';
    ctx.fillText('衛教題庫', GAME_W / 2, 45);

    ctx.fillStyle = '#5bb8e8';
    fillRR(ctx, 10, 10, 60, 28, 14);
    ctx.fillStyle = 'white';
    ctx.font = '13px sans-serif';
    ctx.fillText('← 返回', 40, 28);

    // Scrollable content area
    const HEADER_H  = 60;
    const FOOTER_H  = 20;
    const viewTop    = HEADER_H;
    const viewH      = GAME_H - HEADER_H - FOOTER_H;
    const contentX   = 16;
    const contentW   = GAME_W - 32 - 10; // leave 10px for scrollbar

    const seen = QUIZ_DATA.filter(q => seenQuizIds.includes(q.id));

    if (seen.length === 0) {
        ctx.fillStyle = '#4a8fa8';
        ctx.font = '14px sans-serif';
        ctx.fillText('完成衛教挑戰後題目會顯示在這裡', GAME_W / 2, 220);
        quizBankMaxScroll = 0;
        renderFloatingTexts();
        return;
    }

    // Measure total content height first (dry run)
    ctx.font = 'bold 12px sans-serif';
    let totalH = 18; // top padding
    seen.forEach((q, i) => {
        const qLines = wrapText(ctx, `Q${i+1}. ${q.question}`, contentW);
        totalH += qLines.length * 16 + 2;
        ctx.font = '11px sans-serif';
        totalH += 15; // answer line
        const expLines = wrapText(ctx, q.explanation, contentW - 4);
        totalH += expLines.length * 14 + 10; // gap between entries
        ctx.font = 'bold 12px sans-serif';
    });
    totalH += 12; // bottom padding
    quizBankMaxScroll = Math.max(0, totalH - viewH);
    quizBankScrollY   = Math.max(0, Math.min(quizBankScrollY, quizBankMaxScroll));

    // Clip to content viewport
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, viewTop, GAME_W, viewH);
    ctx.clip();

    // Draw content offset by scroll
    ctx.translate(0, viewTop - quizBankScrollY);
    ctx.textAlign = 'left';
    let y = 18;
    seen.forEach((q, i) => {
        ctx.fillStyle = '#1a5f7a';
        ctx.font = 'bold 12px sans-serif';
        const qLines = wrapText(ctx, `Q${i+1}. ${q.question}`, contentW);
        qLines.forEach(line => { ctx.fillText(line, contentX, y); y += 16; });
        y += 2;
        ctx.fillStyle = '#4caf50';
        ctx.font = '11px sans-serif';
        ctx.fillText(`✓ ${q.options[q.correctIndex]}`, contentX + 4, y); y += 15;
        ctx.fillStyle = '#4a8fa8';
        ctx.font = '11px sans-serif';
        const expLines = wrapText(ctx, q.explanation, contentW - 4);
        expLines.forEach(line => { ctx.fillText(line, contentX + 2, y); y += 14; });
        y += 10;
    });

    ctx.restore();

    // Scrollbar track
    if (quizBankMaxScroll > 0) {
        const sbX  = GAME_W - 7;
        const sbY  = viewTop + 4;
        const sbH  = viewH - 8;
        ctx.fillStyle = 'rgba(180,210,230,0.5)';
        fillRR(ctx, sbX, sbY, 5, sbH, 2);
        const thumbH   = Math.max(24, sbH * (viewH / totalH));
        const thumbY   = sbY + (sbH - thumbH) * (quizBankScrollY / quizBankMaxScroll);
        ctx.fillStyle  = '#5bb8e8';
        fillRR(ctx, sbX, thumbY, 5, thumbH, 2);
    }

    // Fade edges (top only when scrolled, bottom always)
    const fadeH = 18;
    if (quizBankScrollY > 4) {
        const fadeTop = ctx.createLinearGradient(0, viewTop, 0, viewTop + fadeH);
        fadeTop.addColorStop(0, 'rgba(200,233,247,0.9)');
        fadeTop.addColorStop(1, 'rgba(200,233,247,0)');
        ctx.fillStyle = fadeTop;
        ctx.fillRect(0, viewTop, GAME_W, fadeH);
    }

    const fadeBot = ctx.createLinearGradient(0, GAME_H - FOOTER_H - fadeH, 0, GAME_H - FOOTER_H);
    fadeBot.addColorStop(0, 'rgba(212,240,228,0)');
    fadeBot.addColorStop(1, 'rgba(212,240,228,0.9)');
    ctx.fillStyle = fadeBot;
    ctx.fillRect(0, GAME_H - FOOTER_H - fadeH, GAME_W, fadeH);

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
        ctx.fillText('✨ READY！', FEVER_X + FEVER_W / 2, FEVER_Y + FEVER_H / 2 + 4 + bounce);
        ctx.shadowBlur = 0;

        // First-time hint: gold border + bouncing ▼ arrow
        if (!feverHintShown) {
            const glowPulse = 0.6 + 0.4 * Math.sin(totalElapsed / 200);
            // Gold border
            ctx.save();
            ctx.strokeStyle = `rgba(255,210,30,${glowPulse})`;
            ctx.lineWidth   = 3;
            ctx.shadowColor = `rgba(255,180,0,${glowPulse})`;
            ctx.shadowBlur  = 12;
            const br = FEVER_H / 2 + 3;
            const bx = FEVER_X - 3, by = FEVER_Y - 3, bw = FEVER_W + 6, bh = FEVER_H + 6;
            ctx.beginPath();
            ctx.moveTo(bx + br, by);
            ctx.lineTo(bx + bw - br, by);
            ctx.arcTo(bx + bw, by,      bx + bw, by + br,      br);
            ctx.lineTo(bx + bw, by + bh - br);
            ctx.arcTo(bx + bw, by + bh, bx + bw - br, by + bh, br);
            ctx.lineTo(bx + br, by + bh);
            ctx.arcTo(bx,       by + bh, bx,       by + bh - br, br);
            ctx.lineTo(bx, by + br);
            ctx.arcTo(bx,       by,      bx + br,  by,           br);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            // Bouncing ▼ arrow
            const arrowBob = Math.sin(totalElapsed / 260) * 5;
            ctx.font        = 'bold 22px sans-serif';
            ctx.fillStyle   = '#ffd700';
            ctx.shadowColor = 'rgba(255,180,0,0.9)';
            ctx.shadowBlur  = 10;
            ctx.fillText('▼', FEVER_X + FEVER_W / 2, FEVER_Y - 8 + arrowBob);
            ctx.shadowBlur  = 0;
        }
    } else {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = 'bold 11px sans-serif';
        // Item 6: removed ?/10 counter; just show FEVER or FEVER! Ns
        const label = isFeverTime ? `FEVER！${Math.ceil(feverTimeLeft)}s` : 'FEVER';
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
    const gs = getCurrentStrings();
    const btnDefs = [
        { label: gs.retry,   action: 'retry',  color: '#3a9ed4', hover: '#5bb8e8' },
        { label: gs.share,   action: 'share',  color: '#3a9e6a', hover: '#4caf80' },
        { label: gs.saveImg, action: 'save',   color: '#7060c8', hover: '#8878e8' },
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

    initDecoAnimals();
    startLoop();

    // 顯示聲音詢問視窗（使用者點擊即授權瀏覽器播音）
    document.getElementById('sound-prompt').classList.remove('hidden');
}

function pickUniqueDecoType(excludeAnimal) {
    const used = new Set(decoAnimals.map(a => a !== excludeAnimal ? (a.flip?.nextTypeIdx ?? a.typeIdx) : -1));
    const available = [];
    for (let i = 0; i < ACTIVE_TYPES; i++) { if (!used.has(i)) available.push(i); }
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : Math.floor(Math.random() * ACTIVE_TYPES);
}

function initDecoAnimals() {
    const cx = GAME_W / 2;
    const startPos = [
        [cx - 130, 148], [cx + 130, 148],
        [cx - 130, 255], [cx + 130, 255],
    ];
    decoAnimals = startPos.map(([x, y], i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 55 + Math.random() * 35;
        return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, typeIdx: i, bobOffset: i * Math.PI / 2, flip: null };
    });
}

function update(dt) {
    totalElapsed += dt;

    if (gameScreen === 'start') {
        updateFloatingTexts(dt);
        // 移動封面動物（含翻牌換人動畫）
        const DECO_L = 46, DECO_R = GAME_W - 46, DECO_T = 120, DECO_B = 268;
        const FLIP_HALF = 120; // ms per half of flip
        decoAnimals.forEach(a => {
            a.x += a.vx * dt / 1000;
            a.y += a.vy * dt / 1000;

            // 推進翻牌動畫
            if (a.flip) {
                a.flip.timer += dt;
                if (a.flip.phase === 1 && a.flip.timer >= FLIP_HALF) {
                    a.typeIdx = a.flip.nextTypeIdx;
                    a.flip = { phase: 2, timer: a.flip.timer - FLIP_HALF };
                }
                if (a.flip && a.flip.phase === 2 && a.flip.timer >= FLIP_HALF) {
                    a.flip = null;
                }
            }

            // 碰壁：反向 + 啟動翻牌（若目前沒在翻）
            if (a.x < DECO_L) {
                a.x = DECO_L; a.vx = Math.abs(a.vx);
                if (!a.flip) a.flip = { phase: 1, timer: 0, nextTypeIdx: pickUniqueDecoType(a) };
            } else if (a.x > DECO_R) {
                a.x = DECO_R; a.vx = -Math.abs(a.vx);
                if (!a.flip) a.flip = { phase: 1, timer: 0, nextTypeIdx: pickUniqueDecoType(a) };
            }
            if (a.y < DECO_T) { a.y = DECO_T; a.vy = Math.abs(a.vy); }
            else if (a.y > DECO_B) { a.y = DECO_B; a.vy = -Math.abs(a.vy); }
        });
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

    // Countdown shake: tiles jitter when main timer ≤ 5s (applies even during fever time)
    if (timeLeft <= 5) {
        const t   = Math.max(0, (5 - timeLeft) / 5); // 0 → 1
        const mag = t * t * 5;                        // 0 → 5px (reduced amplitude)
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
    } else {
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

    // BGM 已從首次互動開始播放；若因某原因暫停，重新啟動
    if (bgmVolume > 0 && bgm.paused) bgm.play().catch(() => {});
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
    // 停 GameOver 音樂，回首頁恢復 BGM
    gameOverBgm.pause(); gameOverBgm.currentTime = 0;
    if (bgmVolume > 0 && bgm.paused && !isFeverTime) {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        bgm.play().catch(() => {});
    }
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
    // 停止所有背景音樂，播放爆炸音效 + GameOver 音樂
    bgm.pause();
    feverBgm.pause(); feverBgm.currentTime = 0;
    isFeverTime = false; feverIntroActive = false;
    playGameOverExplosion();
    if (bgmVolume > 0) {
        gameOverBgm.currentTime = 0;
        gameOverBgm.play().catch(() => {});
    }

    hasPlayedBefore = true;
    selectedTypes.forEach(t => { if (!seenAnimalTypes.includes(t)) seenAnimalTypes.push(t); });

    // Persist unlock data and clear mid-game save
    try {
        localStorage.setItem(SAVE_KEY + '_progress', JSON.stringify({
            hasPlayedBefore, seenAnimalTypes, seenQuizIds, isChallengeEnabled,
            animalExp: { ...animalExp },
            quizWrongIds: [...quizWrongIds],
            quizCorrectAfterWrong: { ...quizCorrectAfterWrong },
            feverHintShown,
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
    // Block if sound prompt is visible — buttons handle their own audio init
    if (!document.getElementById('sound-prompt').classList.contains('hidden')) return;

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
                    document.getElementById('upload-save-input').click();
                } else if (btn.action === 'library') {
                    gameScreen = 'library';
                    updateUIForScreen();
                } else if (btn.action === 'quizbank') {
                    quizBankScrollY = 0;
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
        } else if (gameScreen === 'quizbank') {
            dragStart = { x: pos.x, y: pos.y }; // track for scroll drag
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

    // Quizbank touch scroll
    if (gameScreen === 'quizbank') {
        if (dragStart) {
            const pos = getCanvasPos(e);
            const dy = dragStart.y - pos.y;
            quizBankScrollY = Math.max(0, Math.min(quizBankMaxScroll, quizBankScrollY + dy));
            dragStart.y = pos.y;
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

document.addEventListener('wheel', (e) => {
    if (gameScreen === 'quizbank') {
        e.preventDefault();
        quizBankScrollY = Math.max(0, Math.min(quizBankMaxScroll, quizBankScrollY + e.deltaY * 0.6));
    }
}, { passive: false });

// ============================================================
// TAB VISIBILITY — AUTO MUTE + AUTO SAVE
// ============================================================
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        if (isAutoMuteEnabled) { bgm.pause(); feverBgm.pause(); gameOverBgm.pause(); }
        saveGameState();
    } else {
        lastTime = performance.now();
        if (audioCtx?.state === 'suspended') audioCtx.resume();
        if (isAutoMuteEnabled && bgmVolume > 0) {
            if (isFeverTime) feverBgm.play().catch(() => {});
            else if (isGameOver) gameOverBgm.play().catch(() => {});
            else bgm.play().catch(() => {});
        }
    }
});

// ============================================================
// SOUND PERMISSION PROMPT
// ============================================================
document.getElementById('sound-yes-btn').addEventListener('click', () => {
    document.getElementById('sound-prompt').classList.add('hidden');
    bgmVolume = 0.5; sfxVolume = 0.5;
    bgmSlider.value = 50; sfxSlider.value = 50;
    initAudioContext();   // 此點擊即是授權手勢，BGM 在 initAudioContext 裡播放
});

document.getElementById('sound-no-btn').addEventListener('click', () => {
    document.getElementById('sound-prompt').classList.add('hidden');
    bgmVolume = 0; sfxVolume = 0;
    bgmSlider.value = 0; sfxSlider.value = 0;
    initAudioContext(); // 建立 GainNode 路由，確保所有音訊以 gain=0 輸出達成靜音
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
    if (bgm.paused && bgmVolume > 0 && !isFeverTime) {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        bgm.play().catch(() => {});
    }
});

bgmSlider.addEventListener('input', (e) => {
    bgmVolume = e.target.value / 100;
    if (bgmGainNode) bgmGainNode.gain.setTargetAtTime(bgmVolume, audioCtx.currentTime, 0.01);
    else bgm.volume = bgmVolume;
    if (bgmVolume > 0 && bgm.paused && !isFeverTime) {
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        bgm.play().catch(() => {});
    } else if (bgmVolume === 0) {
        bgm.pause();
    }
});

let _sfxPreviewTimer = null;
sfxSlider.addEventListener('input', (e) => {
    sfxVolume = e.target.value / 100;
    if (sfxGainNode) sfxGainNode.gain.setTargetAtTime(sfxVolume, audioCtx.currentTime, 0.01);
    // 拖動時試聽（debounce 80ms 避免連發）
    clearTimeout(_sfxPreviewTimer);
    _sfxPreviewTimer = setTimeout(() => {
        if (!audioCtx) initAudioContext();
        playSynth('sine', 880, 0.2, 0.6);
    }, 80);
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
