/* ===== 모바일 풀스크린 메뉴 (전 페이지 공통) =====

   v1 은 헤더 아래로 떨어지는 드롭다운 패널(.nav-mobile-panel)이었다.
   v2(현재)는 크림 배경의 풀스크린 오버레이로 바꿨다 — 럭셔리 브랜드
   모바일 관례(미니멀 헤더 + 전체 화면 메뉴)를 따른다.

   구조 원칙:
   - 오버레이는 JS 가 body 끝에 직접 만든다. <x-dc> 가 관리하는 서브트리
     밖이라 프레임워크의 비동기 마운트/재렌더에 절대 휩쓸리지 않는다
     (inquiry-widget.js 와 같은 검증된 패턴). 페이지 안의 구형
     .nav-mobile-panel 마크업은 CSS 가 항상 숨긴다.
   - 버거 버튼은 헤더(x-dc 안)에 있으므로 노드를 붙잡지 않고 document
     위임으로 처리한다. 열림 상태는 body.nav-open 클래스 하나다.
   - 검색/로그인은 헤더 아이콘(.nav-ic)을 모바일에서 숨기는 대신 메뉴
     항목으로 넣었다. 두 기능 모두 document 위임으로 열리므로, 숨겨진
     아이콘에 합성 click 을 보내면 그대로 동작한다.
   - KO/EN 토글은 기존 .lang 마크업을 재사용한다 — i18n.js 의 위임 클릭과
     paintToggle(.lang b) 이 오버레이 안의 복제본에도 자동 적용된다. */
(function () {
  var OPEN = 'nav-open';
  var KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';
  var TEL_NUM = '031-544-7272';
  var MOBILE_NUM = '010-5430-2580';

  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var PRIMARY = [
    { href: 'about.html', label: '회사소개' },
    { href: 'facility.html', label: '시공 과정' },
    { href: 'portfolio.html', label: '시공사례' },
    { href: 'contact.html', label: '문의' }
  ];
  var MATERIALS = [
    { href: 'showroom.html?cat=PORCELAIN', label: '포세린' },
    { href: 'showroom.html?cat=VIATERA', label: '엔지니어드 스톤' },
    { href: 'showroom.html?cat=HIMACS', label: '인조대리석' },
    { href: 'showroom.html?cat=BMC', label: 'BMC' }
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

  /* ---------- 오버레이 생성 ---------- */
  function linkHtml(item, cls, idx, delay) {
    return '<a class="' + cls + (isCurrent(item.href) ? ' is-current' : '') +
      '" href="' + item.href + '" style="--d:' + delay + 'ms">' +
      (idx ? '<span class="mnav-idx">' + idx + '</span>' : '') +
      '<span class="mnav-link-t">' + item.label + '</span></a>';
  }

  function build() {
    if (document.getElementById('esMnav')) return document.getElementById('esMnav');

    var d = 60;                       /* 스태거 시작 지연(ms) */
    var step = 40;                    /* 항목 간 지연 */
    var html = '';

    html += '<div class="mnav-head">' +
      '<a class="mnav-brand" href="index.html"><span class="mnav-brand-en">EUNSUNG</span><span class="mnav-brand-kr">은성</span></a>' +
      '<button type="button" class="mnav-close" aria-label="메뉴 닫기">' + ICON_CLOSE + '</button>' +
      '</div>';

    html += '<div class="mnav-body">';
    html += '<div class="mnav-eyebrow" style="--d:' + d + 'ms">MENU</div>';

    html += '<nav class="mnav-list">';
    for (var i = 0; i < PRIMARY.length; i++) {
      d += step;
      html += linkHtml(PRIMARY[i], 'mnav-link', '0' + (i + 1), d);
    }
    html += '</nav>';

    d += step;
    html += '<div class="mnav-eyebrow mnav-eyebrow--sub" style="--d:' + d + 'ms">MATERIALS · 소재</div>';
    html += '<nav class="mnav-list">';
    for (var j = 0; j < MATERIALS.length; j++) {
      d += step;
      html += linkHtml(MATERIALS[j], 'mnav-sublink', '', d);
    }
    html += '</nav>';

    d += step;
    html += '<div class="mnav-utils" style="--d:' + d + 'ms">' +
      '<button type="button" class="mnav-util" data-mnav="search">' + ICON_SEARCH + '<span>검색</span></button>' +
      '<button type="button" class="mnav-util" data-mnav="login">' + ICON_USER + '<span>로그인</span></button>' +
      '<span class="lang mnav-lang"><b>KO</b><span class="mnav-lang-sep">|</span><b>EN</b></span>' +
      '</div>';

    d += step;
    html += '<div class="mnav-contact" style="--d:' + d + 'ms">' +
      '<div class="mnav-contact-cap">CONSULTATION · 상담</div>' +
      '<div class="mnav-tels">' +
        '<a class="mnav-tel" href="tel:' + TEL_NUM + '">' + TEL_NUM + '</a>' +
        '<a class="mnav-tel mnav-tel--sub" href="tel:' + MOBILE_NUM + '">' + MOBILE_NUM + '</a>' +
      '</div>' +
      '<div><a class="mnav-kakao" href="' + KAKAO_URL + '" target="_blank" rel="noopener noreferrer">카카오톡 상담 ' + ICON_ARROW + '</a></div>' +
      '</div>';

    html += '</div>';

    var root = document.createElement('div');
    root.className = 'mnav';
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
      var c = document.querySelector('#esMnav .mnav-close');
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

      if (t.closest('.mnav-close')) { close(); return; }

      /* 검색/로그인 — 메뉴를 닫고 해당 오버레이를 연다 */
      var util = t.closest('.mnav-util');
      if (util) {
        var kind = util.getAttribute('data-mnav');
        close();
        setTimeout(function () { clickHeaderIcon(kind); }, 60);
        return;
      }

      /* 메뉴 링크를 누르면 닫는다 (같은 페이지 앵커 이동에서도 남지 않게).
         KO/EN 토글(.lang b)은 메뉴를 유지한다. */
      if (t.closest('.mnav a')) { close(); return; }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    /* 데스크톱 폭으로 넓어지면 상태를 정리한다 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && isOpen()) close();
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
