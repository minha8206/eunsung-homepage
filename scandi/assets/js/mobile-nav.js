/* ===== 모바일 헤더 메뉴 보조 (전 페이지 공통) =====
   패널 자체는 CSS 체크박스 토글로 이미 동작한다. 여기서는 체크박스만으로는
   안 되는 것들을 붙인다 — 열림 시 배경 스크롤 잠금, ESC·바깥 탭으로 닫기,
   메뉴 항목을 누르면 닫기.

   헤더는 x-dc 관리 영역이라 노드를 잡아두지 않고 document 위임으로 처리한다. */
(function () {
  var ID = 'nav-toggle';

  function toggle() { return document.getElementById(ID); }

  function isOpen() {
    var t = toggle();
    return !!(t && t.checked);
  }

  function close() {
    var t = toggle();
    if (t && t.checked) {
      t.checked = false;
      sync();
    }
  }

  /* 패널이 열려 있는 동안 뒤 페이지가 스크롤되지 않게 한다. */
  function sync() {
    var open = isOpen();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('nav-open', open);
  }

  function init() {
    /* 체크박스 상태 변화 감지 (라벨 클릭 포함) */
    document.addEventListener('change', function (e) {
      if (e.target && e.target.id === ID) sync();
    });

    /* 메뉴 항목을 누르면 닫는다 — 같은 페이지 앵커 이동에서도 패널이 남지 않게 */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.nav-mobile-panel a') : null;
      if (a) { close(); return; }

      if (!isOpen()) return;
      /* 바깥 탭 — 패널과 버거 버튼 밖을 눌렀을 때만 */
      var inPanel = e.target.closest ? e.target.closest('.nav-mobile-panel') : null;
      var onBurger = e.target.closest ? e.target.closest('.nav-burger') : null;
      if (!inPanel && !onBurger) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    /* 데스크톱 폭으로 넓어지면 패널 상태를 정리한다 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && isOpen()) close();
    });

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
