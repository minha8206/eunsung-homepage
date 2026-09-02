/* ===== BMC 제품 카탈로그 (bmc/products.html) =====
   data/bmc-products.json 을 읽어 탭별 규격·갤러리를 그린다.
   - 탭 전환은 해시 라우팅(#round-table …). 직접 링크/새로고침 시 해당 탭이 열린다.
   - 다리 코드 칩 -> 식탁 다리 탭의 해당 카드로 스크롤 + 하이라이트.
   - 라이트박스: 좌우 이동 / ESC 닫기 / 모바일 스와이프.
   규격 문자열은 JSON 원문 그대로 출력한다(nowrap 으로 중간 끊김 방지).

   주의 — 이 사이트의 본문은 support.js(x-dc/React)가 비동기로 다시 그린다.
   렌더 직후 마운트가 일어나면 주입한 DOM 이 통째로 사라지므로,
   MutationObserver 로 #bmcCatalog 가 비어 있는 것을 감지할 때마다 다시 그리고
   (data-rendered 마커), 클릭 핸들러는 전부 document 위임으로 건다.
   한글 라벨·이름은 i18n(js/i18n.js)이 텍스트 노드 단위로 치환한다. */
(function () {
  'use strict';
  var IDS = ['round-table', 'dining-table', 'table-legs', 'sink-top', 'homebar', 'washbasin', 'sinkbowl'];
  var DATA = null;              // fetch 결과
  var GALS = {};                // 카테고리 id -> [{src,alt}] (라이트박스 목록)

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function nw(s) { return '<span class="nowrap">' + esc(s) + '</span>'; }

  /* ---------- 라이트박스 (x-dc 밖 — body 직속이라 재마운트에 안전) ---------- */
  var lb = document.createElement('div');
  lb.className = 'bmc-lb';
  lb.innerHTML =
    '<button class="bmc-lb-btn bmc-lb-prev" type="button" aria-label="이전 사진"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
    '<img alt="">' +
    '<button class="bmc-lb-btn bmc-lb-next" type="button" aria-label="다음 사진"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>' +
    '<button class="bmc-lb-btn bmc-lb-close" type="button" aria-label="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<div class="bmc-lb-count"></div>';
  var lbImg = lb.querySelector('img'), lbCount = lb.querySelector('.bmc-lb-count');
  var lbList = [], lbIdx = 0;
  function lbMount() { if (!lb.parentNode) document.body.appendChild(lb); }
  function lbShow(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIdx].src;
    lbImg.alt = lbList[lbIdx].alt;
    lbCount.textContent = (lbIdx + 1) + ' / ' + lbList.length;
  }
  function lbOpen(list, i) {
    lbMount();
    lbList = list;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbShow(i);
  }
  function lbClose() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  lb.addEventListener('click', function (e) {
    if (e.target === lb) return lbClose();
    var btn = e.target.closest('button');
    if (!btn) return;
    if (btn.classList.contains('bmc-lb-prev')) lbShow(lbIdx - 1);
    else if (btn.classList.contains('bmc-lb-next')) lbShow(lbIdx + 1);
    else if (btn.classList.contains('bmc-lb-close')) lbClose();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) lbShow(lbIdx + (dx < 0 ? 1 : -1));
    tx = null;
  }, { passive: true });

  /* ---------- HTML 조립 ---------- */
  function galleryHTML(cat) {
    var h = '<div class="bmc-gallery">';
    cat.images.forEach(function (im, i) {
      h += '<button type="button" data-lb="' + cat.id + '" data-i="' + i + '" aria-label="' + esc(cat.name) + ' 사진 ' + (i + 1) + ' 크게 보기">' +
        '<img src="../' + im.src + '" width="' + im.w + '" height="' + im.h + '" loading="lazy" alt="' + esc(cat.name) + ' 사진 ' + (i + 1) + '"></button>';
    });
    return h + '</div>';
  }
  function itemsHTML(cat) {
    if (!cat.items) return '';
    var h = '<div class="bmc-item-grid">';
    cat.items.forEach(function (it) {
      h += '<div class="bmc-item"><div class="bmc-item-name">' + esc(it.name) + '</div>';
      if (it.colors) {
        h += '<div class="bmc-item-row"><div class="bmc-item-label">컬러</div><div class="bmc-item-val">' +
          it.colors.map(nw).join(' · ') + '</div></div>';
      }
      if (it.size) {
        h += '<div class="bmc-item-row"><div class="bmc-item-label">' + (cat.id === 'sinkbowl' ? '규격 (단위 : mm)' : '상판 규격') + '</div><div class="bmc-item-val">' + nw(it.size) + '</div></div>';
      }
      if (it.legs) {
        h += '<div class="bmc-item-row"><div class="bmc-item-label">적용 가능 다리</div><div class="bmc-item-val"><div class="bmc-leg-chips">' +
          it.legs.map(function (c) {
            return '<a class="bmc-leg-chip" href="#table-legs" data-leg="' + c + '">' + c + '</a>';
          }).join('') + '</div></div></div>';
      }
      h += '</div>';
    });
    return h + '</div>';
  }
  function legsHTML(cat) {
    var h = '<div class="bmc-leg-grid">';
    cat.legs.forEach(function (lg, i) {
      var im = cat.images[i];
      h += '<div class="bmc-leg-card" id="leg-' + lg.code + '">' +
        '<img src="../' + im.src + '" width="' + im.w + '" height="' + im.h + '" loading="lazy" data-lb="table-legs" data-i="' + i + '" alt="식탁 다리 사진 ' + (i + 1) + ' — ' + lg.code + '">' +
        '<div class="bmc-leg-info"><div class="bmc-leg-code">' + lg.code + '</div>' +
        /* 색상을 자체 span 으로 — i18n 이 텍스트 노드 단위라 " · " 가 붙으면 사전 키와 어긋난다 */
        '<div class="bmc-leg-meta"><span>' + esc(lg.color) + '</span> · ' + nw(lg.size) + '</div></div></div>';
    });
    return h + '</div>';
  }
  function bodyHTML(cat) {
    if (!cat.body) return '';
    var t = esc(cat.body);
    var k = t.lastIndexOf(' ');
    if (k > 0) t = t.slice(0, k) + ' ' + t.slice(k + 1);   /* 오펀 방지 — i18n norm() 은 nbsp 를 공백 취급 */
    return '<div class="bmc-body-line">' + t + '</div>';
  }

  function render(root) {
    var h = '';
    DATA.categories.forEach(function (cat) {
      GALS[cat.id] = cat.images.map(function (im, i) {
        return { src: '../' + im.src, alt: cat.name + ' 사진 ' + (i + 1) };
      });
      h += '<section class="bmc-cat-section" id="sec-' + cat.id + '">' +
        '<h2 class="bmc-title" style="margin:0 0 30px">' + esc(cat.name) + '</h2>' +
        bodyHTML(cat) +
        (cat.id === 'table-legs' ? legsHTML(cat) : itemsHTML(cat) + galleryHTML(cat)) +
        '</section>';
    });
    root.innerHTML = h;
    root.setAttribute('data-rendered', '1');
    activate();
  }
  function ensureRendered() {
    if (!DATA) return;
    var root = document.getElementById('bmcCatalog');
    if (root && !root.getAttribute('data-rendered')) render(root);
  }

  /* ---------- 전역 위임 클릭 (재마운트에 안전) ---------- */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.bmc-leg-chip[data-leg]');
    if (chip) {
      e.preventDefault();
      var code = chip.getAttribute('data-leg');
      location.hash = 'table-legs';
      requestAnimationFrame(function () {
        var card = document.getElementById('leg-' + code);
        if (!card) return;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('is-flash');
        setTimeout(function () { card.classList.remove('is-flash'); }, 1800);
      });
      return;
    }
    var t = e.target.closest('[data-lb]');
    if (t && GALS[t.getAttribute('data-lb')]) {
      lbOpen(GALS[t.getAttribute('data-lb')], +t.getAttribute('data-i') || 0);
    }
  });

  /* ---------- 해시 라우팅 ---------- */
  function currentId() {
    var h = (location.hash || '').replace('#', '');
    return IDS.indexOf(h) >= 0 ? h : IDS[0];
  }
  function activate() {
    var id = currentId();
    document.querySelectorAll('.bmc-cat-section').forEach(function (s) {
      s.classList.toggle('is-active', s.id === 'sec-' + id);
    });
    document.querySelectorAll('.bmc-tab').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('href') === '#' + id);
    });
  }
  window.addEventListener('hashchange', activate);

  /* ---------- 데이터 로드 + 재마운트 감시 ---------- */
  fetch('../data/bmc-products.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      DATA = data;
      ensureRendered();
      /* x-dc 재마운트로 #bmcCatalog 가 새 노드로 바뀌면 다시 그린다 */
      new MutationObserver(function () { ensureRendered(); })
        .observe(document.body, { childList: true, subtree: true });
    })
    .catch(function (err) {
      var root = document.getElementById('bmcCatalog');
      if (root) root.innerHTML = '<div style="font:400 15px/1.8 \'Manrope\';color:rgba(14,36,64,.6)">제품 데이터를 불러오지 못했습니다.</div>';
      if (window.console) console.warn('bmc-catalog:', err);
    });
})();
