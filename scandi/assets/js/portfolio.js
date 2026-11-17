/* ===== 시공사례 — 목록 필터 · 상세 갤러리 (2026-11 개편) =====

   마크업은 scripts/build-portfolio.js 가 data/cases.json 에서 정적으로 만든다.
   이 파일은 그 위에 동작만 얹는다 — 스크립트가 막혀도 목록·사진·링크는 그대로 보인다.

   · 목록: 공간(하나만) · 컬러 톤(다시 누르면 해제) 필터. 고른 값은 주소(?space=&tone=)에 남겨
     상세에 다녀와도, 주소를 공유해도 같은 결과가 보인다.
   · 상세: 대표사진 틀은 가로 스크롤 스냅 트랙이다 — 손가락으로 넘기는 것은 브라우저가 하고,
     화살표 · 작은 사진 · 키보드는 그 스크롤 위치만 옮긴다. "크게 보기"는 전체 화면.
   · 옛 주소(portfolio#case/<id>)로 들어오면 새 상세 페이지로 보낸다.

   /assets/* 는 1년 immutable 캐시 — 고치면 build-portfolio.js 의 ASSET_V 를 올릴 것. */
(function () {
  'use strict';

  var doc = document;
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 옛 해시 주소 ---------- */
  (function legacyHash() {
    var m = location.hash.match(/^#case\/([a-z0-9-]+)$/i);
    if (!m) return;
    var card = $('.pfx-card[data-id="' + m[1].toLowerCase() + '"] a');
    if (card) location.replace(card.getAttribute('href'));
  })();

  /* ---------- 목록 필터 ---------- */
  function initList(grid) {
    var cards = $$('.pfx-card', grid);
    var tabs = $$('.pfx-tab');
    var tones = $$('.pfx-tone');
    var countEl = $('.pfx-count b');
    var empty = $('.pfx-empty');
    var state = { space: 'all', tone: '' };

    function valid(list, key, v) {
      return list.some(function (b) { return b.getAttribute(key) === v; });
    }
    function read() {
      var q = new URLSearchParams(location.search);
      var s = q.get('space'), t = q.get('tone');
      state.space = s && valid(tabs, 'data-space', s) ? s : 'all';
      state.tone = t && valid(tones, 'data-tone', t) ? t : '';
    }
    function write() {
      var q = new URLSearchParams(location.search);
      if (state.space === 'all') q['delete']('space'); else q.set('space', state.space);
      if (!state.tone) q['delete']('tone'); else q.set('tone', state.tone);
      var s = q.toString();
      try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '')); } catch (e) { /* file:// 등 */ }
    }
    function paint() {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (state.space === 'all' || c.getAttribute('data-space') === state.space) &&
                 (!state.tone || c.getAttribute('data-tone') === state.tone);
        c.hidden = !ok;
        if (ok) shown++;
      });
      tabs.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-space') === state.space ? 'true' : 'false');
      });
      tones.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-tone') === state.tone ? 'true' : 'false');
      });
      if (countEl) countEl.textContent = String(shown);
      if (empty) empty.hidden = shown > 0;
      grid.hidden = shown === 0;
    }

    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        state.space = b.getAttribute('data-space'); write(); paint();
      });
    });
    tones.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-tone');
        state.tone = state.tone === t ? '' : t; write(); paint();
      });
    });
    var reset = $('.pfx-empty button');
    if (reset) reset.addEventListener('click', function () {
      state.space = 'all'; state.tone = ''; write(); paint();
    });

    read(); paint();
  }

  /* ---------- 상세 갤러리 ---------- */
  function initGallery(gal) {
    var track = $('.pfx-track', gal);
    var slides = $$('.pfx-slide', gal);
    var thumbs = $$('.pfx-thumb', gal);
    var cnt = $('.pfx-cnt b', gal);
    var n = slides.length;
    var idx = 0;
    if (!track || !n) return;

    function paint() {
      thumbs.forEach(function (t, i) { t.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      if (cnt) cnt.textContent = String(idx + 1);
    }
    function go(i, instant) {
      idx = (i + n) % n;
      var left = idx * track.clientWidth;
      if (track.scrollTo) track.scrollTo({ left: left, behavior: instant || reduceMotion ? 'auto' : 'smooth' });
      else track.scrollLeft = left;
      paint();
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var w = track.clientWidth || 1;
        var i = Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / w)));
        if (i !== idx) { idx = i; paint(); }
      });
    }, { passive: true });
    /* 창 크기가 바뀌면 보고 있던 사진 자리에 다시 맞춘다 */
    window.addEventListener('resize', function () { track.scrollLeft = idx * track.clientWidth; });

    var prev = $('.pfx-arr.is-prev', gal), next = $('.pfx-arr.is-next', gal);
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    gal.addEventListener('keydown', function (e) {
      if (n < 2) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    });

    /* ---- 크게 보기 ---- */
    var srcs = slides.map(function (s) {
      var im = $('img', s);
      return { src: im.getAttribute('data-full') || im.currentSrc || im.src, alt: im.alt };
    });
    var lb = null, lbImg = null, lbCnt = null, lastFocus = null;

    function icon(d) {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
    }
    function build() {
      lb = doc.createElement('div');
      lb.className = 'pfx-lb';
      lb.hidden = true;
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', '사진 크게 보기');
      lb.innerHTML =
        '<img alt="">' +
        (n > 1 ? '<button type="button" class="pfx-lb-prev" aria-label="이전 사진">' + icon('M15 5l-7 7 7 7') + '</button>' +
                 '<button type="button" class="pfx-lb-next" aria-label="다음 사진">' + icon('M9 5l7 7-7 7') + '</button>' : '') +
        '<button type="button" class="pfx-lb-x" aria-label="닫기">' + icon('M6 6l12 12M18 6L6 18') + '</button>' +
        (n > 1 ? '<div class="pfx-lb-cnt"></div>' : '');
      doc.body.appendChild(lb);
      lbImg = $('img', lb);
      lbCnt = $('.pfx-lb-cnt', lb);
      lb.addEventListener('click', function (e) {
        var t = e.target;
        if (t.closest('.pfx-lb-prev')) { show(idx - 1); return; }
        if (t.closest('.pfx-lb-next')) { show(idx + 1); return; }
        if (t === lbImg) return;
        close();
      });
      /* 손가락으로 좌우 넘기기 */
      var x0 = null;
      lb.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        if (x0 === null || n < 2) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 48) show(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
    }
    function show(i) {
      idx = (i + n) % n;
      lbImg.src = srcs[idx].src;
      lbImg.alt = srcs[idx].alt;
      if (lbCnt) lbCnt.textContent = (idx + 1) + ' / ' + n;
      paint();
    }
    function onKey(e) {
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft' && n > 1) { show(idx - 1); }
      else if (e.key === 'ArrowRight' && n > 1) { show(idx + 1); }
      else if (e.key === 'Tab') {
        /* 포커스를 창 안에 가둔다 */
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function open() {
      if (!lb) build();
      lastFocus = doc.activeElement;
      show(idx);
      lb.hidden = false;
      doc.documentElement.style.overflow = 'hidden';
      doc.addEventListener('keydown', onKey);
      $('.pfx-lb-x', lb).focus();
    }
    function close() {
      if (!lb || lb.hidden) return;
      lb.hidden = true;
      doc.documentElement.style.overflow = '';
      doc.removeEventListener('keydown', onKey);
      /* 크게 보던 사진을 대표사진 자리에도 맞춰 둔다 */
      track.scrollLeft = idx * track.clientWidth;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    var zoom = $('.pfx-zoom', gal);
    if (zoom) zoom.addEventListener('click', open);
    slides.forEach(function (s) {
      var im = $('img', s);
      if (im) im.addEventListener('click', open);
    });

    paint();
  }

  /* ---------- 상세: 상담 버튼에 이 사례를 실어 보낸다 ----------
     모바일 하단 바(#esCtabar)와 플로팅 "견적 문의"(#iwRoot)는 inquiry-widget.js 가 body 끝에 만든다.
     만들어진 뒤에 견적 링크만 이 사례용 주소로 바꾼다 — 바의 크기·층위는 그대로라
     푸터 여백이나 연말 팝업 위치 계산이 달라지지 않는다. */
  function initCaseCta(href) {
    function patch() {
      var bar = doc.getElementById('esCtabar'), iw = doc.getElementById('iwRoot');
      if (!bar && !iw) return false;
      if (bar && !bar.classList.contains('pfx-bar')) {
        var tel = $('.es-ctabar-tel', bar), kk = $('.es-ctabar-kakao', bar);
        if (tel && kk) {
          tel.setAttribute('href', href);
          var svg = $('svg', tel); if (svg) svg.parentNode.removeChild(svg);
          var sp = $('span', tel); if (sp) sp.textContent = '이 컬러로 견적 문의';
          bar.insertBefore(kk, tel);
          bar.classList.add('pfx-bar');
        }
      }
      if (iw) {
        var q = $('.iw-item--quote', iw);
        if (q) q.setAttribute('href', href);
      }
      return !!(bar && iw);
    }
    if (patch()) return;
    if (!window.MutationObserver) { window.addEventListener('load', patch); return; }
    var mo = new MutationObserver(function () { if (patch()) mo.disconnect(); });
    mo.observe(doc.body, { childList: true });
    setTimeout(function () { mo.disconnect(); }, 8000);
  }

  function init() {
    var grid = $('.pfx-grid[data-filter]');
    if (grid) initList(grid);
    var gal = $('.pfx-gal');
    if (gal) initGallery(gal);
    var cta = $('.pfx-b1[data-case-cta]');
    if (cta) initCaseCta(cta.getAttribute('href'));
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
