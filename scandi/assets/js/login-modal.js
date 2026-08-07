/* ===== LOGIN MODAL (common across all pages) =====
   Opened by the person icon in the header's .nav-right cluster.

   Two deliberate choices, both mirroring assets/js/inquiry-widget.js:
   1. The modal is appended directly to <body>, outside the x-dc-managed
      subtree, so that framework's async mount/re-render never touches it.
   2. The header icon lives INSIDE that subtree, so we never bind a listener
      to it directly — we delegate from document and match the icon by shape.
      A re-render therefore cannot break the trigger.

   UI only: no auth backend is wired up. Submitting (and every social /
   forgot-password button) validates and then shows an inline "준비 중" notice.
   An inline notice is used instead of alert() so the page is never blocked by
   a native modal dialog. */
(function () {
  var ICON_LOGIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>';
  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /* Brand marks are inlined rather than hot-linked to svgrepo.com (as the
     21st.dev reference does) so the modal has no external asset dependency. */
  var ICON_GOOGLE = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>';
  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';
  var ICON_FACEBOOK = '<svg viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>';
  var ICON_APPLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.54c-.03-2.85 2.33-4.22 2.43-4.29-1.32-1.94-3.38-2.2-4.11-2.23-1.75-.18-3.42 1.03-4.3 1.03-.89 0-2.25-1.01-3.7-.98-1.9.03-3.66 1.11-4.64 2.81-1.98 3.44-.51 8.52 1.42 11.31.94 1.37 2.06 2.9 3.53 2.85 1.42-.06 1.96-.92 3.68-.92 1.71 0 2.2.92 3.7.89 1.53-.03 2.5-1.39 3.43-2.77 1.08-1.59 1.53-3.13 1.56-3.21-.03-.02-2.99-1.15-3.02-4.55zM14.23 3.9c.78-.95 1.31-2.27 1.17-3.58-1.13.05-2.49.75-3.3 1.69-.72.84-1.35 2.18-1.18 3.47 1.26.1 2.54-.64 3.31-1.58z"/></svg>';

  var PENDING_MSG = '로그인 기능은 준비 중입니다. 문의는 카카오톡 또는 031-544-7272로 부탁드립니다.';

  var overlay = null;
  var lastTrigger = null;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'lm-overlay';
    overlay.id = 'lmOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'lmTitle');
    overlay.innerHTML =
      '<div class="lm-card" id="lmCard">' +
        '<button type="button" class="lm-close" id="lmClose" aria-label="닫기">' + ICON_CLOSE + '</button>' +
        '<div class="lm-badge">' + ICON_LOGIN + '</div>' +
        '<h2 class="lm-title" id="lmTitle">로그인</h2>' +
        '<p class="lm-sub">은성 회원 서비스를 이용하시려면 로그인해 주세요.</p>' +
        '<form class="lm-fields" id="lmForm" novalidate>' +
          '<div class="lm-field">' +
            '<span class="lm-field-ic">' + ICON_MAIL + '</span>' +
            '<input class="lm-input" id="lmEmail" type="email" name="email" placeholder="이메일" autocomplete="email" aria-label="이메일">' +
          '</div>' +
          '<div class="lm-field">' +
            '<span class="lm-field-ic">' + ICON_LOCK + '</span>' +
            '<input class="lm-input" id="lmPassword" type="password" name="password" placeholder="비밀번호" autocomplete="current-password" aria-label="비밀번호">' +
          '</div>' +
          '<div class="lm-notice" id="lmNotice" role="status" aria-live="polite"></div>' +
          '<div class="lm-forgot-row">' +
            '<button type="button" class="lm-forgot" id="lmForgot">비밀번호를 잊으셨나요?</button>' +
          '</div>' +
          '<button type="submit" class="lm-submit" id="lmSubmit">로그인</button>' +
        '</form>' +
        '<div class="lm-divider"><span>또는 간편 로그인</span></div>' +
        '<div class="lm-social">' +
          '<button type="button" data-social="구글" aria-label="구글로 로그인">' + ICON_GOOGLE + '</button>' +
          '<button type="button" class="lm-kakao" data-social="카카오톡" aria-label="카카오톡으로 로그인">' + ICON_KAKAO + '</button>' +
          '<button type="button" data-social="페이스북" aria-label="페이스북으로 로그인">' + ICON_FACEBOOK + '</button>' +
          '<button type="button" class="lm-apple" data-social="애플" aria-label="애플로 로그인">' + ICON_APPLE + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    return overlay;
  }

  function notice(msg, kind) {
    var el = document.getElementById('lmNotice');
    if (!el) return;
    el.textContent = msg;
    el.className = 'lm-notice is-shown ' + (kind === 'error' ? 'is-error' : 'is-info');
  }

  function clearNotice() {
    var el = document.getElementById('lmNotice');
    if (el) { el.textContent = ''; el.className = 'lm-notice'; }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setOpen(open) {
    overlay.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      var input = document.getElementById('lmEmail');
      if (input) setTimeout(function () { input.focus(); }, 60);
    } else {
      clearNotice();
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
      lastTrigger = null;
    }
  }

  /* The header person icon: a .nav-ic whose svg carries the shoulders path.
     Matched by shape so both markup variants in the repo are covered — the
     self-closing <path .../> form and the <path ...></path> form. */
  function findTrigger(target) {
    var ic = target.closest ? target.closest('.nav-ic') : null;
    if (!ic) return null;
    var path = ic.querySelector('path[d^="M4 21c0-4"]');
    return path ? ic : null;
  }

  function init() {
    if (document.getElementById('lmOverlay')) return;
    build();

    var card = document.getElementById('lmCard');
    var form = document.getElementById('lmForm');

    /* Delegated: survives any x-dc re-render of the header. */
    document.addEventListener('click', function (e) {
      var trigger = findTrigger(e.target);
      if (!trigger) return;
      e.preventDefault();
      lastTrigger = trigger;
      setOpen(true);
    });

    /* Keyboard access for the icon, which is a <span> in the source markup. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var trigger = findTrigger(e.target);
      if (!trigger) return;
      e.preventDefault();
      lastTrigger = trigger;
      setOpen(true);
    });

    document.getElementById('lmClose').addEventListener('click', function () {
      setOpen(false);
    });

    overlay.addEventListener('click', function (e) {
      if (!card.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) setOpen(false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('lmEmail').value.trim();
      var password = document.getElementById('lmPassword').value;

      if (!email || !password) {
        notice('이메일과 비밀번호를 모두 입력해 주세요.', 'error');
        return;
      }
      if (!validEmail(email)) {
        notice('올바른 이메일 주소를 입력해 주세요.', 'error');
        return;
      }
      notice(PENDING_MSG, 'info');
    });

    document.getElementById('lmForgot').addEventListener('click', function () {
      notice('비밀번호 찾기는 준비 중입니다. 031-544-7272로 문의해 주세요.', 'info');
    });

    Array.prototype.forEach.call(overlay.querySelectorAll('[data-social]'), function (btn) {
      btn.addEventListener('click', function () {
        notice(btn.getAttribute('data-social') + ' 간편 로그인은 준비 중입니다.', 'info');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
