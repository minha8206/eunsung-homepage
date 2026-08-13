/* ===== SEARCH OVERLAY (common across all pages) =====
   헤더 .nav-right 의 돋보기 아이콘으로 열린다.

   로그인 모달과 같은 두 가지 전제를 따른다.
   1. 오버레이는 <body> 직속으로 append — x-dc 의 비동기 재렌더가 건드리지 못한다.
   2. 헤더 아이콘은 x-dc 관리 영역이라 직접 바인딩하지 않고 document 위임 +
      아이콘 shape 매칭으로 잡는다. 헤더 마크업을 고칠 필요가 없다.

   제품 데이터는 쇼룸이 쓰는 data/products-*.json 을 그대로 읽는다.
   처음 오버레이를 열 때 한 번만 불러오고 이후 캐시한다. */
(function () {
  var ICON_SEARCH = '<svg class="so-bar-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_PAGE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>';

  /* 쇼룸과 동일한 소스. catalog-data.js 는 ES 모듈이라 여기서 import 하지 않고
     같은 JSON 을 직접 읽는다 — 결합을 늘리지 않기 위해서다. */
  var SOURCES = [
    { file: 'data/products-terracanto.json', cat: 'PORCELAIN', ko: '포세린' },
    { file: 'data/products-viatera.json',    cat: 'VIATERA',   ko: '비아테라' },
    { file: 'data/products-himacs.json',     cat: 'HIMACS',    ko: '하이막스' },
    { file: 'data/products-bmc.json',        cat: 'BMC',       ko: 'BMC' }
  ];

  var PAGES = [
    { name: '회사소개', url: 'about.html',                     desc: '2009년 설립부터 지금까지, 은성이 걸어온 길' },
    { name: '시공 과정', url: 'facility.html',                 desc: '실측부터 현장 시공까지, 은성이 직접 관리하는 10단계' },
    { name: '포세린',   url: 'showroom.html?cat=PORCELAIN',    desc: '1200°C 고온에서 구워낸 대형 포세린 슬랩' },
    { name: '엔지니어드 스톤', url: 'showroom.html?cat=VIATERA', desc: '비아테라 — 석영 90% 이상의 프리미엄 스톤' },
    { name: '인조대리석', url: 'showroom.html?cat=HIMACS',      desc: '하이막스 — 이음새 없는 100% 아크릴 솔리드 서페이스' },
    { name: 'BMC',      url: 'showroom.html?cat=BMC',          desc: '자체 생산하는 열경화성 성형 컴파운드' },
    { name: '시공사례', url: 'portfolio.html',                 desc: '주방·욕실·상업공간 시공 레퍼런스' },
    { name: '문의',     url: 'contact.html',                   desc: '견적·시공·자재 문의와 쇼룸 방문 예약' }
  ];

  var MAX_PRODUCTS = 8;

  var overlay = null, input = null, body = null;
  var products = null;      /* 로딩 완료 시 배열 */
  var loading = false;
  var lastTrigger = null;
  var activeIndex = -1;

  /* 공백·하이픈을 지우고 소문자로 — "ES-001", "es 001", "es001" 이 모두 걸린다 */
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[\s\-_·]/g, '');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'so-overlay';
    overlay.id = 'soOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '검색');
    overlay.innerHTML =
      '<div class="so-panel" id="soPanel">' +
        '<div class="so-bar">' +
          ICON_SEARCH +
          '<input class="so-input" id="soInput" type="text" autocomplete="off" spellcheck="false" ' +
            'placeholder="제품명 · 컬러명 · 코드 또는 페이지를 검색하세요" aria-label="검색어">' +
          '<button type="button" class="so-close" id="soClose" aria-label="검색 닫기">' + ICON_CLOSE + '</button>' +
        '</div>' +
        '<div class="so-body" id="soBody"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    input = document.getElementById('soInput');
    body = document.getElementById('soBody');
  }

  /* ---------- 데이터 ---------- */
  function loadProducts() {
    if (products || loading) return;
    loading = true;
    var acc = [];
    var done = 0;

    SOURCES.forEach(function (src) {
      fetch(src.file)
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (list) {
          (list || []).forEach(function (it) {
            acc.push({
              name: it.name,
              code: it.code,
              collection: it.collection,
              image: it.image,
              cat: src.cat,
              catKo: src.ko,
              hay: norm(it.name) + ' ' + norm(it.code) + ' ' + norm(it.collection) + ' ' + norm(src.ko) + ' ' + norm(src.cat)
            });
          });
        })
        ['catch'](function () { /* 한 파일이 실패해도 나머지로 검색은 된다 */ })
        .then(function () {
          done++;
          if (done === SOURCES.length) {
            products = acc;
            loading = false;
            render(input ? input.value : '');
          }
        });
    });
  }

  /* ---------- 렌더 ---------- */
  function render(q) {
    var term = norm(q);
    if (!term) {
      body.innerHTML = '<div class="so-hint">제품명이나 컬러 코드를 입력해 보세요.<br>' +
        '예) 칼라카타, 오로라 블랑, M617, 비아테라</div>';
      activeIndex = -1;
      return;
    }

    var pageHits = PAGES.filter(function (p) {
      return (norm(p.name) + ' ' + norm(p.desc)).indexOf(term) >= 0;
    });

    var prodHits = products
      ? products.filter(function (p) { return p.hay.indexOf(term) >= 0; })
      : [];

    if (!products && loading) {
      body.innerHTML = '<div class="so-hint">제품 데이터를 불러오는 중입니다…</div>';
      return;
    }

    if (!pageHits.length && !prodHits.length) {
      body.innerHTML =
        '<div class="so-empty">' +
          '<div class="so-empty-t">검색 결과가 없습니다.</div>' +
          '<div class="so-empty-s">찾으시는 소재나 컬러가 있으시면 문의해 주세요.<br>재고와 대체 컬러를 안내드립니다.</div>' +
          '<a class="so-empty-btn" href="contact.html">문의하기</a>' +
        '</div>';
      activeIndex = -1;
      return;
    }

    var html = '';

    if (prodHits.length) {
      html += '<div class="so-sec">제품 · ' + prodHits.length + '건</div>';
      prodHits.slice(0, MAX_PRODUCTS).forEach(function (p) {
        var meta = p.catKo + (p.collection ? ' · ' + p.collection : '') + (p.code ? ' · ' + p.code : '');
        html += '<a class="so-item" href="product-detail.html?code=' + encodeURIComponent(p.code) + '">' +
          (p.image
            ? '<img class="so-thumb" src="' + esc(p.image) + '" alt="" loading="lazy">'
            : '<span class="so-ic">' + ICON_PAGE + '</span>') +
          '<span class="so-txt">' +
            '<span class="so-name">' + esc(p.name) + '</span>' +
            '<span class="so-meta">' + esc(meta) + '</span>' +
          '</span>' +
        '</a>';
      });
      /* 잘라낸 건수는 숨기지 않고 밝힌다 */
      if (prodHits.length > MAX_PRODUCTS) {
        html += '<a class="so-more" href="showroom.html?cat=' + prodHits[0].cat + '">' +
          '나머지 ' + (prodHits.length - MAX_PRODUCTS) + '건은 쇼룸에서 보기 →</a>';
      }
    }

    if (pageHits.length) {
      html += '<div class="so-sec">페이지</div>';
      pageHits.forEach(function (p) {
        html += '<a class="so-item" href="' + p.url + '">' +
          '<span class="so-ic">' + ICON_PAGE + '</span>' +
          '<span class="so-txt">' +
            '<span class="so-name">' + esc(p.name) + '</span>' +
            '<span class="so-meta">' + esc(p.desc) + '</span>' +
          '</span>' +
        '</a>';
      });
    }

    body.innerHTML = html;
    body.scrollTop = 0;
    activeIndex = -1;

    /* 원격 썸네일이 깨지면 자리만 비워 둔다 */
    Array.prototype.forEach.call(body.querySelectorAll('.so-thumb'), function (img) {
      img.addEventListener('error', function () { img.classList.add('is-broken'); });
    });
  }

  /* ---------- 키보드 이동 ---------- */
  function items() { return body.querySelectorAll('.so-item'); }

  function moveActive(delta) {
    var list = items();
    if (!list.length) return;
    activeIndex = (activeIndex + delta + list.length) % list.length;
    Array.prototype.forEach.call(list, function (el, i) {
      el.classList.toggle('is-active', i === activeIndex);
    });
    list[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function setOpen(open) {
    overlay.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      loadProducts();
      render(input.value);
      setTimeout(function () { input.focus(); input.select(); }, 60);
    } else {
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
      lastTrigger = null;
    }
  }

  /* 헤더 돋보기: .nav-ic 안에 검색 아이콘 path 를 가진 것. 두 가지 마크업
     변형(self-closing / 닫는 태그)을 모두 커버한다. */
  function findTrigger(target) {
    var ic = target.closest ? target.closest('.nav-ic') : null;
    if (!ic) return null;
    return ic.querySelector('path[d^="m21 21"]') ? ic : null;
  }

  function init() {
    if (document.getElementById('soOverlay')) return;
    build();

    var panel = document.getElementById('soPanel');

    document.addEventListener('click', function (e) {
      var trigger = findTrigger(e.target);
      if (!trigger) return;
      e.preventDefault();
      lastTrigger = trigger;
      setOpen(true);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var trigger = findTrigger(e.target);
      if (!trigger) return;
      e.preventDefault();
      lastTrigger = trigger;
      setOpen(true);
    });

    document.getElementById('soClose').addEventListener('click', function () { setOpen(false); });

    overlay.addEventListener('click', function (e) {
      if (!panel.contains(e.target)) setOpen(false);
    });

    input.addEventListener('input', function () { render(input.value); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); return; }
      if (e.key === 'Enter') {
        var list = items();
        if (activeIndex >= 0 && list[activeIndex]) { e.preventDefault(); list[activeIndex].click(); }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
