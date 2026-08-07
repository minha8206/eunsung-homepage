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
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICON_BUILDING = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M16 9h3a2 2 0 0 1 2 2v10"/><path d="M9 7h3M9 11h3M9 15h3"/></svg>';

  /* Brand marks are inlined rather than hot-linked to svgrepo.com (as the
     21st.dev reference does) so the modal has no external asset dependency. */
  var ICON_GOOGLE = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>';
  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';

  /* Daum 우편번호 서비스. Loaded on the first 주소 검색 click rather than from
     every page's <head>, so pages that never open the modal pay nothing and
     the 7 HTML files stay untouched. */
  var DAUM_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

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

        '<div class="lm-head">' +
          '<div class="lm-badge">' + ICON_LOGIN + '</div>' +
          '<h2 class="lm-title" id="lmTitle">' + COPY.login.title + '</h2>' +
          '<p class="lm-sub" id="lmSub">' + COPY.login.sub + '</p>' +
          '<div class="lm-tabs" role="tablist">' +
            '<button type="button" class="lm-tab is-active" id="lmTabLogin" role="tab" aria-selected="true" aria-controls="lmPanelLogin" data-tab="login">로그인</button>' +
            '<button type="button" class="lm-tab" id="lmTabSignup" role="tab" aria-selected="false" aria-controls="lmPanelSignup" data-tab="signup">회원가입</button>' +
          '</div>' +
        '</div>' +

        '<div class="lm-body" id="lmBody">' +

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
            field(ICON_PHONE, 'id="lmSuPhone" type="tel" name="phone" placeholder="010-0000-0000" inputmode="numeric" autocomplete="tel" maxlength="13" aria-label="연락처"') +
            field(ICON_MAIL, 'id="lmSuEmail" type="email" name="email" placeholder="이메일" autocomplete="email" aria-label="이메일"') +
            field(ICON_LOCK, 'id="lmSuPassword" type="password" name="password" placeholder="비밀번호" autocomplete="new-password" aria-label="비밀번호"') +
            field(ICON_CHECK, 'id="lmSuConfirm" type="password" name="passwordConfirm" placeholder="비밀번호 확인" autocomplete="new-password" aria-label="비밀번호 확인"') +
            '<div class="lm-hint" id="lmSuHint" aria-live="polite"></div>' +
            '<div class="lm-field-row">' +
              field(ICON_PIN, 'id="lmSuAddr" type="text" name="address" placeholder="주소" autocomplete="street-address" aria-label="주소" readonly') +
              '<button type="button" class="lm-addr-btn" id="lmAddrSearch">주소 검색</button>' +
            '</div>' +
            '<input type="hidden" id="lmSuZip" name="zonecode">' +
            field(ICON_BUILDING, 'id="lmSuAddrDetail" type="text" name="addressDetail" placeholder="상세주소 (동/호수 등)" autocomplete="address-line2" aria-label="상세주소"') +
            '<div class="lm-group-label">가입 유형</div>' +
            '<div class="lm-seg" role="radiogroup" aria-label="가입 유형">' +
              '<label class="lm-seg-opt"><input type="radio" name="lmJoinType" value="일반 고객" checked><span>일반 고객</span></label>' +
              '<label class="lm-seg-opt"><input type="radio" name="lmJoinType" value="인테리어·시공 업체"><span>인테리어·시공 업체</span></label>' +
            '</div>' +
            '<div class="lm-notice" id="lmNoticeSignup" role="status" aria-live="polite"></div>' +
            '<button type="submit" class="lm-submit" id="lmSubmitSignup">회원가입</button>' +
          '</form>' +
          '<div class="lm-divider"><span>또는 간편 가입</span></div>' +
          socialRow('signup') +
          '<p class="lm-swap">이미 계정이 있으신가요?' +
            '<button type="button" id="lmSwapToLogin">로그인</button>' +
          '</p>' +
        '</div>' +

        '</div>' + /* /.lm-body */

        /* ---------- 다음 우편번호 embed layer ---------- */
        '<div class="lm-daum" id="lmDaum">' +
          '<div class="lm-daum-bar">' +
            '<strong>주소 검색</strong>' +
            '<button type="button" class="lm-daum-close" id="lmDaumClose" aria-label="주소 검색 닫기">' + ICON_CLOSE + '</button>' +
          '</div>' +
          '<div class="lm-daum-box" id="lmDaumBox"></div>' +
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

  /* ---------- 연락처: 입력 중 하이픈 자동 삽입 ---------- */
  function formatPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.indexOf('02') === 0) {              /* 서울 지역번호는 2자리 */
      if (d.length < 3) return d;
      if (d.length < 6) return d.slice(0, 2) + '-' + d.slice(2);
      if (d.length < 10) return d.slice(0, 2) + '-' + d.slice(2, 5) + '-' + d.slice(5);
      return d.slice(0, 2) + '-' + d.slice(2, 6) + '-' + d.slice(6, 10);
    }
    if (d.length < 4) return d;
    if (d.length < 8) return d.slice(0, 3) + '-' + d.slice(3);
    if (d.length < 11) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
    return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
  }

  function validPhone(v) {
    return /^\d{2,3}-\d{3,4}-\d{4}$/.test(v);
  }

  /* ---------- 다음 우편번호 ---------- */
  function loadDaum(onReady, onFail) {
    if (window.daum && window.daum.Postcode) { onReady(); return; }
    var s = document.getElementById('lmDaumScript');
    if (!s) {
      s = document.createElement('script');
      s.id = 'lmDaumScript';
      s.src = DAUM_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { onReady(); }, { once: true });
    s.addEventListener('error', function () {
      s.parentNode && s.parentNode.removeChild(s);
      onFail();
    }, { once: true });
  }

  function closeAddressSearch() {
    var layer = document.getElementById('lmDaum');
    if (!layer) return;
    layer.classList.remove('is-shown');
    document.getElementById('lmDaumBox').innerHTML = '';
  }

  function openAddressSearch() {
    var btn = document.getElementById('lmAddrSearch');
    btn.disabled = true;
    notice('signup', '주소 검색을 불러오는 중입니다…', 'info');

    loadDaum(function () {
      btn.disabled = false;
      clearNotices();
      var layer = document.getElementById('lmDaum');
      var box = document.getElementById('lmDaumBox');
      box.innerHTML = '';
      layer.classList.add('is-shown');

      new window.daum.Postcode({
        oncomplete: function (data) {
          var addr = data.roadAddress || data.jibunAddress || data.address || '';
          var extra = '';
          if (data.bname && /[동|로|가]$/.test(data.bname)) extra = data.bname;
          if (data.buildingName && data.apartment === 'Y') {
            extra += (extra ? ', ' : '') + data.buildingName;
          }
          if (extra) addr += ' (' + extra + ')';

          document.getElementById('lmSuZip').value = data.zonecode || '';
          document.getElementById('lmSuAddr').value = addr;
          closeAddressSearch();
          var detail = document.getElementById('lmSuAddrDetail');
          setTimeout(function () { detail.focus(); }, 60);
        },
        onclose: function () { closeAddressSearch(); },
        width: '100%',
        height: '100%'
      }).embed(box);
    }, function () {
      btn.disabled = false;
      notice('signup', '주소 검색 서비스를 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.', 'error');
    });
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
    closeAddressSearch();
    document.getElementById('lmBody').scrollTop = 0;
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
      closeAddressSearch();
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

    /* Escape closes the address layer first, the modal second. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !overlay.classList.contains('is-open')) return;
      if (document.getElementById('lmDaum').classList.contains('is-shown')) {
        closeAddressSearch();
        return;
      }
      setOpen(false);
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

    /* ---------- 회원가입 ---------- */
    document.getElementById('lmSuPassword').addEventListener('input', syncConfirmHint);
    document.getElementById('lmSuConfirm').addEventListener('input', syncConfirmHint);

    /* 하이픈 자동 삽입. 캐럿이 끝에 있을 때만 끝으로 되돌려 놓아, 중간을
       고치는 동안 커서가 튀지 않게 한다. */
    document.getElementById('lmSuPhone').addEventListener('input', function () {
      var atEnd = this.selectionStart === this.value.length;
      var formatted = formatPhone(this.value);
      if (formatted === this.value) return;
      var caret = this.selectionStart + (formatted.length - this.value.length);
      this.value = formatted;
      if (atEnd) this.setSelectionRange(formatted.length, formatted.length);
      else this.setSelectionRange(Math.max(0, caret), Math.max(0, caret));
    });

    document.getElementById('lmAddrSearch').addEventListener('click', openAddressSearch);
    document.getElementById('lmSuAddr').addEventListener('click', openAddressSearch);
    document.getElementById('lmDaumClose').addEventListener('click', closeAddressSearch);

    document.getElementById('lmFormSignup').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('lmSuName').value.trim();
      var phone = document.getElementById('lmSuPhone').value.trim();
      var email = document.getElementById('lmSuEmail').value.trim();
      var password = document.getElementById('lmSuPassword').value;
      var confirm = document.getElementById('lmSuConfirm').value;
      var addr = document.getElementById('lmSuAddr').value.trim();

      if (!name || !phone || !email || !password || !confirm || !addr) {
        notice('signup', '상세주소를 제외한 모든 항목을 입력해 주세요.', 'error');
        return;
      }
      if (!validPhone(phone)) {
        notice('signup', '연락처를 010-0000-0000 형식으로 입력해 주세요.', 'error');
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
