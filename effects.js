// === effects.js — micro-interactions, particles, command palette, easter eggs ===
// Loaded after script.js; relies on its globals:
// translations, currentLang, toggleLang, sendMessage, _t, isCleanMode

(() => {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
  const MOBILE = window.matchMedia('(max-width: 768px)').matches;

  // ---------------------------------------------------------------
  // A1. Typewriter — hero role words
  // ---------------------------------------------------------------
  const ROLES = {
    en: ['AI Product Builder', 'AI Strategy Researcher', 'Economics-Trained Thinker', 'Vibe Coder'],
    zh: ['AI 产品构建者', 'AI 战略研究者', '经济学思维 × 技术直觉', 'Vibe Coder'],
  };
  const typedEl = document.getElementById('typedText');
  let typeToken = 0;

  function startTypewriter(lang) {
    if (!typedEl) return;
    const words = ROLES[lang] || ROLES.en;
    const token = ++typeToken;
    if (REDUCED) { typedEl.textContent = words[0]; return; }

    let wordIdx = 0;
    const typeWord = () => {
      if (token !== typeToken) return;
      const word = words[wordIdx % words.length];
      let i = 0;
      const typeChar = () => {
        if (token !== typeToken) return;
        typedEl.textContent = word.slice(0, ++i);
        if (i < word.length) { setTimeout(typeChar, 75); return; }
        setTimeout(deleteChar, 2000);
      };
      const deleteChar = () => {
        if (token !== typeToken) return;
        typedEl.textContent = word.slice(0, --i);
        if (i > 0) { setTimeout(deleteChar, 35); return; }
        wordIdx++;
        setTimeout(typeWord, 350);
      };
      typeChar();
    };
    typeWord();
  }
  startTypewriter(typeof currentLang !== 'undefined' ? currentLang : 'en');

  // ---------------------------------------------------------------
  // A2. Count-up numbers
  // ---------------------------------------------------------------
  const countupObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countupObserver.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.5 });

  function animateCount(el) {
    const target = el._countTarget;
    const duration = 900;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCountups() {
    document.querySelectorAll('[data-countup]').forEach((el) => {
      const target = parseInt(el.textContent.replace(/[^\d]/g, ''), 10);
      if (isNaN(target)) return;
      if (REDUCED) { el.textContent = target; return; }
      el._countTarget = target;
      el.textContent = '0';
      countupObserver.observe(el);
    });
  }
  initCountups();

  // ---------------------------------------------------------------
  // A3. Card glow — cursor-following radial gradient
  // ---------------------------------------------------------------
  if (FINE_POINTER) {
    document.querySelectorAll('.project-card, .about-card').forEach((c) => c.classList.add('glow-card'));
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest && e.target.closest('.glow-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  // ---------------------------------------------------------------
  // A4. Timeline growth
  // ---------------------------------------------------------------
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    timeline.classList.add('tl-animated');
    const items = Array.from(timeline.querySelectorAll('.timeline-item'));
    if (REDUCED) {
      timeline.style.setProperty('--tl-progress', '100%');
      items.forEach((it) => it.classList.add('lit'));
    } else {
      const pen = document.createElement('div');
      pen.className = 'tl-pen';
      timeline.appendChild(pen);
      let ticking = false;
      const update = () => {
        ticking = false;
        const rect = timeline.getBoundingClientRect();
        const trigger = window.innerHeight * 0.65;
        const progress = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));
        timeline.style.setProperty('--tl-progress', (progress * 100).toFixed(1) + '%');
        pen.classList.toggle('visible', progress > 0.02 && progress < 0.98);
        items.forEach((it) => {
          it.classList.toggle('lit', it.getBoundingClientRect().top < trigger);
        });
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  }

  // ---------------------------------------------------------------
  // A5. Stagger reveal + magnetic hero buttons
  // ---------------------------------------------------------------
  if (!REDUCED) {
    ['.about-grid', '.projects-grid', '.timeline', '.contact-links'].forEach((sel) => {
      document.querySelectorAll(sel).forEach((group) => {
        Array.from(group.children).forEach((el, i) => {
          if (!el.classList.contains('fade-in')) return;
          el.style.transitionDelay = Math.min(i * 80, 480) + 'ms';
          el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
        });
      });
    });
  }

  if (FINE_POINTER && !REDUCED) {
    document.querySelectorAll('.hero-btn').forEach((btn) => {
      btn.classList.add('magnetic');
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.15}px, ${dy * 0.25}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  // ---------------------------------------------------------------
  // D1. Avatar 3D tilt
  // ---------------------------------------------------------------
  const avatar = document.querySelector('.hero-avatar');
  if (avatar && FINE_POINTER && !REDUCED) {
    const wrap = avatar.parentElement;
    wrap.classList.add('tilt-wrap');
    wrap.addEventListener('pointermove', (e) => {
      const r = avatar.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      avatar.style.transform = `rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 14).toFixed(2)}deg)`;
    });
    wrap.addEventListener('pointerleave', () => { avatar.style.transform = ''; });
  }

  // ---------------------------------------------------------------
  // B. Particle neural network (hero background)
  // ---------------------------------------------------------------
  const canvas = document.getElementById('heroParticles');
  if (canvas && !REDUCED && !MOBILE) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 130;
    let nodes = [];
    let raf = null;
    let accent = { r: 99, g: 102, b: 241 };
    const mouse = { x: -9999, y: -9999 };

    function readAccent() {
      const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const m = /^#?([0-9a-f]{6})$/i.exec(hex);
      if (m) {
        accent = {
          r: parseInt(m[1].slice(0, 2), 16),
          g: parseInt(m[1].slice(2, 4), 16),
          b: parseInt(m[1].slice(4, 6), 16),
        };
      }
    }
    readAccent();
    new MutationObserver(readAccent).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function resize() {
      const w = hero.offsetWidth, h = hero.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: 1.2 + Math.random() * 1.6,
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    if (FINE_POINTER) {
      hero.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
    }

    function tick() {
      const w = canvas.width / DPR, h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);
      const { r, g, b } = accent;

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        // gentle mouse repulsion
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const md = Math.hypot(dx, dy);
        if (md < 100 && md > 0.01) {
          n.x += (dx / md) * 0.8;
          n.y += (dy / md) * 0.8;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], c = nodes[j];
          const d = Math.hypot(a.x - c.x, a.y - c.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${((1 - d / LINK_DIST) * 0.3).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    // Pause when hero is off-screen
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && raf === null) raf = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
      });
    }).observe(hero);
  }

  // ---------------------------------------------------------------
  // C. Command palette
  // ---------------------------------------------------------------
  const overlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const clean = typeof isCleanMode !== 'undefined' && isCleanMode;

  const go = (hash) => { closePalette(); document.querySelector(hash)?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); };
  const openChatWidget = () => {
    closePalette();
    const panel = document.getElementById('chatPanel');
    if (panel && !panel.classList.contains('active')) document.getElementById('chatToggle')?.click();
  };
  const askAI = (q) => {
    openChatWidget();
    const input = document.getElementById('chatInput');
    if (input && typeof sendMessage === 'function') {
      input.value = q;
      sendMessage();
    }
  };

  const COMMANDS = [
    { icon: 'fas fa-user', en: 'Go to About', zh: '跳转：关于我', kw: 'about 关于', run: () => go('#about') },
    { icon: 'fas fa-briefcase', en: 'Go to Experience', zh: '跳转：经历', kw: 'experience work 经历 实习', run: () => go('#experience') },
    { icon: 'fas fa-diagram-project', en: 'Go to Projects', zh: '跳转：项目', kw: 'projects 项目', run: () => go('#projects') },
    { icon: 'fas fa-envelope', en: 'Go to Contact', zh: '跳转：联系方式', kw: 'contact email 联系', run: () => go('#contact') },
    { icon: 'fas fa-eye', en: 'Open AI Insights page', zh: '打开 AI 洞察页', kw: 'insights 洞察 报告', hidden: clean, run: () => { location.href = 'insights.html'; } },
    { icon: 'fas fa-circle-half-stroke', en: 'Toggle dark / light theme', zh: '切换深色 / 浅色主题', kw: 'theme dark light 主题 深色', run: () => { closePalette(); document.getElementById('themeToggle')?.click(); } },
    { icon: 'fas fa-language', en: 'Switch language / 切换语言', zh: 'Switch language / 切换语言', kw: 'language english chinese 语言 中文', run: () => { closePalette(); if (typeof toggleLang === 'function') toggleLang(); } },
    { icon: 'fas fa-comments', en: 'Chat with my AI assistant', zh: '和我的 AI 助手聊天', kw: 'chat ai assistant 聊天 助手 机器人', run: () => openChatWidget() },
    { icon: 'fab fa-github', en: 'Open GitHub profile', zh: '打开 GitHub 主页', kw: 'github code 代码', run: () => { closePalette(); window.open('https://github.com/Amb2rZhou', '_blank'); } },
  ];

  let paletteOpen = false;
  let selectedIdx = 0;
  let visibleItems = [];

  function renderList(query) {
    const q = query.trim().toLowerCase();
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    visibleItems = COMMANDS.filter((c) => !c.hidden &&
      (!q || c.en.toLowerCase().includes(q) || c.zh.toLowerCase().includes(q) || c.kw.includes(q)));
    if (query.trim()) {
      const raw = query.trim();
      visibleItems = visibleItems.concat({
        icon: 'fas fa-wand-magic-sparkles',
        en: `Ask AI: "${raw}"`,
        zh: `问 AI：「${raw}」`,
        run: () => askAI(raw),
        isAsk: true,
      });
    }
    selectedIdx = Math.min(selectedIdx, Math.max(0, visibleItems.length - 1));
    cmdkList.innerHTML = '';
    visibleItems.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item' + (i === selectedIdx ? ' selected' : '') + (c.isAsk ? ' cmdk-ask' : '');
      li.innerHTML = `<i class="${c.icon}"></i><span></span>`;
      li.querySelector('span').textContent = lang === 'zh' ? c.zh : c.en;
      li.addEventListener('pointerenter', () => { selectedIdx = i; highlight(); });
      li.addEventListener('click', () => c.run());
      cmdkList.appendChild(li);
    });
  }

  function highlight() {
    cmdkList.querySelectorAll('.cmdk-item').forEach((li, i) => {
      li.classList.toggle('selected', i === selectedIdx);
    });
    cmdkList.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
  }

  function openPalette() {
    if (!overlay || paletteOpen) return;
    paletteOpen = true;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('open'));
    cmdkInput.value = '';
    selectedIdx = 0;
    renderList('');
    cmdkInput.focus();
    if (typeof _t === 'function') _t('cmdk_open');
  }

  function closePalette() {
    if (!overlay || !paletteOpen) return;
    paletteOpen = false;
    overlay.classList.remove('open');
    overlay.hidden = true;
  }

  if (overlay) {
    document.addEventListener('keydown', (e) => {
      const el = document.activeElement;
      const typing = el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        paletteOpen ? closePalette() : openPalette();
      } else if (e.key === '/' && !typing && !paletteOpen) {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape' && paletteOpen) {
        closePalette();
      }
    });

    cmdkInput.addEventListener('input', () => { selectedIdx = 0; renderList(cmdkInput.value); });
    cmdkInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, visibleItems.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); highlight(); }
      else if (e.key === 'Enter' && !e.isComposing) { visibleItems[selectedIdx]?.run(); }
    });

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });
    document.getElementById('cmdkBadge')?.addEventListener('click', openPalette);
    document.getElementById('cmdkBadgeMobile')?.addEventListener('click', openPalette);
  }

  // ---------------------------------------------------------------
  // A6. Scroll text reveal — "What I Do" card lights up word by word
  // ---------------------------------------------------------------
  const revealBox = document.querySelector('[data-i18n="about.whatido.content"]');
  const CJK_RANGE = '\\u3000-\\u30ff\\u3400-\\u9fff\\uf900-\\ufaff\\uff00-\\uffef';
  const TOKEN_RE = new RegExp('\\s+|[' + CJK_RANGE + ']|[^\\s' + CJK_RANGE + ']+', 'g');
  let srSpans = [];

  function updateReveal() {
    if (!srSpans.length) return;
    const rect = revealBox.getBoundingClientRect();
    const range = Math.max(1, Math.min(rect.height, window.innerHeight * 0.6));
    const p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - rect.top) / range));
    const n = Math.round(p * srSpans.length);
    srSpans.forEach((s, i) => s.classList.toggle('on', i < n));
  }

  function initScrollReveal() {
    if (!revealBox || REDUCED) return;
    const walker = document.createTreeWalker(revealBox, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const tokens = node.textContent.match(TOKEN_RE);
      if (!tokens) return;
      const frag = document.createDocumentFragment();
      tokens.forEach((tok) => {
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        const s = document.createElement('span');
        s.className = 'sr-w';
        s.textContent = tok;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    srSpans = Array.from(revealBox.querySelectorAll('.sr-w'));
    updateReveal();
  }

  {
    let srTick = false;
    window.addEventListener('scroll', () => {
      if (!srTick) { srTick = true; requestAnimationFrame(() => { srTick = false; updateReveal(); }); }
    }, { passive: true });
  }

  // ---------------------------------------------------------------
  // A7. Text scramble — hero name decodes on load, titles on lang switch
  // ---------------------------------------------------------------
  const SCR_LATIN = '!<>-_\\/[]{}=+*^?#01';
  const SCR_CJK = '构建智能未来产品思维数据洞察';
  const CJK_TEST = new RegExp('[' + CJK_RANGE + ']');
  const escapeHTML = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function scrambleEl(el) {
    if (!el || REDUCED) return;
    const target = el.textContent;
    const chars = Array.from(target);
    if (!chars.length) return;
    const token = (el._scrToken = (el._scrToken || 0) + 1);
    // left-to-right decode: earlier chars settle first
    const jobs = chars.map((ch, i) => ({ ch, end: 4 + i * 1.1 + Math.random() * 6 }));
    let frame = 0;
    const iv = setInterval(() => {
      if (el._scrToken !== token) { clearInterval(iv); return; }
      let out = '';
      let done = 0;
      for (const j of jobs) {
        if (/\s/.test(j.ch) || frame >= j.end) { out += escapeHTML(j.ch); done++; continue; }
        const pool = CJK_TEST.test(j.ch) ? SCR_CJK : SCR_LATIN;
        out += '<span class="scr-glyph">' + pool[Math.floor(Math.random() * pool.length)] + '</span>';
      }
      if (done === jobs.length) {
        clearInterval(iv);
        el.textContent = target;
      } else {
        el.innerHTML = out;
      }
      frame++;
    }, 30);
  }

  const scrambleTitles = () => {
    document.querySelectorAll('.hero-greeting, .section-title').forEach(scrambleEl);
  };

  // ---------------------------------------------------------------
  // A8. Spotlight easter egg (contact section)
  // ---------------------------------------------------------------
  const spot = document.getElementById('spotlight');
  if (spot) {
    const over = spot.querySelector('.spotlight-over');
    spot.addEventListener('pointermove', (e) => {
      const r = spot.getBoundingClientRect();
      over.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      over.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    }, { passive: true });
    spot.addEventListener('pointerleave', () => {
      over.style.setProperty('--sx', '50%');
      over.style.setProperty('--sy', '130%');
    });
  }

  // ---------------------------------------------------------------
  // Language switch hook (dispatched from script.js setLang)
  // Fires once on DOMContentLoaded (initial setLang), then on each toggle.
  // ---------------------------------------------------------------
  let langInited = false;
  document.addEventListener('langchanged', (e) => {
    startTypewriter(e.detail.lang);
    initCountups();
    if (paletteOpen) renderList(cmdkInput.value);
    initScrollReveal();
    if (!langInited) {
      langInited = true;
      scrambleEl(document.querySelector('.hero-name-en'));
      setTimeout(() => scrambleEl(document.querySelector('.hero-name-cn')), 250);
    } else {
      scrambleTitles();
    }
  });
})();
