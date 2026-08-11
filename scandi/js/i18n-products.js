/* ===== 제품 데이터 -> EN 사전 연결 (쇼룸 / 제품 상세 전용) =====

   제품명·컬렉션명은 JSON 에서 렌더되므로 i18n-en.js 의 정적 사전만으로는
   EN 모드에서 한국어가 그대로 남는다. 그렇다고 컴포넌트 렌더 코드에 언어
   분기를 넣으면 토글 때마다 재렌더를 강제해야 한다.

   대신 JSON 이 이미 들고 있는 en / collectionEn 값을 런타임에 사전으로
   합쳐 넣는다. 그러면 기존 텍스트 치환 엔진이 알아서 바꿔 준다 —
   데이터의 출처는 JSON 한 곳으로 유지되고, 렌더 코드는 건드리지 않는다.

   이 파일은 카탈로그를 쓰는 페이지(showroom, product-detail)에만 넣는다. */
(function () {
  var FILES = [
    'data/products-terracanto.json',
    'data/products-viatera.json',
    'data/products-himacs.json',
    'data/products-bmc.json',
  ];

  function merge(list) {
    var dict = window.I18N_EN || (window.I18N_EN = {});
    var added = 0;
    list.forEach(function (p) {
      if (!p) return;
      /* 이미 있는 키는 덮지 않는다 — 정적 사전이 문맥을 더 잘 아는 경우가 있다 */
      if (p.name && p.en && dict[p.name] === undefined) { dict[p.name] = p.en; added++; }
      if (p.collection && p.collectionEn && dict[p.collection] === undefined) {
        dict[p.collection] = p.collectionEn; added++;
      }
    });
    return added;
  }

  function init() {
    if (!window.fetch) return;
    Promise.all(FILES.map(function (f) {
      return fetch(f).then(function (r) { return r.json(); })['catch'](function () { return []; });
    })).then(function (sets) {
      var all = [];
      sets.forEach(function (s) { if (s && s.length) all = all.concat(s); });
      if (!merge(all)) return;
      /* 사전이 늘었으니 지금 EN 모드라면 다시 훑어 준다 */
      if (window.EunsungI18n && window.EunsungI18n.refresh) window.EunsungI18n.refresh();
    })['catch'](function () { /* 사전이 안 붙어도 한국어로는 정상 동작한다 */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
