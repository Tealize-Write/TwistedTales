/* ══════════════════════════════════════
   music.js — 音樂試聽播放器
   新增歌曲：在 TRACKS 陣列加一筆即可
   ══════════════════════════════════════ */
"use strict";

// ════════════════════════════════
// 🎵 歌曲清單 — 新增時在此加一筆
// ════════════════════════════════
const TRACKS = [
  {
    file:    "audio/空.mp3",
    titleZh: "空",
    titleEn: "Void",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-void",
  },
  {
    file:    "audio/慮.mp3",
    titleZh: "慮",
    titleEn: "Contemplation",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-lv",
  },
  {
    file:    "audio/夜行.mp3",
    titleZh: "夜行",
    titleEn: "Night Travel",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-night",
  },
  {
    file:    "audio/未知之旅.mp3",
    titleZh: "未知之旅",
    titleEn: "Journey Unknown",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-journey",
  },
  {
    file:    "audio/不盡歸途.mp3",
    titleZh: "不盡歸途",
    titleEn: "Endless Return",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-return",
  },
  {
    file:    "audio/探詢.mp3",
    titleZh: "探詢",
    titleEn: "Inquiry",
    metaZh:  "遊戲配樂 · WebSynths Microtonal",
    metaEn:  "Game OST · WebSynths Microtonal",
    svgId:   "svg-inquiry",
  },
];

// ── SVG 定義（每首歌一套） ──
const SVG_DEFS = {

  // 空 — 極簡虛空：單一光環懸在深宇宙中
  "svg-void": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vd-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#04070f"/>
          <stop offset="100%" stop-color="#010208"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#vd-bg)"/>
      <!-- 極遠星點 -->
      <g fill="#c8e8ff">
        <circle cx="22"  cy="18"  r="0.6" opacity="0.3"/>
        <circle cx="88"  cy="8"   r="0.5" opacity="0.25"/>
        <circle cx="145" cy="25"  r="0.7" opacity="0.35"/>
        <circle cx="178" cy="55"  r="0.5" opacity="0.2"/>
        <circle cx="165" cy="170" r="0.6" opacity="0.3"/>
        <circle cx="30"  cy="155" r="0.5" opacity="0.25"/>
        <circle cx="130" cy="188" r="0.6" opacity="0.3"/>
        <circle cx="12"  cy="95"  r="0.4" opacity="0.2"/>
      </g>
      <!-- 最外虛線圓 -->
      <circle cx="100" cy="100" r="80" stroke="#00c8ff" stroke-width="0.5"
              fill="none" stroke-dasharray="2 18" opacity="0.12"/>
      <!-- 中虛線圓 -->
      <circle cx="100" cy="100" r="58" stroke="#00c8ff" stroke-width="0.7"
              fill="none" stroke-dasharray="3 14" opacity="0.18"/>
      <!-- 主實心光環 -->
      <circle cx="100" cy="100" r="36" stroke="#00c8ff" stroke-width="2"
              fill="none" opacity="0.65"/>
      <!-- 環上四個刻度 -->
      <g stroke="#00c8ff" stroke-width="1.2" opacity="0.5">
        <line x1="100" y1="62"  x2="100" y2="70"/>
        <line x1="100" y1="130" x2="100" y2="138"/>
        <line x1="62"  y1="100" x2="70"  y2="100"/>
        <line x1="130" y1="100" x2="138" y2="100"/>
      </g>
      <!-- 內核空洞 -->
      <circle cx="100" cy="100" r="14" fill="#010208"/>
      <!-- 核心微光點 -->
      <circle cx="100" cy="100" r="2.5" fill="#00c8ff" opacity="0.45"/>
      <!-- 漸層暈 -->
      <circle cx="100" cy="100" r="36" fill="none"
              stroke="#00c8ff" stroke-width="18" opacity="0.04"/>
    </svg>`,

  // 慮 — 思緒纏繞：同心漣漪與交錯線條，如思緒翻湧
  "svg-lv": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lv-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#080514"/>
          <stop offset="100%" stop-color="#030208"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#lv-bg)"/>
      <!-- 漣漪圓環（略偏中心，象徵不安定） -->
      <g fill="none" stroke="#a78bfa" stroke-linecap="round">
        <circle cx="95"  cy="102" r="14" stroke-width="1.2" opacity="0.7"/>
        <circle cx="95"  cy="102" r="26" stroke-width="0.9" opacity="0.5"/>
        <circle cx="95"  cy="102" r="40" stroke-width="0.7" opacity="0.35"/>
        <circle cx="95"  cy="102" r="56" stroke-width="0.5" opacity="0.22"/>
        <circle cx="95"  cy="102" r="74" stroke-width="0.4" opacity="0.13"/>
      </g>
      <!-- 交錯思緒線（不規則曲線） -->
      <g stroke="#c4b5fd" fill="none" stroke-linecap="round" opacity="0.35">
        <path d="M 30 40 Q 80 60 60 100 Q 40 140 90 160" stroke-width="1.2"/>
        <path d="M 170 30 Q 130 70 150 110 Q 170 150 120 175" stroke-width="1"/>
        <path d="M 10 120 Q 60 100 80 130 Q 100 160 150 140" stroke-width="0.9"/>
      </g>
      <!-- 核心亮點 -->
      <circle cx="95" cy="102" r="5" fill="#a78bfa" opacity="0.8"/>
      <circle cx="95" cy="102" r="2" fill="#e9d5ff" opacity="0.9"/>
      <!-- 散落思緒粒子 -->
      <g fill="#c4b5fd">
        <circle cx="55"  cy="55"  r="1.5" opacity="0.5"/>
        <circle cx="148" cy="72"  r="1.2" opacity="0.4"/>
        <circle cx="40"  cy="148" r="1.3" opacity="0.45"/>
        <circle cx="162" cy="145" r="1"   opacity="0.35"/>
        <circle cx="110" cy="38"  r="1.4" opacity="0.5"/>
        <circle cx="170" cy="100" r="1"   opacity="0.3"/>
      </g>
    </svg>`,

  // 夜行 — 月光道路：第一人稱視角，路延伸至遠方月亮
  "svg-night": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nt-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#01050d"/>
          <stop offset="60%"  stop-color="#030c1e"/>
          <stop offset="100%" stop-color="#061428"/>
        </linearGradient>
        <linearGradient id="nt-road" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#0a1020"/>
          <stop offset="100%" stop-color="#1a2030"/>
        </linearGradient>
        <radialGradient id="nt-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#dff0ff"/>
          <stop offset="70%"  stop-color="#b8d8f0"/>
          <stop offset="100%" stop-color="#7ab0d8" stop-opacity="0.3"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#nt-sky)"/>
      <!-- 星星 -->
      <g fill="#c8e0ff" opacity="0.7">
        <circle cx="20"  cy="15" r="0.8"/>
        <circle cx="50"  cy="28" r="0.6"/>
        <circle cx="85"  cy="10" r="1"/>
        <circle cx="115" cy="20" r="0.7"/>
        <circle cx="150" cy="8"  r="0.9"/>
        <circle cx="180" cy="22" r="0.6"/>
        <circle cx="35"  cy="45" r="0.5"/>
        <circle cx="160" cy="40" r="0.7"/>
        <circle cx="72"  cy="38" r="0.5"/>
        <circle cx="130" cy="50" r="0.6"/>
      </g>
      <!-- 月亮 -->
      <circle cx="100" cy="58" r="18" fill="url(#nt-moon)"/>
      <circle cx="108" cy="52" r="13" fill="#01050d" opacity="0.9"/>
      <!-- 月暈 -->
      <circle cx="100" cy="58" r="24" stroke="#c0d8f0" stroke-width="0.8"
              fill="none" opacity="0.15"/>
      <!-- 地面分界 -->
      <rect x="0" y="118" width="200" height="82" fill="url(#nt-road)"/>
      <!-- 透視路面（消失點在月亮下方） -->
      <g fill="#0e1828" opacity="0.95">
        <polygon points="100,118 0,200 200,200"/>
      </g>
      <!-- 路面月光反射 -->
      <polygon points="100,118 85,200 115,200" fill="#b8d0f0" opacity="0.06"/>
      <!-- 路中心虛線 -->
      <g stroke="#c0d0e8" stroke-width="1.5" stroke-linecap="round" opacity="0.3">
        <line x1="100" y1="122" x2="100" y2="130"/>
        <line x1="100" y1="136" x2="100" y2="148"/>
        <line x1="100" y1="155" x2="100" y2="170"/>
        <line x1="100" y1="178" x2="100" y2="196"/>
      </g>
      <!-- 路肩隱約燈光 -->
      <g opacity="0.2">
        <line x1="62"  y1="125" x2="20"  y2="195" stroke="#ffd080" stroke-width="0.8"/>
        <line x1="138" y1="125" x2="180" y2="195" stroke="#ffd080" stroke-width="0.8"/>
      </g>
    </svg>`,

  // 未知之旅 — 星圖羅盤：古老星圖與指南針，指向未知
  "svg-journey": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jn-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stop-color="#0a0810"/>
          <stop offset="100%" stop-color="#03020a"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#jn-bg)"/>
      <!-- 背景星點 -->
      <g fill="#e0d0ff" opacity="0.5">
        <circle cx="18"  cy="22"  r="0.8"/>
        <circle cx="55"  cy="12"  r="0.6"/>
        <circle cx="92"  cy="30"  r="1"/>
        <circle cx="140" cy="18"  r="0.7"/>
        <circle cx="178" cy="35"  r="0.9"/>
        <circle cx="165" cy="168" r="0.8"/>
        <circle cx="30"  cy="175" r="0.6"/>
        <circle cx="12"  cy="130" r="0.7"/>
        <circle cx="188" cy="120" r="0.8"/>
      </g>
      <!-- 最外羅盤圈 -->
      <circle cx="100" cy="100" r="85" stroke="#7c6fcd" stroke-width="0.6"
              fill="none" stroke-dasharray="4 8" opacity="0.3"/>
      <!-- 刻度圈 -->
      <circle cx="100" cy="100" r="72" stroke="#7c6fcd" stroke-width="0.8"
              fill="none" opacity="0.4"/>
      <!-- 刻度線（每30度） -->
      <g stroke="#a09ad8" stroke-width="0.8" opacity="0.5">
        <line x1="100" y1="28"  x2="100" y2="38"/>
        <line x1="134" y1="38"  x2="128" y2="46"/>
        <line x1="162" y1="66"  x2="154" y2="72"/>
        <line x1="172" y1="100" x2="162" y2="100"/>
        <line x1="162" y1="134" x2="154" y2="128"/>
        <line x1="134" y1="162" x2="128" y2="154"/>
        <line x1="100" y1="172" x2="100" y2="162"/>
        <line x1="66"  y1="162" x2="72"  y2="154"/>
        <line x1="38"  y1="134" x2="46"  y2="128"/>
        <line x1="28"  y1="100" x2="38"  y2="100"/>
        <line x1="38"  y1="66"  x2="46"  y2="72"/>
        <line x1="66"  y1="38"  x2="72"  y2="46"/>
      </g>
      <!-- 星座連線 -->
      <g stroke="#8080c0" stroke-width="0.7" fill="none" opacity="0.3">
        <polygon points="100,50 120,80 148,72 136,100 148,128 120,120 100,150 80,120 52,128 64,100 52,72 80,80"/>
      </g>
      <!-- 指南針指針 -->
      <polygon points="100,55  96,100 100,108 104,100" fill="#e0d8ff" opacity="0.9"/>
      <polygon points="100,145 96,100 100,92  104,100" fill="#5555aa" opacity="0.7"/>
      <!-- 中心玫瑰 -->
      <circle cx="100" cy="100" r="7" fill="#0a0810" stroke="#a09ad8" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="3" fill="#c0b8f8" opacity="0.9"/>
      <!-- 星座節點 -->
      <g fill="#d0c8ff" opacity="0.7">
        <circle cx="100" cy="50"  r="2.5"/>
        <circle cx="148" cy="72"  r="2"/>
        <circle cx="148" cy="128" r="2"/>
        <circle cx="100" cy="150" r="2.5"/>
        <circle cx="52"  cy="128" r="2"/>
        <circle cx="52"  cy="72"  r="2"/>
      </g>
      <!-- N 標記 -->
      <text x="96" y="22" font-family="Orbitron,monospace" font-size="8"
            fill="#c0b8f8" opacity="0.6">N</text>
    </svg>`,

  // 不盡歸途 — 無限延伸的路：雙軌消失在地平線，暗示無法到達的終點
  "svg-return": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rt-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#0d0508"/>
          <stop offset="100%" stop-color="#1a0b10"/>
        </linearGradient>
        <linearGradient id="rt-ground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stop-color="#140810"/>
          <stop offset="100%" stop-color="#0a0508"/>
        </linearGradient>
        <radialGradient id="rt-sun" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stop-color="#ff8060" stop-opacity="0.7"/>
          <stop offset="60%"  stop-color="#ff4030" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#rt-sky)"/>
      <rect x="0" y="100" width="200" height="100" fill="url(#rt-ground)"/>
      <!-- 夕陽暈染 -->
      <ellipse cx="100" cy="100" rx="100" ry="50" fill="url(#rt-sun)"/>
      <!-- 地平線光帶 -->
      <line x1="0" y1="100" x2="200" y2="100" stroke="#ff6040" stroke-width="1" opacity="0.5"/>
      <!-- 鐵路軌道透視（消失點在地平線正中） -->
      <!-- 左軌 -->
      <polygon points="100,100 20,200 35,200"  fill="#3a1a20" opacity="0.9"/>
      <!-- 右軌 -->
      <polygon points="100,100 165,200 180,200" fill="#3a1a20" opacity="0.9"/>
      <!-- 枕木 -->
      <g stroke="#4a2028" stroke-width="1.5" stroke-linecap="round" opacity="0.7">
        <line x1="82"  y1="112" x2="118" y2="112"/>
        <line x1="72"  y1="122" x2="128" y2="122"/>
        <line x1="60"  y1="135" x2="140" y2="135"/>
        <line x1="48"  y1="150" x2="152" y2="150"/>
        <line x1="35"  y1="167" x2="165" y2="167"/>
        <line x1="22"  y1="187" x2="178" y2="187"/>
      </g>
      <!-- 遠方星點（天空） -->
      <g fill="#ffb0a0" opacity="0.4">
        <circle cx="40"  cy="30" r="0.8"/>
        <circle cx="80"  cy="18" r="0.7"/>
        <circle cx="130" cy="25" r="0.9"/>
        <circle cx="168" cy="42" r="0.6"/>
        <circle cx="15"  cy="65" r="0.7"/>
        <circle cx="185" cy="70" r="0.8"/>
      </g>
      <!-- 無盡感：光點在地平線消失 -->
      <circle cx="100" cy="100" r="2.5" fill="#ff8060" opacity="0.8"/>
      <circle cx="100" cy="100" r="6"   fill="#ff8060" opacity="0.15"/>
    </svg>`,

  // 探詢 — 眼睛與波紋：探索凝視，波紋向外擴散
  "svg-inquiry": `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="iq-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stop-color="#030c0e"/>
          <stop offset="100%" stop-color="#010608"/>
        </radialGradient>
        <radialGradient id="iq-iris" cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stop-color="#60d0e0"/>
          <stop offset="50%"  stop-color="#0090a8"/>
          <stop offset="100%" stop-color="#004858"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#iq-bg)"/>
      <!-- 向外擴散的波紋（橢圓形，像眼波） -->
      <g fill="none" stroke="#00b8cc" stroke-linecap="round">
        <ellipse cx="100" cy="100" rx="20"  ry="10"  stroke-width="1.5" opacity="0.7"/>
        <ellipse cx="100" cy="100" rx="36"  ry="18"  stroke-width="1.1" opacity="0.5"/>
        <ellipse cx="100" cy="100" rx="54"  ry="27"  stroke-width="0.8" opacity="0.35"/>
        <ellipse cx="100" cy="100" rx="74"  ry="37"  stroke-width="0.6" opacity="0.22"/>
        <ellipse cx="100" cy="100" rx="96"  ry="48"  stroke-width="0.4" opacity="0.12"/>
      </g>
      <!-- 眼白 -->
      <ellipse cx="100" cy="100" rx="42" ry="22" fill="#06181c" stroke="#00b8cc" stroke-width="1.5"/>
      <!-- 虹膜 -->
      <circle cx="100" cy="100" r="15" fill="url(#iq-iris)"/>
      <!-- 虹膜紋理 -->
      <g stroke="#40c0d0" stroke-width="0.5" fill="none" opacity="0.4">
        <line x1="100" y1="85" x2="100" y2="115"/>
        <line x1="85"  y1="100" x2="115" y2="100"/>
        <line x1="89"  y1="89"  x2="111" y2="111"/>
        <line x1="111" y1="89"  x2="89"  y2="111"/>
      </g>
      <!-- 瞳孔 -->
      <circle cx="100" cy="100" r="6.5" fill="#010608"/>
      <!-- 光點反射 -->
      <circle cx="105" cy="95"  r="2.5" fill="#e0f8ff" opacity="0.85"/>
      <circle cx="95"  cy="105" r="1"   fill="#e0f8ff" opacity="0.4"/>
      <!-- 睫毛（上） -->
      <g stroke="#00b8cc" stroke-width="1" stroke-linecap="round" opacity="0.5">
        <line x1="68"  y1="86"  x2="72"  y2="80"/>
        <line x1="80"  y1="80"  x2="82"  y2="73"/>
        <line x1="93"  y1="77"  x2="93"  y2="70"/>
        <line x1="107" y1="77"  x2="107" y2="70"/>
        <line x1="120" y1="80"  x2="118" y2="73"/>
        <line x1="132" y1="86"  x2="128" y2="80"/>
      </g>
    </svg>`,
};

// ── 產生波形條 HTML ──
function makeBars() {
  return Array.from({ length: 10 }, () => '<div class="music-wave-bar"></div>').join("");
}

// ── 格式化秒數 → mm:ss ──
function fmtTime(sec) {
  if (!isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── GAS 追蹤 ──
function sendMusicToGAS(event, trackTitle) {
  const API_URL = window.TEALIZE_API_URL;
  if (!API_URL) return;
  try {
    let clientId = "";
    const statsId = localStorage.getItem("abyss_client_id");
    if (statsId && statsId.startsWith("uid_")) clientId = statsId;
    else clientId = localStorage.getItem("tw_tealize_id") || "";
    fetch(
      `${API_URL}?action=music` +
      `&event=${encodeURIComponent(event)}` +
      `&track=${encodeURIComponent(trackTitle)}` +
      `&clientId=${encodeURIComponent(clientId)}`,
      { keepalive: true }
    ).catch(() => {});
  } catch (_) {}
}

// ── 全域狀態 ──
let _currentAudio = null;
let _currentCard  = null;
let _rafId        = null;

function stopAll() {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
  }
  if (_currentCard) {
    _currentCard.classList.remove("is-playing", "is-paused", "is-loaded");
  }
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  _currentAudio = null;
  _currentCard  = null;
}

// ── 播放 / 暫停切換 ──
function toggleTrack(card, audio, fillEl, curEl, durEl, trackTitle) {
  const isThisCard = _currentCard === card;

  if (isThisCard) {
    // 點同一張：暫停 / 繼續
    if (audio.paused) {
      audio.play();
      card.classList.remove("is-paused");
      card.classList.add("is-playing");
      tickProgress(audio, fillEl, curEl);
      sendMusicToGAS("resume", trackTitle);
    } else {
      audio.pause();
      card.classList.remove("is-playing");
      card.classList.add("is-paused");
      if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
      sendMusicToGAS("pause", trackTitle);
    }
    return;
  }

  // 停掉前一首
  stopAll();

  // 播放新的
  _currentAudio = audio;
  _currentCard  = card;
  card.classList.add("is-playing");

  // 更新 duration
  const onMeta = () => {
    durEl.textContent = fmtTime(audio.duration);
    card.classList.add("is-loaded");
  };
  if (audio.readyState >= 1) onMeta();
  else audio.addEventListener("loadedmetadata", onMeta, { once: true });

  audio.play().catch(() => {
    card.classList.remove("is-playing");
    _currentAudio = null; _currentCard = null;
  });
  sendMusicToGAS("play", trackTitle);
  tickProgress(audio, fillEl, curEl);

  // 播完
  audio.addEventListener("ended", () => {
    card.classList.remove("is-playing", "is-paused");
    card.classList.add("is-loaded");
    fillEl.style.width = "0%";
    curEl.textContent = "00:00";
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
    _currentAudio = null; _currentCard = null;
  }, { once: true });
}

function tickProgress(audio, fillEl, curEl) {
  function step() {
    if (!audio.paused && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      fillEl.style.width = pct + "%";
      curEl.textContent  = fmtTime(audio.currentTime);
    }
    _rafId = requestAnimationFrame(step);
  }
  _rafId = requestAnimationFrame(step);
}

// ── 渲染所有卡片 ──
function renderMusicSection() {
  const grid = document.getElementById("musicGrid");
  if (!grid) return;

  const lang = document.documentElement.lang?.startsWith("en") ? "en" : "zh";

  grid.innerHTML = "";

  TRACKS.forEach(track => {
    const title = lang === "en" ? track.titleEn : track.titleZh;
    const meta  = lang === "en" ? track.metaEn  : track.metaZh;
    const svg   = SVG_DEFS[track.svgId] || SVG_DEFS["svg-magic"];

    const card = document.createElement("div");
    card.className = "music-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `播放 ${title}`);

    card.innerHTML = `
      <div class="music-artwork">
        ${svg}
        <div class="music-play-overlay">
          <div class="music-play-icon"><i class="fa-solid fa-play" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="music-progress-wrap">
        <div class="music-progress-fill"></div>
      </div>
      <div class="music-time">
        <span class="music-cur">00:00</span>
        <span class="music-dur">--:--</span>
      </div>
      <div class="music-info">
        <div class="music-title">${title}</div>
        <div class="music-meta">${meta}</div>
      </div>
      <div class="music-wave-bars">${makeBars()}</div>
    `;

    const audio   = new Audio(track.file);
    audio.preload = "none";

    const fillEl  = card.querySelector(".music-progress-fill");
    const curEl   = card.querySelector(".music-cur");
    const durEl   = card.querySelector(".music-dur");
    const iconEl  = card.querySelector(".music-play-icon i");

    // 更新圖示
    function syncIcon() {
      iconEl.className = audio.paused
        ? "fa-solid fa-play"
        : "fa-solid fa-pause";
    }
    audio.addEventListener("play",  syncIcon);
    audio.addEventListener("pause", syncIcon);
    audio.addEventListener("ended", () => { iconEl.className = "fa-solid fa-play"; });

    card.addEventListener("click", () => toggleTrack(card, audio, fillEl, curEl, durEl, track.titleZh));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTrack(card, audio, fillEl, curEl, durEl, track.titleZh);
      }
    });

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderMusicSection, 80); // 等 setLang 跑完
});
document.addEventListener("langChanged", renderMusicSection);