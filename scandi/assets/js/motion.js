/* ===== 모션 엔진 (index / about / facility / portfolio / contact) =====

   21st.dev 에서 고른 컴포넌트 8종의 움직임을 바닐라로 옮겨 온 곳이다.
   원본은 전부 React + framer-motion 이라 코드를 그대로 붙일 수 없어, 각
   컴포넌트에서 "무엇이 어떤 값으로 움직이는가"만 가져와 아래 8개 kind 로
   다시 짰다. 어느 원본에서 온 값인지는 각 bind 함수 위에 적어 뒀다.

   ── 구조 ──
   프레임을 굴리는 곳은 step() 하나뿐이다. 각 요소는 tick(dt) 를 가진 job 으로
   등록되고, tick 이 false 를 돌려주면(화면 밖이거나 다 멈췄으면) 루프에서
   빠진다. 살아 있는 job 이 없으면 rAF 자체를 걸지 않는다.

   ── 이 사이트에서 특히 조심한 것 ──

   1. 히어로(#videoHero)는 index.html 안의 자체 스크립트가 스크롤 진행도를
      크기에 직접 매핑한다. 여기서 스크롤을 가로채거나(스무스 스크롤 라이브러리)
      그 안의 요소에 transform 을 쓰면 그 매핑이 깨진다. 그래서
        - 페이지 스크롤은 건드리지 않는다. 부드러움은 값 쪽에서 lerp 로 만든다.
        - #videoHero 하위는 bind 단계에서 전부 제외한다.
   2. js/i18n.js 는 "텍스트 노드 전체"를 사전 키로 써서 한↔영을 치환한다.
      제목을 어절 span 으로 쪼개면 그 매칭이 깨져 EN 이 한국어로 남는다.
      그래서 사전에 있는 문장은 쪼개지 않고 통째로 마스크에 넣는다(bindText).
   3. 본문 상당수가 <x-dc> 안에서 비동기로 다시 그려진다. 한 번 훑고 끝내면
      안 되므로 assets/js/reveal.js 와 같은 MutationObserver 를 둔다. */
(function () {
  'use strict';

  /* ── 환경 판정 ──────────────────────────────────────────────── */

  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var mqFine = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

  var reduced = !!(mqReduce && mqReduce.matches);
  var fine = mqFine ? mqFine.matches : true;

  /* 무거운 3D(스크롤 틸트·호버 틸트)는 데스크톱에서만 켠다 */
  function wide() { return window.innerWidth > 900; }
  function heavyOk() { return !reduced && fine && wide(); }

  var PAGE = (function () {
    var f = location.pathname.split('/').pop() || 'index.html';
    return f.toLowerCase();
  })();

  /* ── 프레임 루프 ────────────────────────────────────────────── */

  var jobs = [];
  var rafId = 0;
  var lastT = 0;

  /* 스크롤 위치와 속도. 속도는 마퀴가 쓴다.
     원본(Scroll Velocity Text)은 useVelocity + useSpring{damping:50,stiffness:400}
     으로 다듬는데, 여기서는 같은 목적의 지수 평활로 대신한다. */
  var scrollY = window.pageYOffset || 0;
  var vel = 0;

  function pump() {
    if (rafId || reduced) return;
    lastT = 0;
    rafId = requestAnimationFrame(step);
  }

  function step(now) {
    rafId = 0;
    var dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 1 / 60;
    lastT = now;

    var y = window.pageYOffset || 0;
    var raw = dt > 0 ? (y - scrollY) / dt : 0;
    scrollY = y;
    vel += (raw - vel) * Math.min(1, dt * 11);

    var alive = false;
    for (var i = jobs.length - 1; i >= 0; i--) {
      /* x-dc 가 다시 그리면 이전 노드는 문서에서 떨어져 나간다. 그대로 두면
         죽은 요소의 job 이 계속 쌓여 루프가 영원히 멈추지 않는다
         (시공사례 필터를 누를 때마다 카드 전체가 새로 그려진다). */
      if (jobs[i].el && !jobs[i].el.isConnected) { jobs.splice(i, 1); continue; }
      /* 한 요소가 던져도 나머지 프레임은 계속 돌아야 한다 */
      try { if (jobs[i].tick(dt)) alive = true; }
      catch (e) { /* 무시 */ }
    }

    if (alive && !document.hidden) rafId = requestAnimationFrame(step);
  }

  /* 스크롤 속도 계수 — 원본과 같은 식: 부호 × min(5, |v|/1000 × 5) */
  function velocityFactor() {
    var sign = vel < 0 ? -1 : 1;
    return sign * Math.min(5, (Math.abs(vel) / 1000) * 5);
  }

  function addJob(j) { jobs.push(j); pump(); }

  /* ── 작은 도구들 ────────────────────────────────────────────── */

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

  /* 요소가 화면 아래에서 올라오는 동안의 0~1.
     top 이 뷰포트 높이의 from 배에 있을 때 0, to 배에 있을 때 1. */
  function enterProgress(el, from, to) {
    var vh = window.innerHeight || 1;
    var top = el.getBoundingClientRect().top;
    var span = (from - to) * vh;
    if (span <= 0) return 1;
    return clamp((from * vh - top) / span, 0, 1);
  }

  /* 요소가 뷰포트를 통과하는 동안의 0~1 (한가운데가 0.5) */
  function throughProgress(el) {
    var vh = window.innerHeight || 1;
    var r = el.getBoundingClientRect();
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  }

  /* 화면 안팎만 알려 주는 관찰자 — 각 job 이 자기 상태를 갱신한다 */
  var seenIO = null;
  function watch(el, onChange) {
    if (!('IntersectionObserver' in window)) { onChange(true); return; }
    if (!seenIO) {
      seenIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var cb = en.target.__mSeen;
          if (cb) cb(en.isIntersecting);
        });
        pump();
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
    }
    el.__mSeen = onChange;
    seenIO.observe(el);
  }

  /* ── 1. 스크롤 3D 틸트 ────────────────────────────────────────
     21st: Container Scroll Animation (@manuarora700 / aceternity)
     원본은 scrollYProgress 를 rotateX 20→0, scale 1.05→1, translateY 0→-100
     으로 매핑한다. 여기서는 아래에서 올라오는 카드에 맞게 뒤집어서
     rotateX rot→0, scale 0.94→1, translateY lift→0 으로 쓴다.
     원근은 부모를 건드리지 않으려고 transform 함수로 직접 준다. */
  function bindTilt3d(el, o) {
    if (!heavyOk()) return;
    var rot = o.rot || 15;
    var lift = o.lift || 32;
    var seen = false;
    var cur = -1;

    el.classList.add('m-live', 'm-tilt3d');

    function draw(p) {
      var e = easeOut(p);
      el.style.opacity = String(clamp(p * 2.1, 0, 1));
      el.style.transform =
        'perspective(1300px) translate3d(0,' + ((1 - e) * lift).toFixed(2) + 'px,0)' +
        ' rotateX(' + ((1 - e) * rot).toFixed(3) + 'deg)' +
        ' scale(' + (0.94 + e * 0.06).toFixed(4) + ')';
      el.classList.toggle('is-lifting', p < 0.98);
    }

    draw(enterProgress(el, 1.02, 0.58));
    watch(el, function (v) { seen = v; });

    addJob({
      el: el,
      tick: function () {
        if (!seen) return false;
        var p = enterProgress(el, 1.02, 0.58);
        if (Math.abs(p - cur) < 0.001) return true;
        cur = p;
        draw(p);
        return true;
      }
    });
  }

  /* ── 2. 줌 패럴랙스 ───────────────────────────────────────────
     21st: Zoom Parallax (@sshahaider)
     원본은 여러 이미지를 서로 다른 배율로 확대해 깊이를 만든다. 여기서는
     이미지가 뷰포트를 지나는 동안 위아래로 흐르게 하고, 그만큼 잘려도 빈 칸이
     생기지 않도록 기본 배율을 키워 둔다. 자르는 일은 부모가 한다
     (.mbanner / .ft-photo-wrap 둘 다 overflow:hidden).

     hover 옵션이 있으면 그 조상에 마우스가 올라갔을 때의 확대까지 여기서
     맡는다. 같은 요소의 transform 을 CSS 와 JS 가 나눠 쓰면 서로 덮어쓴다. */
  function bindParallax(el, o) {
    if (reduced) return;
    var amp = (o.amp || 24) * (wide() ? 1 : 0.45);
    var base = o.scale || 1.12;
    var seen = false;
    var hoverK = 0;
    var hoverTo = 0;

    el.classList.add('m-live', 'm-parallax');

    if (o.hover && fine) {
      var host = el.closest(o.hover);
      if (host) {
        host.addEventListener('pointerenter', function () { hoverTo = o.hoverScale || 0.05; pump(); });
        host.addEventListener('pointerleave', function () { hoverTo = 0; pump(); });
      }
    }

    function draw() {
      var ty = (0.5 - throughProgress(el)) * 2 * amp;
      el.style.transform =
        'translate3d(0,' + ty.toFixed(2) + 'px,0) scale(' + (base + hoverK).toFixed(4) + ')';
    }

    draw();
    watch(el, function (v) { seen = v; });

    addJob({
      el: el,
      tick: function (dt) {
        var moving = Math.abs(hoverTo - hoverK) > 0.0005;
        if (!seen && !moving) return false;
        if (moving) hoverK = lerp(hoverK, hoverTo, Math.min(1, dt * 9));
        else hoverK = hoverTo;
        draw();
        return true;
      }
    });
  }

  /* ── 3. 스크롤 속도 마퀴 ──────────────────────────────────────
     21st: Scroll Velocity Text (@cnippet.dev)
     원본 그대로 옮긴 부분 — wrap() 으로 한 단위 폭 안에서 좌표를 감고,
     속도 계수의 절댓값만큼 배속(1 + |vf|)하고, 굴리는 방향으로 흐름을 뒤집는다.
     단위 폭은 ResizeObserver 로 재고, 화면 밖이거나 탭이 숨으면 멈춘다. */
  function wrapv(min, max, v) {
    var size = max - min;
    return ((((v - min) % size) + size) % size) + min;
  }

  function bindMarquee(el, o) {
    var track = el.querySelector('.m-marquee-track');
    var unit = track && track.querySelector('.m-marquee-unit');
    if (!track || !unit) return;

    var baseVel = parseFloat(el.getAttribute('data-m-speed')) || 3;
    var baseDir = parseFloat(el.getAttribute('data-m-dir')) || 1;
    var dir = baseDir;
    var baseX = 0;
    var unitW = 0;
    var seen = false;

    function fill() {
      var w = unit.scrollWidth || 0;
      if (!w) return;
      unitW = w;
      var need = Math.max(3, Math.ceil((el.offsetWidth || 0) / w) + 2);
      while (track.children.length < need) track.appendChild(unit.cloneNode(true));
      while (track.children.length > need) track.removeChild(track.lastChild);
    }

    fill();
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { fill(); pump(); });
      ro.observe(el);
      ro.observe(unit);
    } else {
      window.addEventListener('resize', function () { fill(); pump(); }, { passive: true });
    }

    watch(el, function (v) { seen = v; });

    if (reduced) return;   /* 마크업은 두되 흐르지는 않게 한다 */

    addJob({
      el: el,
      tick: function (dt) {
        /* 멈출 때는 확실히 멈춘다 — 다시 켜는 일은 IO 와 visibilitychange 가 한다.
           폭을 못 잰 경우(붙는 시점에 숨어 있었다면) 한 번 더 재 본다. */
        if (!seen || document.hidden) return false;
        if (!unitW) { fill(); if (!unitW) return false; }
        var vf = velocityFactor();
        var abs = Math.min(5, Math.abs(vf));
        if (abs > 0.1) dir = baseDir * (vf >= 0 ? 1 : -1);
        baseX += dir * ((unitW * baseVel) / 100) * (1 + abs) * dt;
        track.style.transform = 'translate3d(' + (-wrapv(0, unitW, baseX)).toFixed(2) + 'px,0,0)';
        return true;
      }
    });
  }

  /* ── 4. 3D 틸트 카드 + 스포트라이트 ───────────────────────────
     21st: Tilt Card (@tom_ui) — 원근 안에서 커서 위치를 rotateX/rotateY 로
     바꾸고 기운 쪽에 빛을 얹는다. 원본의 스프링 복귀는 lerp 로 대신했다. */
  function bindTilt(el, o) {
    if (!heavyOk()) return;
    var max = o.max || 8;

    el.classList.add('m-tilt', 'm-tilt-host');

    var glare = document.createElement('span');
    glare.className = 'm-tilt-glare';
    el.appendChild(glare);

    var rx = 0, ry = 0, sc = 0;
    var tx = 0, ty = 0, ts = 0;
    var on = false;

    /* .reveal 이 아직 안 올라온 카드를 붙잡으면 등장 애니메이션이 잘린다 */
    function ready() {
      return !el.classList.contains('reveal') || el.classList.contains('is-revealed');
    }

    el.addEventListener('pointerenter', function () {
      if (!ready()) return;
      on = true;
      ts = 0.018;
      el.classList.add('is-tilting', 'm-live');
      pump();
    });

    el.addEventListener('pointermove', function (e) {
      if (!on) return;
      var r = el.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      tx = -ny * max * 2;
      ty = nx * max * 2;
      glare.style.setProperty('--m-gx', ((nx + 0.5) * 100).toFixed(1) + '%');
      glare.style.setProperty('--m-gy', ((ny + 0.5) * 100).toFixed(1) + '%');
      pump();
    });

    el.addEventListener('pointerleave', function () {
      on = false;
      tx = ty = ts = 0;
      el.classList.remove('is-tilting');
      pump();
    });

    addJob({
      el: el,
      tick: function (dt) {
        var k = Math.min(1, dt * (on ? 11 : 7));
        rx = lerp(rx, tx, k); ry = lerp(ry, ty, k); sc = lerp(sc, ts, k);
        var done = Math.abs(rx - tx) < 0.01 && Math.abs(ry - ty) < 0.01 && Math.abs(sc - ts) < 0.0002;
        if (done && !on) {
          rx = tx; ry = ty; sc = ts;
          el.style.transform = '';
          el.classList.remove('m-live');
          return false;
        }
        el.style.transform =
          'perspective(900px) rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg)' +
          ' scale(' + (1 + sc).toFixed(4) + ')';
        return true;
      }
    });
  }

  /* ── 5. 마스크 슬라이드 / 깊이 등장 ───────────────────────────
     21st: Masked Slide Reveal (@framecn) + Depth Parallax Words (@educalvolpz)

     어절로 쪼개는 쪽(Depth Parallax Words)이 원본에 가깝지만, 이 사이트에서는
     조건부다. js/i18n.js 가 텍스트 노드 하나를 통째로 사전 키로 쓰기 때문에
     쪼개는 순간 그 문장의 EN 치환이 죽는다. 그래서 런타임에 사전을 보고 고른다.

       사전에 있음        → 통짜 마스크 (텍스트 노드를 그대로 둔다)
       사전에 __HIDE__    → 아무것도 하지 않는다 (i18n 이 부모를 숨기는 대상이라
                            래퍼가 끼면 엉뚱한 요소가 숨겨진다)
       사전에 없음        → 어절 단위 + 깊이 시차

     어절 기준은 공백이다. word-break:keep-all 이 정한 줄바꿈 지점과 같으므로
     한국어 줄바꿈이 달라지지 않는다. */
  var HIDE = '__HIDE__';
  var STEP_MS = 70;      /* Depth Parallax Words 의 시차와 같은 값 */
  var MAX_STEPS = 8;

  function splitWords(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) if (norm(n.nodeValue)) nodes.push(n);

    var out = [];
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      /* 공백을 잃으면 줄바꿈 지점이 사라진다. 캡처해서 그대로 되돌린다. */
      node.nodeValue.split(/(\s+)/).forEach(function (piece) {
        if (!piece) return;
        if (/^\s+$/.test(piece)) { frag.appendChild(document.createTextNode(piece)); return; }
        var s = document.createElement('span');
        s.className = 'm-word';
        s.textContent = piece;
        frag.appendChild(s);
        out.push(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return out;
  }

  /* 사전의 "영문 쪽"도 알아야 한다. EN 으로 저장된 상태에서 새로고침하면
     i18n 이 먼저 돌아 본문이 이미 영문이고, 그 영문은 사전의 키가 아니다.
     키만 보면 어절로 쪼개게 되는데, 그러면 i18n 이 원문 복원용으로 들고 있던
     텍스트 노드가 사라져 KO 로 되돌릴 때 영문이 그대로 남는다. */
  var dictValues = null;
  function translatable(s) {
    var dict = window.I18N_EN || {};
    if (dict[s] !== undefined) return true;
    if (!dictValues) {
      dictValues = Object.create(null);
      Object.keys(dict).forEach(function (k) {
        if (dict[k] !== HIDE) dictValues[norm(dict[k])] = 1;
      });
    }
    return !!dictValues[s];
  }

  function bindText(el) {
    var key = norm(el.textContent);
    var hit = (window.I18N_EN || {})[key];
    if (hit === HIDE) return;

    var targets;
    if (translatable(key)) {
      var mask = document.createElement('span');
      mask.className = 'm-mask';
      var inner = document.createElement('span');
      inner.className = 'm-mask-inner';
      while (el.firstChild) inner.appendChild(el.firstChild);
      mask.appendChild(inner);
      el.appendChild(mask);
      targets = [inner];
    } else {
      el.classList.add('m-words');
      targets = splitWords(el);
    }
    if (!targets.length) return;

    function show() {
      targets.forEach(function (t, i) {
        t.style.setProperty('--m-d', (Math.min(i, MAX_STEPS) * STEP_MS) + 'ms');
        t.classList.add('is-in');
      });
    }

    if (reduced || !('IntersectionObserver' in window)) { show(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        show();
        io.disconnect();
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    io.observe(el);
  }

  /* ── 6. 카운트업 ──────────────────────────────────────────────
     21st: Count Up (@unlumen) — 화면에 들어오면 목표까지 감긴다.

     숫자를 고쳐 쓰면 js/i18n.js 의 MutationObserver 가 깨어난다. 매 프레임
     고치면 그때마다 문서 전체를 훑게 되므로, 눈에 차이가 없는 선(50ms)에서
     쓰기를 묶는다. */
  function bindCount(el) {
    var node = null;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (/\d/.test(n.nodeValue)) { node = n; break; }
    }
    if (!node) return;

    var m = node.nodeValue.match(/^(\s*)([\d,]+)([\s\S]*)$/);
    if (!m) return;
    var lead = m[1], tail = m[3];
    var grouped = m[2].indexOf(',') >= 0;
    var target = parseInt(m[2].replace(/,/g, ''), 10);
    if (!isFinite(target)) return;

    el.classList.add('m-count');

    function put(v) {
      var s = grouped ? v.toLocaleString('en-US') : String(v);
      node.nodeValue = lead + s + tail;
    }

    if (reduced || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();

      var DUR = 1150;
      var t0 = 0;
      var lastWrite = 0;
      var shown = -1;
      put(0);

      addJob({
      el: el,
        tick: function () {
          var now = performance.now();
          if (!t0) t0 = now;
          var p = clamp((now - t0) / DUR, 0, 1);
          var v = Math.round(target * (1 - Math.pow(1 - p, 4)));
          if (p >= 1) { put(target); return false; }
          if (now - lastWrite >= 50 && v !== shown) { shown = v; lastWrite = now; put(v); }
          return true;
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ── 7. 마그네틱 ──────────────────────────────────────────────
     21st: Magnetic (@ibelick) — 커서가 반경 안에 들어오면 끌려간다.
     원본은 스프링, 여기서는 lerp. 포인터가 정밀할 때만 켠다. */
  var magnets = [];

  function bindMagnet(el, o) {
    if (!heavyOk()) return;
    var radius = o.radius || 96;
    var pull = o.pull || 0.3;
    var cx = 0, cy = 0, tx = 0, ty = 0;

    el.classList.add('m-magnet', 'm-live');
    magnets.push({
      el: el,
      aim: function (px, py) {
        var r = el.getBoundingClientRect();
        var mx = r.left + r.width / 2;
        var my = r.top + r.height / 2;
        var dx = px - mx, dy = py - my;
        var near = Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius;
        tx = near ? dx * pull : 0;
        ty = near ? dy * pull : 0;
      }
    });

    addJob({
      el: el,
      tick: function (dt) {
        var k = Math.min(1, dt * 10);
        cx = lerp(cx, tx, k); cy = lerp(cy, ty, k);
        if (Math.abs(cx - tx) < 0.05 && Math.abs(cy - ty) < 0.05) {
          cx = tx; cy = ty;
          el.style.transform = (tx || ty) ? 'translate3d(' + tx + 'px,' + ty + 'px,0)' : '';
          return false;
        }
        el.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
        return true;
      }
    });
  }

  if (fine && !reduced) {
    window.addEventListener('pointermove', function (e) {
      if (!magnets.length) return;
      for (var i = 0; i < magnets.length; i++) magnets[i].aim(e.clientX, e.clientY);
      pump();
    }, { passive: true });
  }

  /* ── 8. 스포트라이트 ──────────────────────────────────────────
     21st: Cursor Spotlight (@pulkitxm) — 커서 주변만 들어 올린다.
     CSS 변수만 바꾸므로 프레임 루프에 등록하지 않는다. */
  function bindSpot(el) {
    if (!fine || reduced) return;
    el.classList.add('m-spot');

    var layer = document.createElement('div');
    layer.className = 'm-spot-layer';
    el.insertBefore(layer, el.firstChild);

    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      layer.style.setProperty('--m-sx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      layer.style.setProperty('--m-sy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    }, { passive: true });

    el.addEventListener('pointerenter', function () { el.classList.add('is-spotting'); });
    el.addEventListener('pointerleave', function () { el.classList.remove('is-spotting'); });
  }

  /* ── 배치표 ──────────────────────────────────────────────────
     어느 페이지의 어떤 요소에 무엇을 거는지 한곳에 모아 둔다. showroom.html /
     product-detail.html 에는 이 파일 자체를 넣지 않았으므로 여기에도 없다. */
  var KINDS = {
    tilt3d: bindTilt3d,
    parallax: bindParallax,
    marquee: bindMarquee,
    tilt: bindTilt,
    text: bindText,
    count: bindCount,
    magnet: bindMagnet,
    spot: bindSpot
  };

  var COMMON = [
    ['[data-m-text]', 'text', {}],
    ['[data-m-marquee]', 'marquee', {}]
  ];

  var PLAN = {
    'index.html': [
      ['.mbanner', 'tilt3d', { rot: 15, lift: 34 }],
      ['.mbanner-image', 'parallax', { amp: 26, scale: 1.14 }],
      ['#inquiry', 'spot', {}],
      ['#inquiry .cta', 'magnet', {}]
    ],
    'about.html': [
      ['.m-card, .m-stat', 'tilt', { max: 7 }],
      ['.m-stat > div:first-child', 'count', {}]
    ],
    'facility.html': [
      ['.ft-photo-wrap', 'tilt3d', { rot: 9, lift: 26 }],
      ['.ft-photo', 'parallax', { amp: 26, scale: 1.13, hover: '.ft-photo-wrap', hoverScale: 0.05 }]
    ],
    'portfolio.html': [
      ['.pf-card', 'tilt', { max: 7 }]
    ],
    'contact.html': [
      ['.ct-form-wrap', 'spot', {}],
      ['.ct-submit', 'magnet', { radius: 80, pull: 0.34 }]
    ]
  };

  /* ── 훑기 ────────────────────────────────────────────────────
     x-dc 가 다시 그릴 때마다 새 노드가 생기므로 계속 주워 담는다.
     이미 처리한 노드는 __mBound 로 거른다(재렌더로 만들어진 노드는 새 객체라
     자연히 표시가 없다). */
  var rules = COMMON.concat(PLAN[PAGE] || []);
  var pending = null;

  function scan() {
    rules.forEach(function (r) {
      var list;
      try { list = document.querySelectorAll(r[0]); }
      catch (e) { return; }

      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (el.__mBound) continue;
        /* 히어로는 자체 스크롤 매핑이 있다 — 손대지 않는다 */
        if (el.closest && el.closest('#videoHero')) continue;
        el.__mBound = true;
        try { KINDS[r[1]](el, r[2] || {}); }
        catch (e) { /* 한 요소가 실패해도 나머지는 붙인다 */ }
      }
    });
  }

  function init() {
    document.documentElement.classList.add('motion-ready');
    scan();

    window.addEventListener('scroll', pump, { passive: true });
    window.addEventListener('resize', pump, { passive: true });
    document.addEventListener('visibilitychange', pump);

    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () { pending = null; scan(); }, 90);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
