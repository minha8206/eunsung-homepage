(function () {
  'use strict';

  const PORTFOLIO = [
    { loc: '한남동', name: '프리미엄 라운지 카운터', desc: '아이보리 포세린으로 바 카운터와 바닥재를 통일 시공한 프리미엄 라운지', cap: '카페·상업시설 · 2026.06', sub: '포세린 · 아이보리 화이트', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/hannamdong/01.png' },
    { loc: '동대문구', name: '라이트 마블 포세린', desc: '크리미 마블 포세린으로 화이트 캐비닛·그레이 백스플래시 레이어드, 싱크 통합', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 라이트 마블', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/dongdaemun/01.jpg' },
    { loc: '양평', name: '내추럴 모던 포세린 아일랜드', desc: '원목 루버 패널과 어우러지는 라이트 그레이 포세린 아일랜드', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 라이트 그레이', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/yangpyeong/01.png' },
    { loc: '성수동', name: '대형 아일랜드 시공', desc: '오크 캐비닛 + 크림 베이지 포세린 아일랜드, 싱크·인덕션 통합 가공', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 크림 베이지', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/seongsu/01.jpg' },
    { loc: '선릉', name: '대기업 임원회의실', desc: '5m 칼라카타 화이트 포세린, 케이블 트레이 통합 맞춤 제작', cap: '오피스·호텔 · 2026.06', sub: '포세린 · 칼라카타', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/seolleung/01.jpg' },
    { loc: '여주', name: '단독주택 오픈 키친 전체 시공', desc: '높은 층고·전면 통창, 다크 그레이 포세린으로 아일랜드·카운터 통일 시공', cap: '주방아일랜드 · 2026.05', sub: '포세린 · 다크 그레이', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/yeoju/01.jpg' },
    { loc: '여의도', name: '라이트 그레이 아일랜드', desc: '라이트 그레이 포세린 + 월넛 캐비닛 조합, 싱크·쿡탑 통합 가공', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 라이트 그레이', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/yeouido/02.jpg' },
    { loc: '도곡동', name: '화이트 마블 포세린', desc: '녹음 뷰 창가와 어우러지는 크리미 마블 포세린, 인덕션·싱크 통합 가공', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 화이트 마블', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/dokgok/01.jpg' },
    { loc: '마포', name: '화이트 마블 포세린 시공', desc: '포세린 아일랜드 + 화이트 마블 포세린 카운터, 기존 캐비닛 활용 교체 시공', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 화이트 마블', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/mapo/02.jpg' },
    { loc: '남양주', name: '신축 아파트 포세린 주방 시공', desc: '크림 화이트 포세린, 카운터·상부 선반 통일 시공, 빌트인 컷아웃 포함', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 크림 화이트', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/namyangju/01.jpg' },
    { loc: '홍대', name: '화이트 마블 포세린 주방 시공', desc: '화이트 마블 포세린으로 상부장·하부 카운터 통일, 밝고 세련된 주방', cap: '주방아일랜드 · 2026.06', sub: '포세린 · 화이트 마블', img: 'https://minha8206.github.io/eunsung-homepage/images/cases/hongdae/02.jpg' },
  ];

  let expanded = false;
  let clb = null;

  function renderList() {
    const listEl = document.getElementById('pf-list');
    listEl.innerHTML = '';
    const visible = expanded ? PORTFOLIO : PORTFOLIO.slice(0, 6);
    visible.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'pf-row' + (idx % 2 === 1 ? ' rev' : '');
      row.innerHTML =
        '<div class="pf-photo"><img src="' + item.img + '" alt="' + item.loc + ' ' + item.name + '" loading="lazy"></div>' +
        '<div style="flex:1">' +
          '<div class="pf-cap">' + item.cap + '</div>' +
          '<div class="pf-title">' + item.loc + ' — ' + item.name + '</div>' +
          '<div class="pf-desc">' + item.desc + '</div>' +
        '</div>';
      row.addEventListener('click', () => openCase(item));
      listEl.appendChild(row);
    });
    const btn = document.getElementById('pf-toggle');
    btn.textContent = expanded ? '접기' : `더보기 · ${PORTFOLIO.length - 6}건 더보기`;
  }

  function openCase(item) {
    clb = { s: 1, x: 0, y: 0, ptrs: new Map(), dist: 0 };
    document.getElementById('case-panel').style.display = 'block';
    document.getElementById('case-lb-img').style.backgroundImage = "url('" + item.img + "')";
    document.getElementById('case-lb-img').style.transform = 'translate(-50%,-50%)';
    document.getElementById('case-cap').textContent = item.cap;
    document.getElementById('case-loc').textContent = item.loc;
    document.getElementById('case-desc').textContent = item.desc;
    document.getElementById('case-sub').textContent = item.sub;
    document.getElementById('case-cap2').textContent = item.cap;
    setTimeout(bindCaseLightbox, 60);
  }
  function closeCase() {
    document.getElementById('case-panel').style.display = 'none';
  }
  function bindCaseLightbox() {
    const st = document.getElementById('case-lb-stage'), img = document.getElementById('case-lb-img');
    if (!st || !img || st._zoomBound) return;
    st._zoomBound = true;
    const clamp = (v) => Math.min(6, Math.max(0.5, v));
    const apply = () => { img.style.transform = 'translate(-50%,-50%) translate(' + clb.x.toFixed(1) + 'px,' + clb.y.toFixed(1) + 'px) scale(' + clb.s.toFixed(3) + ')'; };
    st.addEventListener('wheel', (e) => { e.preventDefault(); clb.s = clamp(clb.s * Math.exp(-e.deltaY * 0.0016)); apply(); }, { passive: false });
    st.addEventListener('pointerdown', (e) => { st.setPointerCapture(e.pointerId); clb.ptrs.set(e.pointerId, [e.clientX, e.clientY]); clb.dist = 0; st.style.cursor = 'grabbing'; });
    st.addEventListener('pointermove', (e) => {
      if (!clb.ptrs.has(e.pointerId)) return;
      const prev = clb.ptrs.get(e.pointerId);
      clb.ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (clb.ptrs.size === 1) { clb.x += e.clientX - prev[0]; clb.y += e.clientY - prev[1]; apply(); }
      else if (clb.ptrs.size === 2) {
        const p = Array.from(clb.ptrs.values());
        const d = Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]);
        if (clb.dist) clb.s = clamp(clb.s * d / clb.dist);
        clb.dist = d; apply();
      }
    });
    const up = (e) => { clb.ptrs.delete(e.pointerId); clb.dist = 0; st.style.cursor = 'grab'; };
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderList();
    document.getElementById('pf-toggle').addEventListener('click', () => { expanded = !expanded; renderList(); });
    document.getElementById('case-panel').addEventListener('click', closeCase);
    document.getElementById('case-side').addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('case-lb-stage').addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('case-close-x').addEventListener('click', (e) => { e.stopPropagation(); closeCase(); });
  });
})();
