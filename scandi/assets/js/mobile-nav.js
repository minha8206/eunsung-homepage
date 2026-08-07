/* ===== 모바일 헤더 메뉴 (전 페이지 공통) =====

   원래는 <label for> + 숨은 체크박스 + CSS :checked 로 열고 닫았다.
   그런데 iOS 카카오톡 인앱 브라우저에서 label 탭이 체크박스를 토글하지 못해
   메뉴가 열리지 않았다. 인앱 웹뷰에서 드물지 않은 문제라, label/체크박스
   의존을 걷어내고 실제 <button> + JS 토글로 바꿨다.

   상태는 body.nav-open 클래스 하나로 표현하고 CSS 가 그것만 본다.
   헤더는 x-dc 관리 영역이라 노드를 붙잡지 않고 document 위임으로 처리한다. */
(function () {
  var OPEN = 'nav-open';

  function isOpen() { return document.body.classList.contains(OPEN); }

  function panels() { return document.querySelectorAll('.nav-mobile-panel'); }
  function burgers() { return document.querySelectorAll('.nav-burger'); }

  function sync() {
    var open = isOpen();
    /* 열려 있는 동안 뒤 페이지가 스크롤되지 않게 한다.
       position:fixed 를 쓰지 않으므로 스크롤 위치는 그대로 보존된다. */
    document.documentElement.style.overflow = open ? 'hidden' : '';
    Array.prototype.forEach.call(burgers(), function (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    Array.prototype.forEach.call(panels(), function (p) {
      p.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  }

  function setOpen(v) {
    document.body.classList.toggle(OPEN, !!v);
    sync();
  }

  function close() { if (isOpen()) setOpen(false); }

  function init() {
    /* 버거 탭 — click 하나로 충분하다. touchstart 까지 같이 걸면 iOS 에서
       한 번의 탭이 두 번 토글돼 열리자마자 닫힌다. */
    document.addEventListener('click', function (e) {
      var burger = e.target.closest ? e.target.closest('.nav-burger') : null;
      if (burger) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!isOpen());
        return;
      }

      if (!isOpen()) return;

      /* 메뉴 항목을 누르면 닫는다 (같은 페이지 앵커 이동에서도 남지 않게) */
      if (e.target.closest && e.target.closest('.nav-mobile-panel a')) { close(); return; }

      /* 바깥 탭 */
      if (!(e.target.closest && e.target.closest('.nav-mobile-panel'))) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    /* 데스크톱 폭으로 넓어지면 상태를 정리한다 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && isOpen()) close();
    });

    /* x-dc 가 헤더를 다시 그려도 aria 속성이 유지되도록 재적용한다.
       body 의 클래스만 상태라서 패널 자체는 CSS 가 알아서 따라온다. */
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
