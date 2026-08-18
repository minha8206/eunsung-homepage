#!/usr/bin/env node
/* ===== 구조화 데이터(JSON-LD) 정적 생성기 =====

   왜 빌드 스크립트인가 —
   쇼룸/시공사례 페이지는 x-dc(React) 가 클라이언트에서 그린다. 네이버 크롤러는
   JS 실행이 약해서 초기 HTML 만 읽으므로, 런타임에 만든 JSON-LD 는 색인되지
   않는다. 그래서 제품 데이터(data/products-*.json)를 빌드 시점에 읽어
   <script type="application/ld+json"> 을 HTML 에 통째로 박아 넣는다.

   실행:  node scripts/build-seo.js

   각 HTML 의 아래 두 마커 사이만 교체한다. 마커가 없으면 </head> 앞에 만든다.
     <!-- SEO-JSONLD:START -->  …생성 구간…  <!-- SEO-JSONLD:END -->
   따라서 몇 번을 다시 돌려도 결과가 같다(멱등). 마커 밖의 수기 편집은 보존된다. */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://esstone.co.kr';

const START = '<!-- SEO-JSONLD:START -->';
const END = '<!-- SEO-JSONLD:END -->';

/* ── 사업자 정보 (한 곳에서만 관리) ──
   geo 는 구글 지도가 이 도로명주소를 지오코딩한 좌표이며,
   OSM 역지오코딩(정금로 · 금현리 · 포천시)으로 교차 확인했다. */
const BIZ = {
  legalName: '(주)은성',
  name: '(주)은성 EUNSUNG',
  alternateName: ['EUNSUNG', '은성', '은성 세라믹'],
  founder: '이언기',
  foundingDate: '2009',
  tel: '+82-31-544-7272',
  fax: '+82-31-544-6868',
  email: 'eunsung8585@naver.com',
  street: '가산면 정금로 356-39',
  locality: '포천시',
  region: '경기도',
  postalCode: '11164',
  country: 'KR',
  geo: { lat: 37.8179451, lng: 127.1969716 },
  image: SITE + '/images/og-cover.jpg',
};

const FULL_ADDRESS = BIZ.region + ' ' + BIZ.locality + ' ' + BIZ.street;

const address = () => ({
  '@type': 'PostalAddress',
  streetAddress: BIZ.street,
  addressLocality: BIZ.locality,
  addressRegion: BIZ.region,
  postalCode: BIZ.postalCode,
  addressCountry: BIZ.country,
});

/* 평일 08:30–17:30, 주말·공휴일 휴무 (contact.html 의 영업시간 표와 동일) */
const openingHours = () => [{
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '08:30',
  closes: '17:30',
}];

function organization() {
  return {
    '@type': 'Organization',
    '@id': SITE + '/#organization',
    name: BIZ.legalName,
    alternateName: BIZ.alternateName,
    url: SITE + '/',
    logo: BIZ.image,
    image: BIZ.image,
    description: '포세린·비아테라·하이막스 등 표면재의 선별·가공·시공을 직접 수행하는 전문 기업. LX하우시스 공식 파트너.',
    foundingDate: BIZ.foundingDate,
    founder: { '@type': 'Person', name: BIZ.founder },
    employee: { '@type': 'Person', name: BIZ.founder, jobTitle: '대표이사' },
    telephone: BIZ.tel,
    faxNumber: BIZ.fax,
    email: BIZ.email,
    address: address(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BIZ.tel,
      contactType: 'customer service',
      areaServed: 'KR',
      availableLanguage: ['ko', 'en'],
    },
  };
}

function localBusiness() {
  return {
    '@type': 'LocalBusiness',
    '@id': SITE + '/#localbusiness',
    name: BIZ.name,
    parentOrganization: { '@id': SITE + '/#organization' },
    url: SITE + '/',
    image: BIZ.image,
    description: '경기도 포천 자체 공장에서 포세린·비아테라·하이막스 슬랩을 재단·가공하고 현장 시공까지 진행합니다. 쇼룸 방문 상담 가능.',
    telephone: BIZ.tel,
    faxNumber: BIZ.fax,
    email: BIZ.email,
    address: address(),
    geo: { '@type': 'GeoCoordinates', latitude: BIZ.geo.lat, longitude: BIZ.geo.lng },
    hasMap: 'https://map.naver.com/p/search/' + encodeURIComponent(FULL_ADDRESS),
    openingHoursSpecification: openingHours(),
    areaServed: { '@type': 'Country', name: '대한민국' },
    knowsAbout: ['포세린 시공', '비아테라', '하이막스', 'BMC', '주방 상판', '아트월'],
  };
}

function breadcrumb(trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': SITE + '/#breadcrumb',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: SITE + t.path,
    })),
  };
}

/* ── 쇼룸 ItemList — data/products-*.json 전량을 제품 목록으로 편다 ── */
const BRANDS = [
  { file: 'products-terracanto.json', catKey: 'PORCELAIN', catKo: '포세린', brand: 'LX Hausys' },
  { file: 'products-viatera.json', catKey: 'VIATERA', catKo: '엔지니어드 스톤', brand: 'LX Hausys' },
  { file: 'products-himacs.json', catKey: 'HIMACS', catKo: '인조대리석', brand: 'LX Hausys' },
  { file: 'products-bmc.json', catKey: 'BMC', catKo: 'BMC', brand: '(주)코반 산업' },
];

function productItemList() {
  const items = [];
  for (const b of BRANDS) {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', b.file), 'utf8'));
    for (const p of raw) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        item: {
          '@type': 'Product',
          name: p.name + ' ' + p.code,
          alternateName: p.en,
          sku: p.code,
          category: b.catKo + ' · ' + b.catKey,
          brand: { '@type': 'Brand', name: b.brand },
          image: SITE + '/' + p.image,
          url: SITE + '/product-detail.html?code=' + encodeURIComponent(p.code),
        },
      });
    }
  }
  return {
    '@type': 'ItemList',
    '@id': SITE + '/showroom.html#products',
    name: '은성 소재 컬렉션',
    description: '포세린·엔지니어드 스톤·인조대리석·BMC 전 소재 라인업.',
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items,
  };
}

/* ── 페이지별 구성 ── */
const PAGES = {
  'index.html': { trail: [{ name: '홈', path: '/' }] },
  'about.html': { trail: [{ name: '홈', path: '/' }, { name: '회사소개', path: '/about.html' }] },
  'facility.html': { trail: [{ name: '홈', path: '/' }, { name: '시공 과정', path: '/facility.html' }] },
  'portfolio.html': { trail: [{ name: '홈', path: '/' }, { name: '시공사례', path: '/portfolio.html' }] },
  'contact.html': { trail: [{ name: '홈', path: '/' }, { name: '문의', path: '/contact.html' }] },
  'showroom.html': {
    trail: [{ name: '홈', path: '/' }, { name: '쇼룸', path: '/showroom.html' }],
    extra: productItemList,
  },
  'product-detail.html': {
    trail: [
      { name: '홈', path: '/' },
      { name: '쇼룸', path: '/showroom.html' },
      { name: '제품 상세', path: '/product-detail.html' },
    ],
  },
};

function blockFor(file) {
  const cfg = PAGES[file];
  const graph = [organization(), localBusiness(), breadcrumb(cfg.trail)];
  if (cfg.extra) graph.push(cfg.extra());
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  return [
    START,
    '<!-- 이 구간은 scripts/build-seo.js 가 생성합니다. 직접 고치지 마세요 —',
    '     제품 데이터나 사업자 정보가 바뀌면 `node scripts/build-seo.js` 를 다시 실행하세요. -->',
    '<script type="application/ld+json">',
    json,
    '</script>',
    END,
  ].join('\n');
}

let changed = 0;
for (const file of Object.keys(PAGES)) {
  const p = path.join(ROOT, file);
  const html = fs.readFileSync(p, 'utf8');
  const block = blockFor(file);

  const s = html.indexOf(START);
  const e = html.indexOf(END);
  let next;
  if (s !== -1 && e !== -1) {
    next = html.slice(0, s) + block + html.slice(e + END.length);
  } else {
    const head = html.indexOf('</head>');
    if (head === -1) throw new Error(file + ': </head> 를 찾지 못했습니다');
    next = html.slice(0, head) + block + '\n' + html.slice(head);
  }
  if (next !== html) {
    fs.writeFileSync(p, next);
    changed++;
    console.log('  updated  ' + file);
  } else {
    console.log('  ok       ' + file);
  }
}
console.log('\nJSON-LD 갱신 완료 — ' + changed + '/' + Object.keys(PAGES).length +
  '개 파일, 쇼룸 제품 ' + productItemList().numberOfItems + '건.');
