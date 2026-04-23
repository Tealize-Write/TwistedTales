/* ══════════════════════════════════════
   tracking.js — 訪客追蹤系統
   依賴：window.TEALIZE_API_URL（由 app.js 設定）
   ══════════════════════════════════════ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  (function initTracking() {
    const API_URL = window.TEALIZE_API_URL;
    if (!API_URL) return;
    const COUNTRY_CACHE_KEY = "tealize.country.cache.v1";
    const COUNTRY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

    // ── clientIdentity：依固定 key 順序查找，回傳完整識別資訊 ──
    function getClientIdentity() {
      try {
        // 1. stats.js 專案的 ID（優先）
        const statsId = localStorage.getItem("abyss_client_id");
        if (statsId && statsId.startsWith("uid_")) {
          return { clientId: statsId, source: "stats", playedStats: true };
        }
        // 2. 本站既有 ID
        const existing = localStorage.getItem("tw_tealize_id");
        if (existing) {
          return { clientId: existing, source: "tealize", playedStats: false };
        }
        // 3. 新建本站 ID
        const newId =
          "tw_" +
          Math.random().toString(36).slice(2, 10) +
          Date.now().toString(36);
        localStorage.setItem("tw_tealize_id", newId);
        return { clientId: newId, source: "tealize", playedStats: false };
      } catch {
        return { clientId: "unknown", source: "unknown", playedStats: false };
      }
    }

    // prefixLabel 保留做顯示分類，不再作為來源判定依據
    function prefixLabel(id) {
      if (id.startsWith("uid_")) return "心測";
      if (id.startsWith("ag_")) return "賣貨便";
      if (id.startsWith("tw_")) return "兌";
      return id.substring(0, 4);
    }

    const TZ_TO_COUNTRY = {
      "Asia/Taipei": "台灣",
      "Asia/Tokyo": "日本",
      "Asia/Seoul": "韓國",
      "Asia/Shanghai": "中國",
      "Asia/Hong_Kong": "香港",
      "Asia/Singapore": "新加坡",
      "Asia/Kuala_Lumpur": "馬來西亞",
      "Asia/Bangkok": "泰國",
      "Asia/Ho_Chi_Minh": "越南",
      "Asia/Jakarta": "印尼",
      "Asia/Manila": "菲律賓",
      "Asia/Kolkata": "印度",
      "Asia/Dubai": "阿聯酋",
      "Asia/Riyadh": "沙烏地阿拉伯",
      "Asia/Istanbul": "土耳其",
      "Europe/London": "英國",
      "Europe/Paris": "法國",
      "Europe/Berlin": "德國",
      "Europe/Moscow": "俄羅斯",
      "America/New_York": "美國(東)",
      "America/Chicago": "美國(中)",
      "America/Los_Angeles": "美國(西)",
      "America/Toronto": "加拿大",
      "America/Sao_Paulo": "巴西",
      "Australia/Sydney": "澳洲",
      "Pacific/Auckland": "紐西蘭",
    };

    function toTW8(ts) {
      return new Date(ts + 8 * 3600000)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
    }

    function readCountryCache() {
      try {
        const raw = localStorage.getItem(COUNTRY_CACHE_KEY);
        if (!raw) return "";
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.country || !parsed.ts) return "";
        if (Date.now() - parsed.ts > COUNTRY_CACHE_TTL_MS) return "";
        return parsed.country;
      } catch {
        return "";
      }
    }

    function writeCountryCache(country) {
      try {
        localStorage.setItem(
          COUNTRY_CACHE_KEY,
          JSON.stringify({ country, ts: Date.now() }),
        );
      } catch {}
    }

    function postVisit(payload) {
      try {
        if (navigator.sendBeacon) {
          const sent = navigator.sendBeacon(
            API_URL,
            new Blob([payload], { type: "text/plain" }),
          );
          if (sent) return;
        }
      } catch {}

      try {
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: payload,
          keepalive: true,
        });
      } catch {}
    }

    const tzName =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    const tzOffset = new Date().getTimezoneOffset();
    const {
      clientId,
      source: clientIdSource,
      playedStats,
    } = getClientIdentity();
    let enterTime = Date.now();
    let enterStr = toTW8(enterTime);

    // ── IP 地理位置（ipapi.co，2 秒超時）──
    const cachedCountry = readCountryCache();
    let countryResolved = cachedCountry || TZ_TO_COUNTRY[tzName] || tzName;
    if (!cachedCountry) {
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const res = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (!res || !res.ok) return;
          const data = await res.json();
          if (data && data.country_name) {
            countryResolved =
              data.country_name + (data.city ? ` · ${data.city}` : "");
            writeCountryCache(countryResolved);
          }
        } catch (_) {}
      })();
    }

    // ── 點擊追蹤 ──
    const clickLog = [];
    const TRACKED = [
      { sel: 'a[href*="framer.app"]', label: "咬了神一口官網" },
      { sel: 'a[href*="kadokado"][href*="1425"]', label: "字命覺醒VOL1" },
      { sel: 'a[href*="kadokado"][href*="42308"]', label: "字命覺醒VOL2" },
      { sel: 'a[href*="kadokado"][href*="65322"]', label: "字命覺醒Extra" },
      { sel: 'a[href*="kadokado"][href*="60627"]', label: "穿越者KadoKado" },
      { sel: 'a[href*="wixsite"]', label: "反轉的真實官網" },
      { sel: 'a[href*="gamer.com"]', label: "反轉的真實巴哈" },
      { sel: 'a[href*="story-command-academy"]', label: "字命覺醒測驗" },
      { sel: 'a[href*="DarkBLstory"]', label: "黑暗特質測驗" },
      { sel: "#lagAfterwordBtn", label: "閱讀後記btn" },
      { sel: "#spoilerConfirm", label: "後記確認進入" },
      { sel: "#langBtn", label: "切換語言" },
      { sel: "#themeBtn", label: "切換主題" },
      { sel: "#modeBtn", label: "切換終端機" },
      { sel: '[data-section="section-sc"]', label: "nav:字命覺醒" },
      { sel: '[data-section="section-lag"]', label: "nav:咬了神一口" },
      { sel: '[data-section="section-soil"]', label: "nav:穿越者" },
      { sel: '[data-section="section-game"]', label: "nav:反轉的真實" },
    ];
    TRACKED.forEach(({ sel, label }) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener(
          "click",
          () => {
            clickLog.push(label);
          },
          { passive: true },
        );
      });
    });

    // ── 離開時 POST ──
    function sendVisit(reason) {
      const exitTime = Date.now();
      const staySeconds = Math.round((exitTime - enterTime) / 1000);
      clickLog.push(`X:${reason}`);
      const urlParams = new URLSearchParams(window.location.search);
      const payload = JSON.stringify({
        action: "visit",
        clientId: clientId,
        prefixLabel: prefixLabel(clientId),
        clientIdSource: clientIdSource,
        playedStats: playedStats,
        tz: String(tzOffset),
        country: countryResolved,
        enterTime: enterStr,
        exitTime: toTW8(exitTime),
        stay: staySeconds,
        clicks: clickLog.join(","),
        source: urlParams.get("utm_source") || "direct",
        referrer: document.referrer || "none",
        device:
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          )
            ? "Mobile"
            : "Desktop",
      });
      postVisit(payload);
    }

    let sent = false;
    function onLeave(reason) {
      if (sent) return;
      sent = true;
      sendVisit(reason);
    }
    window.addEventListener("pagehide", () => onLeave("pagehide"));
    window.addEventListener("beforeunload", () => onLeave("close"));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        onLeave("hidden");
      } else if (document.visibilityState === "visible") {
        sent = false;
        clickLog.length = 0;
        enterTime = Date.now();
        enterStr = toTW8(enterTime);
      }
    });
  })();
});
