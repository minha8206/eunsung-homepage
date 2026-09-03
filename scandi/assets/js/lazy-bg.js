/* ===== 배경 이미지 지연 로드 (첫 화면 밖 background-image 용) =====

   <div data-bg="images/foo.webp" style="…"> 처럼 URL 을 data-bg 에만 두면, 뷰포트 반 화면
   앞(rootMargin 50%)에 들어올 때 style.backgroundImage 로 올려 그때 받는다.
   <img loading="lazy"> 와 같은 효과를 CSS 배경 이미지에 주는 것 — 첫 화면(LCP) 이미지가
   아래 사진들과 대역폭을 나눠 쓰지 않게 하려는 것이다.

   이 사이트 본문은 <x-dc> 안에서 프레임워크가 비동기로 그리므로, 한 번 훑고 끝내면
   안 되고 MutationObserver 로 새로 생긴 [data-bg] 도 계속 주워야 한다(reveal.js 와 같은 장치).
   IntersectionObserver 가 없는 구형 브라우저는 그냥 즉시 전부 올린다. */
(function () {
  var ATTR = 'data-bg';
  var DONE = 'data-bg-done';
  var io = null;

  function apply(el) {
    var url = el.getAttribute(ATTR);
    if (!url || el.hasAttribute(DONE)) return;
    el.style.backgroundImage = "url('" + url.replace(/'/g, "%27") + "')";
    el.setAttribute(DONE, '');
    if (io) io.unobserve(el);
  }

  function watch(el) {
    if (el.hasAttribute(DONE)) return;
    if (!io) { apply(el); return; }
    io.observe(el);
  }

  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.hasAttribute && root.hasAttribute(ATTR)) watch(root);
    var list = root.querySelectorAll ? root.querySelectorAll('[' + ATTR + ']') : [];
    for (var i = 0; i < list.length; i++) watch(list[i]);
  }

  function init() {
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) apply(e.target); });
      }, { rootMargin: '50% 0px' });
    }
    scan(document.body);
    if ('MutationObserver' in window) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) scan(added[j]);
        }
      }).observe(document.body, { childList: true, subtree: true });
    } else {
      setInterval(function () { scan(document.body); }, 1000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
