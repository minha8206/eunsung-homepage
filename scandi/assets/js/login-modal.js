/* ===== LOGIN / SIGNUP MODAL (common across all pages) =====
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
  var ICON_USER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="m9.5 16.5 1.8 1.8 3.2-3.4"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /* Brand marks are inlined rather than hot-linked to svgrepo.com (as the
     21st.dev reference does) so the modal has no external asset dependency. */
  var ICON_GOOGLE = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>';
  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';

  var PENDING_LOGIN = '로그인 기능은 준비 중입니다. 문의는 카카오톡 또는 031-544-7272로 부탁드립니다.';
  var PENDING_SIGNUP = '회원가입 기능은 준비 중입니다. 문의는 카카오톡 또는 031-544-7272로 부탁드립니다.';

  var COPY = {
    login:  { title: '로그인',   sub: '은성 회원 서비스를 이용하시려면 로그인해 주세요.' },
    signup: { title: '회원가입', sub: '은성 회원으로 가입하고 서비스를 이용해 보세요.' }
  };

  var overlay = null;
  var lastTrigger = null;

  /* Google + Kakao only. Rendered into both panels; `mode` keeps the
     notice wording ("로그인" vs "가입") correct per panel. */
  function socialRow(mode) {
    var verb = mode === 'signup' ? '가입' : '로그인';
    return '<div class="lm-social">' +
      '<button type="button" data-social="구글" data-mode="' + mode + '" aria-label="구글로 ' + verb + '">' + ICON_GOOGLE + '</button>' +
      '<button type="button" class="lm-kakao" data-social="카카오톡" data-mode="' + mode + '" aria-label="카카오톡으로 ' + verb + '">' + ICON_KAKAO + '</button>' +
    '</div>';
  }

  function field(icon, attrs) {
    return '<div class="lm-field"><span class="lm-field-ic">' + icon + '</span>' +
           '<input class="lm-input" ' + attrs + '></div>';
  }

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
        '<h2 class="lm-title" id="lmTitle">' + COPY.login.title + '</h2>' +
        '<p class="lm-sub" id="lmSub">' + COPY.login.sub + '</p>' +

        '<div class="lm-tabs" role="tablist">' +
          '<button type="button" class="lm-tab is-active" id="lmTabLogin" role="tab" aria-selected="true" aria-controls="lmPanelLogin" data-tab="login">로그인</button>' +
          '<button type="button" class="lm-tab" id="lmTabSignup" role="tab" aria-selected="false" aria-controls="lmPanelSignup" data-tab="signup">회원가입</button>' +
        '</div>' +

        /* ---------- 로그인 패널 ---------- */
        '<div class="lm-panel is-active" id="lmPanelLogin" role="tabpanel" aria-labelledby="lmTabLogin">' +
          '<form class="lm-fields" id="lmForm" novalidate>' +
            field(ICON_MAIL, 'id="lmEmail" type="email" name="email" placeholder="이메일" autocomplete="email" aria-label="이메일"') +
            field(ICON_LOCK, 'id="lmPassword" type="password" name="password" placeholder="비밀번호" autocomplete="current-password" aria-label="비밀번호"') +
            '<div class="lm-notice" id="lmNotice" role="status" aria-live="polite"></div>' +
            '<div class="lm-forgot-row">' +
              '<button type="button" class="lm-forgot" id="lmForgot">비밀번호를 잊으셨나요?</button>' +
            '</div>' +
            '<button type="submit" class="lm-submit" id="lmSubmit">로그인</button>' +
          '</form>' +
          '<div class="lm-divider"><span>또는 간편 로그인</span></div>' +
          socialRow('login') +
        '</div>' +

        /* ---------- 회원가입 패널 ---------- */
        '<div class="lm-panel" id="lmPanelSignup" role="tabpanel" aria-labelledby="lmTabSignup">' +
          '<form class="lm-fields" id="lmFormSignup" novalidate>' +
            field(ICON_USER, 'id="lmSuName" type="text" name="name" placeholder="이름" autocomplete="name" aria-label="이름"') +
            field(ICON_MAIL, 'id="lmSuEmail" type="email" name="email" placeholder="이메일" autocomplete="email" aria-label="이메일"') +
            field(ICON_LOCK, 'id="lmSuPassword" type="password" name="password" placeholder="비밀번호" autocomplete="new-password" aria-label="비밀번호"') +
            field(ICON_CHECK, 'id="lmSuConfirm" type="password" name="passwordConfirm" placeholder="비밀번호 확인" autocomplete="new-password" aria-label="비밀번호 확인"') +
            '<div class="lm-hint" id="lmSuHint" aria-live="polite"></div>' +
            '<div class="lm-notice" id="lmNoticeSignup" role="status" aria-live="polite"></div>' +
            '<button type="submit" class="lm-submit" id="lmSubmitSignup">회원가입</button>' +
          '</form>' +
          '<div class="lm-divider"><span>또는 간편 가입</span></div>' +
          socialRow('signup') +
          '<p class="lm-swap">이미 계정이 있으신가요?' +
            '<button type="button" id="lmSwapToLogin">로그인</button>' +
          '</p>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    return overlay;
  }

  /* ---------- notices ---------- */
  function noticeEl(mode) {
    return document.getElementById(mode === 'signup' ? 'lmNoticeSignup' : 'lmNotice');
  }

  function notice(mode, msg, kind) {
    var el = noticeEl(mode);
    if (!el) return;
    el.textContent = msg;
    el.className = 'lm-notice is-shown ' + (kind === 'error' ? 'is-error' : 'is-info');
  }

  function clearNotices() {
    ['login', 'signup'].forEach(function (m) {
      var el = noticeEl(m);
      if (el) { el.textContent = ''; el.className = 'lm-notice'; }
    });
    var hint = document.getElementById('lmSuHint');
    if (hint) { hint.textContent = ''; hint.className = 'lm-hint'; }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  /* ---------- tabs ---------- */
  function setTab(mode, focusFirst) {
    var isSignup = mode === 'signup';
    document.getElementById('lmTabLogin').classList.toggle('is-active', !isSignup);
    document.getElementById('lmTabSignup').classList.toggle('is-active', isSignup);
    document.getElementById('lmTabLogin').setAttribute('aria-selected', String(!isSignup));
    document.getElementById('lmTabSignup').setAttribute('aria-selected', String(isSignup));
    document.getElementById('lmPanelLogin').classList.toggle('is-active', !isSignup);
    document.getElementById('lmPanelSignup').classList.toggle('is-active', isSignup);
    document.getElementById('lmTitle').textContent = COPY[mode].title;
    document.getElementById('lmSub').textContent = COPY[mode].sub;
    clearNotices();
    if (focusFirst === false) return;
    var first = document.getElementById(isSignup ? 'lmSuName' : 'lmEmail');
    if (first) setTimeout(function () { first.focus(); }, 40);
  }

  /* ---------- 비밀번호 확인 일치 안내 ---------- */
  function syncConfirmHint() {
    var pw = document.getElementById('lmSuPassword').value;
    var cf = document.getElementById('lmSuConfirm').value;
    var hint = document.getElementById('lmSuHint');
    if (!cf) { hint.textContent = ''; hint.className = 'lm-hint'; return true; }
    if (pw === cf) {
      hint.textContent = '비밀번호가 일치합니다.';
      hint.className = 'lm-hint is-shown is-good';
      return true;
    }
    hint.textContent = '비밀번호가 일치하지 않습니다.';
    hint.className = 'lm-hint is-shown is-bad';
    return false;
  }

  function setOpen(open) {
    overlay.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      var input = document.getElementById('lmEmail');
      if (input) setTimeout(function () { input.focus(); }, 60);
    } else {
      clearNotices();
      setTab('login', false);
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

    Array.prototype.forEach.call(overlay.querySelectorAll('.lm-tab'), function (tab) {
      tab.addEventListener('click', function () { setTab(tab.getAttribute('data-tab')); });
    });

    document.getElementById('lmSwapToLogin').addEventListener('click', function () {
      setTab('login');
    });

    /* ---------- 로그인 제출 ---------- */
    document.getElementById('lmForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('lmEmail').value.trim();
      var password = document.getElementById('lmPassword').value;

      if (!email || !password) {
        notice('login', '이메일과 비밀번호를 모두 입력해 주세요.', 'error');
        return;
      }
      if (!validEmail(email)) {
        notice('login', '올바른 이메일 주소를 입력해 주세요.', 'error');
        return;
      }
      notice('login', PENDING_LOGIN, 'info');
    });

    document.getElementById('lmForgot').addEventListener('click', function () {
      notice('login', '비밀번호 찾기는 준비 중입니다. 031-544-7272로 문의해 주세요.', 'info');
    });

    /* ---------- 회원가입 제출 ---------- */
    document.getElementById('lmSuPassword').addEventListener('input', syncConfirmHint);
    document.getElementById('lmSuConfirm').addEventListener('input', syncConfirmHint);

    document.getElementById('lmFormSignup').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('lmSuName').value.trim();
      var email = document.getElementById('lmSuEmail').value.trim();
      var password = document.getElementById('lmSuPassword').value;
      var confirm = document.getElementById('lmSuConfirm').value;

      if (!name || !email || !password || !confirm) {
        notice('signup', '모든 항목을 입력해 주세요.', 'error');
        return;
      }
      if (!validEmail(email)) {
        notice('signup', '올바른 이메일 주소를 입력해 주세요.', 'error');
        return;
      }
      if (password !== confirm) {
        syncConfirmHint();
        notice('signup', '비밀번호가 일치하지 않습니다.', 'error');
        return;
      }
      notice('signup', PENDING_SIGNUP, 'info');
    });

    /* ---------- 소셜 (구글 / 카카오톡) ---------- */
    Array.prototype.forEach.call(overlay.querySelectorAll('[data-social]'), function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode');
        var verb = mode === 'signup' ? '간편 가입' : '간편 로그인';
        notice(mode, btn.getAttribute('data-social') + ' ' + verb + '은 준비 중입니다.', 'info');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
