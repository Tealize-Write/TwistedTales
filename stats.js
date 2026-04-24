// 產生或讀取專屬裝置 ID
// ✦ 已有 uid_ 開頭的舊 ID 繼續沿用；全新訪客改用 tt_ 前綴
function getClientId() {
  let cid = localStorage.getItem("abyss_client_id");
  if (!cid) {
    cid = "tale_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem("abyss_client_id", cid);
  }
  return cid;
}

// ── 全域變數，預存玩家地點 (預設使用時區作為國家備案)
const _tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
window.userLocationData = {
  country: _tz,
  city: _tz,
};

// ── IP 地理位置（ipwho.is 主服務 + 超時保護）────────────────
window._locationReady = (async () => {
  const createTimeout = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    const res = await Promise.race([
      fetch("https://ipwho.is/"),
      createTimeout(2000),
    ]);
    if (!res || !res.ok) return;
    const data = await res.json();
    if (data && data.success) {
      window.userLocationData.country =
        data.country || window.userLocationData.country;
      window.userLocationData.city = data.city || window.userLocationData.city;
    }
  } catch (_) {}
})();

// ── 輔助函數：打包擴充的分析數據 ──
function getTrackingPayload(code, actionType = "") {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get("utm_source") || "direct";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
      ? "Mobile"
      : "Desktop";

  let timeSpent = 0;
  if (
    typeof window.quizStartTime !== "undefined" &&
    window.quizStartTime > 0 &&
    actionType === ""
  ) {
    timeSpent = Math.round((Date.now() - window.quizStartTime) / 1000);
  }

  return {
    token: typeof GAS_TOKEN !== "undefined" ? GAS_TOKEN : "",
    resultCode: code,
    action: actionType,
    clientId: getClientId(),
    source: utmSource,
    referrer: document.referrer || "none",
    device: isMobile,
    country: window.userLocationData.country,
    city: window.userLocationData.city,
    timeSpent: timeSpent,
  };
}

// ── 行為追蹤 (背景靜默發送) ──
function trackUserAction(code, actionType) {
  if (!GAS_URL || GAS_URL.includes("在此貼上")) return;
  const payload = getTrackingPayload(code, actionType);
  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((r) => r.json())
    .then((data) => {
      if (!data.ok)
        console.error("[trackUserAction] GAS rejected:", data.error, {
          code,
          actionType,
          payload,
        });
    })
    .catch((err) =>
      console.error("[trackUserAction] fetch failed:", err, {
        code,
        actionType,
      }),
    );
}

// ── 測驗結果統計 ──
async function sendStats(code) {
  const line = document.getElementById("pop-line");
  const chart = document.getElementById("pop-chart");

  if (!GAS_URL || GAS_URL.includes("在此貼上")) {
    line.textContent = "✦ 尚未串接資料庫，僅顯示本地結果。";
    return;
  }

  // IP 地理位置由背景非同步填入 userLocationData，不再阻塞主流程
  // （_locationReady 仍在背景跑，已有值就會自動帶入 getTrackingPayload）

  try {
    const r = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(getTrackingPayload(code, "")),
    });
    const data = await r.json();
    if (!data || !data.ok) throw new Error(data?.error ?? "unknown");
    renderStats(data, code);
  } catch (_) {
    line.textContent = "✦ 數據讀取失敗，但黑童話大門已記住你的選擇。";
    chart.innerHTML = "";
  }
}

// ── XSS 防護：對來自外部的字串做跳脫 ──
function _esc(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

/* ════════════════════════════════
   甜甜圈圖表
════════════════════════════════ */

// 11 個世界的配色（搭配黑暗童話色調）
const WORLD_COLORS = {
  BRO: "#b85c52",
  SHA: "#4d70b0",
  PIP: "#7a55a8",
  KING: "#b89a3a",
  BEAST: "#3d7a58",
  THORN: "#5e7a3d",
  RACE: "#b57234",
  CROW: "#5e5e6e",
  CANDY: "#b05878",
  CIND: "#7e7e8e",
  ESC: "#8e7e60",
};
const CHART_OTHER_COLOR = "#3a3a44";
const CHART_THRESHOLD = 4; // 低於此 % 的世界合併為「其他」

function _f2(n) {
  return n.toFixed(2);
}

function buildDonutSVG(slices, myCode, displayTotal) {
  const CX = 100,
    CY = 100,
    IR = 52,
    OR = 78;
  const MID_R = (IR + OR) / 2; // 65 — stroke 圓心半徑
  const SW = OR - IR; // 26 — stroke 寬度
  const GAP = 0.025; // 扇形間隙（弧度）

  const total = slices.reduce((s, sl) => s + sl.count, 0);
  if (!slices.length || total === 0) return "";
  // 中央顯示數字優先用 data.total（與下方文案同源），避免兩者因歷史資料誤差而不一致
  const shownTotal = displayTotal != null ? displayTotal : total;

  const centerText =
    `<circle cx="${CX}" cy="${CY}" r="${IR}" fill="#0a0a0f"/>` +
    `<text x="${CX}" y="${CY - 8}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="10" font-family="serif" letter-spacing="1">定居分布</text>` +
    `<text x="${CX}" y="${CY + 8}" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-size="15" font-weight="700" font-family="serif">${shownTotal}</text>` +
    `<text x="${CX}" y="${CY + 22}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9" font-family="serif" letter-spacing="1">位旅人</text>`;

  // 單一扇形 → 完整甜甜圈
  if (slices.length === 1) {
    const sl = slices[0];
    const isMe = sl.code === myCode;
    const r = isMe ? MID_R + 3 : MID_R;
    const sw = isMe ? SW + 4 : SW;
    const circ = _f2(2 * Math.PI * r);
    return (
      `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">` +
      `<circle class="donut-ring" cx="${CX}" cy="${CY}" r="${r}"` +
      ` fill="none" stroke="${sl.color}" stroke-width="${sw}" opacity="${isMe ? 1 : 0.85}"` +
      ` stroke-dasharray="${circ} ${circ}" stroke-dashoffset="${circ}"` +
      ` data-dashoffset-target="0"` +
      ` style="transform-origin:${CX}px ${CY}px;transform:rotate(-90deg)"/>` +
      centerText +
      `</svg>`
    );
  }

  // 多扇形：每一片用 stroke-dasharray 畫弧（可動畫）
  let circles = "";
  let angle = -Math.PI / 2; // 從 12 點鐘方向開始

  for (const sl of slices) {
    const sweep = (sl.count / total) * 2 * Math.PI - GAP;
    if (sweep <= 0) {
      angle += GAP;
      continue;
    }

    const isMe = sl.code === myCode;
    const r = isMe ? MID_R + 3 : MID_R;
    const sw = isMe ? SW + 4 : SW;
    const circ = 2 * Math.PI * r;
    const arcLen = (sweep / (2 * Math.PI)) * circ;
    const rotDeg = _f2(angle * (180 / Math.PI));

    circles +=
      `<circle class="donut-ring" cx="${CX}" cy="${CY}" r="${_f2(r)}"` +
      ` fill="none" stroke="${sl.color}" stroke-width="${sw}" opacity="${isMe ? "1" : "0.80"}"` +
      ` stroke-dasharray="${_f2(arcLen)} ${_f2(circ)}" stroke-dashoffset="${_f2(arcLen)}"` +
      ` data-dashoffset-target="0"` +
      ` style="transform-origin:${CX}px ${CY}px;transform:rotate(${rotDeg}deg)"/>`;

    angle += sweep + GAP;
  }

  return (
    `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">` +
    circles +
    centerText +
    `</svg>`
  );
}

function buildDonutLegend(slices, myCode) {
  return slices
    .map((sl) => {
      const isMe = sl.code === myCode;
      const txtStyle = isMe
        ? "color:rgba(255,255,255,0.95);font-weight:700;"
        : "color:rgba(200,178,140,0.70);";
      const glowStyle = isMe ? `box-shadow:0 0 5px ${sl.color};` : "";
      return (
        `<div class="donut-legend-item" style="${txtStyle}">` +
        `<span class="donut-legend-dot" style="background:${sl.color};${glowStyle}"></span>` +
        `<span class="donut-legend-name">${isMe ? "✦ " : ""}${_esc(sl.label)}</span>` +
        `<span class="donut-legend-pct">${sl.pct.toFixed(1)}%</span>` +
        `</div>`
      );
    })
    .join("");
}

function renderStats(data, code) {
  const line = document.getElementById("pop-line");
  const chart = document.getElementById("pop-chart");

  const total = Number(data.total) || 0;
  const counts = data.countsByKeyword || data.counts || {};

  // 以 code（BRO/SHA/…）對應資料庫關鍵字；顯示時用 label
  const myLabel = (resultsData[code] && resultsData[code].label) || code;
  const myCount = Number(counts[code] || 0);
  const myPct = total > 0 ? Number(((myCount / total) * 100).toFixed(1)) : 0;

  // 只取 11 個已知世界中有數據的，依人數排序
  const allItems = CATEGORY_KEYS.map((k) => {
    const cnt = Number(counts[k] || 0);
    return {
      code: k,
      label: (resultsData[k] && resultsData[k].label) || k,
      count: cnt,
      pct: total > 0 ? (cnt / total) * 100 : 0,
      color: WORLD_COLORS[k] || CHART_OTHER_COLOR,
    };
  })
    .filter((i) => i.count > 0)
    .sort((a, b) => b.count - a.count);

  const myRankIndex = allItems.findIndex((i) => i.code === code);
  const myRankText = myRankIndex >= 0 ? String(myRankIndex + 1) : "尚未進榜";
  const totalTypes = CATEGORY_KEYS.length;

  const rarestItem = allItems.length
    ? [...allItems].sort((a, b) => a.count - b.count)[0]
    : { label: "未知", pct: 0 };

  line.innerHTML =
    "✦ 目前共有 <strong>" +
    total +
    "</strong> 位旅人踏入黑童話大門。<br/>" +
    "✦ 你的定居地（" +
    _esc(myLabel) +
    "）約佔 <strong>" +
    myPct +
    "%</strong>，" +
    "在 " +
    totalTypes +
    " 個世界中排名第 <strong>" +
    myRankText +
    "</strong>。<br/>" +
    "✦ 最稀有的定居地：「" +
    _esc(rarestItem.label) +
    "」（僅 " +
    rarestItem.pct.toFixed(1) +
    "%）";

  // 低於門檻的世界合併為「其他」；但玩家本次的世界永遠單獨顯示
  const mainSlices = [];
  let otherCount = 0;

  allItems.forEach((item) => {
    if (item.pct >= CHART_THRESHOLD || item.code === code) {
      mainSlices.push({ ...item });
    } else {
      otherCount += item.count;
    }
  });

  if (otherCount > 0) {
    mainSlices.push({
      code: "其他",
      label: "其他",
      count: otherCount,
      pct: total > 0 ? (otherCount / total) * 100 : 0,
      color: CHART_OTHER_COLOR,
    });
  }

  // 排序：玩家世界優先，其他殿後，中間按人數遞減
  mainSlices.sort((a, b) => {
    if (a.code === code) return -1;
    if (b.code === code) return 1;
    if (a.code === "其他") return 1;
    if (b.code === "其他") return -1;
    return b.count - a.count;
  });

  chart.innerHTML =
    '<div class="donut-wrap">' +
    buildDonutSVG(mainSlices, code, total) +
    '<div class="donut-legend">' +
    buildDonutLegend(mainSlices, code) +
    "</div>" +
    "</div>";

  // 甜甜圈弧形展開動畫（stroke-dashoffset: arcLen → 0）
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      chart.querySelectorAll(".donut-ring").forEach((ring, i) => {
        const target = ring.dataset.dashoffsetTarget;
        if (target == null) return;
        ring.style.transition = `stroke-dashoffset 0.88s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.02}s`;
        ring.style.strokeDashoffset = target;
      });
    }),
  );
}
