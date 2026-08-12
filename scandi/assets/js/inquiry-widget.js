/* ===== 플로팅 상담 버튼 (전 페이지 공통) =====
   body 끝에 직접 붙인다 — x-dc 가 관리하는 서브트리 밖이라 프레임워크의 비동기
   마운트/재렌더에 휩쓸리지 않는다 (index.html 의 비디오 히어로 마크업이 <x-dc>
   바깥에 있는 것과 같은 이유). */
(function () {
  var KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';
  var TEL_URL = 'tel:031-544-7272';
  var TIP_KEY = 'eunsung-iw-tip';      /* 세션당 1회만 보여주기 위한 표식 */
  var TIP_DELAY = 3000;                /* 로드 후 3초 */
  var TIP_LIFE = 5000;                 /* 5초 뒤 자동으로 사라짐 */

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  var ICON_QUOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function item(cls, href, target, label, icon) {
    return '<a class="iw-item iw-item--' + cls + '" href="' + href + '"' +
      (target ? ' target="_blank" rel="noopener noreferrer"' : '') +
      ' aria-label="' + label + '">' +
      '<span class="iw-label">' + label + '</span>' +
      '<span class="iw-btn iw-btn--' + cls + '">' + icon + '</span>' +
      '</a>';
  }

  /* 문의 섹션이 있는 페이지면 그 앵커로, 없으면 문의 페이지로 보낸다 */
  function quoteHref() {
    return document.getElementById('inquiry') ? '#inquiry' : 'contact.html';
  }

  function build() {
    var root = document.createElement('div');
    root.className = 'iw-root';
    root.id = 'iwRoot';
    root.innerHTML =
      '<div class="iw-tip" id="iwTip" role="status">' +
        '<span>궁금한 점은 편하게 물어보세요</span>' +
        '<button type="button" class="iw-tip-close" id="iwTipClose" aria-label="안내 닫기">' + ICON_X + '</button>' +
      '</div>' +
      item('kakao', KAKAO_URL, true, '카카오톡 상담', ICON_KAKAO) +
      item('tel', TEL_URL, false, '전화 문의', ICON_TEL) +
      item('quote', quoteHref(), false, '견적 문의', ICON_QUOTE) +
      '<button type="button" class="iw-main" id="iwMain" aria-haspopup="true" aria-expanded="false" aria-label="문의하기">' +
        '<span class="iw-main-icon">' +
          ICON_CHAT.replace('<svg ', '<svg class="iw-icon-chat" ') +
          ICON_CLOSE.replace('<svg ', '<svg class="iw-icon-close" ') +
        '</span>' +
      '</button>';
    document.body.appendChild(root);
    return root;
  }

  /* ── 모바일 하단 고정 CTA 바 ──
     ≤768px 에서는 플로팅 위젯 대신 엄지 거리의 고정 바(전화·카톡)를 쓴다.
     표시/숨김 전환은 전부 CSS 미디어쿼리가 한다(inquiry-widget.css).
     위젯과 같은 이유로 body 끝에 직접 붙는다 — x-dc 재렌더 영역 밖. */
  function buildCtaBar() {
    if (document.getElementById('esCtabar')) return;
    var bar = document.createElement('div');
    bar.className = 'es-ctabar';
    bar.id = 'esCtabar';
    bar.innerHTML =
      '<a class="es-ctabar-tel" href="' + TEL_URL + '">' + ICON_TEL + '<span>전화하기</span></a>' +
      '<a class="es-ctabar-kakao" href="' + KAKAO_URL + '" target="_blank" rel="noopener noreferrer">' + ICON_KAKAO + '<span>카카오톡 상담</span></a>';
    document.body.appendChild(bar);
  }

  function init() {
    if (document.getElementById('iwRoot')) return;

    buildCtaBar();
    var root = build();
    var mainBtn = document.getElementById('iwMain');
    var tip = document.getElementById('iwTip');
    var tipClose = document.getElementById('iwTipClose');
    var quoteLink = root.querySelector('.iw-item--quote');
    var tipTimer = null;

    function hideTip() {
      if (!tip) return;
      tip.classList.remove('is-on');
      clearTimeout(tipTimer);
    }

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      mainBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) hideTip();
    }

    mainBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!root.classList.contains('is-open'));
    });

    /* 항목을 고르면 메뉴는 닫는다. 링크 자체 동작(새 탭/전화/앵커)은 그대로 둔다. */
    Array.prototype.forEach.call(root.querySelectorAll('.iw-item'), function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    /* 견적 문의 — 같은 페이지에 문의 섹션이 있으면 부드럽게 스크롤 */
    if (quoteLink) {
      quoteLink.addEventListener('click', function (e) {
        var target = document.getElementById('inquiry');
        if (!target) return;                       /* 다른 페이지로 이동 */
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); hideTip(); }
    });

    if (tipClose) {
      tipClose.addEventListener('click', function (e) {
        e.stopPropagation();
        hideTip();
      });
    }

    /* 안내 말풍선 — 세션당 1회 */
    var shown;
    try { shown = window.sessionStorage.getItem(TIP_KEY); } catch (err) { shown = '1'; }
    if (!shown && tip) {
      setTimeout(function () {
        if (root.classList.contains('is-open')) return;   /* 이미 열어 봤으면 굳이 */
        tip.classList.add('is-on');
        try { window.sessionStorage.setItem(TIP_KEY, '1'); } catch (err) { /* 무시 */ }
        tipTimer = setTimeout(hideTip, TIP_LIFE);
      }, TIP_DELAY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
