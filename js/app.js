/* ══════════════════════════════════════
   Tealize Base v3 - Core Script
   i18n 翻譯字典已拆至 js/i18n.js
   ══════════════════════════════════════ */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let canvas,
    ctx,
    particles = [],
    animationId;

  // 從 i18n.js 讀取字典（i18n.js 必須在 app.js 之前載入）
  const i18nData = window.i18nData || {};

  // 2. 定義所有核心函式
  function setLang(lang) {
    html.lang = lang;
    lsSet("tealize.lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (i18nData[lang] && i18nData[lang][key] !== undefined) {
        el.innerHTML = i18nData[lang][key];
        if (el.dataset.text !== undefined) el.dataset.text = el.textContent;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const rules = el.dataset.i18nAttr.split(";");
      rules.forEach((rule) => {
        const [attr, key] = rule.split(":").map((s) => s.trim());
        if (!attr || !key) return;
        if (i18nData[lang] && i18nData[lang][key]) {
          el.setAttribute(attr, i18nData[lang][key]);
        }
      });
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (i18nData[lang] && i18nData[lang][key]) {
        document.title = i18nData[lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const key = el.dataset.i18nContent;
      if (i18nData[lang] && i18nData[lang][key]) {
        el.setAttribute("content", i18nData[lang][key]);
      }
    });

    const langBtnSpan =
      document.querySelector("#langBtn span") ||
      document.getElementById("langBtnLabel");
    if (langBtnSpan) {
      langBtnSpan.textContent =
        html.lang === "zh"
          ? i18nData[lang]["lang-btn-en"] || "EN"
          : i18nData[lang]["lang-btn-zh"] || "中文";
    }

    // 通知其他模組語言已切換
    document.dispatchEvent(new CustomEvent("langChanged"));
  }

  function toggleMode() {
    // ✅ 修正：讀取與寫入 html 的 data-mode
    const currentMode = html.getAttribute("data-mode");
    const newMode = currentMode === "visual" ? "code" : "visual";
    html.setAttribute("data-mode", newMode);
    lsSet("tealize.mode", newMode);

    if (newMode === "visual") {
      initCanvas();
      // 切回視覺模式時重跑 side nav（整合進來，避免重複綁定 modeBtn）
      setTimeout(() => initSideNav(), 100);
    } else {
      stopCanvas();
    }
    updateVisualMode(newMode === "visual");
  }

  function updateVisualMode(isVisual) {
    const modeBtnIcon = document.querySelector("#modeBtn i");
    if (modeBtnIcon)
      modeBtnIcon.className = isVisual
        ? "fa-solid fa-terminal"
        : "fa-solid fa-wand-magic-sparkles";

    const visualContainer = document.getElementById("visual-mode");
    const codeContainer = document.getElementById("code-mode");

    if (visualContainer) {
      if (isVisual) visualContainer.classList.remove("hidden");
      else visualContainer.classList.add("hidden");
    }

    if (codeContainer) {
      if (isVisual) {
        codeContainer.classList.add("hidden");
      } else {
        codeContainer.classList.remove("hidden");
        if (typeof playCodeModeAnimation === "function")
          playCodeModeAnimation();
      }
    }
    // 游標完全不碰，讓 initCustomCursor 獨立管理
  }

  function playCodeModeAnimation() {
    const codeTitle = document.getElementById("code-title");
    const codeBio = document.getElementById("code-bio");
    const codeIntro = document.getElementById("code-intro");
    const codeContent = document.querySelector(".code-content");

    if (!codeTitle) return;

    if (codeTitle.dataset.typed === "true") {
      if (codeBio) codeBio.style.opacity = "1";
      if (codeIntro) codeIntro.style.opacity = "1";
      if (codeContent) codeContent.style.opacity = "1";
      return;
    }

    codeTitle.dataset.typed = "true";
    codeTitle.textContent = "";
    const text = "TEALIZE.HUB()";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        codeTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      } else {
        if (codeBio) codeBio.style.opacity = "1";
        if (codeIntro) codeIntro.style.opacity = "1";
        if (codeContent) codeContent.style.opacity = "1";
      }
    }
    setTimeout(typeWriter, 300);
  }

  function toggleTheme() {
    // ✅ 修正：讀取與寫入 html 的 data-theme
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    lsSet("tealize.theme", newTheme);
    refreshAccentCache(); // ✅ 主題切換後刷新粒子顏色快取
    syncIcons();
  }

  function syncIcons() {
    const avatarImg =
      document.getElementById("avatar-img") ||
      document.getElementById("avatarImg");
    const themeBtnIcon = document.querySelector("#themeBtn i");
    const isDark = html.getAttribute("data-theme") === "dark";

    if (avatarImg)
      avatarImg.src = isDark ? "img/avatar_black.jpg" : "img/avatar_white.jpg";
    if (themeBtnIcon)
      themeBtnIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  // ── 動態計算資歷年數 ──
  (function updateCareerYears() {
    const now = new Date();
    const yr = now.getFullYear();
    const mo = now.getMonth() + 1; // 1-12

    function yearsFrom(startY, startM = 1) {
      const diff = yr - startY + (mo - startM) / 12;
      return Math.floor(diff);
    }

    const elWriting = document.getElementById("career-writing");
    const elMis = document.getElementById("career-mis");
    const elPenana = document.getElementById("career-penana");

    if (elWriting) elWriting.textContent = yearsFrom(2007);
    if (elMis) elMis.textContent = yearsFrom(2019, 7);
    if (elPenana) {
      const y = yearsFrom(2025, 6);
      elPenana.textContent = y < 1 ? "<1" : y;
      // 滿 1 年後單位顯示「年+」
      const unitEl = elPenana.nextElementSibling;
      if (unitEl && y >= 1) unitEl.textContent = " 年+";
    }
  })();

  // ── Header 漸層隨滾動加深 ──
  const controlPanel = document.querySelector(".control-panel");
  document.querySelectorAll(".view-mode").forEach((container) => {
    container.addEventListener(
      "scroll",
      () => {
        if (!controlPanel) return;
        const scrolled = container.scrollTop > 10;
        controlPanel.style.backdropFilter = scrolled
          ? "blur(8px)"
          : "blur(0px)";
        controlPanel.style.webkitBackdropFilter = scrolled
          ? "blur(8px)"
          : "blur(0px)";
      },
      { passive: true },
    );
  });

  // ── 平滑滾動與回頂端按鈕 ──
  const backToTopBtn = document.getElementById("backToTop");

  // 1. 目錄按鈕點擊：精準滾動到對應區塊
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);

      if (target) {
        // 找出當前真正產生滾動軸的容器 (視覺模式 或 程式模式)
        const scrollContainer = document.querySelector(
          ".view-mode:not(.hidden)",
        );
        if (scrollContainer) {
          // target.getBoundingClientRect().top 是目標相對視窗頂部的距離
          // 加上容器目前的 scrollTop，再扣掉 80px 的上方緩衝空間
          const targetPosition =
            scrollContainer.scrollTop + target.getBoundingClientRect().top - 80;
          scrollContainer.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    });
  });

  // 2. 監聽滾動：控制回頂端按鈕的浮現與隱藏
  document.querySelectorAll(".view-mode").forEach((container) => {
    container.addEventListener(
      "scroll",
      () => {
        if (!backToTopBtn) return;
        // 只要往下滾動超過 400px，就顯示按鈕
        if (container.scrollTop > 400) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      },
      { passive: true },
    );
  });

  // 3. 回頂端按鈕點擊：捲回最上方
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      const scrollContainer = document.querySelector(".view-mode:not(.hidden)");
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ── 咬了神一口：防雷彈窗邏輯 ──
  const spoilerBtn = document.getElementById("lagAfterwordBtn");
  const spoilerOverlay = document.getElementById("spoilerOverlay");
  if (spoilerBtn && spoilerOverlay) {
    const spoilerCancel = document.getElementById("spoilerCancel");
    const spoilerConfirm = document.getElementById("spoilerConfirm");

    const openModal = () => {
      spoilerOverlay.classList.add("active");
      spoilerOverlay.setAttribute("aria-hidden", "false");
      // 鎖住真正的滾動容器（而非 body，頁面由 .view-mode 負責滾動）
      document
        .querySelector(".view-mode:not(.hidden)")
        ?.style.setProperty("overflow", "hidden");
    };
    const closeModal = () => {
      spoilerOverlay.classList.remove("active");
      spoilerOverlay.setAttribute("aria-hidden", "true");
      document
        .querySelector(".view-mode:not(.hidden)")
        ?.style.removeProperty("overflow");
    };

    spoilerBtn.addEventListener("click", openModal);
    if (spoilerCancel) spoilerCancel.addEventListener("click", closeModal);
    if (spoilerConfirm)
      spoilerConfirm.addEventListener("click", () => {
        closeModal();
        window.open("lag-afterword.html", "_blank", "noopener,noreferrer");
      });
    spoilerOverlay.addEventListener("click", (e) => {
      if (e.target === spoilerOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && spoilerOverlay.classList.contains("active"))
        closeModal();
    });
  }

  // ── Canvas 背景粒子特效 ──
  function initCanvas() {
    canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    createParticles();
    animateCanvas();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = window.innerWidth > 768 ? 70 : 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.2 + 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2, // 隨機相位，製造粒子閃爍
      });
    }
  }

  // ── 顏色輔助：快取 accent color，只在主題切換時刷新，避免每幀 reflow ──
  let _cachedAccentRGB = null;
  function refreshAccentCache() {
    const probe = document.createElement("div");
    probe.style.cssText =
      "display:none;color:" +
      getComputedStyle(html).getPropertyValue("--accent-color").trim();
    body.appendChild(probe);
    _cachedAccentRGB = getComputedStyle(probe).color; // 瀏覽器回傳 "rgb(r, g, b)"
    body.removeChild(probe);
  }
  function getAccentRGBA(opacity) {
    if (!_cachedAccentRGB) refreshAccentCache();
    return _cachedAccentRGB
      .replace("rgb(", "rgba(")
      .replace(")", ", " + opacity + ")");
  }

  const MAX_LINK_DIST = 120; // 粒子間連線距離上限

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── 更新粒子位置 ──
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.018;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    // ── 繪製連線 ──
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_LINK_DIST) {
          const lineOpacity = (1 - dist / MAX_LINK_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = getAccentRGBA(lineOpacity);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // ── 繪製粒子（帶呼吸閃爍） ──
    particles.forEach((p) => {
      const breath = 1 + 0.3 * Math.sin(p.pulse);
      const r = p.r * breath;
      const op = p.opacity * (0.85 + 0.15 * Math.sin(p.pulse + Math.PI));
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = getAccentRGBA(op);
      ctx.fill();
    });

    animationId = requestAnimationFrame(animateCanvas);
  }

  function stopCanvas() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    // ⚠️ _outlineRafId 不在這裡取消，游標圓圈要跨模式持續運作
    if (canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener("resize", resizeCanvas);
    }
  }

  // ── 自訂游標 (強化版防干擾) ──
  let _outlineRafId = null;
  function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");
    if (!dot || !outline) return;

    let mouseX = window.innerWidth / 2,
      mouseY = window.innerHeight / 2;
    let outlineX = mouseX,
      outlineY = mouseY;
    let cursorEnabled = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!cursorEnabled) {
          body.dataset.cursor = "on";
          dot.style.display = "block";
          outline.style.display = "block";
          cursorEnabled = true;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      },
      { passive: true },
    );

    function animateOutline() {
      if (cursorEnabled) {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = outlineX + "px";
        outline.style.top = outlineY + "px";
      }
      _outlineRafId = requestAnimationFrame(animateOutline);
    }
    animateOutline();

    document
      .querySelectorAll(
        "a, button, .link-card, .neon-tag, .bubble-link, .control-btn",
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (cursorEnabled) body.classList.add("cursor-active");
        });
        el.addEventListener("mouseleave", () =>
          body.classList.remove("cursor-active"),
        );
      });
  }

  // 3. 讀取儲存的狀態並開始執行
  // ── localStorage 安全存取（防無痕模式 SecurityError）──
  function lsGet(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch {}
  }

  const savedMode =
    lsGet("tealize.mode") || html.getAttribute("data-mode") || "visual";
  const savedThemeStr =
    lsGet("tealize.theme") || html.getAttribute("data-theme") || "dark";
  html.setAttribute("data-mode", savedMode);
  html.setAttribute("data-theme", savedThemeStr);

  const savedLang =
    lsGet("tealize.lang") ||
    (navigator.language.startsWith("en") ? "en" : "zh");
  setLang(savedLang);

  syncIcons();
  refreshAccentCache();
  initCustomCursor();
  updateVisualMode(savedMode === "visual");
  if (savedMode === "visual") initCanvas();

  // ── 按鈕事件綁定 ──
  const btnTheme = document.getElementById("themeBtn");
  if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

  const btnMode = document.getElementById("modeBtn");
  if (btnMode) btnMode.addEventListener("click", toggleMode);

  const btnLang = document.getElementById("langBtn");
  if (btnLang)
    btnLang.addEventListener("click", () => {
      const currentLang = html.lang;
      const nextLang = currentLang.includes("zh") ? "en" : "zh";
      setLang(nextLang);
    });

  // ── 右側藤蔓導航：SVG 繪製 + 滾動 active 偵測 ──
  let _sideNavInitialized = false;
  function initSideNav() {
    const nav = document.getElementById("sideNav");
    const svg = document.getElementById("sideVineSvg");
    const bubbles = document.querySelectorAll(".side-bubble");
    const visualContainer = document.getElementById("visual-mode");
    if (!nav || !svg || !bubbles.length) return;

    // ── 繪製 SVG 藤蔓主幹 ──
    function drawVine() {
      const bubblesEl = document.getElementById("sideBubbles");
      if (!bubblesEl) return;
      const totalH = bubblesEl.offsetHeight;
      const W = 90;
      svg.setAttribute("viewBox", `0 0 ${W} ${totalH}`);
      svg.style.height = totalH + "px";

      const cx = W * 0.5;

      // 5 節點色彩（對應 sc / lag / soil / game / music）
      const nodes = [
        { t: 0.11, c: "#47d7ff", g: "rgba(71,215,255,0.42)", dur: "3.2s" },
        { t: 0.29, c: "#47d7ff", g: "rgba(71,215,255,0.42)", dur: "3.8s" },
        { t: 0.47, c: "#47d7ff", g: "rgba(71,215,255,0.42)", dur: "2.9s" },
        { t: 0.67, c: "#ff7a63", g: "rgba(255,122,99,0.38)", dur: "3.5s" },
        { t: 0.85, c: "#b774ff", g: "rgba(183,116,255,0.38)", dur: "4.0s" },
      ];

      const nodesSVG = nodes
        .map(({ t, c, g, dur }) => {
          const y = totalH * t;
          return `
          <circle cx="${cx}" cy="${y}" r="5.5" fill="none" stroke="${c}" stroke-width="0.7" opacity="0" filter="url(#geo-glow)">
            <animate attributeName="r"       values="5.5;8.5;5.5"    dur="${dur}" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.55;0.1;0.55"  dur="${dur}" repeatCount="indefinite"/>
          </circle>
          <circle cx="${cx}" cy="${y}" r="2.2" fill="${c}" opacity="0.9" filter="url(#geo-glow)"/>
          <line x1="${cx - 9}" y1="${y}" x2="${cx + 9}" y2="${y}" stroke="${c}" stroke-width="0.65" opacity="0.28"/>`;
        })
        .join("");

      svg.innerHTML = `<defs>
        <linearGradient id="geo-axis" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stop-color="#47d7ff" stop-opacity="0"/>
          <stop offset="10%"  stop-color="#47d7ff" stop-opacity="0.48"/>
          <stop offset="52%"  stop-color="#6bb6ff" stop-opacity="0.32"/>
          <stop offset="90%"  stop-color="#b774ff" stop-opacity="0.44"/>
          <stop offset="100%" stop-color="#b774ff" stop-opacity="0"/>
        </linearGradient>
        <filter id="geo-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- 主軸線 -->
      <line x1="${cx}" y1="${totalH * 0.02}" x2="${cx}" y2="${totalH * 0.98}"
            stroke="url(#geo-axis)" stroke-width="1"/>

      <!-- 星圖虛線疊層 -->
      <line x1="${cx}" y1="${totalH * 0.07}" x2="${cx}" y2="${totalH * 0.93}"
            stroke="rgba(190,225,255,0.055)" stroke-width="4" stroke-dasharray="1 22"/>

      <!-- 節點 -->
      ${nodesSVG}

      <!-- 分類分隔刻度（GAMES / MUSIC 區段起點） -->
      <line x1="${cx - 16}" y1="${totalH * 0.56}" x2="${cx + 16}" y2="${totalH * 0.56}"
            stroke="rgba(255,122,99,0.2)" stroke-width="0.8" stroke-dasharray="2 3"/>
      <line x1="${cx - 16}" y1="${totalH * 0.75}" x2="${cx + 16}" y2="${totalH * 0.75}"
            stroke="rgba(183,116,255,0.2)" stroke-width="0.8" stroke-dasharray="2 3"/>`;
    }

    drawVine();
    if (!_sideNavInitialized) {
      window.addEventListener("resize", drawVine, { passive: true });
    }

    // ── 手機版 toggle ──
    const toggleBtn = document.getElementById("sideNavToggle");
    const toggleIcon = document.getElementById("sideNavToggleIcon");
    const bubblesPanel = document.getElementById("sideBubbles");

    function isMobileNav() {
      return window.innerWidth <= 768;
    }

    function openNav() {
      bubblesPanel.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "收起導航");
      toggleIcon.className = "fa-solid fa-chevron-up";
    }
    function closeNav() {
      bubblesPanel.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "展開導航");
      toggleIcon.className = "fa-solid fa-chevron-down";
    }

    if (toggleBtn && !_sideNavInitialized) {
      toggleBtn.addEventListener("click", () => {
        if (bubblesPanel.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }

    // 點氣泡後自動收合（手機版）
    if (!_sideNavInitialized) {
      bubbles.forEach((bubble) => {
        bubble.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = bubble.dataset.section;
          const target = document.getElementById(targetId);
          if (!target) return;
          if (visualContainer) {
            const pos =
              visualContainer.scrollTop +
              target.getBoundingClientRect().top -
              90;
            visualContainer.scrollTo({ top: pos, behavior: "smooth" });
          }
          // 手機版：跳轉後自動收起
          if (isMobileNav()) closeNav();
        });
      });
    }

    // ── 滾動偵測：點亮當前區塊對應的氣泡 ──
    const sections = [
      "section-sc",
      "section-lag",
      "section-soil",
      "section-game",
      "section-music",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    function updateActive() {
      const scrollEl = visualContainer;
      if (!scrollEl) return;
      const scrollTop = scrollEl.scrollTop;
      const vh = scrollEl.clientHeight;
      let current = null;

      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        // 區塊進入視窗上半部就算 active
        if (rect.top < vh * 0.55 && rect.bottom > 0) current = sec.id;
      });

      bubbles.forEach((b) => {
        b.classList.toggle("is-active", b.dataset.section === current);
      });
    }

    if (!_sideNavInitialized && visualContainer) {
      visualContainer.addEventListener("scroll", updateActive, {
        passive: true,
      });
    }
    updateActive();
    _sideNavInitialized = true;
  }

  // 初始化（在 visual mode 時執行）
  if (savedMode === "visual") initSideNav();

  // mode 切換時也重跑
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then(() => console.log("SW registered"))
        .catch(() => {});
    });
  }

  // ── 記錄進站人數 (PageView) ──
  const API_URL =
    "https://script.google.com/macros/s/AKfycbxx9-JwDwcQ-XPm4I782i9z0JfYpvw0em4ugiCPI28NR9pKyniRyebA1pTHWSJ6fGJ0/exec";
  window.TEALIZE_API_URL = API_URL; // 提前暴露給 tracking.js，消除 script 順序依賴

  // 與 tracking.js 相同優先順序：心測 ID → 本站 ID → 新建 ID
  function getOrCreateClientId() {
    try {
      const statsId = localStorage.getItem("abyss_client_id");
      if (statsId && statsId.startsWith("uid_")) return statsId;
      const existing = localStorage.getItem("tw_tealize_id");
      if (existing) return existing;
      const newId =
        "tw_" +
        Math.random().toString(36).slice(2, 10) +
        Date.now().toString(36);
      localStorage.setItem("tw_tealize_id", newId);
      return newId;
    } catch {
      return "";
    }
  }

  const visitorNumberEl = document.getElementById("visitorNumber");

  if (visitorNumberEl) {
    const isNewView = !sessionStorage.getItem("tealize.viewed");
    const action = isNewView ? "view" : "get";
    const viewClientId = getOrCreateClientId();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(
      `${API_URL}?action=${encodeURIComponent(action)}&clientId=${encodeURIComponent(viewClientId)}`,
      { signal: controller.signal },
    )
      .then((res) => {
        clearTimeout(timeoutId);
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.views === "number") {
          visitorNumberEl.textContent = data.views.toLocaleString();
          if (isNewView) sessionStorage.setItem("tealize.viewed", "true");
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name !== "AbortError") console.log("無法獲取瀏覽人數", err);
        visitorNumberEl.textContent = "—";
      });
  }

  // ── 攻受投票長條圖 ──
  (function initVoteBar() {
    const barDeer = document.getElementById("bar-deer");
    const barLion = document.getElementById("bar-lion");
    const barSwitch = document.getElementById("bar-switch");
    const pctDeer = document.getElementById("pct-deer");
    const pctLion = document.getElementById("pct-lion");
    const pctSwitch = document.getElementById("pct-switch");
    if (!barDeer) return;

    function renderBars(deer, lion, sw) {
      const total = deer + lion + sw;
      if (total === 0) return;
      const pd = Math.round((deer / total) * 100);
      const pl = Math.round((lion / total) * 100);
      const ps = 100 - pd - pl;
      setTimeout(() => {
        barDeer.style.width = pd + "%";
        barLion.style.width = pl + "%";
        barSwitch.style.width = ps + "%";
        pctDeer.textContent = pd + "%";
        pctLion.textContent = pl + "%";
        pctSwitch.textContent = ps + "%";
      }, 400);
    }

    // 先讀快取立刻顯示
    try {
      const raw = localStorage.getItem("tealize.poll.cache");
      if (raw) {
        const { votes } = JSON.parse(raw);
        if (votes)
          renderBars(votes.deer || 0, votes.lion || 0, votes.switch || 0);
      }
    } catch {}

    // 背景拉最新，同時更新快取
    fetch(API_URL + "?action=get")
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;
        renderBars(d.deer || 0, d.lion || 0, d.switch || 0);
        // 寫回快取，下次進站可立即顯示最新數字
        try {
          localStorage.setItem(
            "tealize.poll.cache",
            JSON.stringify({ votes: d, ts: Date.now() }),
          );
        } catch {}
      })
      .catch(() => {});
  })();
});
