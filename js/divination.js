/* ══════════════════════════════════════
   divination.js — 本次創作占卜台
   ══════════════════════════════════════ */
"use strict";

const DIVINATION_READINGS = [
  { nameKey: "div-green-name",    luckKey: "div-green-luck",    emoji: "🐈‍⬛", textKey: "div-green-text"    },
  { nameKey: "div-red-name",      luckKey: "div-red-luck",      emoji: "🔥",  textKey: "div-red-text"      },
  { nameKey: "div-blue-name",     luckKey: "div-blue-luck",     emoji: "📘",  textKey: "div-blue-text"     },
  { nameKey: "div-ink-name",      luckKey: "div-ink-luck",      emoji: "🖋️", textKey: "div-ink-text"      },
  { nameKey: "div-silver-name",   luckKey: "div-silver-luck",   emoji: "🐶",  textKey: "div-silver-text"   },
  { nameKey: "div-sc-name",       luckKey: "div-sc-luck",       emoji: "📚",  textKey: "div-sc-text"       },
  { nameKey: "div-core-name",     luckKey: "div-core-luck",     emoji: "✨",  textKey: "div-core-text"     },
  { nameKey: "div-filth-name",    luckKey: "div-filth-luck",    emoji: "🫠",  textKey: "div-filth-text"    },
  { nameKey: "div-room-name",     luckKey: "div-room-luck",     emoji: "🕯️", textKey: "div-room-text"     },
  { nameKey: "div-race-name",     luckKey: "div-race-luck",     emoji: "🎯",  textKey: "div-race-text"     },
  { nameKey: "div-overread-name", luckKey: "div-overread-luck", emoji: "😵",  textKey: "div-overread-text" },
  { nameKey: "div-pit-name",      luckKey: "div-pit-luck",      emoji: "💭",  textKey: "div-pit-text"      },
  { nameKey: "div-dead-name",     luckKey: "div-dead-luck",     emoji: "⏰",  textKey: "div-dead-text"     },
  { nameKey: "div-fill-name",     luckKey: "div-fill-luck",     emoji: "✂️", textKey: "div-fill-text"     },
  { nameKey: "div-slack-name",    luckKey: "div-slack-luck",    emoji: "🛋️", textKey: "div-slack-text"    },
  { nameKey: "div-done-name",     luckKey: "div-done-luck",     emoji: "🏆",  textKey: "div-done-text"     },
  { nameKey: "div-lore-name",     luckKey: "div-lore-luck",     emoji: "📎",  textKey: "div-lore-text"     },
  { nameKey: "div-bless-name",    luckKey: "div-bless-luck",    emoji: "🎉",  textKey: "div-bless-text"    },
];

let _divItem     = null;
let _resultShown = false;
let _meditTimer  = null;

function renderDivination() {
  if (!_divItem) return;
  const lang = document.documentElement.lang?.startsWith("en") ? "en" : "zh";
  const dict = window.i18nData?.[lang] || window.i18nData?.zh || {};

  const elSymbol = document.getElementById("divSymbol");
  const elName   = document.getElementById("divName");
  const elLuck   = document.getElementById("divLuck");
  const elText   = document.getElementById("divText");
  if (!elSymbol) return;

  elSymbol.textContent = _divItem.emoji;
  elName.textContent   = dict[_divItem.nameKey] || _divItem.nameKey;
  elText.textContent   = dict[_divItem.textKey] || _divItem.textKey;
  elLuck.textContent   = dict[_divItem.luckKey] || _divItem.luckKey;
  elLuck.className     = `divination-luck luck-${dict[_divItem.luckKey] || _divItem.luckKey}`;
}

function sendDivinationToGAS(resultName, luck) {
  const API_URL = window.TEALIZE_API_URL;
  if (!API_URL) return;
  try {
    let clientId = "";
    const statsId = localStorage.getItem("abyss_client_id");
    if (statsId && statsId.startsWith("uid_")) {
      clientId = statsId;
    } else {
      clientId = localStorage.getItem("tw_tealize_id") || "";
    }
    fetch(
      `${API_URL}?action=divination` +
      `&clientId=${encodeURIComponent(clientId)}` +
      `&result=${encodeURIComponent(resultName)}` +
      `&luck=${encodeURIComponent(luck)}`,
      { keepalive: true }
    ).catch(() => {});
  } catch (_) {}
}

function _revealResult() {
  _resultShown = true;
  const medit = document.getElementById("divMedit");
  const body  = document.getElementById("divBody");
  if (medit) {
    medit.classList.add("medit-fadeout");
    setTimeout(() => {
      medit.style.display = "none";
      medit.classList.remove("medit-fadeout");
      if (body) body.style.display = "";
    }, 400);
  } else {
    if (body) body.style.display = "";
  }

  renderDivination();

  const lang = document.documentElement.lang?.startsWith("en") ? "en" : "zh";
  const dict = window.i18nData?.[lang] || window.i18nData?.zh || {};
  sendDivinationToGAS(dict[_divItem.nameKey] || _divItem.nameKey, dict[_divItem.luckKey] || _divItem.luckKey);
}

function startMeditation() {
  if (_meditTimer) clearTimeout(_meditTimer);
  _divItem     = DIVINATION_READINGS[Math.floor(Math.random() * DIVINATION_READINGS.length)];
  _resultShown = false;

  const medit = document.getElementById("divMedit");
  if (medit) {
    medit.style.display = "";
    // 重啟 ring 動畫
    medit.querySelectorAll(".medit-ring, .medit-core").forEach(el => {
      el.style.animation = "none";
      el.offsetHeight; // reflow
      el.style.animation = "";
    });
  }

  _meditTimer = setTimeout(_revealResult, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn   = document.getElementById("divBtn");
  const retry = document.getElementById("divRetry");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const intro = document.getElementById("divIntro");
    if (intro) intro.style.display = "none";
    startMeditation();
  });

  if (retry) {
    retry.addEventListener("click", () => {
      const body = document.getElementById("divBody");
      if (body) body.style.display = "none";
      startMeditation();
    });
  }
});

// 語言切換時，若結果已顯示則重新渲染
document.addEventListener("langChanged", () => {
  if (_resultShown) renderDivination();
});
