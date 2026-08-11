/* ===== 스크롤 등장 애니메이션 (전 페이지 공통) =====

   .reveal 요소를 IntersectionObserver 로 보다가, 뷰포트에 들어오면 is-revealed 를
   붙이고 관찰을 끊는다(최초 1회만).

   시차(stagger)는 그룹 단위다. 가장 가까운 [data-reveal-group] 조상을 그룹으로 보고,
   그 안에서 몇 번째 .reveal 인지에 따라 80ms 씩 밀어 준다. 그룹 지정이 없으면
   부모 요소를 그룹으로 쓴다. 한 그룹의 시차 합이 너무 길어지지 않게 상한을 둔다.

   이 사이트 본문 상당수는 <x-dc> 안에서 프레임워크가 비동기로 다시 그린다. 그래서
   한 번 훑고 끝내면 안 되고, MutationObserver 로 새로 생긴 .reveal 도 계속 주워야 한다.
   (js/i18n.js 가 같은 이유로 같은 장치를 쓴다.) */
(function () {
  var STEP_MS = 80;      /* 요소 간 시차 */
  var MAX_STEPS = 6;     /* 시차 상한 — 카드가 많아도 마지막이 너무 늦지 않게 */
  var DISTANCE_GUARD = 'reveal-ready';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;
  var pending = null;

  function groupOf(el) {
    var g = el.closest ? el.closest('[data-reveal-group]') : null;
    return g || el.parentElement || document.body;
  }

  function indexInGroup(el) {
    var group = groupOf(el);
    var items = group.querySelectorAll('.reveal');
    for (var i = 0; i < items.length; i++) {
      if (items[i] === el) return Math.min(i, MAX_STEPS);
    }
    return 0;
  }

  function show(el) {
    el.style.setProperty('--reveal-d', (indexInGroup(el) * STEP_MS) + 'ms');
    el.classList.add('is-revealed');
    /* 전환이 끝나면 will-change 를 놓는다 */
    var done = function () {
      el.classList.add('is-settled');
      el.removeEventListener('transitionend', done);
    };
    el.addEventListener('transitionend', done);
    setTimeout(done, 1600);   /* transitionend 가 안 오는 경우의 안전망 */
  }

  /* 이미 화면 안에 있는지 — 재렌더로 새 노드가 들어왔을 때 관찰 콜백을 기다리지 않고
     바로 드러내기 위한 판정. 기다리면 그 한두 프레임 동안 내용이 비어 보인다. */
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false;
    return r.top < (window.innerHeight || 0) && r.bottom > 0;
  }

  function observe(root) {
    var list = (root || document).querySelectorAll('.reveal:not(.is-revealed)');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.__revealBound) continue;
      el.__revealBound = true;
      if (reduced || !io || inViewport(el)) { show(el); continue; }
      io.observe(el);
    }
  }

  function init() {
    document.documentElement.classList.add(DISTANCE_GUARD);

    if (!reduced && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          io.unobserve(entry.target);      /* 최초 1회 — 되감지 않는다 */
        });
      }, {
        /* 요소가 화면 아래 12% 지점까지 올라오면 시작 — 너무 이르지도 늦지도 않게 */
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.01,
      });
    }

    observe(document);

    /* x-dc 재렌더 / 나중에 만들어지는 UI 를 계속 주워 담는다 */
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () { pending = null; observe(document); }, 80);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
