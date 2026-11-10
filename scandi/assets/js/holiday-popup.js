/*!
 * 은성 연말 프로모션 팝업 (실측 방문 무료)
 * - 데스크톱: 오른쪽 아래 380px 카드 / 모바일(768px 이하): 하단 시트
 * - 닫기 → 작은 탭으로 줄어듦 (같은 방문 동안 유지) / 오늘 하루 보지 않기 → 24시간 숨김
 * - END_AT 이후에는 아무것도 띄우지 않음
 */
(function () {
  'use strict';

  /* ===================== 설정 ===================== */
  var CONFIG = {
    END_AT: '2026-12-01T00:00:00+09:00',       // 이 시각부터 자동 종료
    IMAGE: '/images/promo/holiday-kitchen-2026.jpg', // 은성 시공 사진 (images/* 는 1년 캐시 → 바꿀 땐 새 파일명으로)
    FORM_URL: '/contact.html',                  // 문의 섹션(#inquiry)이 없는 페이지에서 "무료 실측 신청하기" 이동 주소
    KAKAO_URL: 'https://open.kakao.com/o/sS7BnYyc', // 카카오톡 오픈채팅 (inquiry-widget.js 와 같은 주소)
    DESKTOP_DELAY: 0,                           // 데스크톱: 접속 후 표시까지 (ms) — 0 = 바로
    MOBILE_DELAY: 0,                            // 모바일: 접속 후 표시까지 (ms) — 0 = 바로
    MOBILE_SCROLL: 0.3
  };
  var KEY_HIDE = 'esh_hide_until';   // localStorage: 오늘 하루 보지 않기
  var KEY_MINI = 'esh_minimized';    // sessionStorage: 닫아서 탭으로 줄인 상태

  /* ===================== 가드 ===================== */
  var now = Date.now();
  if (now >= new Date(CONFIG.END_AT).getTime()) return;
  function store(type) { try { return window[type]; } catch (e) { return null; } }
  var ls = store('localStorage'), ss = store('sessionStorage');
  function get(s, k) { try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function set(s, k, v) { try { if (s) s.setItem(k, v); } catch (e) {} }
  if (Number(get(ls, KEY_HIDE) || 0) > now) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 768px)') : { matches: false };

  /* ===================== 폰트 ===================== */
  function addLink(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  }
  addLink('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
  addLink('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@500&display=swap');

  /* ===================== 가랜드 일러스트 (SVG 생성) ===================== */
  var BAND_H = 92, PHOTO_H = 188, TAG_X = 318, TAG_HOLE_Y = 242;
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function swag(t) {
    var u, p0, p1, p2;
    if (t < 0.5) { u = t / 0.5; p0 = [-12, 84]; p1 = [92, 126]; p2 = [190, 90]; }
    else { u = (t - 0.5) / 0.5; p0 = [190, 90]; p1 = [288, 126]; p2 = [392, 84]; }
    var x = (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0];
    var y = (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1];
    var dx = 2 * (1 - u) * (p1[0] - p0[0]) + 2 * u * (p2[0] - p1[0]);
    var dy = 2 * (1 - u) * (p1[1] - p0[1]) + 2 * u * (p2[1] - p1[1]);
    return [x, y, Math.atan2(dy, dx)];
  }
  function yAt(xq) { var best = 1e9, by = 0; for (var i = 0; i <= 800; i++) { var p = swag(i / 800), d = Math.abs(p[0] - xq); if (d < best) { best = d; by = p[1]; } } return by; }
  function n(v) { return Math.round(v * 10) / 10; }

  function decoSVG() {
    var r = rng(11), o = [];
    var a = function (s) { o.push(s); };
    a('<svg class="esh-deco" viewBox="0 0 380 300" aria-hidden="true" focusable="false"><defs>');
    a('<radialGradient id="esh-glow"><stop offset="0" stop-color="#fff1c9" stop-opacity=".85"/><stop offset=".45" stop-color="#ffe2a0" stop-opacity=".28"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>');
    a('<radialGradient id="esh-spill" cx=".5" cy="0" r=".7"><stop offset="0" stop-color="#ffe6b0" stop-opacity=".3"/><stop offset="1" stop-color="#ffe6b0" stop-opacity="0"/></radialGradient>');
    a('<linearGradient id="esh-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0710" stop-opacity=".36"/><stop offset="1" stop-color="#2a0710" stop-opacity="0"/></linearGradient>');
    [['chrome', '#fff', '#c9ced4', '#5f666e'], ['cherry', '#ff9aa6', '#b3192f', '#560913'], ['butter', '#fff7d6', '#efd98e', '#9c7e2a'], ['cloud', '#fff', '#ecebe6', '#a19d95']].forEach(function (g) {
      a('<radialGradient id="esh-' + g[0] + '" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="' + g[1] + '"/><stop offset=".42" stop-color="' + g[2] + '"/><stop offset="1" stop-color="' + g[3] + '"/></radialGradient>');
    });
    a('<linearGradient id="esh-velvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4233c"/><stop offset="1" stop-color="#7a1324"/></linearGradient></defs>');
    a('<rect y="' + BAND_H + '" width="380" height="26" fill="url(#esh-shade)"/><rect y="' + BAND_H + '" width="380" height="120" fill="url(#esh-spill)"/>');

    // 눈
    if (!reduceMotion) {
      for (var i = 0; i < 60; i++) {
        var x = r() * 380, rad = [0.7, 0.9, 1.1, 1.3, 1.6, 1.9, 2.3][Math.floor(r() * 7)];
        var dur = (8 + r() * 8) * (rad < 1.2 ? 1.25 : 1), drift = r() * 20 - 10;
        a('<circle cx="' + n(x) + '" cy="-6" r="' + rad + '" fill="#fff" opacity="' + (0.45 + r() * 0.5).toFixed(2) + '"><animateTransform attributeName="transform" type="translate" values="0 0;' + n(drift) + ' 145;' + n(-drift * 0.6) + ' 292" dur="' + dur.toFixed(1) + 's" begin="-' + (r() * dur).toFixed(1) + 's" repeatCount="indefinite"/></circle>');
      }
    }
    // 태그 끈
    var gy = yAt(TAG_X);
    a('<path d="M' + TAG_X + ' ' + n(gy + 4) + ' C' + (TAG_X + 3) + ' ' + n(gy + 60) + ',' + (TAG_X - 3) + ' ' + (TAG_HOLE_Y - 60) + ',' + TAG_X + ' ' + TAG_HOLE_Y + '" stroke="#c3c7cc" stroke-width="1.1" fill="none"/>');
    // 가랜드 몸통
    var d = 'M';
    for (i = 0; i <= 120; i++) { var p = swag(i / 120); d += (i ? ' L' : '') + n(p[0]) + ' ' + n(p[1]); }
    a('<path d="' + d + '" stroke="#0f2a1b" stroke-width="17" stroke-linecap="round" fill="none" opacity=".95"/><path d="' + d + '" stroke="#1a3d29" stroke-width="11" stroke-linecap="round" fill="none"/>');
    // 솔잎
    var greens = ['#1f4a32', '#28583c', '#2f6745', '#3b7550', '#4d875d', '#5f9a69'], steps = 380;
    for (i = 0; i <= steps; i++) {
      var q = swag(i / steps);
      for (var k = 0; k < 3; k++) {
        var side = r() < 0.5 ? -1 : 1;
        var ang = q[2] + side * (35 + r() * 45) * Math.PI / 180 + (r() * 24 - 12) * Math.PI / 180;
        var ln = 6 + r() * 6.5, ox = q[0] + r() * 4 - 2, oy = q[1] + r() * 5 - 2.5;
        a('<line x1="' + n(ox) + '" y1="' + n(oy) + '" x2="' + n(ox + Math.cos(ang) * ln) + '" y2="' + n(oy + Math.sin(ang) * ln) + '" stroke="' + greens[Math.floor(r() * 6)] + '" stroke-width="' + (1 + r() * 0.7).toFixed(2) + '" stroke-linecap="round"/>');
      }
    }
    for (i = 0; i < 60; i++) { var s2 = swag(r()); a('<circle cx="' + n(s2[0] + r() * 12 - 6) + '" cy="' + n(s2[1] + r() * 13 - 7) + '" r="' + (0.6 + r() * 0.7).toFixed(2) + '" fill="#f4f7f2" opacity="' + (0.5 + r() * 0.4).toFixed(2) + '"/>'); }
    // 솔방울
    [64, 156, 226, 344].forEach(function (xc) {
      var yc = n(yAt(xc) + 3), tr = ' transform="rotate(-25 ' + xc + ' ' + yc + ')"';
      a('<ellipse cx="' + xc + '" cy="' + yc + '" rx="4.2" ry="6.4" fill="#5a3418"' + tr + '/>');
      for (var j = 0; j < 4; j++) a('<path d="M' + (xc - 3.4) + ' ' + n(yc - 4 + j * 2.6) + ' q3.4 1.6 6.8 0" stroke="#8a5a2c" stroke-width=".9" fill="none"' + tr + '/>');
    });
    // 열매
    [22, 104, 140, 250, 276, 372].forEach(function (xc) {
      var yc = yAt(xc) - 2;
      [[0, 0], [3.6, 1.8], [-0.6, 3.8]].forEach(function (o2) {
        a('<circle cx="' + n(xc + o2[0]) + '" cy="' + n(yc + o2[1]) + '" r="2.3" fill="#a80f1a"/><circle cx="' + n(xc + o2[0] - 0.7) + '" cy="' + n(yc + o2[1] - 0.8) + '" r=".7" fill="#ffd3cf"/>');
      });
    });
    // 오너먼트
    function bauble(x, hang, rr, kind) {
      var y0 = yAt(x) + 4, cy = y0 + hang + rr, hx = n(x - rr * 0.35), hy = n(cy - rr * 0.4);
      a('<line x1="' + x + '" y1="' + n(y0) + '" x2="' + x + '" y2="' + n(cy - rr - 2) + '" stroke="#c3c7cc" stroke-width=".9"/>');
      a('<rect x="' + n(x - rr * 0.32) + '" y="' + n(cy - rr - 3) + '" width="' + n(rr * 0.64) + '" height="3.6" rx=".8" fill="#b9bec4"/>');
      a('<circle cx="' + x + '" cy="' + n(cy) + '" r="' + rr + '" fill="url(#esh-' + kind + ')"/>');
      a('<ellipse cx="' + hx + '" cy="' + hy + '" rx="' + n(rr * 0.28) + '" ry="' + n(rr * 0.16) + '" fill="#fff" opacity=".75" transform="rotate(-30 ' + hx + ' ' + hy + ')"/>');
      if (kind === 'cherry' || kind === 'butter') a('<path d="M' + n(x - rr * 0.92) + ' ' + n(cy + rr * 0.15) + ' Q' + x + ' ' + n(cy + rr * 0.42) + ' ' + n(x + rr * 0.92) + ' ' + n(cy + rr * 0.15) + '" stroke="#fff" stroke-width=".9" fill="none" opacity=".55"/>');
    }
    bauble(36, 10, 8.5, 'chrome'); bauble(118, 18, 7, 'cherry'); bauble(160, 8, 5.5, 'cloud');
    bauble(246, 14, 6.5, 'chrome'); bauble(286, 22, 7.5, 'butter'); bauble(358, 9, 6, 'cherry');
    // 리본
    var bx = 190, by = 92;
    a('<path d="M' + bx + ' ' + by + ' C' + (bx - 10) + ' ' + (by - 16) + ',' + (bx - 30) + ' ' + (by - 12) + ',' + (bx - 24) + ' ' + (by + 2) + ' C' + (bx - 20) + ' ' + (by + 10) + ',' + (bx - 8) + ' ' + (by + 6) + ',' + bx + ' ' + by + 'Z" fill="url(#esh-velvet)"/>');
    a('<path d="M' + bx + ' ' + by + ' C' + (bx + 10) + ' ' + (by - 16) + ',' + (bx + 30) + ' ' + (by - 12) + ',' + (bx + 24) + ' ' + (by + 2) + ' C' + (bx + 20) + ' ' + (by + 10) + ',' + (bx + 8) + ' ' + (by + 6) + ',' + bx + ' ' + by + 'Z" fill="url(#esh-velvet)"/>');
    a('<path d="M' + (bx - 3) + ' ' + (by + 3) + ' C' + (bx - 8) + ' ' + (by + 16) + ',' + (bx - 12) + ' ' + (by + 26) + ',' + (bx - 17) + ' ' + (by + 34) + ' L' + (bx - 10) + ' ' + (by + 32) + ' L' + (bx - 8) + ' ' + (by + 38) + ' C' + (bx - 4) + ' ' + (by + 26) + ',' + (bx - 1) + ' ' + (by + 14) + ',' + (bx + 1) + ' ' + (by + 4) + 'Z" fill="#8f1528"/>');
    a('<path d="M' + (bx + 3) + ' ' + (by + 3) + ' C' + (bx + 7) + ' ' + (by + 15) + ',' + (bx + 10) + ' ' + (by + 24) + ',' + (bx + 15) + ' ' + (by + 31) + ' L' + (bx + 8) + ' ' + (by + 30) + ' L' + (bx + 5) + ' ' + (by + 36) + ' C' + (bx + 3) + ' ' + (by + 24) + ',' + (bx + 1) + ' ' + (by + 13) + ',' + (bx - 1) + ' ' + (by + 4) + 'Z" fill="#7a1222"/>');
    a('<ellipse cx="' + bx + '" cy="' + (by + 1) + '" rx="5" ry="4.4" fill="#a61a30"/>');
    // 전구
    for (i = 0, x = 12; x < 380; x += 29, i++) {
      var yl = n(yAt(x) + (i % 2 ? 3 : -3));
      a('<circle cx="' + x + '" cy="' + yl + '" r="11" fill="url(#esh-glow)">' + (reduceMotion ? '' : '<animate attributeName="opacity" values=".55;1;.6;.95;.55" dur="' + (2.2 + (i % 5) * 0.55).toFixed(2) + 's" repeatCount="indefinite"/>') + '</circle><circle cx="' + x + '" cy="' + yl + '" r="1.9" fill="#fffaf0"/>');
    }
    a('</svg>');
    return o.join('');
  }

  /* ===================== 스타일 ===================== */
  var CSS = [
    '.esh-root{position:fixed;right:24px;bottom:24px;z-index:9999;width:380px;max-width:calc(100vw - 32px);font-family:Pretendard Variable,Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;-webkit-font-smoothing:antialiased;opacity:0;transform:translateY(16px);transition:opacity .32s ease,transform .42s cubic-bezier(.2,.8,.2,1);pointer-events:none}.esh-card{pointer-events:none}.esh-root.is-open .esh-card{pointer-events:auto}',
    '.esh-root.is-open{opacity:1;transform:none}',
    '.esh-root *{box-sizing:border-box}',
    '.esh-card{position:relative;overflow:hidden;transform-origin:100% 100%;border-radius:20px;background:#f0eee9;border:1px solid rgba(27,26,25,.08);box-shadow:0 24px 60px rgba(20,12,10,.22),0 4px 14px rgba(20,12,10,.08)}',
    '.esh-band{position:relative;background:#a11a2e;overflow:hidden}',
    '.esh-band svg{position:absolute;inset:0;width:100%;height:100%}',
    '.esh-band-text{position:absolute;left:0;right:0;top:15px;display:flex;flex-direction:column;align-items:center;gap:4px}',
    '.esh-kicker{font-family:"Geist Mono",ui-monospace,monospace;font-size:10.5px;font-weight:500;letter-spacing:.18em;color:rgba(240,238,233,.72)}',
    '.esh-script{font-family:"Instrument Serif",Georgia,serif;font-size:38px;line-height:1;letter-spacing:-.01em;color:#f0eee9}',
    '.esh-script i{font-style:italic}',
    '.esh-photo{position:relative;overflow:hidden}',
    '.esh-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 62%}',
    '.esh-chip{position:absolute;left:12px;bottom:10px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.22);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.45);color:#fff;font-size:11px;font-weight:500;letter-spacing:-.01em}',
    '.esh-body{position:relative;padding:20px 24px 50px;display:flex;flex-direction:column}',
    '.esh-eyebrow{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:#a11a2e;letter-spacing:-.01em}',
    '.esh-eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:#a11a2e}',
    '.esh-title{margin:8px 0 0;font-size:23px;font-weight:700;line-height:1.32;color:#1b1a19;letter-spacing:-.035em}',
    '.esh-desc{margin:10px 0 0;font-size:13.5px;line-height:1.6;color:#5e5a55;letter-spacing:-.01em;word-break:keep-all}',
    '.esh-cta{margin-top:16px;height:50px;border-radius:999px;background:#a11a2e;color:#faf9f6!important;display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;font-weight:600;letter-spacing:-.02em;text-decoration:none!important;transition:background .2s}',
    '.esh-cta:hover{background:#86152a}',
    '.esh-kakao{margin-top:6px;height:38px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:13.5px;font-weight:500;color:#1b1a19!important;text-decoration:none!important}',
    '.esh-kakao:hover{text-decoration:underline!important;text-underline-offset:3px}',
    '.esh-note{margin:0;font-size:11.5px;color:#8c8780;text-align:center;letter-spacing:-.01em}',
    '.esh-foot{position:absolute;left:0;right:0;bottom:0;height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;background:#e8e5df;border-top:1px solid #dcd8d1}',
    '.esh-foot button{height:42px;padding:0 8px;border:0;background:transparent;display:flex;align-items:center;gap:6px;font:inherit;font-size:12px;color:#6f6b65;cursor:pointer}',
    '.esh-deco{position:absolute;left:0;top:0;width:100%;height:auto;pointer-events:none;overflow:visible}',
    '.esh-tag{position:absolute;width:100px;height:112px;transform:rotate(-4deg);transform-origin:50px 16px;filter:drop-shadow(0 8px 14px rgba(20,12,10,.22));pointer-events:none}',
    '.esh-tag .esh-tag-bg{position:absolute;inset:0;clip-path:polygon(20% 0,80% 0,100% 15%,100% 100%,0 100%,0 15%);background:#faf9f6}',
    '.esh-tag .esh-tag-line{position:absolute;inset:5px;clip-path:polygon(19% 0,81% 0,100% 14%,100% 100%,0 100%,0 14%);border:1px solid rgba(161,26,46,.2)}',
    '.esh-tag .esh-tag-hole{position:absolute;left:42px;top:8px;width:16px;height:16px;border-radius:50%;background:#e4e1db;box-shadow:inset 0 0 0 2.5px #c3c7cc,inset 0 1px 3px rgba(20,20,20,.3)}',
    '.esh-tag .esh-tag-in{position:relative;display:flex;flex-direction:column;align-items:center;padding-top:29px;gap:2px;line-height:1.2}',
    '.esh-tag .t1{font-family:"Geist Mono",ui-monospace,monospace;font-weight:500;font-size:10px;letter-spacing:.2em;color:#a11a2e}',
    '.esh-tag .t2{font-weight:600;font-size:13px;color:#1b1a19;letter-spacing:-.02em}',
    '.esh-tag .t3{font-weight:800;font-size:26px;line-height:1.1;color:#a11a2e;letter-spacing:-.05em}',
    '.esh-tag .t4{font-family:"Geist Mono",ui-monospace,monospace;font-size:10.5px;color:#6f6b65;margin-top:2px;letter-spacing:.04em}',
    '.esh-x{position:absolute;right:4px;top:4px;width:44px;height:44px;border:0;background:transparent;color:#faf9f6;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}',
    '.esh-x span{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center}',
    '.esh-handle{display:none}',
    '.esh-scrim{position:fixed;inset:0;z-index:9999;background:rgba(20,9,7,.5);opacity:0;transition:opacity .3s;pointer-events:none}',
    '.esh-scrim.is-open{opacity:1;pointer-events:auto}',
    '.esh-mini{position:fixed;right:24px;bottom:24px;z-index:9999;height:58px;width:300px;max-width:calc(100vw - 32px);border:0;border-radius:999px;background:#a11a2e;color:#faf9f6;display:flex;align-items:center;gap:12px;padding:0 10px 0 12px;box-shadow:0 12px 28px rgba(80,14,24,.28),inset 0 0 0 .5px rgba(255,255,255,.25);font-family:Pretendard Variable,Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;cursor:pointer;text-align:left;opacity:0;transform:translateY(12px);transition:opacity .3s,transform .35s cubic-bezier(.2,.8,.2,1);pointer-events:none}',
    '.esh-mini.is-open{opacity:1;transform:none;pointer-events:auto}',
    '.esh-mini .m-t{display:flex;flex-direction:column;gap:1px;flex:1}',
    '.esh-mini .m1{font-size:14.5px;font-weight:700;letter-spacing:-.02em}',
    '.esh-mini .m2{font-family:"Geist Mono",ui-monospace,monospace;font-size:10.5px;color:rgba(250,249,246,.72);letter-spacing:.06em}',
    '.esh-mini .m-up{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center}',
    '.esh-root :focus-visible,.esh-mini:focus-visible{outline:2px solid #1b1a19;outline-offset:2px}',
    '@media (max-width:768px){',
    '.esh-root{left:0;right:0;bottom:0;width:100%;max-width:none;transform:translateY(100%)}',
    '.esh-root.is-open{transform:none}',
    '.esh-card{border-radius:22px 22px 0 0;border:0;padding-bottom:env(safe-area-inset-bottom);transform:none!important}',
    '.esh-foot{bottom:env(safe-area-inset-bottom)}',
    '.esh-handle{display:block;position:absolute;left:50%;top:7px;width:36px;height:4px;margin-left:-18px;border-radius:4px;background:rgba(250,249,246,.55);z-index:2}',
    '.esh-mini{right:16px;width:auto;padding-right:10px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.esh-root,.esh-mini,.esh-scrim{transition:opacity .2s}.esh-root{transform:none}}'
  ].join('');

  /* ===================== 마크업 ===================== */
  var IX = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>';
  var IARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
  var ICHAT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c-4.97 0-9 3.13-9 7 0 2.46 1.63 4.62 4.1 5.87L6.3 20l3.9-2.2c.58.08 1.18.12 1.8.12 4.97 0 9-3.13 9-7s-4.03-7-9-7z"/></svg>';
  var IBOX = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>';
  var IUP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
  var IORN = '<svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true" style="flex:none"><defs><radialGradient id="esh-mg" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="#fff"/><stop offset=".42" stop-color="#c9ced4"/><stop offset="1" stop-color="#5f666e"/></radialGradient></defs><line x1="17" y1="0" x2="17" y2="8" stroke="#c3c7cc"/><rect x="13" y="7" width="8" height="5" rx="1" fill="#b9bec4"/><circle cx="17" cy="25" r="13" fill="url(#esh-mg)"/><ellipse cx="12" cy="19" rx="3.6" ry="2" fill="#fff" opacity=".75" transform="rotate(-30 12 19)"/></svg>';

  function build() {
    var style = document.createElement('style'); style.id = 'esh-style'; style.textContent = CSS; document.head.appendChild(style);

    var scrim = document.createElement('div'); scrim.className = 'esh-scrim';
    var root = document.createElement('div');
    root.className = 'esh-root'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-labelledby', 'esh-title');
    root.innerHTML =
      '<div class="esh-card">' +
        '<div class="esh-band"><svg viewBox="0 0 380 92" preserveAspectRatio="none" aria-hidden="true"><filter id="esh-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0"/></filter><rect width="380" height="92" filter="url(#esh-grain)"/></svg>' +
          '<div class="esh-band-text"><span class="esh-kicker">HOLIDAY EDITION — 2026</span><span class="esh-script"><i>Merry</i> Christmas</span></div></div>' +
        '<div class="esh-photo"><img src="' + CONFIG.IMAGE + '" alt="은성이 시공한 포세린 주방 상판과 아일랜드" loading="lazy" decoding="async"><span class="esh-chip">은성 시공 현장 · 포세린 상판</span></div>' +
        '<div class="esh-body">' +
          '<span class="esh-eyebrow">11월 한정 연말 프로모션</span>' +
          '<h2 class="esh-title" id="esh-title">올해 실측은<br>은성이 선물할게요</h2>' +
          '<p class="esh-desc">11월 30일까지 신청하시면 상판 실측 방문을 무료로 진행해 드려요. 크리스마스 전에, 새 주방을 준비해 보세요.</p>' +
          '<a class="esh-cta" href="' + (document.getElementById('inquiry') ? '#inquiry' : CONFIG.FORM_URL) + '" data-esh="cta">무료 실측 신청하기' + IARROW + '</a>' +
          (CONFIG.KAKAO_URL ? '<a class="esh-kakao" href="' + CONFIG.KAKAO_URL + '" target="_blank" rel="noopener" data-esh="kakao">' + ICHAT + '카카오톡으로 문의하기</a>' : '') +
          '<p class="esh-note">원거리 지역은 시공 시 출장비가 별도로 발생합니다</p>' +
        '</div>' +
        '<div class="esh-foot"><button type="button" data-esh="today">' + IBOX + '오늘 하루 보지 않기</button><button type="button" data-esh="close">닫기</button></div>' +
        decoSVG() +
        '<div class="esh-tag"><div class="esh-tag-bg"></div><div class="esh-tag-line"></div><div class="esh-tag-hole"></div><div class="esh-tag-in"><span class="t1">FREE</span><span class="t2">실측 방문</span><span class="t3">무료</span><span class="t4">~ 11.30</span></div></div>' +
        '<span class="esh-handle"></span>' +
        '<button type="button" class="esh-x" aria-label="팝업 닫기" data-esh="close"><span>' + IX + '</span></button>' +
      '</div>';

    var mini = document.createElement('button');
    mini.type = 'button'; mini.className = 'esh-mini'; mini.setAttribute('aria-label', '연말 프로모션 다시 보기: 실측 방문 무료');
    mini.innerHTML = IORN + '<span class="m-t"><span class="m1">실측 방문 무료</span><span class="m2">~ 11.30 · HOLIDAY</span></span><span class="m-up">' + IUP + '</span>';

    document.body.appendChild(scrim); document.body.appendChild(root); document.body.appendChild(mini);

    // 폭에 맞춰 띠/사진/태그 위치 계산
    var band = root.querySelector('.esh-band'), photo = root.querySelector('.esh-photo'), tag = root.querySelector('.esh-tag'), card = root.querySelector('.esh-card');
    function layout() {
      var k = card.clientWidth / 380;
      band.style.height = (BAND_H * k) + 'px';
      photo.style.height = (PHOTO_H * k) + 'px';
      tag.style.left = (TAG_X * k - 50) + 'px';
      tag.style.top = ((TAG_HOLE_Y - 16) * k) + 'px';
      // 데스크톱에서 창 높이가 낮으면 카드 전체를 비율 그대로 줄인다
      card.style.transform = '';
      if (!mqMobile.matches) {
        var room = window.innerHeight - 48, h = card.offsetHeight;
        if (h > room) card.style.transform = 'scale(' + Math.max(0.6, room / h).toFixed(3) + ')';
      }
    }
    // 작은 탭: 데스크톱은 플로팅 상담 버튼(.iw-root) 위, 모바일은 하단 CTA 바(.es-ctabar) 위
    function placeMini() {
      var iw = document.getElementById('iwRoot'), bar = document.getElementById('esCtabar');
      var b = mqMobile.matches ? 16 : 24;
      if (mqMobile.matches && bar && bar.offsetHeight) b = bar.offsetHeight + 12;
      else if (!mqMobile.matches && iw && iw.offsetHeight) b = 24 + iw.offsetHeight + 14;
      mini.style.bottom = b + 'px';
    }

    function open() {
      layout(); mini.classList.remove('is-open');
      root.classList.add('is-open');
      if (mqMobile.matches) scrim.classList.add('is-open');
    }
    function minimize() {
      root.classList.remove('is-open'); scrim.classList.remove('is-open');
      set(ss, KEY_MINI, '1');
      placeMini();
      setTimeout(function () { mini.classList.add('is-open'); }, 200);
    }
    function hideToday() {
      set(ls, KEY_HIDE, String(Date.now() + 24 * 60 * 60 * 1000));
      root.classList.remove('is-open'); scrim.classList.remove('is-open'); mini.classList.remove('is-open');
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-esh]'); if (!t) return;
      var act = t.getAttribute('data-esh');
      if (act === 'close') minimize();
      else if (act === 'today') hideToday();
      else if (act === 'kakao') set(ss, KEY_MINI, '1');
      else if (act === 'cta') {
        var target = document.getElementById('inquiry');
        if (target) { e.preventDefault(); minimize(); target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
        else set(ss, KEY_MINI, '1');
      }
    });
    scrim.addEventListener('click', minimize);
    mini.addEventListener('click', open);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-open')) minimize(); });
    window.addEventListener('resize', function () { if (root.classList.contains('is-open')) layout(); if (mini.classList.contains('is-open')) placeMini(); });

    // 같은 방문에서 이미 닫았다면 탭만 표시
    if (get(ss, KEY_MINI)) { placeMini(); mini.classList.add('is-open'); return; }

    if (mqMobile.matches) {
      var fired = false;
      var go = function () { if (fired) return; fired = true; window.removeEventListener('scroll', onScroll); open(); };
      var onScroll = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0 && window.scrollY / h >= CONFIG.MOBILE_SCROLL) go();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      setTimeout(go, CONFIG.MOBILE_DELAY);
    } else {
      setTimeout(open, CONFIG.DESKTOP_DELAY);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
