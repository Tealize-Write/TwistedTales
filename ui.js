/* ── UI ── */

// ── Ruler
function buildRuler(fillPct) {
  const numStr = String(fillPct).replace("%", "").trim();
  const pct = Math.min(100, Math.max(0, parseFloat(numStr) || 0));
  const ticks = Array.from({ length: 10 + 1 }, () => "<span></span>").join("");
  return (
    '<div class="seal-ruler">' +
    '<div class="seal-ruler-track"></div>' +
    '<div class="seal-ruler-ticks">' +
    ticks +
    "</div>" +
    '<div class="seal-ruler-fill" data-fill="' +
    pct +
    '%"></div>' +
    '<div class="seal-ruler-pointer" data-fill="' +
    pct +
    '%"></div>' +
    "</div>"
  );
}

function animateRulers(root) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      root
        .querySelectorAll(".seal-ruler-fill, .seal-ruler-pointer")
        .forEach((el) => {
          const f = el.dataset.fill;
          if (el.classList.contains("seal-ruler-fill")) el.style.width = f;
          if (el.classList.contains("seal-ruler-pointer"))
            el.style.left = "calc(" + f + " - 4px)";
        });
    }),
  );
}

/* ════════════════════════════════
   FLOW
════════════════════════════════ */
window.quizStartTime = 0; // ✦ 新增：全域變數，記錄測驗開始時間

function startQuiz() {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  document.getElementById("quiz").classList.add("in");

  qi = 0;
  answerHistory = [];
  categoryScore = {};
  CATEGORY_KEYS.forEach((k) => (categoryScore[k] = 0));
  _lastResultCode = null;

  // ✦ 記錄測驗開始的時間點
  window.quizStartTime = Date.now();

  // ✦ GAS 暖機：趁玩家答題期間預先喚醒 GAS 實例，消除結果頁的冷啟動延遲
  if (
    typeof GAS_URL !== "undefined" &&
    GAS_URL &&
    !GAS_URL.includes("在此貼上")
  ) {
    fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        token: typeof GAS_TOKEN !== "undefined" ? GAS_TOKEN : "",
        resultCode: "ESC",
        action: "warmup",
        clientId: "",
        source: "",
        referrer: "",
        device: "",
        country: "",
        city: "",
        timeSpent: 0,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  const elProgress = document.getElementById("progress");
  elProgress.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const d = document.createElement("div");
    d.className = "seg";
    elProgress.appendChild(d);
  }
  showQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  document.querySelectorAll(".seg").forEach((s, idx) => {
    s.classList.remove("done", "active");
    if (idx < qi) s.classList.add("done");
    else if (idx === qi) s.classList.add("active");
  });
  document.getElementById("quiz-label").textContent =
    `Question ${ROMAN[qi]} of ${ROMAN[questions.length - 1]}`;
  document.getElementById("qno").textContent = `— ${ROMAN[qi]} —`;
}

/* ════════════════════════════════
   QUESTION APPEAR
════════════════════════════════ */
let _twTimer = null;
let _twDone = false;

function skipTypewriter() {
  /* no-op — skip button removed */
}

function _finishTypewriter() {
  _twDone = true;

  const el = document.getElementById("qtext");
  const q = questions[qi];
  el.textContent = q.text;

  const opts = document.getElementById("options");
  opts.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.type = "button";
    btn.innerHTML = `<span class="bullet"></span><span class="txt">${opt.text}</span>`;
    btn.onclick = () => pick(i, opt.scores || {}, btn);
    opts.appendChild(btn);
    setTimeout(() => btn.classList.add("visible"), 60 + i * 130);
  });
}

function showQuestion() {
  updateProgress();
  _twDone = false;
  if (_twTimer) {
    clearTimeout(_twTimer);
    _twTimer = null;
  }

  const q = questions[qi];
  const el = document.getElementById("qtext");

  document.getElementById("options").innerHTML = "";

  el.textContent = q.text;
  el.classList.remove("appear");
  void el.offsetWidth; // force reflow to restart animation
  el.classList.add("appear");

  _twTimer = setTimeout(_finishTypewriter, 320);
}

function pick(optionIndex, addObj, btn) {
  if (_twTimer) {
    clearInterval(_twTimer);
    _twTimer = null;
  }
  document.querySelectorAll(".opt").forEach((b) => (b.disabled = true));
  btn.classList.add("selected");

  answerHistory[qi] = optionIndex;
  addAxisScores(addObj);

  setTimeout(() => {
    qi++;
    qi < questions.length ? showQuestion() : showResult();
  }, 380);
}

function confirmRestart() {
  if (confirm("確定要重新開始？目前進度將清除。")) {
    location.reload();
  }
}

/* ════════════════════════════════
   世界關係區塊
════════════════════════════════ */
function renderWorldRelationsBlock(code) {
  const r = resultsData[code];
  const el = document.getElementById("r-cp");
  if (!el) return;

  const allied = ((r && r.alliedWorlds) || []).filter((k) => resultsData[k]);
  const conflict = ((r && r.conflictingWorlds) || []).filter(
    (k) => resultsData[k],
  );

  if (!allied.length && !conflict.length) {
    el.innerHTML = "";
    return;
  }

  const toTag = (k) =>
    `<span class="relation-world">${resultsData[k].label}</span>`;
  const join = (arr) =>
    arr.map(toTag).join('<span class="relation-sep">・</span>');

  el.innerHTML =
    `<div class="lab">世界關係</div>` +
    (allied.length
      ? `<div class="relation-row">` +
        `<span class="relation-label">友邦世界</span>` +
        `<span class="relation-worlds">${join(allied)}</span></div>` +
        `<div class="relation-note">較容易互相適應</div>`
      : "") +
    (conflict.length
      ? `<div class="relation-row relation-conflict">` +
        `<span class="relation-label">互斥世界</span>` +
        `<span class="relation-worlds">${join(conflict)}</span></div>` +
        `<div class="relation-note">規則衝突，慎重跨界</div>`
      : "");
}

/* ════════════════════════════════
   MBTI 異世界人格
════════════════════════════════ */
function getMBTIHTML(code) {
  const r = resultsData[code];
  if (!r || !r.mbti) return "";
  return r.mbti
    .map(
      ({ type, pct }) =>
        '<div class="seal">' +
        '<div class="lab mbti-type">' +
        type +
        "</div>" +
        buildRuler(pct + "%") +
        '<div class="val">' +
        pct +
        "%</div>" +
        "</div>",
    )
    .join("");
}

/* ════════════════════════════════
   DYNAMIC EMBLEM SVGs（故事分類版）
════════════════════════════════ */
function getEmblemSVG(code) {
  const baseProps =
    'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

  const mysticCircle = `
    <circle cx="32" cy="32" r="30" stroke-width="0.5" stroke-dasharray="2 4"/>
    <circle cx="32" cy="32" r="26" stroke-width="1" stroke-opacity="0.3"/>
  `;

  switch (code) {
    // BRO 兩兄弟：劍
    case "BRO":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 32 60 L 26 24 L 32 14 L 38 24 Z" /><line x1="32" y1="14" x2="32" y2="60" stroke-width="1.5"/><line x1="16" y1="24" x2="48" y2="24" /><line x1="22" y1="21" x2="42" y2="21" stroke-width="1.5"/><path d="M 30 21 V 10 H 34 V 21 Z" /><polygon points="32,4 35,8 32,12 29,8" fill="currentColor" stroke="none"/></g></svg>`;
    // SHA 影子：書
    case "SHA":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 16 10 V 46 C 16 53 20 54 26 54 H 44 V 10 Z" fill="var(--bg)" stroke="none" /><path d="M 22 10 H 16 V 46 C 16 53 20 54 26 54 H 44 V 50 H 26 C 23 50 22 48 22 46 Z" fill="var(--bg)" stroke="currentColor" /><rect x="22" y="10" width="22" height="36" fill="var(--bg)" stroke="currentColor" /><line x1="23" y1="48" x2="44" y2="48" stroke-width="1.5" /><path d="M 28 46 V 58 L 31 55 L 34 58 V 46 Z" fill="var(--bg)" stroke="currentColor" stroke-linejoin="miter" /><rect x="26" y="14" width="14" height="28" stroke-width="1.5" /><rect x="37" y="23" width="10" height="10" fill="var(--bg)" stroke="currentColor" /><rect x="41" y="26" width="3" height="4" rx="1.5" stroke-width="1.5" /><polygon points="33,16 41,28 33,40 25,28" fill="var(--bg)" stroke="currentColor" stroke-linejoin="miter" /><polygon points="33,21 37,28 33,35 29,28" stroke-width="1.5" stroke-linejoin="miter" /></g></svg>`;
    // PIP 吹笛手：長笛
    case "PIP":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><line x1="12" y1="52" x2="52" y2="12" stroke-width="4" stroke-linecap="round"/><line x1="14" y1="50" x2="50" y2="14" stroke-width="1" stroke="var(--bg)"/><circle cx="24" cy="40" r="1.5" fill="var(--bg)" stroke="currentColor"/><circle cx="30" cy="34" r="1.5" fill="var(--bg)" stroke="currentColor"/><circle cx="36" cy="28" r="1.5" fill="var(--bg)" stroke="currentColor"/><circle cx="42" cy="22" r="1.5" fill="var(--bg)" stroke="currentColor"/><path d="M 46 18 L 50 14" stroke-width="3"/><circle cx="48" cy="16" r="1" fill="var(--bg)" stroke="none"/></g></svg>`;
    // KING 國王的新衣：皇冠
    case "KING":
      return `<svg ${baseProps}>${mysticCircle}<g transform="translate(0, 4)" stroke-width="2.5"><path d="M 8 28 C 16 24 26 26 30 30 C 34 26 44 24 56 28 L 54 32 C 46 28 38 30 34 32 C 30 30 22 28 10 32 Z" fill="currentColor" stroke="none"/><path d="M 10 32 C 10 44 28 44 30 30 M 54 32 C 54 44 36 44 34 30" /><path d="M 30 30 C 32 28 34 30 34 30" /><path d="M 8 28 L 4 16 M 56 28 L 60 16" /><path d="M 14 36 L 20 30 M 50 36 L 44 30" /></g></svg>`;
    // BEAST 美女與野獸：神鹿/黑獅
    case "BEAST":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5">
      <path d="M 28 36 L 22 62 L 42 62 L 36 36 Z" fill="var(--bg)" stroke="currentColor" />
      <path d="M 26 50 L 32 60 L 38 50" fill="none" stroke-width="1.5" />
      <g fill="none">
        <path d="M 28 28 C 22 20, 8 20, 10 8" /><path d="M 24 23 Q 22 12, 24 10" /><path d="M 17 18 Q 14 10, 16 4" /><path d="M 10 12 Q 6 15, 4 6" />
        <path d="M 36 28 C 42 20, 56 20, 54 8" /><path d="M 40 23 Q 42 12, 40 10" /><path d="M 47 18 Q 50 10, 48 4" /><path d="M 54 12 Q 58 15, 60 6" />
      </g>
      <path d="M 25 32 C 19 32, 14 33, 10 35 C 15 43, 21 41, 24 39 Z" fill="var(--bg)" stroke="currentColor" />
      <path d="M 22 34.5 C 17 35, 13 35.5, 11 36" fill="none" stroke-width="1.5" />
      <path d="M 39 32 C 45 32, 50 33, 54 35 C 49 43, 43 41, 40 39 Z" fill="var(--bg)" stroke="currentColor" />
      <path d="M 42 34.5 C 47 35, 51 35.5, 53 36" fill="none" stroke-width="1.5" />
      <path d="M 28 28 L 36 28 C 40 28, 42 36, 40 42 L 32 56 L 24 42 C 22 36, 24 28, 28 28 Z" fill="var(--bg)" stroke="currentColor" />
      <path d="M 32 10 L 33.5 14 L 37.5 15.5 L 33.5 17 L 32 21 L 30.5 17 L 26.5 15.5 L 30.5 14 Z" fill="currentColor" stroke="none" />
      <polygon points="32,26 29,31 32,36 35,31" fill="var(--bg)" stroke="currentColor" stroke-width="1.5" />
      <line x1="32" y1="36" x2="32" y2="51" stroke-width="1.5" />
      <path d="M 21 36 Q 25 38 30 39" fill="none" stroke-width="2" />
      <path d="M 43 36 Q 39 38 34 39" fill="none" stroke-width="2" />
      <polygon points="32,51 34.5,53 32,56 29.5,53" fill="currentColor" stroke="none" />
    </g></svg>`;
    // THORN 沉睡荊棘：龍
    case "THORN":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 32 30 C 26 16, 50 10, 42 1 C 60 10, 40 20, 44 25 Q 58 15, 55 14 Q 58 25, 50 30 Q 58 30, 58 34 Q 52 40, 46 40 Q 42 46, 41 50 Q 38 56, 32 56 Q 26 56, 23 50 Q 22 46, 18 40 Q 12 40, 6 34 Q 6 30, 14 30 Q 6 25, 9 14 Q 6 15, 20 25 C 24 20, 4 10, 22 1 C 14 10, 38 16, 32 30 Z" fill="var(--bg)" stroke="currentColor" stroke-linejoin="round"/><circle cx="24" cy="37" r="3.5" fill="currentColor" stroke="none"/><circle cx="40" cy="37" r="3.5" fill="currentColor" stroke="none"/><circle cx="23" cy="36" r="1.2" fill="var(--bg)" stroke="none"/><circle cx="39" cy="36" r="1.2" fill="var(--bg)" stroke="none"/><path d="M 20 31 Q 24 29, 28 32 M 44 31 Q 40 29, 36 32" stroke-width="1.5" fill="none" stroke-linecap="round"/><line x1="17" y1="42" x2="21" y2="42" stroke-width="1.5" stroke-linecap="round"/><line x1="43" y1="42" x2="47" y2="42" stroke-width="1.5" stroke-linecap="round"/><polygon points="29,50 26,52 29,54" fill="currentColor" stroke="none"/><polygon points="35,50 38,52 35,54" fill="currentColor" stroke="none"/><path d="M 28 32 Q 32 36, 32 41 V 44 M 36 32 Q 32 36, 32 41" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 30 45 L 32 47 L 34 45" stroke-width="1.5" fill="none" stroke-linecap="round"/></g></svg>`;
    // RACE 龜兔賽跑：六角軌道
    case "RACE":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><ellipse cx="32" cy="32" rx="14" ry="18" /><path d="M 32 20 L 40 25 V 39 L 32 44 L 24 39 V 25 Z" /><path d="M 32 14 V 20 M 40 22 L 46 18 M 40 42 L 46 46 M 32 50 V 44 M 24 42 L 18 46 M 24 22 L 18 18" /><path d="M 28 12 Q 32 4 36 12 Z" /><path d="M 18 24 Q 8 20 12 32" /><path d="M 46 24 Q 56 20 52 32" /><path d="M 22 46 Q 16 56 18 42" /><path d="M 42 46 Q 48 56 46 42" /></g></svg>`;
    // CROW 烏鴉：羽毛
    case "CROW":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 8 54 Q 32 48 56 56" /><path d="M 44 51 L 50 58" /><path d="M 36 26 C 42 32 44 42 36 50 L 30 60 L 26 54 C 20 46 18 36 24 28" /><path d="M 36 26 C 30 20 24 20 24 28" /><path d="M 26 24 L 12 26 L 24 28 Z" fill="currentColor" stroke="none"/><circle cx="28" cy="24" r="1.5" fill="currentColor" stroke="none"/><path d="M 32 32 C 40 38 40 48 32 54 M 28 36 C 34 42 34 48 28 52" /><path d="M 32 52 L 30 56 M 38 50 L 36 54" /></g></svg>`;
    // CANDY 糖裹屋：糖果鐘罩
    case "CANDY":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 20 54 C 20 30 44 30 44 54" stroke-width="1.5" stroke-dasharray="2 4"/><path d="M 32 10 C 22 10 16 22 16 34 C 16 44 12 52 10 56 H 54 C 52 52 48 44 48 34 C 48 22 42 10 32 10 Z" /><path d="M 32 18 C 24 18 22 26 24 34 C 26 40 38 40 40 34 C 42 26 40 18 32 18 Z" fill="currentColor"/><path d="M 32 42 L 34 46 L 38 48 L 34 50 L 32 54 L 30 50 L 26 48 L 30 46 Z" fill="currentColor" stroke="none"/><path d="M 24 56 V 46 M 40 56 V 46 M 32 56 V 52" stroke-width="1.5"/></g></svg>`;
    // CIND 灰姑娘：面具
    case "CIND":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-width="2.5"><path d="M 12 28 C 12 16 24 18 32 24 C 40 18 52 16 52 28 C 52 40 40 38 32 44 C 24 38 12 40 12 28 Z" /><path d="M 20 28 Q 24 24 28 28 Q 24 32 20 28 Z" stroke-width="1.5"/><path d="M 44 28 Q 40 24 36 28 Q 40 32 44 28 Z" stroke-width="1.5"/><path d="M 32 12 L 35 18 L 32 24 L 29 18 Z" fill="currentColor" stroke="none"/><circle cx="20" cy="28" r="1.5" fill="currentColor" stroke="none"/><circle cx="44" cy="28" r="1.5" fill="currentColor" stroke="none"/></g></svg>`;
    // ESC 清醒旁觀者：逃生出口
    case "ESC":
      return `<svg ${baseProps}>${mysticCircle}<g stroke-linecap="round" stroke-linejoin="round">
        <path d="M9,8 H37 V50 L44,58 H16 L9,50 Z" stroke-width="1.5" fill="none"/>
        <line x1="37" y1="8" x2="37" y2="50" stroke-width="1" stroke-dasharray="3 2" stroke-opacity="0.45"/>
        <circle cx="44" cy="18" r="4" fill="currentColor" stroke="none"/>
        <line x1="42" y1="23" x2="38" y2="36" stroke-width="2.5"/>
        <polyline points="41,28 50,33 47,39" stroke-width="2"/>
        <polyline points="41,28 33,32" stroke-width="2"/>
        <polyline points="38,36 47,48 55,48" stroke-width="2"/>
        <polyline points="38,36 32,47" stroke-width="2"/>
      </g></svg>`;
  }
}

/* ════════════════════════════════
   SHOW RESULT
════════════════════════════════ */
function showResult() {
  const elQuiz = document.getElementById("quiz");
  const elResult = document.getElementById("result");
  elQuiz.classList.add("hidden");
  document.getElementById("intro").classList.add("hidden");
  elResult.classList.remove("hidden");
  elResult.classList.remove("in");
  void elResult.offsetWidth;
  elResult.classList.add("in");

  const code = determineResultCode();
  _lastResultCode = code;
  const r = resultsData[code];

  if (!r) {
    document.getElementById("pop-line").textContent =
      "✦ 黑童話大門暫時找不到你的檔案（結果資料缺漏）。";
    console.error("Missing resultsData for code:", code);
    return;
  }

  const label = r.label || code;
  const resultImgEl = document.getElementById("result-img");
  if (resultImgEl) {
    resultImgEl.src = r.image;
  }

  const eyebrow = document.getElementById("r-eyebrow");
  if (eyebrow) {
    if (r.storyName === "逃脫成功結局") {
      eyebrow.textContent = `清醒路線 ── 逃脫成功結局`;
    } else {
      eyebrow.textContent = `你適合穿越進去《${r.label || code}》`;
    }
  }

  // r-compound：IF 路線行
  const compound = document.getElementById("r-compound");
  if (compound) {
    compound.textContent =
      r.storyName === "逃脫成功結局" ? "" : `IF 路線──${r.storyName || label}`;
  }

  // r-name：稱號（視覺主角大字）
  document.getElementById("r-name").textContent = `「${r.residentType}」`;
  const rDescParts = (r.resultText || "").split("\n");
  document.getElementById("r-desc").textContent =
    rDescParts.length > 1
      ? rDescParts.slice(1).join("").trim()
      : r.residentDesc;

  // 觸發逐段揭曉動畫（eyebrow → compound → name 錯開）
  setTimeout(() => {
    ["r-eyebrow", "r-compound", "r-name"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("r-reveal");
      void el.offsetWidth; // 強制 reflow，確保動畫重播
      el.classList.add("r-reveal");
    });
  }, 30);

  // r-mbti 已移除，不再渲染

  document.getElementById("r-quote").textContent = r.worldQuote;
  document.getElementById("r-guide").textContent = r.settlementAdvice;

  const rConcept = document.getElementById("r-concept");
  if (rConcept) rConcept.textContent = r.concept || "";

  const rNote = document.getElementById("r-note");
  if (rNote) rNote.textContent = r.residentDesc || "";

  /* ══ 定居評估三指標（由 results.js 人工設定） ══ */
  const mp = r.metrics || { survival: 0, happiness: 0, fate: 0 };
  const ml =
    typeof metricLabels !== "undefined"
      ? metricLabels
      : {
          survival: "童話世界生存率",
          happiness: "幸福指數",
          fate: "命運干預值",
        };
  const baseStatsHTML =
    '<div class="seal"><div class="lab">' +
    ml.survival +
    "</div>" +
    buildRuler(mp.survival + "%") +
    '<div class="val">' +
    mp.survival +
    "%</div></div>" +
    '<div class="seal"><div class="lab">' +
    ml.happiness +
    "</div>" +
    buildRuler(mp.happiness + "%") +
    '<div class="val">' +
    mp.happiness +
    "%</div></div>" +
    '<div class="seal"><div class="lab">' +
    ml.fate +
    "</div>" +
    buildRuler(mp.fate + "%") +
    '<div class="val">' +
    mp.fate +
    "%</div></div>";

  const mbtiHTML = getMBTIHTML(code);

  const tarotHTML = `
    <div class="tarot-star ts-tl"></div>
    <div class="tarot-star ts-tr"></div>
    <div class="tarot-star ts-bl"></div>
    <div class="tarot-star ts-br"></div>

    <div class="tarot-pendant top-pendant"></div>

    <div class="tarot-emblem">
        ${getEmblemSVG(code)}
    </div>

    <div class="tarot-title">✦ 定居評估報告 ✦</div>
    ${baseStatsHTML}

    <div class="tarot-divider">
        <svg viewBox="0 0 200 10" preserveAspectRatio="none">
            <line x1="10" y1="5" x2="190" y2="5" stroke="rgba(255,255,255,0.2)" stroke-dasharray="2 4"/>
            <polygon points="100,0 105,5 100,10 95,5" fill="rgba(255,255,255,0.6)"/>
        </svg>
    </div>

    <div class="tarot-title">✦ 異世界人格 ✦</div>
    ${mbtiHTML}

    <div class="tarot-pendant bottom-pendant"></div>
  `;

  document.getElementById("seals").innerHTML = tarotHTML;
  animateRulers(document.getElementById("seals"));

  const cta = document.getElementById("r-cta");
  const tagsHtml = (r.bookTags || [])
    .map((t) => '<span class="cta-tag">' + t + "</span>")
    .join("");
  const fairyLine = r.bookFairy
    ? '<span class="cta-fairy">' + r.bookFairy + "</span>"
    : "";
  cta.innerHTML =
    '<a href="' +
    escapeAttr(r.link) +
    '" target="_blank" rel="noopener noreferrer" onclick="trackBookClick(\'' +
    code +
    "')\">" +
    '<img class="cta-cover" src="https://framerusercontent.com/images/mduS33yvcuc8AhTxWKgAsjOOek.jpg?width=1819&height=2551" alt=""/>' +
    '<div class="cta-info">' +
    '<div class="cta-meta">' +
    '<span class="cta-label">前往官網試閱<span class="age-badge"> · 18+</span></span>' +
    '<span class="cta-arrow">→</span>' +
    "</div>" +
    '<div class="cta-title-row">' +
    '<span class="cta-title">' +
    r.bookName +
    "</span>" +
    '<span class="cta-author">' +
    (r.bookAuthor || "") +
    "</span>" +
    "</div>" +
    '<div class="cta-bot">' +
    fairyLine +
    '<span class="cta-tags">' +
    tagsHtml +
    "</span>" +
    "</div>" +
    "</div>" +
    "</a>";

  renderWorldRelationsBlock(code);
  sendStats(code);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ════════════════════════════════
   STATS & SHARE
════════════════════════════════ */
function trackBookClick(code) {
  if (typeof trackUserAction === "function") {
    trackUserAction(code, "book_click");
  }
}

// ✦ 新增：用來追蹤外部購書連結的通用函式
function trackBuyLink(actionType) {
  const code =
    _lastResultCode ||
    (typeof determineResultCode === "function" ? determineResultCode() : "");
  if (typeof trackUserAction === "function") {
    trackUserAction(code, actionType);
  }
}

// ✦ 中鍵（新開分頁）點擊追蹤：委派攔截所有帶 trackBuyLink onclick 的元素
document.addEventListener("auxclick", function (e) {
  if (e.button !== 1) return;
  const el = e.target.closest("[onclick]");
  if (!el) return;
  const match = el
    .getAttribute("onclick")
    .match(/trackBuyLink\(['"]([^'"]+)['"]\)/);
  if (match) trackBuyLink(match[1]);
});

window.startQuiz = startQuiz;
window.confirmRestart = confirmRestart;
window.skipTypewriter = skipTypewriter;
window.trackBookClick = trackBookClick;
window.trackBuyLink = trackBuyLink;
window.shareResultAsImage = shareResultAsImage;
window.shareShortImage = shareShortImage;

function escapeAttr(str) {
  const s = String(str ?? "");
  return s.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function isProbablyMobileDevice() {
  const ua = navigator.userAgent || "";
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  const touchOnlyTabletLike =
    (navigator.maxTouchPoints || 0) > 1 && window.innerWidth <= 1024;
  return mobileUA || touchOnlyTabletLike;
}

async function safeShare(shareData) {
  if (typeof navigator.share !== "function") return false;

  if (typeof navigator.canShare === "function") {
    try {
      if (!navigator.canShare(shareData)) return false;
    } catch (_) {
      return false;
    }
  }

  try {
    await navigator.share(shareData);
    return true;
  } catch (e) {
    if (e && e.name === "AbortError") throw e;
    return false;
  }
}

function triggerBlobDownload(blob, filename) {
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objUrl), 1200);
}

/* ════════════════════════════════
   SHARE LONG IMAGE
════════════════════════════════ */
async function shareResultAsImage() {
  const code = _lastResultCode || determineResultCode();
  const btn = document.querySelector(".share-btn:not(.short-share)");
  const targetEl = document.getElementById("result");
  const originalText = btn ? btn.textContent : "";
  const SITE_URL = "https://tealize-write.github.io/TwistedTales/";

  if (typeof trackUserAction === "function") {
    trackUserAction(code, "share_image");
  }

  // file:// 協定下 Chrome 會封鎖 canvas 匯出，提早告知
  if (window.location.protocol === "file:") {
    alert(
      "⚠️ 下載功能需要透過 HTTP 伺服器執行。\n\n" +
      "請改用 VS Code「Live Server」外掛：\n" +
      "右鍵 index.html → Open with Live Server\n\n" +
      "（部署到 GitHub Pages 後亦可正常使用）"
    );
    return;
  }

  if (btn) {
    btn.textContent = "生成專屬圖像中...";
    btn.disabled = true;
  }

  // ✦ 給瀏覽器 50 毫秒的喘息時間，確保「生成中...」文字順利渲染
  await new Promise((resolve) => setTimeout(resolve, 50));

  const hideEls = targetEl.querySelectorAll(
    ".btn-row, .share-divider, .buy-book-wrap, .lab:last-of-type, .stats, .btn-line-sticker-wrap",
  );
  hideEls.forEach((el) => (el.style.display = "none"));

  // framerusercontent.com 不送 CORS headers，留著會污染 canvas
  const _ctaCoverEl = targetEl.querySelector(".cta-cover");
  const _origCtaSrc = _ctaCoverEl ? _ctaCoverEl.src : null;
  if (_ctaCoverEl) _ctaCoverEl.src = "";

  targetEl.classList.add("capturing");

  const captureStyle = document.createElement("style");
  captureStyle.id = "capture-override-style";
  captureStyle.innerHTML = `
      body.capturing-global::before,
      body.capturing-global::after,
      .capturing-global .art-layer,
      .capturing-global #audio-btn,
      .capturing-global #audio-hint,
      .capturing-global .music-attribution {
          display: none !important;
          opacity: 0 !important;
      }
      #result.capturing {
          background-color: #0c1326 !important;
          background-image:
              radial-gradient(circle at 50% 50%, rgba(20,30,60,0.5), transparent),
              url("data:image/svg+xml,%3Csvg width='60' height='100' viewBox='0 0 60 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 50 L30 100 L0 50 Z' fill='%2312284a' opacity='0.9'/%3E%3Cpath d='M30 0 L60 50 L30 100 L0 50 Z' fill='none' stroke='rgba(212,175,55,0.20)' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='50' r='1' fill='rgba(212,175,55,0.42)'/%3E%3Ccircle cx='0' cy='0' r='1' fill='rgba(212,175,55,0.32)'/%3E%3Ccircle cx='60' cy='0' r='1' fill='rgba(212,175,55,0.32)'/%3E%3Ccircle cx='30' cy='100' r='1' fill='rgba(212,175,55,0.32)'/%3E%3C/svg%3E") !important;
          background-repeat: repeat, repeat !important;
          background-size: 100% 100%, 60px 100px !important;
          background-position: center, center top !important;
      }
      #result.capturing,
      #result.capturing .r-eyebrow,
      #result.capturing .r-compound,
      #result.capturing .r-name,
      #result.capturing .r-desc,
      #result.capturing .block .txt,
      #result.capturing .block .txt.muted,
      #result.capturing .block .lab,
      #result.capturing .seal .lab,
      #result.capturing .stats,
      #result.capturing .stats strong,
      #result.capturing .relation-label,
      #result.capturing .relation-world,
      #result.capturing .val,
      #result.capturing #pop-line {
          color: #ffffff !important;
          opacity: 1 !important;
      }
      #result.capturing .seal-ruler-track { background: rgba(255,255,255,.2) !important; }
      #result.capturing .seal-ruler-fill { background: #ffffff !important; box-shadow: none !important; }
      #result.capturing .tarot-frame,
      #result.capturing .block,
      #result.capturing .cta a {
          background-color: rgba(9, 22, 48, 0.86) !important;
          background-image: none !important;
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24) !important;
          border-color: rgba(235, 200, 145, 0.42) !important;
      }
      #result.capturing .result-img {
          filter: none !important;
      }
      #result.capturing * {
          text-shadow: none !important;
      }
      #result.capturing .r-name {
          text-shadow: 0 0 10px rgba(200,160,55,0.30) !important;
      }
  `;
  document.head.appendChild(captureStyle);
  document.body.classList.add("capturing-global");

  const animEls = [...targetEl.querySelectorAll(".in")];
  animEls.forEach((el) => {
    el.style.animation = "none";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    el.style.filter = "none";
  });

  const bgColor = "#0c1326";
  const emblemEl = targetEl.querySelector(".tarot-emblem");
  const emblemEls = emblemEl
    ? emblemEl.querySelectorAll('[fill="var(--bg)"], [stroke="var(--bg)"]')
    : [];
  emblemEls.forEach((el) => {
    if (el.getAttribute("fill") === "var(--bg)")
      el.setAttribute("fill", bgColor);
    if (el.getAttribute("stroke") === "var(--bg)")
      el.setAttribute("stroke", bgColor);
  });

  const stamp = document.createElement("div");
  stamp.id = "_share_stamp";
  stamp.style.cssText =
    "text-align:center;padding:26px 0 44px;background-color:#0c1326;";
  stamp.innerHTML =
    '<div style="border-top:1px solid rgba(212,175,55,0.35);margin:0 44px 24px;"></div>' +
    "<div style=\"font-family:'Noto Serif TC',serif;font-size:14px;letter-spacing:3px;color:rgba(249,231,177,0.88);margin-bottom:14px;\">《故事另有結局》</div>" +
    "<div style=\"font-family:'Noto Serif TC',serif;font-size:13px;letter-spacing:2px;color:rgba(212,175,55,0.65);margin-bottom:16px;\">" +
    (resultsData[code] ? resultsData[code].bookName : "") +
    "</div>" +
    '<div style="font-family:Georgia,serif;font-style:italic;font-size:12px;letter-spacing:2px;color:rgba(212,175,55,0.42);">✦  ' +
    SITE_URL +
    "  ✦</div>";

  const _longSpacer = document.createElement("div");
  _longSpacer.id = "_share_spacer";
  _longSpacer.style.cssText = "height:64px;background:transparent;";
  targetEl.appendChild(_longSpacer);
  targetEl.appendChild(stamp);

  // ── 暫時覆寫長圖標題群，使層級與 short image 一致 ──
  const r_share = resultsData[code];
  const _eyebrowEl = targetEl.querySelector(".r-eyebrow");
  const _compoundEl = targetEl.querySelector("#r-compound");
  const _origEyebrow = _eyebrowEl ? _eyebrowEl.textContent : null;
  const _origCompound = _compoundEl ? _compoundEl.textContent : null;
  const _isESC_share = r_share && r_share.storyName === "逃脫成功結局";
  if (r_share && _eyebrowEl) {
    _eyebrowEl.textContent = _isESC_share
      ? "清醒路線"
      : r_share.label
        ? `童話《${r_share.label}》`
        : "異世界移居指南";
  }
  if (r_share && _compoundEl) {
    _compoundEl.textContent = _isESC_share
      ? "── 逃脫成功結局 ──"
      : `IF 路線──${r_share.storyName || r_share.label || code}`;
  }

  const originalScrollY = window.scrollY;
  window.scrollTo(0, 0);

  const fullH = targetEl.scrollHeight;
  const fullW = targetEl.offsetWidth;

  // ✦ 動態調整渲染倍率 (手機降低倍率以換取速度)
  const isMobileSize = window.innerWidth <= 768;
  const renderScale = isMobileSize
    ? 1
    : Math.min(window.devicePixelRatio || 2, 2);

  let canvas = null;
  try {
    canvas = await html2canvas(targetEl, {
      scale: renderScale,
      backgroundColor: "#0a0f1e",
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: fullW,
      height: fullH,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: fullH,
      scrollX: 0,
      scrollY: 0,
    });
  } catch (err) {
    console.error("html2canvas 失敗:", err);
    alert("圖片生成失敗，請稍後再試。");
  }

  window.scrollTo(0, originalScrollY);
  animEls.forEach((el) => {
    el.style.animation = "";
    el.style.opacity = "";
    el.style.transform = "";
    el.style.filter = "";
  });
  emblemEls.forEach((el) => {
    if (el.getAttribute("fill") === bgColor)
      el.setAttribute("fill", "var(--bg)");
    if (el.getAttribute("stroke") === bgColor)
      el.setAttribute("stroke", "var(--bg)");
  });

  const _spacerEl = document.getElementById("_share_spacer");
  if (_spacerEl) _spacerEl.remove();
  const stampEl = document.getElementById("_share_stamp");
  if (stampEl) stampEl.remove();

  // ── 還原長圖標題群文字 ──
  if (_eyebrowEl && _origEyebrow !== null)
    _eyebrowEl.textContent = _origEyebrow;
  if (_compoundEl && _origCompound !== null)
    _compoundEl.textContent = _origCompound;

  targetEl.classList.remove("capturing");
  document.body.classList.remove("capturing-global");
  const overrideStyle = document.getElementById("capture-override-style");
  if (overrideStyle) overrideStyle.remove();

  if (_ctaCoverEl && _origCtaSrc) _ctaCoverEl.src = _origCtaSrc;
  hideEls.forEach((el) => (el.style.display = ""));
  if (btn) {
    btn.textContent = originalText;
    btn.disabled = false;
  }

  if (!canvas) return;

  // ── 桌機：直接下載 ──
  const isMobileDevice = isProbablyMobileDevice();
  if (!isMobileDevice) {
    // Step 1：toBlob（20 秒 timeout 防止無限等待）
    let blob = null;
    try {
      blob = await new Promise((resolve) => {
        let done = false;
        const timer = setTimeout(() => {
          if (!done) {
            done = true;
            console.warn("toBlob timeout");
            resolve(null);
          }
        }, 20000);
        try {
        canvas.toBlob((b) => {
          if (!done) {
            done = true;
            clearTimeout(timer);
            resolve(b);
          }
        }, "image/png");
      } catch (syncErr) {
        if (!done) { done = true; clearTimeout(timer); }
        throw syncErr;
      }
      });
    } catch (e) {
      console.error("desktop toBlob error:", e);
    }

    // Step 2：toBlob 失敗 → base64→Blob（和手機相同路徑，比 raw dataURL href 更可靠）
    if (!blob) {
      console.warn("toBlob null, fallback to dataURL→Blob");
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const arr = dataUrl.split(",");
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8 = new Uint8Array(n);
        while (n--) u8[n] = bstr.charCodeAt(n);
        blob = new Blob([u8], { type: "image/png" });
      } catch (e) {
        console.error("desktop dataURL fallback error:", e);
      }
    }

    // Step 3：下載（永遠走 createObjectURL，不用 raw dataURL 作 href）
    if (!blob) {
      if (btn) {
        btn.textContent = "✦ 下載失敗，請截圖儲存";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 3000);
      }
      return;
    }

    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dark_trait_result.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      if (btn) {
        btn.textContent = "✦ 圖片已下載！";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2500);
      }
    } catch (e) {
      console.error("desktop download trigger failed:", e);
      if (btn) {
        btn.textContent = "✦ 下載失敗，請截圖儲存";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 3000);
      }
    }
    return;
  }

  // ── 手機長圖：顯示長按儲存覆蓋層，迴避 iOS canvas 記憶體限制 ──
  const shareBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  if (!shareBlob) {
    if (btn) {
      btn.textContent = "✦ 圖片生成失敗";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3000);
    }
    alert("圖片生成失敗，請稍後再試。");
    return;
  }

  showLongPressSaveOverlay(shareBlob);
  if (btn) {
    btn.textContent = "✦ 長按圖片儲存";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2500);
  }
}

function _doMobileDownload(blob) {
  triggerBlobDownload(blob, "dark_trait_result.png");
}

function showLongPressSaveOverlay(blob) {
  const url = URL.createObjectURL(blob);
  const file = new File([blob], "dark_trait_result.png", { type: "image/png" });

  const canShareFiles =
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    (() => { try { return navigator.canShare({ files: [file] }); } catch (_) { return false; } })();

  const hint = canShareFiles
    ? "點擊「分享圖片」傳送，或長按圖片另存"
    : "長按圖片儲存，或截圖保存";

  const overlay = document.createElement("div");
  overlay.id = "share-save-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(5,8,18,.92);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px;
  `;

  const btnRow = canShareFiles
    ? `<button id="_ov-share" type="button" style="
        padding:10px 22px;
        border-radius:999px;
        border:1px solid rgba(249,231,177,.8);
        background:rgba(212,175,55,.18);
        color:#f9e7b1;
        font-family:'Noto Serif TC',serif;
        font-size:14px;
        letter-spacing:2px;
        cursor:pointer;
      ">✦ 分享圖片</button>
      <button id="_ov-close" type="button" style="
        padding:10px 18px;
        border-radius:999px;
        border:1px solid rgba(249,231,177,.5);
        background:rgba(10,16,30,.9);
        color:#f9e7b1;
        font-family:'Noto Serif TC',serif;
        font-size:14px;
        letter-spacing:2px;
        cursor:pointer;
      ">關閉</button>`
    : `<button id="_ov-close" type="button" style="
        padding:10px 18px;
        border-radius:999px;
        border:1px solid rgba(249,231,177,.5);
        background:rgba(10,16,30,.9);
        color:#f9e7b1;
        font-family:'Noto Serif TC',serif;
        font-size:14px;
        letter-spacing:2px;
        cursor:pointer;
      ">關閉</button>`;

  overlay.innerHTML = `
    <div style="
      color:#f9e7b1;
      font-family:'Noto Serif TC',serif;
      letter-spacing:2px;
      margin-bottom:12px;
      text-align:center;
      font-size:13px;
    ">${hint}</div>
    <img src="${url}" style="
      max-width:100%;
      max-height:72vh;
      object-fit:contain;
      border-radius:12px;
      box-shadow:0 12px 40px rgba(0,0,0,.45);
      -webkit-touch-callout: default;
      user-select: auto;
    " />
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;justify-content:center;">
      ${btnRow}
    </div>
  `;

  const closeOverlay = () => {
    overlay.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  overlay.querySelector("#_ov-close").onclick = closeOverlay;

  if (canShareFiles) {
    const shareBtn = overlay.querySelector("#_ov-share");
    shareBtn.onclick = async () => {
      try {
        await navigator.share({ files: [file] });
        closeOverlay();
      } catch (e) {
        if (e.name === "AbortError") return;
        // share 失敗時保留 overlay，使用者仍可長按另存
      }
    };
  }

  document.body.appendChild(overlay);
}

/* ════════════════════════════════
   SHARE SHORT IMAGE (IG 1080 × 1350) - 黑暗童話精修版
════════════════════════════════ */
async function shareShortImage() {
  const code = _lastResultCode || determineResultCode();
  const r = resultsData[code];
  const SITE_URL = "https://tealize-write.github.io/TwistedTales/";
  if (!r) return;

  const btn = document.querySelector(".share-btn.short-share");
  const origText = btn ? btn.textContent : "";
  if (btn) {
    btn.textContent = "生成中…";
    btn.disabled = true;
  }
  if (typeof trackUserAction === "function")
    trackUserAction(code, "share_short");

  const CW = 1050;
  const CH = 1586;
  const canvas = document.createElement("canvas");
  canvas.width = CW;
  canvas.height = CH;
  const ctx = canvas.getContext("2d");

  /* ── 繪圖輔助工具 ── */
  function setShadow(blur, color) {
    ctx.shadowColor = color || "rgba(0,0,0,0.6)";
    ctx.shadowBlur = blur;
  }
  function clearShadow() {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  function getWrappedLines(text, maxW) {
    const lines = [];
    let line = "";
    for (const ch of text || "") {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = ch;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  async function loadImg(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src + (src.includes("?") ? "&" : "?") + "cache=" + Date.now();
    });
  }

  /* ══ 1. 增強版菱格紋背景 ══ */
  ctx.fillStyle = "#0e1e38";
  ctx.fillRect(0, 0, CW, CH);

  const tileW = 90,
    tileH = 150;
  const tileCanvas = document.createElement("canvas");
  tileCanvas.width = tileW;
  tileCanvas.height = tileH;
  const tctx = tileCanvas.getContext("2d");

  tctx.fillStyle = "#1e3868";
  tctx.beginPath();
  tctx.moveTo(tileW / 2, 0);
  tctx.lineTo(tileW, tileH / 2);
  tctx.lineTo(tileW / 2, tileH);
  tctx.lineTo(0, tileH / 2);
  tctx.closePath();
  tctx.fill();

  tctx.strokeStyle = "rgba(212,175,55,0.32)";
  tctx.lineWidth = 1;
  tctx.stroke();

  tctx.fillStyle = "rgba(212,175,55,0.65)";
  tctx.beginPath();
  tctx.arc(tileW / 2, 0, 1.5, 0, Math.PI * 2);
  tctx.fill();
  tctx.beginPath();
  tctx.arc(0, tileH / 2, 1.5, 0, Math.PI * 2);
  tctx.fill();
  tctx.beginPath();
  tctx.arc(tileW, tileH / 2, 1.5, 0, Math.PI * 2);
  tctx.fill();
  tctx.beginPath();
  tctx.arc(tileW / 2, tileH, 1.5, 0, Math.PI * 2);
  tctx.fill();

  const pattern = ctx.createPattern(tileCanvas, "repeat");
  ctx.fillStyle = pattern;
  ctx.globalAlpha = 0.88;
  ctx.fillRect(0, 0, CW, CH);
  ctx.globalAlpha = 1.0;

  /* ══ 2. 角色英雄圖 ══ */
  const PANEL_Y = Math.round(CH * 0.48);
  try {
    const img = await loadImg(r.image);
    if (img) {
      const imgOffY = 68;
      const scale = Math.min(
        CW / img.naturalWidth,
        PANEL_Y / img.naturalHeight,
      );
      const sw = Math.round(img.naturalWidth * scale);
      const sh = Math.round(img.naturalHeight * scale);
      ctx.drawImage(img, (CW - sw) / 2, imgOffY, sw, sh);

      // 底部淡出
      const fadeStart = Math.max(imgOffY + sh - 220, imgOffY);
      const grad = ctx.createLinearGradient(0, fadeStart, 0, PANEL_Y + 10);
      grad.addColorStop(0, "rgba(14,30,56,0)");
      grad.addColorStop(0.6, "rgba(14,30,56,0.75)");
      grad.addColorStop(1, "#0e1e38");
      ctx.fillStyle = grad;
      ctx.fillRect(0, fadeStart, CW, PANEL_Y + 10 - fadeStart);

      // 左右側邊暗幕
      const vigW = Math.round(CW * 0.12);
      const lvg = ctx.createLinearGradient(0, 0, vigW, 0);
      lvg.addColorStop(0, "rgba(14,30,56,0.38)");
      lvg.addColorStop(1, "rgba(14,30,56,0)");
      ctx.fillStyle = lvg;
      ctx.fillRect(0, 0, vigW, PANEL_Y);
      const rvg = ctx.createLinearGradient(CW - vigW, 0, CW, 0);
      rvg.addColorStop(0, "rgba(14,30,56,0)");
      rvg.addColorStop(1, "rgba(14,30,56,0.38)");
      ctx.fillStyle = rvg;
      ctx.fillRect(CW - vigW, 0, vigW, PANEL_Y);
    }
  } catch (e) {}

  // 頂部極淡暗幕
  {
    const tvg = ctx.createLinearGradient(0, 0, 0, 72);
    tvg.addColorStop(0, "rgba(14,30,56,0.16)");
    tvg.addColorStop(1, "rgba(14,30,56,0)");
    ctx.fillStyle = tvg;
    ctx.fillRect(0, 0, CW, 72);
  }

  /* ══ 3. 文字托底板 ══ */
  ctx.fillStyle = "rgba(8,14,32,0.84)";
  ctx.fillRect(0, PANEL_Y, CW, CH - PANEL_Y);

  // 金色雙線框 + 第三條極淡細線
  const FM = 26;
  ctx.strokeStyle = "rgba(212,175,55,0.65)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(FM + 12, PANEL_Y + 10);
  ctx.lineTo(CW - FM - 12, PANEL_Y + 10);
  ctx.stroke();
  ctx.strokeStyle = "rgba(212,175,55,0.18)";
  ctx.beginPath();
  ctx.moveTo(FM + 22, PANEL_Y + 16);
  ctx.lineTo(CW - FM - 22, PANEL_Y + 16);
  ctx.stroke();
  ctx.strokeStyle = "rgba(212,175,55,0.08)";
  ctx.beginPath();
  ctx.moveTo(FM + 30, PANEL_Y + 22);
  ctx.lineTo(CW - FM - 30, PANEL_Y + 22);
  ctx.stroke();

  // 四角星點
  function drawStar4(x, y, r) {
    const t = r * 0.38;
    ctx.fillStyle = "rgba(212,175,55,0.80)";
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + t, y - t);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x + t, y + t);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - t, y + t);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x - t, y - t);
    ctx.closePath();
    ctx.fill();
  }
  drawStar4(FM + 12, PANEL_Y + 10, 5.5);
  drawStar4(CW - FM - 12, PANEL_Y + 10, 5.5);

  /* ══ 4. 頂部橫幅 ══ */
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `italic 300 ${Math.round(CW * 0.02)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(212,175,55,0.55)";
  ctx.letterSpacing = "5px";
  ctx.fillText("故 事 另 有 結 局  ✦  黑 童 話 測 驗", CW / 2, FM + 12);
  ctx.letterSpacing = "0px";

  /* ══ 5. 文字內容 ══ */
  const PAD_X = Math.round(CW * 0.082);
  const isESC = r.storyName === "逃脫成功結局";
  let y = PANEL_Y + 46;

  function setShadowCtx(blur, color) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
  }
  function clearShadowCtx() {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
  function fillWrapped(text, startY, maxW, lineH, maxLines) {
    let lines = getWrappedLines(text, maxW);
    if (maxLines) lines = lines.slice(0, maxLines);
    lines.forEach((l, i) => ctx.fillText(l, CW / 2, startY + i * lineH));
    return startY + lines.length * lineH;
  }

  // 第一層：童話《label》
  ctx.font = `italic 300 ${Math.round(CW * 0.024)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(212,175,55,0.96)";
  ctx.letterSpacing = "5px";
  ctx.fillText(
    isESC ? "清醒路線" : r.label ? `童話《${r.label}》` : "異世界移居指南",
    CW / 2,
    y,
  );
  ctx.letterSpacing = "0px";
  y += Math.round(CW * 0.04);

  // 第二層：IF 路線
  ctx.font = `400 ${Math.round(CW * 0.028)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(249,231,177,0.96)";
  ctx.letterSpacing = "3px";
  ctx.fillText(
    isESC ? "── 逃脫成功結局 ──" : `IF 路線──${r.storyName || r.label || code}`,
    CW / 2,
    y,
  );
  ctx.letterSpacing = "0px";
  y += Math.round(CW * 0.048);

  // 第三層：residentType（主標）
  ctx.font = `700 ${Math.round(CW * 0.053)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "#f9e7b1";
  ctx.letterSpacing = "10px";
  setShadowCtx(8, "rgba(212,175,55,0.25)");
  ctx.fillText(r.residentType, CW / 2, y);
  clearShadowCtx();
  ctx.letterSpacing = "0px";

  // residentType 下方金色裝飾線
  {
    const ulW = Math.round(CW * 0.18);
    const ulY = y + Math.round(CW * 0.063);
    const ulX0 = (CW - ulW) / 2;
    const ulG = ctx.createLinearGradient(ulX0, 0, ulX0 + ulW, 0);
    ulG.addColorStop(0, "rgba(212,175,55,0)");
    ulG.addColorStop(0.35, "rgba(212,175,55,0.70)");
    ulG.addColorStop(0.65, "rgba(212,175,55,0.70)");
    ulG.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = ulG;
    ctx.fillRect(ulX0, ulY, ulW, 1.5);
  }
  y += Math.round(CW * 0.074);

  /* ── 圖騰分隔線（置於 residentDesc 前） ── */
  let emblemImg = null;
  try {
    let rawSvg = getEmblemSVG(code);
    rawSvg = rawSvg.replace(/currentColor/g, "rgba(249,215,100,1.0)");
    rawSvg = rawSvg.replace(/var\(--bg\)/g, "#0b1530");
    if (!rawSvg.includes("xmlns="))
      rawSvg = rawSvg.replace(
        "<svg ",
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" ',
      );
    emblemImg = await new Promise((resolve) => {
      const _i = new Image();
      _i.onload = () => resolve(_i);
      _i.onerror = () => resolve(null);
      _i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(rawSvg);
    });
  } catch (e) {}

  const divLineW = Math.round(CW * 0.6);
  const eSize = emblemImg ? Math.round(CW * 0.096) : 0;
  const halfGap = eSize > 0 ? eSize / 2 + 14 : 0;
  // emblem 從 y 開始向下繪製（不以 y 為中心），避免蓋到上方文字
  const eDrawY = y;
  const lineY = y + (eSize > 0 ? Math.round(eSize / 2) : 0);
  const drawGradH = (x0, x1, a0, a1) => {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, `rgba(212,175,55,${a0})`);
    g.addColorStop(1, `rgba(212,175,55,${a1})`);
    ctx.fillStyle = g;
    ctx.fillRect(x0, lineY - 0.5, x1 - x0, 1);
  };
  const lx0 = (CW - divLineW) / 2,
    lx1 = CW / 2 - halfGap;
  const rx0 = CW / 2 + halfGap,
    rx1 = lx0 + divLineW;
  if (lx0 < lx1) drawGradH(lx0, lx1, 0, 0.5);
  if (rx0 < rx1) drawGradH(rx0, rx1, 0.5, 0);
  if (emblemImg) {
    const glowR = Math.round(eSize * 0.72);
    const glowG = ctx.createRadialGradient(
      CW / 2,
      lineY,
      0,
      CW / 2,
      lineY,
      glowR,
    );
    glowG.addColorStop(0, "rgba(212,175,55,0.22)");
    glowG.addColorStop(0.6, "rgba(212,175,55,0.08)");
    glowG.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = glowG;
    ctx.beginPath();
    ctx.arc(CW / 2, lineY, glowR, 0, Math.PI * 2);
    ctx.fill();
    setShadowCtx(28, "rgba(212,175,55,0.70)");
    ctx.drawImage(emblemImg, (CW - eSize) / 2, eDrawY, eSize, eSize);
    clearShadowCtx();
  } else {
    const dm = 7;
    ctx.fillStyle = "rgba(212,175,55,0.75)";
    ctx.beginPath();
    ctx.moveTo(CW / 2, lineY - dm);
    ctx.lineTo(CW / 2 + dm, lineY);
    ctx.lineTo(CW / 2, lineY + dm);
    ctx.lineTo(CW / 2 - dm, lineY);
    ctx.closePath();
    ctx.fill();
  }
  y += (eSize > 0 ? eSize : Math.round(CW * 0.04)) + Math.round(CW * 0.02);

  // 第四層：residentDesc
  const descLineH = Math.round(CW * 0.036);
  ctx.font = `300 ${Math.round(CW * 0.022)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(238,220,195,0.96)";
  ctx.letterSpacing = "2px";
  y = fillWrapped(r.residentDesc || "", y, CW - PAD_X * 2 - 80, descLineH, 2);
  ctx.letterSpacing = "0px";
  y += Math.round(CW * 0.022);

  /* ── 4欄指標 ── */
  const FOOTER_Y = CH - 108;
  const axisMax = typeof calcAxisMax === "function" ? calcAxisMax() : {};
  const _tags = r && r.bookTags && r.bookTags.length ? r.bookTags : [];
  const _randomTag = _tags.length
    ? _tags[Math.floor(Math.random() * _tags.length)]
    : "—";
  const top1dark = [{ lab: "紀念品", val: _randomTag, pct: 100 }];
  // 與結果頁一致：直接使用結果資料內的固定指標，避免分享圖 fallback 成 0
  const mp2 = (r && r.metrics) || {};
  const ml2 =
    typeof metricLabels !== "undefined"
      ? metricLabels
      : { survival: "生存率", happiness: "幸福指數", fate: "命運干預值" };
  const seals = [
    {
      lab: ml2.survival,
      val: (mp2.survival ?? 0) + "%",
      pct: mp2.survival || 0,
    },
    {
      lab: ml2.happiness,
      val: (mp2.happiness ?? 0) + "%",
      pct: mp2.happiness || 0,
    },
    { lab: ml2.fate, val: (mp2.fate ?? 0) + "%", pct: mp2.fate || 0 },
    ...top1dark,
  ];

  const sPadX = Math.round(CW * 0.048);
  const sW = Math.round((CW - sPadX * 2) / seals.length);
  const barH = 3;
  const barW = sW - Math.round(CW * 0.022);
  const sealH = Math.round(CW * 0.092);
  const sealTopY = y - 8;
  const sealBotY = y + sealH - 8;

  // 整體極淡金色光帶（取代格線框）
  {
    const bandG = ctx.createLinearGradient(0, sealTopY, 0, sealBotY);
    bandG.addColorStop(0, "rgba(212,175,55,0.06)");
    bandG.addColorStop(0.5, "rgba(212,175,55,0.02)");
    bandG.addColorStop(1, "rgba(212,175,55,0.06)");
    ctx.fillStyle = bandG;
    ctx.fillRect(
      sPadX - 8,
      sealTopY,
      CW - (sPadX - 8) * 2,
      sealBotY - sealTopY,
    );
  }

  // 頂部裝飾線：兩端淡出漸變 + 端點星
  {
    const tg = ctx.createLinearGradient(sPadX, 0, CW - sPadX, 0);
    tg.addColorStop(0, "rgba(212,175,55,0)");
    tg.addColorStop(0.1, "rgba(212,175,55,0.52)");
    tg.addColorStop(0.9, "rgba(212,175,55,0.52)");
    tg.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = tg;
    ctx.fillRect(sPadX, sealTopY, CW - sPadX * 2, 1);
    drawStar4(sPadX + 18, sealTopY, 3.5);
    drawStar4(CW - sPadX - 18, sealTopY, 3.5);
  }

  ctx.textAlign = "center";
  seals.forEach((s, i) => {
    const sx = sPadX + i * sW;
    const cx = sx + sW / 2;
    const isLast = i === seals.length - 1;

    // 欄間裝飾：菱形 + 上下小圓點（取代直線分隔）
    if (i > 0) {
      const sepX = sx;
      const sepCY = y + Math.round(sealH * 0.36);
      const dm = 4.5;
      ctx.fillStyle = isLast
        ? "rgba(212,175,55,0.65)"
        : "rgba(212,175,55,0.42)";
      ctx.beginPath();
      ctx.moveTo(sepX, sepCY - dm);
      ctx.lineTo(sepX + dm, sepCY);
      ctx.lineTo(sepX, sepCY + dm);
      ctx.lineTo(sepX - dm, sepCY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = isLast
        ? "rgba(212,175,55,0.38)"
        : "rgba(212,175,55,0.24)";
      ctx.beginPath();
      ctx.arc(sepX, sepCY - dm - 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sepX, sepCY + dm + 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 標籤
    ctx.font = `400 ${Math.round(CW * 0.02)}px "Noto Serif TC", serif`;
    ctx.fillStyle = "rgba(225,202,160,0.92)";
    ctx.letterSpacing = "1px";
    ctx.fillText(s.lab, cx, y);
    ctx.letterSpacing = "0px";

    // 進度條
    const barY = y + Math.round(CW * 0.031);
    ctx.fillStyle = "rgba(212,175,55,0.18)";
    ctx.fillRect(sx + Math.round(CW * 0.011), barY, barW, barH);
    const fillW = Math.round((barW * Math.min(s.pct, 100)) / 100);
    const bGrad = ctx.createLinearGradient(sx, 0, sx + sW, 0);
    bGrad.addColorStop(0, "rgba(170,130,50,0.90)");
    bGrad.addColorStop(1, "rgba(249,231,177,0.95)");
    ctx.fillStyle = bGrad;
    setShadowCtx(4, "rgba(212,175,55,0.30)");
    ctx.fillRect(sx + Math.round(CW * 0.011), barY, fillW, barH);
    clearShadowCtx();

    // 數值
    ctx.font = `700 ${Math.round(CW * 0.026)}px "Noto Serif TC", serif`;
    ctx.fillStyle = isLast ? "rgba(249,215,120,0.95)" : "#faf5ea";
    ctx.letterSpacing = "1px";
    ctx.fillText(s.val, cx, barY + Math.round(CW * 0.022));
    ctx.letterSpacing = "0px";
  });

  // 底部裝飾線：同頂部
  {
    const bg = ctx.createLinearGradient(sPadX, 0, CW - sPadX, 0);
    bg.addColorStop(0, "rgba(212,175,55,0)");
    bg.addColorStop(0.1, "rgba(212,175,55,0.52)");
    bg.addColorStop(0.9, "rgba(212,175,55,0.52)");
    bg.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(sPadX, sealBotY, CW - sPadX * 2, 1);
    drawStar4(sPadX + 18, sealBotY, 3.5);
    drawStar4(CW - sPadX - 18, sealBotY, 3.5);
  }

  y += sealH;

  /* ── 引言分隔線 ── */
  {
    const qdW = Math.round(CW * 0.48);
    const qx0 = (CW - qdW) / 2;
    const qg1 = ctx.createLinearGradient(qx0, 0, CW / 2 - 8, 0);
    qg1.addColorStop(0, "rgba(212,175,55,0)");
    qg1.addColorStop(1, "rgba(212,175,55,0.42)");
    ctx.fillStyle = qg1;
    ctx.fillRect(qx0, y - 0.5, CW / 2 - 8 - qx0, 1);
    const qg2 = ctx.createLinearGradient(CW / 2 + 8, 0, qx0 + qdW, 0);
    qg2.addColorStop(0, "rgba(212,175,55,0.42)");
    qg2.addColorStop(1, "rgba(212,175,55,0)");
    ctx.fillStyle = qg2;
    ctx.fillRect(CW / 2 + 8, y - 0.5, qx0 + qdW - (CW / 2 + 8), 1);
    const dm = 5;
    ctx.fillStyle = "rgba(212,175,55,0.72)";
    ctx.beginPath();
    ctx.moveTo(CW / 2, y - dm);
    ctx.lineTo(CW / 2 + dm, y);
    ctx.lineTo(CW / 2, y + dm);
    ctx.lineTo(CW / 2 - dm, y);
    ctx.closePath();
    ctx.fill();
  }
  y += Math.round(CW * 0.03);

  /* ── 世界警語 ── */
  const qLineH = Math.round(CW * 0.038);
  const qAvail = FOOTER_Y - 12 - y;
  const qMaxLines = Math.max(1, Math.floor(qAvail / qLineH));
  ctx.font = `italic 300 ${Math.round(CW * 0.023)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(249,231,177,0.84)";
  ctx.letterSpacing = "3px";
  fillWrapped(
    r.residentDesc || "",
    y,
    CW - PAD_X * 2,
    qLineH,
    Math.min(3, qMaxLines),
  );
  ctx.letterSpacing = "0px";

  /* ══ 6. 頁腳 ══ */
  ctx.fillStyle = "rgba(10,16,30,0.92)";
  ctx.fillRect(0, FOOTER_Y, CW, CH - FOOTER_Y);

  ctx.strokeStyle = "rgba(212,175,55,0.38)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(FM + 12, FOOTER_Y + 1);
  ctx.lineTo(CW - FM - 12, FOOTER_Y + 1);
  ctx.stroke();
  ctx.strokeStyle = "rgba(212,175,55,0.14)";
  ctx.beginPath();
  ctx.moveTo(FM + 22, FOOTER_Y + 6);
  ctx.lineTo(CW - FM - 22, FOOTER_Y + 6);
  ctx.stroke();
  drawStar4(FM + 12, FOOTER_Y + 1, 4.5);
  drawStar4(CW - FM - 12, FOOTER_Y + 1, 4.5);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `500 ${Math.round(CW * 0.029)}px "Noto Serif TC", serif`;
  ctx.fillStyle = "rgba(249,231,177,0.88)";
  ctx.letterSpacing = "4px";
  setShadowCtx(2, "rgba(212,175,55,0.15)");
  ctx.fillText(`《故事另有結局》✦ ${r.bookName}`, CW / 2, FOOTER_Y + 20);
  clearShadowCtx();
  ctx.letterSpacing = "0px";

  ctx.font = `300 ${Math.round(CW * 0.018)}px Georgia, serif`;
  ctx.fillStyle = "rgba(212,175,55,0.38)";
  ctx.letterSpacing = "2px";
  ctx.fillText("✦  " + SITE_URL + "  ✦", CW / 2, FOOTER_Y + 66);
  ctx.letterSpacing = "0px";

  /* ══ 7. 外框角落 ══ */
  ctx.strokeStyle = "rgba(212,175,55,0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(FM, FM, CW - FM * 2, CH - FM * 2);

  const cl = 32;
  ctx.strokeStyle = "rgba(212,175,55,0.58)";
  ctx.lineWidth = 2;
  const dc = (ax, ay, bx, by, cx2, cy2) => {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
  };
  dc(FM, FM + cl, FM, FM, FM + cl, FM);
  dc(CW - FM - cl, FM, CW - FM, FM, CW - FM, FM + cl);
  dc(FM, CH - FM - cl, FM, CH - FM, FM + cl, CH - FM);
  dc(CW - FM - cl, CH - FM, CW - FM, CH - FM, CW - FM, CH - FM - cl);

  /* ══ 8. 輸出 ══ */
  const restore = () => {
    if (btn) {
      btn.textContent = origText;
      btn.disabled = false;
    }
  };
  const doSaveShort = (blob) => {
    const file = new File([blob], "dark_result_short.png", {
      type: "image/png",
    });
    const tryShareThenDownload = async () => {
      if (isProbablyMobileDevice()) {
        try {
          const sharedFile = await safeShare({
            files: [file],
            title: "我的異世界居住指南",
            url: SITE_URL,
          });
          if (sharedFile) {
            restore();
            return;
          }

          const sharedLink = await safeShare({
            title: "我的異世界居住指南",
            text: "點我測測看你適合住進哪個童話異世界",
            url: SITE_URL,
          });
          if (sharedLink) {
            restore();
            return;
          }
        } catch (e) {
          if (e && e.name === "AbortError") {
            restore();
            return;
          }
        }
      }

      triggerBlobDownload(blob, "dark_result_short.png");
      if (btn) {
        btn.textContent = "✦ IG圖已下載！";
        setTimeout(() => restore(), 2500);
      } else {
        restore();
      }
    };

    tryShareThenDownload();
  };

  try {
    await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          doSaveShort(blob);
          resolve();
        } else reject(new Error("toBlob returned null"));
      }, "image/png");
    });
  } catch (e) {
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const arr = dataUrl.split(",");
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8 = new Uint8Array(n);
      while (n--) u8[n] = bstr.charCodeAt(n);
      doSaveShort(new Blob([u8], { type: "image/png" }));
    } catch (e2) {
      alert("無法下載，請使用截圖功能儲存！");
      restore();
    }
  }
}
