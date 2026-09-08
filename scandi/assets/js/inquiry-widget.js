/* ===== 플로팅 상담 버튼 (전 페이지 공통) =====
   body 끝에 직접 붙인다 — x-dc 가 관리하는 서브트리 밖이라 프레임워크의 비동기
   마운트/재렌더에 휩쓸리지 않는다 (index.html 의 비디오 히어로 마크업이 <x-dc>
   바깥에 있는 것과 같은 이유).

   2026-09: 접힘/펼침 토글(채팅 아이콘 메인 버튼 · X 닫기 · 안내 말풍선)을 없애고
   카카오톡 상담 · 전화 문의 · 견적 문의 3개 버튼을 항상 펼쳐진 상태로 보여준다. */
(function () {
  var KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';
  /* 발신은 휴대폰으로 받는다 — 대표번호(031-544-7272)는 표기용으로 푸터·문의
     페이지에 그대로 남아 있고, 위젯/하단 CTA 바의 통화 버튼만 이 번호를 쓴다. */
  var TEL_URL = 'tel:01054302580';

  var ICON_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5s-4.25-7.5-9.5-7.5z"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  var ICON_QUOTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>';

  function item(cls, href, target, label, icon) {
    return '<a class="iw-item iw-item--' + cls + '" href="' + href + '"' +
      (target ? ' target="_blank" rel="noopener noreferrer"' : '') +
      ' aria-label="' + label + '">' +
      '<span class="iw-label">' + label + '</span>' +
      '<span class="iw-btn iw-btn--' + cls + '">' + icon + '</span>' +
      '</a>';
  }

  /* 문의 섹션이 있는 페이지면 그 앵커로, 없으면 문의 페이지로 보낸다 */
  function quoteHref() {
    return document.getElementById('inquiry') ? '#inquiry' : 'contact.html';
  }

  function build() {
    var root = document.createElement('div');
    root.className = 'iw-root';
    root.id = 'iwRoot';
    root.setAttribute('aria-label', '문의하기');
    root.innerHTML =
      item('kakao', KAKAO_URL, true, '카카오톡 상담', ICON_KAKAO) +
      item('tel', TEL_URL, false, '전화 문의', ICON_TEL) +
      item('quote', quoteHref(), false, '견적 문의', ICON_QUOTE);
    document.body.appendChild(root);
    return root;
  }

  /* ── 모바일 하단 고정 CTA 바 ──
     ≤768px 에서는 플로팅 위젯 대신 엄지 거리의 고정 바(전화·카톡)를 쓴다.
     표시/숨김 전환은 전부 CSS 미디어쿼리가 한다(inquiry-widget.css).
     위젯과 같은 이유로 body 끝에 직접 붙는다 — x-dc 재렌더 영역 밖. */
  function buildCtaBar() {
    if (document.getElementById('esCtabar')) return;
    var bar = document.createElement('div');
    bar.className = 'es-ctabar';
    bar.id = 'esCtabar';
    bar.innerHTML =
      '<a class="es-ctabar-tel" href="' + TEL_URL + '">' + ICON_TEL + '<span>전화하기</span></a>' +
      '<a class="es-ctabar-kakao" href="' + KAKAO_URL + '" target="_blank" rel="noopener noreferrer">' + ICON_KAKAO + '<span>카카오톡 상담</span></a>';
    document.body.appendChild(bar);
  }

  function init() {
    if (document.getElementById('iwRoot')) return;

    buildCtaBar();
    var root = build();
    var quoteLink = root.querySelector('.iw-item--quote');

    /* 견적 문의 — 같은 페이지에 문의 섹션이 있으면 부드럽게 스크롤 */
    if (quoteLink) {
      quoteLink.addEventListener('click', function (e) {
        var target = document.getElementById('inquiry');
        if (!target) return;                       /* 다른 페이지로 이동 */
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
