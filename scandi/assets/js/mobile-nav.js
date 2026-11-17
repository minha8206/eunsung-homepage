/* ===== 모바일 풀스크린 메뉴 (전 페이지 공통) =====

   v1 은 헤더 아래로 떨어지는 드롭다운 패널(.nav-mobile-panel)이었다.
   v2(2026-09)는 순백 풀스크린 오버레이 — 명조 큰 글씨 + 01~05 번호 + 금색 영문 소제목.
   v3(2026-11, 현재)는 같은 오버레이를 "2단 배열"로 다시 그렸다:
   - 글꼴은 Pretendard 하나, 글자 크기는 17px 하나(로고 워드마크만 예외).
     위계는 굵기(600/500)와 회색 농도로만 준다.
   - 금색·번호·영문 소제목(MENU/MATERIALS/CONSULTATION)·순차 등장 애니메이션을 없앴다.
     색은 메인 리디자인 토큰(잉크 #16202A · 레이크 블루 #2C6E96 · 미스트 #F0F5F8)만 쓴다.
     블루는 "지금 보고 있는 페이지" 표시 한 곳에만 쓴다.
   - 왼쪽 단 = 메뉴, 오른쪽 단 = 소재. 그 아래 상담 박스(전화 2 · 카카오톡), 맨 아래 검색·로그인·KO/EN.

   구조 원칙:
   - 오버레이는 JS 가 body 끝에 직접 만든다. <x-dc> 가 관리하는 서브트리
     밖이라 프레임워크의 비동기 마운트/재렌더에 절대 휩쓸리지 않는다
     (inquiry-widget.js 와 같은 검증된 패턴). 페이지 안의 구형
     .nav-mobile-panel 마크업은 CSS 가 항상 숨긴다.
   - v3 부터 스타일도 이 파일이 <style id="esMnavCss"> 로 직접 넣는다(클래스 접두사 .mnv).
     /assets/* 는 1년 immutable 캐시라 JS 와 site.css 가 서로 다른 세대로 섞일 수 있는데,
     한 파일에 묶어 두면 "새 마크업 + 옛 CSS" 로 깨질 일이 없다.
     site.css(mobile.css)에 남아 있는 .mnav-* 규칙은 옛 mobile-nav.js 를 캐시에 들고 있는
     방문자(특히 ?v= 를 못 붙이는 보호 파일 showroom.html · product-detail.html)를 위한 것이니
     그 두 페이지의 참조를 바꾸기 전에는 지우지 말 것.
   - Pretendard 는 index/contact 만 <head> 에서 읽는다. 다른 페이지에서는 이 파일이
     같은 jsDelivr 주소를 한 번 붙인다(이미 있으면 건너뜀).
   - 버거 버튼은 헤더(x-dc 안)에 있으므로 노드를 붙잡지 않고 document
     위임으로 처리한다. 열림 상태는 body.nav-open 클래스 하나다.
   - 검색/로그인은 헤더 아이콘(.nav-ic)을 모바일에서 숨기는 대신 메뉴
     항목으로 넣었다. 두 기능 모두 document 위임으로 열리므로, 숨겨진
     아이콘에 합성 click 을 보내면 그대로 동작한다.
   - KO/EN 토글은 기존 .lang 마크업을 재사용한다 — i18n.js 의 위임 클릭과
     paintToggle(.lang b) 이 오버레이 안의 복제본에도 자동 적용된다.
     b 안에 <button class="lang-btn"> 을 두어 키보드로도 누를 수 있다.
     모양은 아래 .mnv-lang 규칙이 헤더용 알약 토글을 덮어 글자만 남긴다.
   - 새 라벨(메뉴 · 대표전화 · 휴대전화)의 영문은 js/i18n-en.js 에 있다. */
(function () {
  var OPEN = 'nav-open';
  var KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';
  var TEL_NUM = '031-544-7272';
  var MOBILE_NUM = '010-5430-2580';

  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  var PRIMARY = [
    { href: 'about.html', label: '회사소개' },
    { href: 'facility.html', label: '시공 과정' },
    { href: 'portfolio.html', label: '시공사례' },
    { href: 'store.html', label: '스토어' },
    { href: 'contact.html', label: '문의' }
  ];
  var MATERIALS = [
    { href: 'showroom.html?cat=PORCELAIN', label: '포세린' },
    { href: 'showroom.html?cat=VIATERA', label: '엔지니어드 스톤' },
    { href: 'showroom.html?cat=HIMACS', label: '인조대리석' },
    { href: 'bmc.html', label: 'BMC' }
  ];

  function isOpen() { return document.body.classList.contains(OPEN); }
  function burgers() { return document.querySelectorAll('.nav-burger'); }

  /* ---------- 현재 페이지 표시 ---------- */
  function isCurrent(href) {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var base = href.split('?')[0].toLowerCase();
    if (base !== here) return false;
    var q = href.indexOf('?') >= 0 ? href.slice(href.indexOf('?')) : '';
    if (!q) return true;
    return location.search.indexOf(q.slice(1)) >= 0;
  }

  /* ---------- 스타일 ---------- */
  var PRETENDARD_CSS = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

  var CSS = [
    '.mnv{--ink:#16202A;--sub:#7A848D;--line:#E7EAED;--blue:#2C6E96;--mist:#F0F5F8;',
      'position:fixed;inset:0;z-index:9500;display:flex;flex-direction:column;overflow:hidden;',
      'background:#fff;color:var(--ink);',
      "font:500 17px/1 'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,system-ui,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif;",
      'letter-spacing:-.01em;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;text-size-adjust:100%;',
      'visibility:hidden;opacity:0;transition:opacity .2s ease,visibility 0s linear .2s}',
    'body.nav-open .mnv{visibility:visible;opacity:1;transition:opacity .2s ease}',
    '.mnv *{box-sizing:border-box}',
    '.mnv a,.mnv button{color:inherit;text-decoration:none;font:inherit;letter-spacing:inherit;',
      'background:none;border:0;border-radius:0;padding:0;margin:0;cursor:pointer;min-height:0;',
      '-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}',
    '.mnv a:focus-visible,.mnv button:focus-visible{outline:2px solid var(--blue);outline-offset:2px;border-radius:4px}',

    /* 머리 — 로고 + 닫기 */
    '.mnv-head{flex:none;display:flex;align-items:center;justify-content:space-between;',
      'height:calc(56px + env(safe-area-inset-top,0px));padding:env(safe-area-inset-top,0px) 10px 0 24px;',
      'border-bottom:1px solid var(--line)}',
    '.mnv-brand{display:flex;align-items:center;gap:7px;min-height:44px}',
    ".mnv-brand-en{font:600 20px/1 'Cormorant Garamond',serif;letter-spacing:.14em}",
    '.mnv-brand-kr{font-size:12px;color:var(--sub)}',
    '.mnv-close{width:44px;height:44px;display:grid;place-items:center}',
    '.mnv-close svg{width:22px;height:22px;stroke-width:1.6}',

    /* 본문 */
    '.mnv-body{flex:1 1 auto;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;',
      'display:flex;flex-direction:column;padding:22px 24px calc(20px + env(safe-area-inset-bottom,0px))}',
    '.mnv-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:20px}',
    '.mnv-cap{display:flex;align-items:flex-start;height:40px;margin-bottom:8px;',
      'color:var(--sub);border-bottom:1px solid var(--line)}',
    '.mnv-list{display:flex;flex-direction:column}',
    '.mnv-list a{display:flex;align-items:center;min-height:50px;font-weight:600;line-height:1.25;word-break:keep-all}',
    '.mnv-list a.is-current{color:var(--blue)}',
    '.mnv-list a:active,.mnv-util:active{opacity:.55}',

    /* 상담 박스 */
    '.mnv-card{margin-top:26px;padding:8px 18px 18px;border-radius:14px;background:var(--mist)}',
    '.mnv-tel{display:flex;align-items:center;justify-content:space-between;gap:12px;height:50px}',
    '.mnv-tel + .mnv-tel{border-top:1px solid #DFE6EB}',
    '.mnv-tel-k{color:var(--sub)}',
    '.mnv-tel-v{font-variant-numeric:tabular-nums;letter-spacing:0;white-space:nowrap}',
    '.mnv a.mnv-kakao{display:flex;align-items:center;justify-content:center;height:52px;margin-top:8px;',
      'border-radius:10px;background:var(--ink);color:#fff;font-weight:600}',
    '.mnv a.mnv-kakao:active{opacity:.85}',

    /* 유틸 — 검색 · 로그인 · KO/EN */
    '.mnv-utils{display:flex;align-items:center;gap:24px;margin-top:auto;padding-top:22px;color:var(--sub)}',
    '.mnv .mnv-util{display:inline-flex;align-items:center;min-height:44px}',
    /* 헤더용 .lang(알약 토글) 규칙을 덮어 글자만 남긴다.
       paintToggle 이 b 에 심는 inline opacity 는 !important 로 무시하고 색·굵기로 표시한다. */
    '.mnv .mnv-lang{display:inline-flex;align-items:center;gap:0;margin:0 0 0 auto;padding:0;height:auto;',
      'background:none;border-radius:0;font:inherit;letter-spacing:.01em;text-transform:none;color:var(--sub)}',
    '.mnv .mnv-lang::before{content:none}',
    '.mnv .mnv-lang b{position:relative;display:inline-flex;align-items:center;min-width:0;min-height:44px;',
      'font-weight:500;opacity:1 !important;color:var(--sub)}',
    '.mnv .mnv-lang b + b{margin-left:9px;padding-left:9px}',
    ".mnv .mnv-lang b + b::before{content:'';position:absolute;left:0;top:50%;width:1px;height:14px;margin-top:-7px;background:#D5DBE0}",
    ':root:not([lang="en"]) .mnv .mnv-lang b:nth-of-type(1),',
    ':root[lang="en"] .mnv .mnv-lang b:nth-of-type(2){color:var(--ink);font-weight:600}',
    '.mnv .mnv-lang .lang-btn{position:relative;display:inline-flex;align-items:center;width:auto;min-width:0;',
      'height:44px;padding:0 2px;border-radius:4px;font:inherit;color:inherit;line-height:1}',
    '.mnv .mnv-lang .lang-btn::after{content:none}',

    /* 아주 좁은 화면(폴드 커버 등) — 크기는 그대로 두고 여백만 줄인다 */
    '@media (max-width:359px){.mnv-head{padding-left:18px}.mnv-body{padding-left:18px;padding-right:18px}',
      '.mnv-grid{column-gap:14px}.mnv-card{padding-left:14px;padding-right:14px}.mnv-utils{gap:18px}}',
    '@media (prefers-reduced-motion:reduce){.mnv,body.nav-open .mnv{transition:none}}'
  ].join('');

  function injectAssets() {
    if (!document.getElementById('esMnavCss')) {
      var st = document.createElement('style');
      st.id = 'esMnavCss';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    /* Pretendard — 페이지가 이미 읽고 있으면(index · contact) 건너뛴다 */
    if (!document.querySelector('link[href*="pretendard"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.crossOrigin = 'anonymous';
      l.href = PRETENDARD_CSS;
      document.head.appendChild(l);
    }
  }

  /* ---------- 오버레이 생성 ---------- */
  function linksHtml(items) {
    var out = '';
    for (var i = 0; i < items.length; i++) {
      out += '<a' + (isCurrent(items[i].href) ? ' class="is-current" aria-current="page"' : '') +
        ' href="' + items[i].href + '">' + items[i].label + '</a>';
    }
    return out;
  }

  function telHtml(label, num) {
    return '<a class="mnv-tel" href="tel:' + num + '">' +
      '<span class="mnv-tel-k">' + label + '</span><span class="mnv-tel-v">' + num + '</span></a>';
  }

  function build() {
    if (document.getElementById('esMnav')) return document.getElementById('esMnav');
    injectAssets();

    var html = '';

    html += '<div class="mnv-head">' +
      '<a class="mnv-brand" href="index.html"><span class="mnv-brand-en">EUNSUNG</span><span class="mnv-brand-kr">은성</span></a>' +
      '<button type="button" class="mnv-close" aria-label="메뉴 닫기">' + ICON_CLOSE + '</button>' +
      '</div>';

    html += '<div class="mnv-body">';

    html += '<div class="mnv-grid">' +
      '<div><div class="mnv-cap">메뉴</div><nav class="mnv-list" aria-label="메뉴">' + linksHtml(PRIMARY) + '</nav></div>' +
      '<div><div class="mnv-cap">소재</div><nav class="mnv-list" aria-label="소재">' + linksHtml(MATERIALS) + '</nav></div>' +
      '</div>';

    html += '<div class="mnv-card">' +
      telHtml('대표전화', TEL_NUM) +
      telHtml('휴대전화', MOBILE_NUM) +
      '<a class="mnv-kakao" href="' + KAKAO_URL + '" target="_blank" rel="noopener noreferrer">카카오톡 상담</a>' +
      '</div>';

    html += '<div class="mnv-utils">' +
      '<button type="button" class="mnv-util" data-mnav="search">검색</button>' +
      '<button type="button" class="mnv-util" data-mnav="login">로그인</button>' +
      '<span class="lang mnv-lang" role="group" aria-label="언어 선택">' +
        '<b><button type="button" class="lang-btn" lang="ko" aria-label="한국어">KO</button></b>' +
        '<b><button type="button" class="lang-btn" lang="en" aria-label="English">EN</button></b>' +
      '</span>' +
      '</div>';

    html += '</div>';

    var root = document.createElement('div');
    root.className = 'mnv';
    root.id = 'esMnav';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', '메뉴');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = html;
    document.body.appendChild(root);
    return root;
  }

  /* ---------- 헤더의 숨은 아이콘에 합성 클릭 ----------
     search-overlay.js / login-modal.js 는 document 위임으로 .nav-ic 를
     svg path 모양으로 식별한다. display:none 이어도 프로그램 click 이벤트는
     버블링되므로 그대로 열린다. */
  function clickHeaderIcon(kind) {
    var sel = kind === 'search' ? '.nav-ic path[d^="m21 21"]' : '.nav-ic path[d^="M4 21"]';
    var path = document.querySelector(sel);
    var ic = path;
    while (ic && ic !== document.body && !(ic.classList && ic.classList.contains('nav-ic'))) ic = ic.parentNode;
    if (ic && ic.classList && ic.classList.contains('nav-ic')) ic.click();
  }

  /* ---------- 상태 동기화 ---------- */
  function sync() {
    var open = isOpen();
    var menu = document.getElementById('esMnav');
    /* 열려 있는 동안 뒤 페이지가 스크롤되지 않게 한다.
       position:fixed 를 쓰지 않으므로 스크롤 위치는 그대로 보존된다. */
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
    if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    Array.prototype.forEach.call(burgers(), function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
  }

  function setOpen(v) {
    document.body.classList.toggle(OPEN, !!v);
    sync();
    if (v) {
      var c = document.querySelector('#esMnav .mnv-close');
      if (c) c.focus({ preventScroll: true });
    }
  }

  function close() { if (isOpen()) setOpen(false); }

  /* ---------- 초기화 ---------- */
  function init() {
    build();

    /* 버거 탭 — click 하나로 충분하다. touchstart 까지 같이 걸면 iOS 에서
       한 번의 탭이 두 번 토글돼 열리자마자 닫힌다. */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t.closest) return;

      var burger = t.closest('.nav-burger');
      if (burger) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!isOpen());
        return;
      }

      if (!isOpen()) return;

      if (t.closest('.mnv-close')) { close(); return; }

      /* 검색/로그인 — 메뉴를 닫고 해당 오버레이를 연다 */
      var util = t.closest('.mnv-util');
      if (util) {
        var kind = util.getAttribute('data-mnav');
        close();
        setTimeout(function () { clickHeaderIcon(kind); }, 60);
        return;
      }

      /* 메뉴 링크를 누르면 닫는다 (같은 페이지 앵커 이동에서도 남지 않게).
         KO/EN 토글(.lang b)은 메뉴를 유지한다. */
      if (t.closest('.mnv a')) { close(); return; }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    /* 데스크톱 폭으로 넓어지면 상태를 정리한다 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1279 && isOpen()) close();
    });

    /* x-dc 가 헤더를 다시 그려도 버거의 aria 속성이 유지되도록 재적용한다.
       오버레이 자체는 x-dc 밖이라 다시 만들 필요가 없다. */
    if (window.MutationObserver) {
      var pending = null;
      new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () { pending = null; sync(); }, 80);
      }).observe(document.body, { childList: true, subtree: true });
    }

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
