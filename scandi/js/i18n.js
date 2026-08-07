/* ===== KO / EN 언어 전환 엔진 (전 페이지 공통) =====

   설계 원칙 — 한국어 버전은 손대지 않는다.
   기존 마크업에 data-i18n 속성을 심는 대신, 사전을 "한국어 원문 -> 영문"으로
   두고 런타임에 텍스트 노드를 치환한다. 그래서 KO 상태의 HTML/CSS/레이아웃은
   바이트 단위로 그대로다. 필요할 때는 data-i18n 속성으로 개별 지정도 가능하다
   (같은 한국어가 문맥에 따라 다르게 번역돼야 하는 경우).

   이 방식이어야 하는 실질적 이유가 하나 더 있다. 이 사이트의 본문 대부분은
   <x-dc> 안에서 프레임워크가 비동기로 다시 그린다. 어떤 방식이든 재렌더 후
   다시 적용해야 하므로, 아래 MutationObserver 가 필수다. 로그인 모달/검색
   오버레이처럼 JS 가 나중에 만드는 UI 도 같은 경로로 자동 처리된다.

   사전은 js/i18n-en.js 에서 window.I18N_EN 으로 주입한다.
   값이 HIDE 면 EN 모드에서 그 요소를 숨긴다 — 이미 한/영이 병기된 곳에서
   영문이 두 번 나오지 않게 하기 위한 장치다. */
(function () {
  var STORE_KEY = 'eunsung-lang';
  var HIDE = '__HIDE__';

  var dict = window.I18N_EN || {};
  var lang = 'ko';
  var original = new WeakMap();   /* 노드 -> 한국어 원문 */
  var applying = false;
  var pending = null;

  /* ---------- 저장소 (차단돼 있으면 조용히 KO 로) ---------- */
  function readLang() {
    try {
      var v = window.localStorage.getItem(STORE_KEY);
      return v === 'en' ? 'en' : 'ko';
    } catch (e) { return 'ko'; }
  }
  function writeLang(v) {
    try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* 무시 */ }
  }

  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }

  /* ---------- 텍스트 노드 ---------- */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 0 };

  function translateTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        return norm(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      var current = node.nodeValue;
      var key = original.has(node) ? original.get(node) : current;
      var hit = dict[norm(key)];

      if (lang === 'en') {
        if (hit === undefined) return;
        if (!original.has(node)) original.set(node, current);
        if (hit === HIDE) { hideHost(node); return; }
        /* 원문의 앞뒤 공백을 유지해 인라인 배치가 흐트러지지 않게 한다 */
        var lead = (current.match(/^\s*/) || [''])[0];
        var tail = (current.match(/\s*$/) || [''])[0];
        if (node.nodeValue !== lead + hit + tail) node.nodeValue = lead + hit + tail;
      } else if (original.has(node)) {
        node.nodeValue = original.get(node);
        original['delete'](node);
      }
    });
  }

  function hideHost(node) {
    var el = node.parentElement;
    /* hasAttribute 로 봐야 한다. 백업값이 빈 문자열(인라인 display 없음)인 경우가
       흔한데, 값의 truthiness 로 판단하면 두 번째 패스에서 이미 적용된 'none' 을
       백업으로 덮어써 KO 로 되돌릴 때 요소가 계속 숨겨진 채 남는다. */
    if (!el || el.hasAttribute('data-i18n-hid')) return;
    el.setAttribute('data-i18n-hid', el.style.display || '');
    el.style.display = 'none';
  }

  function unhideAll(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-i18n-hid]'), function (el) {
      el.style.display = el.getAttribute('data-i18n-hid');
      el.removeAttribute('data-i18n-hid');
    });
  }

  /* ---------- 속성 (placeholder / alt / aria-label / title) ---------- */
  var ATTRS = ['placeholder', 'alt', 'aria-label', 'title'];

  function translateAttrs(root) {
    ATTRS.forEach(function (attr) {
      var sel = '[' + attr + ']';
      var list = root.querySelectorAll ? root.querySelectorAll(sel) : [];
      Array.prototype.forEach.call(list, function (el) {
        var bak = 'data-i18n-' + attr;
        var key = el.hasAttribute(bak) ? el.getAttribute(bak) : el.getAttribute(attr);
        var hit = dict[norm(key)];
        if (lang === 'en') {
          if (hit === undefined || hit === HIDE) return;
          if (!el.hasAttribute(bak)) el.setAttribute(bak, el.getAttribute(attr));
          el.setAttribute(attr, hit);
        } else if (el.hasAttribute(bak)) {
          el.setAttribute(attr, el.getAttribute(bak));
          el.removeAttribute(bak);
        }
      });
    });
  }

  /* ---------- 토글 표시 ---------- */
  function paintToggle() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang'), function (box) {
      var bs = box.querySelectorAll('b');
      if (bs.length < 2) return;
      /* 마크업 순서는 EN | KO */
      bs[0].style.opacity = lang === 'en' ? '1' : '.5';
      bs[1].style.opacity = lang === 'ko' ? '1' : '.5';
      bs[0].style.cursor = 'pointer';
      bs[1].style.cursor = 'pointer';
    });
  }

  /* ---------- 적용 ---------- */
  function apply() {
    if (applying) return;
    applying = true;
    try {
      if (lang === 'ko') unhideAll(document.body);
      translateTextNodes(document.body);
      translateAttrs(document.body);
      paintToggle();
      document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'ko');
    } finally {
      applying = false;
    }
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'ko') next = 'ko';
    if (next === lang) return;
    lang = next;
    writeLang(lang);
    apply();
  }

  /* ---------- 초기화 ---------- */
  function init() {
    dict = window.I18N_EN || {};
    lang = readLang();

    /* 헤더 토글 — 헤더가 x-dc 안이라 위임으로 잡는다 */
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.lang b') : null;
      if (!b) return;
      e.preventDefault();
      setLang(norm(b.textContent).toLowerCase() === 'en' ? 'en' : 'ko');
    });

    apply();

    /* x-dc 재렌더 / 모달·오버레이 생성 후 다시 적용 */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (applying || pending) return;
        pending = setTimeout(function () { pending = null; apply(); }, 60);
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  window.EunsungI18n = {
    set: setLang,
    get: function () { return lang; },
    refresh: apply
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
