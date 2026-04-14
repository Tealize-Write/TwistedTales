/* ── ENGINE ── */

// 故事分類代號（與 questions.js 的 scores key、results.js 的頂層 key 一致）
const CATEGORY_KEYS = [
  'BRO', 'SHA', 'PIP', 'KING', 'BEAST',
  'THORN', 'RACE', 'CROW', 'CANDY', 'CIND', 'ESC'
];

/* ════════════════════════════════
   STATE
════════════════════════════════ */
let qi = 0;
let categoryScore = {};
let answerHistory = []; // 每題記錄玩家選了哪一個 option index
let _lastResultCode = null;
CATEGORY_KEYS.forEach(k => categoryScore[k] = 0);

// 三指標累計分數（由玩家作答選項的 metrics 欄位累加）
let metricScore = { survival: 0, happiness: 0, fate: 0 };

const elIntro    = document.getElementById('intro');
const elQuiz     = document.getElementById('quiz');
const elResult   = document.getElementById('result');
const elProgress = document.getElementById('progress');

/* ════════════════════════════════
   SCORING
════════════════════════════════ */

// 累加選項的故事分類分數
// scoresObj 格式：{ BRO: 2, THORN: 1 } 等
function addAxisScores(scoresObj) {
  if (!scoresObj) return;
  for (const k in scoresObj) {
    if (Object.prototype.hasOwnProperty.call(categoryScore, k)) {
      categoryScore[k] += Number(scoresObj[k]) || 0;
    }
  }
}

// 累加選項的三指標分數（與 addAxisScores 並行，互不干擾）
// metricsObj 格式：{ survival: 4, happiness: 6, fate: 9 }
function addMetricScores(metricsObj) {
  if (!metricsObj) return;
  for (const k in metricScore) {
    if (Object.prototype.hasOwnProperty.call(metricsObj, k)) {
      metricScore[k] += Number(metricsObj[k]) || 0;
    }
  }
}

// 動態計算三指標的理論最大分（每題取該 metric 四個選項中的最大值，加總所有題）
function calcMetricMax() {
  const max = { survival: 0, happiness: 0, fate: 0 };
  questions.forEach(q => {
    for (const k in max) {
      let best = 0;
      q.options.forEach(o => {
        best = Math.max(best, Number((o.metrics && o.metrics[k]) || 0));
      });
      max[k] += best;
    }
  });
  return max;
}

// 將玩家累計分轉換為 0–100 的百分比整數
// 使用動態最大值作分母，確保不寫死、不超過 100%
function calcMetricPercent() {
  const max = calcMetricMax();
  const result = {};
  for (const k in metricScore) {
    const denom = max[k] || 1; // 防止除以零
    result[k] = Math.min(100, Math.max(0, Math.round((metricScore[k] / denom) * 100)));
  }
  return result;
}

/* ════════════════════════════════
   TIE-BREAKER（抽成獨立函式）
════════════════════════════════ */

// 取某題某選項的 scores 物件（依 answerHistory）
function getOptionScoresByHistory(questionIndex) {
  const optIdx = answerHistory[questionIndex];
  if (optIdx == null) return null;

  const q = questions[questionIndex];
  if (!q || !Array.isArray(q.options)) return null;

  const opt = q.options[optIdx];
  return (opt && opt.scores) ? opt.scores : null;
}

// 從最後一題往前回溯，逐步縮小 candidates 直到唯一
function breakCategoryTie(candidates) {
  let current = [...candidates];

  for (let i = answerHistory.length - 1; i >= 0; i--) {
    const scores = getOptionScoresByHistory(i);
    if (!scores) continue;

    let best = -1;
    let winners = [];

    for (const cat of current) {
      const s = Number(scores[cat] || 0);
      if (s > best)       { best = s; winners = [cat]; }
      else if (s === best) { winners.push(cat); }
    }

    if (best > 0) {
      if (winners.length === 1) return winners[0]; // 找到唯一勝者
      current = winners; // 淘汰分數較低的，繼續往前
    }
  }

  // 全部回溯完仍平手 → 依 CATEGORY_KEYS 固定順序保底
  return CATEGORY_KEYS.find(k => current.includes(k)) || current[0];
}

/* ════════════════════════════════
   RESULT LOGIC
════════════════════════════════ */

function determineResultCode() {
  // 找到最高分
  const maxScore = Math.max(...CATEGORY_KEYS.map(k => categoryScore[k]));

  // 收集所有並列最高分的分類
  const topCandidates = CATEGORY_KEYS.filter(k => categoryScore[k] === maxScore);

  // 唯一最高分直接返回；平手則走 tie-breaker
  return topCandidates.length === 1
    ? topCandidates[0]
    : breakCategoryTie(topCandidates);
}

/* ════════════════════════════════
   SHARED RULER UTILITIES
════════════════════════════════ */
const TICK_COUNT = 10;

// 計算各分類的理論最高分（每題取各選項最大值加總）
function calcAxisMax() {
  const max = {};
  CATEGORY_KEYS.forEach(k => max[k] = 0);

  questions.forEach(q => {
    CATEGORY_KEYS.forEach(k => {
      let best = 0;
      q.options.forEach(o => {
        best = Math.max(best, Number((o.scores && o.scores[k]) || 0));
      });
      max[k] += best;
    });
  });

  return max;
}

/* ════════════════════════════════
   GLOBAL EXPORTS
════════════════════════════════ */
window.startQuiz      = startQuiz;
window.confirmRestart = confirmRestart;
window.skipTypewriter = skipTypewriter;
// shareResultAsImage is defined and exported in ui.js
