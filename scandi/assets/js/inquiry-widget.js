/* ===== FLOATING INQUIRY WIDGET (common across all pages) =====
   Appended directly to <body>, outside the x-dc-managed subtree, so it is
   never touched by that framework's async mount/re-render (same reasoning
   as the video-hero markup living outside <x-dc> in index.html). */
(function () {
  var KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';
  var TEL_URL = 'tel:0315447272';

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  function build() {
    var root = document.createElement('div');
    root.className = 'iw-root';
    root.id = 'iwRoot';
    root.innerHTML =
      '<button type="button" class="iw-option iw-option--kakao" id="iwKakao" aria-label="카카오톡 문의">' + ICON_KAKAO + '<span>카카오톡 문의</span></button>' +
      '<button type="button" class="iw-option iw-option--tel" id="iwTel" aria-label="전화 문의 031-544-7272">' + ICON_TEL + '<span>전화 문의 031-544-7272</span></button>' +
      '<button type="button" class="iw-main" id="iwMain" aria-haspopup="true" aria-expanded="false" aria-label="문의하기">' +
        '<span class="iw-main-icon"><svg class="iw-icon-chat" viewBox="0 0 24 24"></svg><svg class="iw-icon-close" viewBox="0 0 24 24"></svg></span>' +
      '</button>';

    // fill the two icon placeholders inside the main button with the actual markup
    // (kept as separate nodes so both can cross-fade via CSS opacity/transform)
    var chatIcon = root.querySelector('.iw-icon-chat');
    var closeIcon = root.querySelector('.iw-icon-close');
    chatIcon.outerHTML = ICON_CHAT.replace('<svg ', '<svg class="iw-icon-chat" ');
    closeIcon.outerHTML = ICON_CLOSE.replace('<svg ', '<svg class="iw-icon-close" ');

    document.body.appendChild(root);
    return root;
  }

  function init() {
    if (document.getElementById('iwRoot')) return;
    var root = build();
    var mainBtn = document.getElementById('iwMain');
    var kakaoBtn = document.getElementById('iwKakao');
    var telBtn = document.getElementById('iwTel');

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      mainBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    mainBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!root.classList.contains('is-open'));
    });

    kakaoBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.open(KAKAO_URL, '_blank', 'noopener');
      setOpen(false);
    });

    telBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.location.href = TEL_URL;
      setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
