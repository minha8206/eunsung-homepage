#!/usr/bin/env node
/* ===== 시공사례 정적 생성기 (2026-11 개편) =====

   실행:  node scandi/scripts/build-portfolio.js

   data/cases.json 한 파일을 읽어 아래를 만든다. 사례를 고치거나 더할 때는 그 JSON 만 고치고
   이 스크립트를 다시 돌리면 된다(몇 번을 돌려도 결과가 같다).

     portfolio.html              목록 — 공간·컬러 필터, 카드 전부가 HTML 에 들어 있다
     portfolio/<id>.html         상세 — 사례마다 한 페이지(주소 /portfolio/<id>)
     js/i18n-portfolio.js        EN 모드용 사전(사례 제목·설명 + 화면 라벨)
     sitemap.xml                 사례 주소 구간(PORTFOLIO-CASES 마커 사이)만 교체

   왜 정적 생성인가 — 예전 시공사례는 x-dc(React) 가 브라우저에서 그렸다. 크롤러가 읽는 초기
   HTML 에는 템플릿 문법만 있어 사례가 검색에 잡히지 않았고, 사례별 주소(#case/..)는 공유해도
   미리보기가 전부 같았다. 지금은 사례마다 제목·설명·대표사진이 든 실제 페이지가 생긴다.

   상세 페이지는 한 단계 아래 폴더라 <base href="/"> 를 둔다 — 공통 스크립트(상담 버튼·모바일
   메뉴·검색)가 'contact.html' 같은 상대 주소를 쓰기 때문이다. 그래서 상세 안에서는 '#..' 만
   적은 링크를 쓰지 않는다(홈으로 가 버린다).

   카드용 축소 사진(<이름>-card.webp)과 컬러 칩(images/cases/_sw/<코드>.webp)은 있으면 쓰고
   없으면 원본을 그대로 쓴다. 새 사진을 넣고 축소본을 안 만들어도 페이지는 정상이다. */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://esstone.co.kr';
/* /assets/* 는 1년 immutable 캐시 — portfolio.css · portfolio.js 를 고치면 이 값을 올린다 */
const ASSET_V = '20261117';
const KAKAO_URL = 'https://open.kakao.com/o/sS7BnYyc';

const SPACES = [
  { key: 'kitchen', ko: '주방', en: 'Kitchen' },
  { key: 'bath', ko: '욕실', en: 'Bathroom' },
  { key: 'wall', ko: '아트월', en: 'Feature wall' },
  { key: 'commercial', ko: '상업 공간', en: 'Commercial' },
];
/* 컬러 톤 필터 — sw 는 필터 점에 쓰는 견본 */
const TONES = [
  { key: 'white', ko: '화이트', en: 'White', sw: 'WM101' },
  { key: 'beige', ko: '베이지·크림', en: 'Beige & cream', sw: 'CC072' },
  { key: 'gray', ko: '그레이', en: 'Grey', sw: 'ST111' },
  { key: 'dark', ko: '다크', en: 'Dark', sw: 'CM104' },
];
const CATALOGS = [
  { file: 'data/products-terracanto.json', brand: 'LX 포세린', brandEn: 'LX Porcelain' },
  { file: 'data/products-viatera.json', brand: 'LX 비아테라', brandEn: 'LX Viatera' },
  { file: 'data/products-himacs.json', brand: 'LX 하이막스', brandEn: 'LX HIMACS' },
];

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ── 데이터 ── */
const cases = JSON.parse(read('data/cases.json')).cases;
const products = {};
for (const cat of CATALOGS) {
  if (!exists(cat.file)) continue;
  for (const p of JSON.parse(read(cat.file))) {
    if (p && p.code && !products[p.code]) products[p.code] = Object.assign({ brand: cat.brand, brandEn: cat.brandEn }, p);
  }
}

const problems = [];
const seen = new Set();
for (const c of cases) {
  if (!/^[a-z0-9-]+$/.test(c.id || '')) problems.push('id 는 영문 소문자·숫자·하이픈만: ' + c.id);
  if (seen.has(c.id)) problems.push('id 중복: ' + c.id);
  seen.add(c.id);
  if (!SPACES.some((s) => s.key === c.space)) problems.push(c.id + ': space 값 확인 → ' + c.space);
  if (!TONES.some((t) => t.key === c.toneGroup)) problems.push(c.id + ': toneGroup 값 확인 → ' + c.toneGroup);
  if (!c.photos || !c.photos.length) problems.push(c.id + ': 사진이 없음');
  for (const p of c.photos || []) if (!exists(p.src)) problems.push(c.id + ': 사진 파일 없음 → ' + p.src);
  if (!c.color || !products[c.color.code]) problems.push(c.id + ': color.code 가 제품 데이터에 없음 → ' + (c.color && c.color.code));
  for (const code of c.similar || []) if (!products[code]) problems.push(c.id + ': similar 코드가 제품 데이터에 없음 → ' + code);
}
if (problems.length) {
  console.error('data/cases.json 에 고칠 곳이 있습니다:\n  - ' + problems.join('\n  - '));
  process.exit(1);
}

const titleOf = (c) => c.tone + ' ' + c.use;
const spaceOf = (c) => SPACES.find((s) => s.key === c.space);
const caseHref = (c) => 'portfolio/' + c.id + '.html';
const cardSrc = (src) => {
  const t = src.replace(/\.[a-z0-9]+$/i, '-card.webp');
  return exists(t) ? t : src;
};
const chipSrc = (code) => (exists('images/cases/_sw/' + code + '.webp') ? 'images/cases/_sw/' + code + '.webp' : products[code].image);
const productHref = (code) => 'product-detail.html?code=' + encodeURIComponent(code);
const posStyle = (p) => (p.pos ? ' style="object-position:' + esc(p.pos) + '"' : '');
const contactHref = (c) => {
  const p = products[c.color.code];
  return 'contact.html?case=' + encodeURIComponent(titleOf(c) + ' · ' + c.region + ' · ' + p.name + ' ' + p.code);
};

/* ── 아이콘 ── */
const svg = (d, size, sw) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
const IC_L = 'M15 5l-7 7 7 7';
const IC_R = 'M9 5l7 7-7 7';
const IC_PHOTO = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>';
const IC_ZOOM = svg('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5', 16);
const IC_KAKAO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 3.5C6.75 3.5 2.5 6.86 2.5 11c0 2.64 1.75 4.96 4.39 6.29-.19.7-.7 2.57-.8 2.97-.13.5.18.49.38.36.16-.1 2.53-1.72 3.56-2.42.63.09 1.28.14 1.97.14 5.25 0 9.5-3.36 9.5-7.5S17.25 3.5 12 3.5z"/></svg>';

/* ── 공통 틀 ── */
const FONT_RANGE = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

/* 상세 페이지 전용 — 연말 프로모션 팝업(holiday-popup.js)은 오른쪽 아래 380px 카드로 바로 뜨는데,
   상세에서는 그 자리가 컬러·시공 범위·문의 버튼이다. 그래서 상세에서만 작은 탭으로 시작하게 한다:
   팝업 스크립트가 읽는 "접어 둠" 표시를 먼저 켜 두고, 페이지가 다 뜨면 우리가 켠 표시만 다시 끈다
   (다른 페이지에서는 평소대로 뜬다). 방문자가 직접 닫았던 경우에는 건드리지 않는다. */
const QUIET_POPUP = `<script>
(function(){try{var k='esh_minimized';if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');addEventListener('load',function(){setTimeout(function(){try{sessionStorage.removeItem(k)}catch(e){}},0)})}catch(e){}})();
</script>`;

function head(o) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${o.base ? '<base href="/">\n' : ''}<meta name="naver-site-verification" content="3f77031df39ae82017cfd209f31be7ff0f23892e" />
<!-- 이 파일은 scripts/build-portfolio.js 가 data/cases.json 에서 만든다. 직접 고치지 말고 JSON 을 고친 뒤 다시 빌드할 것. -->
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:site_name" content="EUNSUNG 은성">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.ogDesc || o.desc)}">
<meta property="og:url" content="${esc(o.canonical)}">
<meta property="og:image" content="${esc(o.ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${esc(o.canonical)}">
${o.preloadImage ? '<link rel="preload" as="image" href="' + esc(o.preloadImage) + '" fetchpriority="high">\n' : ''}<link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/cormorant-garamond-latin.woff2">
<style>
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:300 700;font-display:swap;src:url(assets/fonts/cormorant-garamond-latin.woff2) format('woff2');unicode-range:${FONT_RANGE}}
@font-face{font-family:'Manrope';font-style:normal;font-weight:200 800;font-display:swap;src:url(assets/fonts/manrope-latin.woff2) format('woff2');unicode-range:${FONT_RANGE}}
</style>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"></noscript>
<script>
/* 로고 옆 "은성" 한 글자용 Noto Serif KR 은 첫 페인트 뒤에 붙인다(다른 페이지와 같은 방식). */
(function(){var done=false;function add(){if(done)return;done=true;var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500&display=swap';document.head.appendChild(l);}
try{var po=new PerformanceObserver(function(list){if(list.getEntries().some(function(e){return e.name==='first-contentful-paint';})){po.disconnect();add();}});po.observe({type:'paint',buffered:true});}catch(e){}
setTimeout(add,1000);})();
</script>
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/portfolio.css?v=${ASSET_V}">
${o.quietPopup ? QUIET_POPUP : ''}
<script src="assets/js/inquiry-widget.js" defer></script>
<script src="assets/js/holiday-popup.js?v=20261110b" defer></script>
<script src="assets/js/login-modal.js" defer></script>
<script src="assets/js/search-overlay.js" defer></script>
<script src="js/i18n-portfolio.js" defer></script>
<script src="js/i18n.js" defer></script>
<script src="assets/js/mobile-nav.js?v=20261117" defer></script>
<script src="assets/js/portfolio.js?v=${ASSET_V}" defer></script>
${o.jsonld || ''}
</head>
<body class="pfx-page${o.quietPopup ? ' pfx-case' : ''}">
`;
}

function siteHeader(quoteHref) {
  return `<div class="site-hd" style="position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;justify-content:space-between;padding:19px 5vw;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(22,32,42,.08);color:#16202A">
  <a href="index.html" class="brand-logo" style="text-decoration:none;color:inherit">
    <span class="brand-en">EUNSUNG</span><span class="brand-kr">은성</span>
  </a>
  <nav class="nav-mid" style="color:#16202A">
    <a href="about.html">회사소개</a>
    <a href="facility.html">시공 과정</a>
    <a href="showroom.html?cat=PORCELAIN">포세린</a>
    <a href="showroom.html?cat=VIATERA">엔지니어드 스톤</a>
    <a href="showroom.html?cat=HIMACS">인조대리석</a>
    <a href="bmc.html">BMC</a>
    <a href="portfolio.html" aria-current="page">시공사례</a>
    <a href="store.html">스토어</a>
  </nav>
  <div class="nav-right">
    <button type="button" class="nav-ic" aria-label="검색"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></button>
    <span class="lang" role="group" aria-label="언어 선택"><b><button type="button" class="lang-btn" lang="ko" aria-label="한국어">KO</button></b><b><button type="button" class="lang-btn" lang="en" aria-label="English">EN</button></b></span>
    <button type="button" class="nav-ic" aria-label="로그인"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></button>
    <a class="hd-quote" href="${esc(quoteHref || 'contact.html')}">견적 문의</a>
    <button type="button" class="nav-burger" aria-label="메뉴 열기" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M4 9h16M4 15h16"/></svg></button>
  </div>
</div>
`;
}

/* index.html 의 밝은 톤 푸터와 같은 마크업 — 인라인 값(바깥 flex · gap:64px · flex-wrap)은
   mobile.css 의 푸터 규칙이 잡는 열쇠라 그대로 둔다. */
const FOOTER = `<footer class="hf" style="padding:72px 5vw 40px">
  <div style="max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:44px">
    <div style="max-width:320px">
      <a href="index.html" class="hf-brand" aria-label="EUNSUNG 은성 홈"><span class="hf-en">EUNSUNG</span><span class="hf-kr">은성</span></a>
      <p class="hf-desc">포세린·엔지니어드 스톤·인조대리석·BMC<br>소재 선별부터 가공, 시공까지. 은성이 처음부터 끝까지&nbsp;책임집니다.</p>
    </div>
    <div style="display:flex;gap:64px;flex-wrap:wrap">
      <div><div class="hf-h">소재</div><div class="hf-col"><a class="ft-link" href="showroom.html?cat=PORCELAIN">포세린</a><a class="ft-link" href="showroom.html?cat=VIATERA">엔지니어드 스톤</a><a class="ft-link" href="showroom.html?cat=HIMACS">인조대리석</a><a class="ft-link" href="bmc.html">BMC</a></div></div>
      <div><div class="hf-h">회사</div><div class="hf-col"><a class="ft-link" href="about.html">회사소개</a><a class="ft-link" href="facility.html">시공 과정</a><a class="ft-link" href="portfolio.html">시공사례</a><a class="ft-link" href="showroom.html?cat=PORCELAIN">쇼룸</a><a class="ft-link" href="store.html">스토어</a></div></div>
      <div><div class="hf-h">고객지원</div><div class="hf-col"><a class="ft-link" href="contact.html">문의하기</a><a class="ft-link" href="${KAKAO_URL}" target="_blank" rel="noopener noreferrer">카카오톡 상담</a></div></div>
    </div>
  </div>
  <div class="hf-bottom">
    <div class="hf-small" style="margin-bottom:12px;word-break:keep-all">(주)은성 — 경기도 포천 포세린·엔지니어드 스톤 전문 기업 | LX하우시스 공식&nbsp;파트너</div>
    <div class="ft-info hf-small" style="display:flex;flex-wrap:wrap;gap:6px 22px;margin-bottom:16px">
      <span>상호 (주)은성</span><span>대표자 이언기</span><span>사업자등록번호 328-88-00420</span><span class="ft-info-addr">주소&nbsp;경기도 포천시 가산면 정금로&nbsp;356-39</span><span>전화 031-544-7272 · 010-5430-2580</span><span>팩스 031-544-6868</span><span>이메일 ceramices@naver.com</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px">
      <div class="hf-small">© 2026 (주)은성 EUNSUNG Co., Ltd. · 인조대리석 및 상판 가공</div><a class="ft-link" href="privacy.html" style="font-size:12.5px;text-decoration:underline;text-underline-offset:3px">개인정보처리방침</a><div class="hf-small">Instagram · KakaoTalk · Naver</div>
    </div>
  </div>
</footer>
</body>
</html>
`;

/* ── 카드 ── */
function card(c, i, eager) {
  const p0 = c.photos[0];
  const load = eager ? ' loading="eager"' + (i === 0 ? ' fetchpriority="high"' : '') : ' loading="lazy" decoding="async"';
  return `<li class="pfx-card" data-id="${c.id}" data-space="${c.space}" data-tone="${c.toneGroup}">
  <a href="${caseHref(c)}">
    <div class="pfx-pic"><img src="${esc(cardSrc(p0.src))}" alt="${esc(titleOf(c) + ' — ' + c.region + ' 시공 사진')}"${posStyle(p0)}${load}><span class="pfx-n" aria-label="사진 ${c.photos.length}장">${IC_PHOTO}${c.photos.length}</span></div>
    <div class="pfx-cap"><img class="pfx-sw" src="${esc(chipSrc(c.color.code))}" alt="" width="46" height="46" loading="lazy" decoding="async"><div><h3 class="pfx-name">${esc(titleOf(c))}</h3><div class="pfx-meta"><span>${esc(c.region)}</span><span>${esc(c.material)}</span></div></div></div>
  </a>
</li>`;
}

/* ── 목록 ── */
function listPage() {
  const file = 'portfolio.html';
  /* build-seo.js 가 관리하는 JSON-LD 구간은 그대로 옮겨 싣는다 */
  let jsonld = '';
  if (exists(file)) {
    const m = read(file).match(/<!-- SEO-JSONLD:START -->[\s\S]*?<!-- SEO-JSONLD:END -->/);
    if (m) jsonld = m[0];
  }
  if (!jsonld) jsonld = '<!-- SEO-JSONLD:START -->\n<!-- SEO-JSONLD:END -->';

  const tabs = [{ key: 'all', ko: '전체', n: cases.length }]
    .concat(SPACES.map((s) => ({ key: s.key, ko: s.ko, n: cases.filter((c) => c.space === s.key).length })))
    .filter((t) => t.n > 0)
    .map((t) => `<button type="button" class="pfx-tab" data-space="${t.key}" aria-pressed="${t.key === 'all'}">${t.ko}<i>${t.n}</i></button>`)
    .join('');
  const tones = TONES.filter((t) => cases.some((c) => c.toneGroup === t.key))
    .map((t) => `<button type="button" class="pfx-tone" data-tone="${t.key}" aria-pressed="false"><span class="pfx-dot" style="background-image:url(${chipSrc(t.sw)})"></span>${t.ko}</button>`)
    .join('');

  const html = head({
    title: '시공사례 | 포세린 주방 상판·아일랜드·아트월 시공 — 은성 EUNSUNG',
    desc: '주방 상판과 아일랜드, 욕실, 아트월, 상업 공간까지 은성이 직접 가공하고 시공한 포세린 현장 사례입니다. 공간과 컬러로 찾아보고 같은 컬러로 견적을 받아보세요.',
    ogDesc: '은성이 직접 가공하고 시공한 포세린 현장. 공간과 컬러로 찾아보고 같은 컬러로 견적을 받아보세요.',
    canonical: SITE + '/portfolio.html',
    ogImage: SITE + '/' + cases[0].photos[0].src,
    jsonld,
  }) + siteHeader('contact.html') + `<main class="pfx">
<div class="pfx-wrap">
  <div class="pfx-head">
    <h1>시공사례</h1>
    <p><span>은성 직영 공장에서 가공하고 직접 시공한 현장입니다.</span> <span>사례를 누르면 사용한 컬러와 시공 범위를 볼 수 있습니다.</span></p>
  </div>
  <div class="pfx-filter">
    <div class="pfx-frow"><span class="pfx-flab" id="pfxSpaceLab">공간</span><div class="pfx-opts" role="group" aria-labelledby="pfxSpaceLab">${tabs}</div></div>
    <div class="pfx-frow"><span class="pfx-flab" id="pfxToneLab">컬러</span><div class="pfx-opts" role="group" aria-labelledby="pfxToneLab">${tones}</div><span class="pfx-count" aria-live="polite"><span>사례</span> <b>${cases.length}</b><span>건</span></span></div>
  </div>
  <ul class="pfx-grid" data-filter>
${cases.map((c, i) => card(c, i, i < 3)).join('\n')}
  </ul>
  <p class="pfx-empty" hidden><span>조건에 맞는 사례가 아직 없습니다.</span><button type="button">필터 초기화</button></p>
</div>
</main>
` + FOOTER;
  fs.writeFileSync(path.join(ROOT, file), html);
}

/* ── 상세 ── */
function related(c) {
  const rest = cases.filter((x) => x.id !== c.id);
  const out = rest.filter((x) => x.toneGroup === c.toneGroup);
  for (const x of rest) if (out.length < 3 && !out.includes(x) && x.space === c.space) out.push(x);
  for (const x of rest) if (out.length < 3 && !out.includes(x)) out.push(x);
  return out.slice(0, 3);
}

function detailPage(c, i) {
  const title = titleOf(c);
  const sp = spaceOf(c);
  const prod = products[c.color.code];
  const exact = !!c.color.exact;
  const prev = cases[(i - 1 + cases.length) % cases.length];
  const next = cases[(i + 1) % cases.length];
  const n = c.photos.length;
  const url = SITE + '/portfolio/' + c.id;
  const quote = contactHref(c);

  const jsonld = '<script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE + '/' },
          { '@type': 'ListItem', position: 2, name: '시공사례', item: SITE + '/portfolio.html' },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
      {
        '@type': 'CreativeWork',
        '@id': url + '#case',
        name: title,
        description: c.desc,
        url,
        image: c.photos.map((p) => SITE + '/' + p.src),
        material: c.material,
        locationCreated: { '@type': 'Place', name: c.region },
        creator: { '@id': SITE + '/#organization' },
      },
    ],
  }, null, 2) + '\n</script>';

  const slides = c.photos.map((p, k) =>
    `<figure class="pfx-slide"><img src="${esc(p.src)}" data-full="${esc(p.src)}" alt="${esc(title + ' 시공 사진 ' + (k + 1))}"${posStyle(p)}${k === 0 ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}></figure>`).join('');
  const arrows = n > 1
    ? `<button type="button" class="pfx-arr is-prev" aria-label="이전 사진">${svg(IC_L, 20)}</button><button type="button" class="pfx-arr is-next" aria-label="다음 사진">${svg(IC_R, 20)}</button>`
    : '';
  const thumbs = n > 1
    ? `\n      <div class="pfx-thumbs">${c.photos.map((p, k) =>
        `<button type="button" class="pfx-thumb" aria-label="사진 ${k + 1} 보기" aria-current="${k === 0}"><img src="${esc(cardSrc(p.src))}" alt=""${posStyle(p)} loading="lazy" decoding="async"></button>`).join('')}<span class="pfx-cnt"><span>사진</span> <b>1</b> / ${n}</span></div>`
    : '';

  const colorLabel = exact ? '사용 컬러' : '비슷한 컬러';
  const tiles = [c.color.code].concat((c.similar || []).filter((x) => x !== c.color.code)).slice(0, 4).map((code, k) => {
    const p = products[code];
    const badge = k === 0 ? `<span class="pfx-badge">${exact ? '사용 컬러' : '가장 비슷한 컬러'}</span>` : '';
    return `<li><a href="${productHref(code)}"><div class="pfx-tile">${badge}<img src="${esc(p.image)}" alt="${esc(p.name + ' 컬러 견본')}" loading="lazy" decoding="async"></div><b>${esc(p.name)}</b><i><span>${esc(p.code)}</span><span>${esc(p.brand)}</span></i></a></li>`;
  }).join('\n      ');
  const colorLead = exact
    ? '이 현장에 사용한 컬러와, 톤이 가까운 LX 컬러입니다. 누르면 컬러 상세로 이동합니다.'
    : '이 현장과 톤이 가까운 LX 컬러입니다. 누르면 컬러 상세로 이동합니다.';

  const html = head({
    base: true,
    title: `${title} | ${c.region} ${sp.ko} 포세린 시공사례 — 은성 EUNSUNG`,
    desc: `${c.desc} 소재 ${c.material}, 시공 범위 ${c.scope}. 같은 컬러로 견적을 받아보세요.`,
    ogDesc: c.desc,
    ogType: 'article',
    canonical: url,
    ogImage: SITE + '/' + c.photos[0].src,
    preloadImage: c.photos[0].src,
    quietPopup: true,
    jsonld,
  }) + siteHeader(quote) + `<main class="pfx pfx-detail">
<div class="pfx-wrap">
  <div class="pfx-top">
    <nav aria-label="현재 위치"><ol class="pfx-bc"><li><a href="portfolio.html">시공사례</a></li><li aria-hidden="true">/</li><li><a href="portfolio.html?space=${sp.key}">${sp.ko}</a></li><li aria-hidden="true">/</li><li aria-current="page">${esc(title)}</li></ol></nav>
    <div class="pfx-pn"><a href="${caseHref(prev)}" rel="prev">${svg(IC_L, 16)}<span>이전 사례</span></a><a href="${caseHref(next)}" rel="next"><span>다음 사례</span>${svg(IC_R, 16)}</a></div>
  </div>
  <div class="pfx-main">
    <section class="pfx-gal" aria-label="시공 사진">
      <div class="pfx-stage"><div class="pfx-track" tabindex="0" aria-label="시공 사진 ${n}장">${slides}</div>${arrows}<button type="button" class="pfx-zoom">${IC_ZOOM}<span>크게 보기</span></button></div>${thumbs}
    </section>
    <div class="pfx-info">
      <a class="pfx-kind" href="portfolio.html?space=${sp.key}">${sp.ko}</a>
      <h1 class="pfx-ttl"><span>${esc(c.tone)}</span><span>${esc(c.use)}</span></h1>
      <p class="pfx-desc">${esc(c.desc)}</p>
      <a class="pfx-color" href="${productHref(prod.code)}">
        <img src="${esc(prod.image)}" alt="${esc(prod.name + ' 컬러 견본')}" width="76" height="76">
        <span class="pfx-color-t"><span class="pfx-color-l">${colorLabel}</span><span class="pfx-color-n">${esc(prod.name)}</span><span class="pfx-color-c"><span>${esc(prod.code)}</span><span>${esc(prod.brand)}</span></span></span>
        <span class="pfx-color-go"><span>컬러 보기</span>${svg(IC_R, 16)}</span>
      </a>
      <dl class="pfx-spec">
        <div><dt>소재</dt><dd>${esc(c.material)}</dd></div>
        <div><dt>시공 범위</dt><dd>${esc(c.scope)}</dd></div>
        <div><dt>지역</dt><dd>${esc(c.region)}</dd></div>
      </dl>
      <div class="pfx-cta">
        <a class="pfx-b1" data-case-cta href="${esc(quote)}">이 컬러로 견적 문의</a>
        <a class="pfx-b2" href="${KAKAO_URL}" target="_blank" rel="noopener noreferrer"><span class="pfx-kk">${IC_KAKAO}</span><span>카카오톡으로 물어보기</span></a>
      </div>
      <p class="pfx-tel"><span>전화 상담</span> <a href="tel:0315447272">031-544-7272</a> <span>(평일 08:30~17:30)</span></p>
    </div>
  </div>
  <section class="pfx-sec" aria-labelledby="pfxColorsH">
    <h2 id="pfxColorsH">비슷한 컬러</h2>
    <p class="pfx-lead">${colorLead}</p>
    <ul class="pfx-colors">
      ${tiles}
    </ul>
  </section>
  <section class="pfx-sec" aria-labelledby="pfxRelH">
    <h2 id="pfxRelH">비슷한 톤의 다른 사례</h2>
    <ul class="pfx-grid pfx-rel">
${related(c).map((x) => card(x, 9, false)).join('\n')}
    </ul>
  </section>
  <div class="pfx-end"><a href="portfolio.html">시공사례 목록으로</a></div>
</div>
</main>
` + FOOTER;

  fs.writeFileSync(path.join(ROOT, 'portfolio', c.id + '.html'), html);
}

/* ── EN 사전 ──
   i18n.js 는 "한국어 원문 → 영문" 사전으로 텍스트 노드를 바꾼다. 사전 본체(js/i18n-en.js)는
   EN 을 고른 순간에야 내려받으므로, 여기서는 window.I18N_EN 이 채워지는 순간에 끼어들어
   시공사례용 항목을 합친다(본체에 이미 있는 키는 건드리지 않는다). */
function i18nFile() {
  const d = {};
  const put = (ko, en) => { if (ko && en && d[ko] === undefined) d[ko] = en; };
  put('은성 직영 공장에서 가공하고 직접 시공한 현장입니다.', 'Fabricated in our own factory and installed by our own team.');
  put('사례를 누르면 사용한 컬러와 시공 범위를 볼 수 있습니다.', 'Open a project to see the colour and the scope of work.');
  put('공간', 'Space'); put('전체', 'All');
  SPACES.forEach((s) => put(s.ko, s.en));
  TONES.forEach((t) => put(t.ko, t.en));
  /* '건' 은 사전 본체에 ' results' 로 있다 → EN 은 "23 results" */
  put('사례', '__HIDE__');
  put('조건에 맞는 사례가 아직 없습니다.', 'No projects match these filters yet.');
  put('필터 초기화', 'Clear filters');
  put('이전 사례', 'Previous'); put('다음 사례', 'Next');
  put('크게 보기', 'Enlarge'); put('사진', 'Photo');
  put('비슷한 컬러', 'Similar colour'); put('사용 컬러', 'Colour used'); put('가장 비슷한 컬러', 'Closest match');
  put('컬러 보기', 'View colour');
  put('시공 범위', 'Scope'); put('지역', 'Location');
  put('이 컬러로 견적 문의', 'Get a quote in this colour');
  put('카카오톡으로 물어보기', 'Ask on KakaoTalk');
  put('전화 상담', 'Call'); put('(평일 08:30~17:30)', '(Mon–Fri 08:30–17:30)');
  put('이 현장과 톤이 가까운 LX 컬러입니다. 누르면 컬러 상세로 이동합니다.',
    'LX colours close in tone to this project. Select one to see its details.');
  put('이 현장에 사용한 컬러와, 톤이 가까운 LX 컬러입니다. 누르면 컬러 상세로 이동합니다.',
    'The colour used on this project, with LX colours close in tone. Select one to see its details.');
  put('비슷한 톤의 다른 사례', 'More projects in a similar tone');
  put('시공사례 목록으로', 'Back to all projects');
  put('포세린 12T', 'Porcelain 12 mm');
  CATALOGS.forEach((c) => put(c.brand, c.brandEn));
  for (const c of cases) {
    const e = c.en || {};
    put(titleOf(c), e.tone && e.use ? e.tone + ' ' + e.use : '');
    put(c.tone, e.tone); put(c.use, e.use); put(c.region, e.region); put(c.scope, e.scope); put(c.desc, e.desc);
    const codes = [c.color.code].concat(c.similar || []);
    for (const code of codes) put(products[code].name, products[code].en);
  }
  const body = `/* ===== 시공사례 EN 사전 — scripts/build-portfolio.js 가 data/cases.json 에서 만든다 =====
   직접 고치지 말 것. 사례의 영문은 cases.json 의 en 항목, 화면 라벨은 build-portfolio.js 에 있다. */
(function () {
  var ADD = ${JSON.stringify(d, null, 2).replace(/\n/g, '\n  ')};
  function merge(base) {
    for (var k in ADD) if (Object.prototype.hasOwnProperty.call(ADD, k) && base[k] === undefined) base[k] = ADD[k];
    return base;
  }
  if (window.I18N_EN) {
    merge(window.I18N_EN);
    if (window.EunsungI18n && window.EunsungI18n.refresh) window.EunsungI18n.refresh();
    return;
  }
  /* 사전 본체가 window.I18N_EN 에 대입되는 순간 합친다. 그 전에는 undefined 로 보여야
     i18n.js 가 본체를 내려받는다(값이 있으면 받지 않는다). */
  var store;
  try {
    Object.defineProperty(window, 'I18N_EN', {
      configurable: true, enumerable: true,
      get: function () { return store; },
      set: function (v) { store = v && typeof v === 'object' ? merge(v) : v; }
    });
  } catch (e) { /* 합치지 못해도 한국어로는 정상 동작한다 */ }
})();
`;
  fs.writeFileSync(path.join(ROOT, 'js', 'i18n-portfolio.js'), body);
  return Object.keys(d).length;
}

/* ── 사이트맵 ── */
function sitemap() {
  const file = 'sitemap.xml';
  if (!exists(file)) return false;
  const S = '<!-- PORTFOLIO-CASES:START -->', E = '<!-- PORTFOLIO-CASES:END -->';
  let xml = read(file);
  const prevBlock = (xml.match(new RegExp(S + '[\\s\\S]*?' + E)) || [''])[0];
  const today = new Date().toISOString().slice(0, 10);
  const urlsOf = (date) => cases.map((c) =>
    `  <url>\n    <loc>${SITE}/portfolio/${c.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join('\n');
  /* 사례 구성이 그대로면 날짜를 바꾸지 않는다 — 다시 돌려도 파일이 변하지 않게 */
  const prevDate = (prevBlock.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
  let block = S + '\n' + urlsOf(prevDate || today) + '\n  ' + E;
  if (block !== prevBlock) block = S + '\n' + urlsOf(today) + '\n  ' + E;
  if (prevBlock) xml = xml.replace(prevBlock, block);
  else xml = xml.replace(/\s*<\/urlset>\s*$/, '\n  ' + block + '\n</urlset>\n');
  fs.writeFileSync(path.join(ROOT, file), xml);
  return true;
}

/* ── 실행 ── */
const outDir = path.join(ROOT, 'portfolio');
fs.mkdirSync(outDir, { recursive: true });
/* 데이터에서 빠진 사례의 옛 페이지는 지운다 */
for (const f of fs.readdirSync(outDir)) {
  if (/\.html$/.test(f) && !cases.some((c) => c.id + '.html' === f)) fs.unlinkSync(path.join(outDir, f));
}
listPage();
cases.forEach(detailPage);
const keys = i18nFile();
const sm = sitemap();
console.log('시공사례 빌드 완료 — 목록 1 · 상세 ' + cases.length + ' · EN 사전 ' + keys + '개 항목' + (sm ? ' · sitemap 갱신' : ''));
