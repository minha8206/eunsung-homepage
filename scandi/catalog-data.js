// 은성 쇼룸 카탈로그 — LX하우시스 실제 라인업 기준 (TERACANTO / VIATERA / HIMACS 공식 컬러명)
// 이미지는 임시 텍스처입니다. 공식 제품 이미지를 받으면 각 제품의 img 값만 교체하세요.

export const TONE_LABEL = { white: '화이트', beige: '베이지', gray: '그레이', dark: '다크' };

export const CATALOG = {
  PORCELAIN: {
    ko: '포세린', en: 'PORCELAIN',
    items: [], // fetch로 채워짐 — getCatalog() 참고
  },
  VIATERA: {
    ko: '엔지니어드 스톤', en: 'VIATERA',
    items: [], // fetch로 채워짐 — getCatalog() 참고
  },
  HIMACS: {
    ko: '인조대리석', en: 'HIMACS',
    items: [], // fetch로 채워짐 — getCatalog() 참고
  },
  BMC: {
    ko: 'BMC', en: 'BMC',
    items: [], // fetch로 채워짐 — getCatalog() 참고
  },
};

export function findProduct(code) {
  for (const key of Object.keys(CATALOG)) {
    const p = CATALOG[key].items.find(it => it.code === code);
    if (p) return { ...p, catKey: key, catKo: CATALOG[key].ko, catEn: CATALOG[key].en };
  }
  return null;
}

// ── HIMACS 실데이터 (data/products-himacs.json, LX지인 하이막스 126개) ──
// 이름 키워드로 색상(tone)을 자동 추정합니다. 공식 컬러 분류가 아니므로
// 색상 필터 결과가 어색하면 이 표를 조정하세요.
const HM_DARK = ['블랙','나이트','차콜','에보니','오닉스','다크','시크','니로','버건디','엄버','딥','쉐도우','미드나잇','커피','레드','에메랄드','에머랄드','사파이어','루비'];
const HM_GRAY = ['그레이','스틸','실버','스모크','콘크리트','윈디','쿨','슬레이트','미스트','더스크','그린'];
const HM_BEIGE = ['베이지','크림','아이보리','샌드','아몬드','코튼','마키아토','다즐링','카모마일','쿠키','클레이','캐니언','플루마','앙고라','테라','파비아','비스크','에크루','리넨','헤리티지','스웨이드','바나나','오렌지'];
const HM_WHITE = ['화이트','블랑','스노우','새틴','알파인','다이아몬드','고스트','아틱','비앙코','펄','밀키','아이스','오팔'];
const HM_OVERRIDE = { '아이스버그': 'gray', '토라노': 'white', '제미니': 'white', '산타아나': 'dark', '모닝캄': 'white', '스와니': 'gray', '코로나': 'beige', '마자린 블루': 'gray' };
const HM_COLLECTION_DEFAULT = { '오로라&칼라카타': 'white', '그라빌라': 'beige', '그라나이트': 'gray', '솔리드': 'gray', '인텐스 울트라': 'gray', '루센트': 'dark', '콘크리트': 'gray', '볼케닉스': 'dark', '루시아': 'white', '에스터': 'gray', '테라조': 'beige' };
const HM_STYLE = { '오로라&칼라카타': '마블 · Marble', '그라빌라': '스톤 · Stone', '그라나이트': '스톤 · Stone', '솔리드': '솔리드 · Solid', '인텐스 울트라': '솔리드 · Solid', '루센트': '솔리드 · Solid', '콘크리트': '콘크리트 · Concrete', '볼케닉스': '스톤 · Stone', '루시아': '마블 · Marble', '에스터': '솔리드 · Solid', '테라조': '테라조 · Terrazzo' };
const HM_DESC = {
  white: '인조대리석 화이트 계열 특유의 깨끗하고 안정된 인상 —\n이음매 없는 시공으로 어떤 공간에도 무난하게 어울립니다.',
  beige: '따뜻한 웜톤의 인조대리석 베이지 계열 —\n우드 소재와 배색했을 때 특히 잘 어울리는 컬러입니다.',
  gray: '차분한 뉴트럴 톤의 인조대리석 그레이 계열 —\n모던하고 도시적인 공간 연출에 적합합니다.',
  dark: '깊이감 있는 인조대리석 다크 톤 —\n공간에 무게감과 고급스러운 존재감을 더합니다.',
};
const HM_SPECS = ['3680×760 · 12T', '3680×910 · 12T'];

function classifyHimacsTone(name, collection) {
  if (HM_OVERRIDE[name]) return HM_OVERRIDE[name];
  for (const k of HM_DARK) if (name.includes(k)) return 'dark';
  for (const k of HM_GRAY) if (name.includes(k)) return 'gray';
  for (const k of HM_BEIGE) if (name.includes(k)) return 'beige';
  for (const k of HM_WHITE) if (name.includes(k)) return 'white';
  return HM_COLLECTION_DEFAULT[collection] || 'white';
}

// ── PORCELAIN(TERACANTO) 실데이터 (data/products-terracanto.json, LX지인 포세린 23개) ──
const PC_DARK_STRONG = ['블랙'];
const PC_GRAY_STRONG = ['그레이', '그리지오'];
const PC_BEIGE_STRONG = ['베이지', '크림', '아이보리'];
const PC_WHITE_STRONG = ['화이트', '비앙코'];
const PC_DARK_WEAK = [];
const PC_GRAY_WEAK = ['그라나이트', '실버', '스틸'];
const PC_BEIGE_WEAK = ['트래버티노', '트레버티노', '크레모', '델리카토', '도라토'];
const PC_WHITE_WEAK = ['칼라카타', '스타투아리오', '앱솔루트', '히말라야'];
const PC_COLLECTION_DEFAULT = { '라이트 마블 룩': 'white', '다크 마블 룩': 'dark', '콘크리트 룩': 'gray', '스톤 룩': 'beige' };
const PC_STYLE = { '라이트 마블 룩': '마블 · Marble', '다크 마블 룩': '마블 · Marble', '콘크리트 룩': '콘크리트 · Concrete', '스톤 룩': '스톤 · Stone' };
/* 설명의 \n 은 상세 페이지(white-space:pre-line)에서 대시 뒤 줄바꿈으로 살아난다.
   pre-line 이 아닌 곳(쇼룸 등)에서는 공백으로 접히므로 어디서든 안전하다. */
const PC_DESC = {
  white: '포세린 화이트 계열 특유의 맑고 정제된 인상 —\n대형 슬랩으로 이음매를 최소화한 웅장한 면 연출이 가능합니다.',
  beige: '따뜻한 웜톤의 포세린 베이지 계열 —\n내추럴한 우드 소재와 배색했을 때 특히 잘 어울립니다.',
  gray: '차분한 뉴트럴 톤의 포세린 그레이 계열 —\n모던하고 도시적인 공간 연출에 적합합니다.',
  dark: '깊이감 있는 포세린 다크 톤 —\n공간에 무게감과 고급스러운 존재감을 더합니다.',
};
const PC_SPECS = ['3200×1600 · 12T', '3200×1600 · 20T'];

function classifyPorcelainTone(name, collection) {
  for (const k of PC_DARK_STRONG) if (name.includes(k)) return 'dark';
  for (const k of PC_GRAY_STRONG) if (name.includes(k)) return 'gray';
  for (const k of PC_BEIGE_STRONG) if (name.includes(k)) return 'beige';
  for (const k of PC_WHITE_STRONG) if (name.includes(k)) return 'white';
  for (const k of PC_DARK_WEAK) if (name.includes(k)) return 'dark';
  for (const k of PC_GRAY_WEAK) if (name.includes(k)) return 'gray';
  for (const k of PC_BEIGE_WEAK) if (name.includes(k)) return 'beige';
  for (const k of PC_WHITE_WEAK) if (name.includes(k)) return 'white';
  return PC_COLLECTION_DEFAULT[collection] || 'white';
}

// ── VIATERA 실데이터 (data/products-viatera.json, LX지인 이스톤(비아테라) 70개) ──
const VT_DARK = ['블랙', '오닉스', '마르퀴나', '시크'];
const VT_GRAY = ['그레이', '실버', '콘크리트'];
const VT_BEIGE = ['베이지', '골드', '카퍼'];
const VT_WHITE = ['화이트', '펄', '칼라카타', '스완', '클라우드', '스노우'];
const VT_OVERRIDE = { '칼라카타 골드': 'white' };
const VT_COLLECTION_DEFAULT = { '럭셔리': 'beige', '플로라': 'white', '로열': 'beige', '문명': 'dark', '노블': 'beige', '모노': 'gray', '미러': 'dark', '멀티': 'dark', '퓨어': 'white', 'LEV': 'beige' };
const VT_STYLE = { '럭셔리': '마블 · Marble', '플로라': '마블 · Marble', '로열': '마블 · Marble', '문명': '스톤 · Stone', '노블': '마블 · Marble', '모노': '솔리드 · Solid', '미러': '스톤 · Stone', '멀티': '마블 · Marble', '퓨어': '솔리드 · Solid', 'LEV': '마블 · Marble' };
const VT_DESC = {
  white: '엔지니어드 스톤 화이트 계열 특유의 맑고 정제된 인상 —\n쿼츠 함량 최대 93%의 뛰어난 내구성으로 어떤 공간에도 무난하게 어울립니다.',
  beige: '따뜻한 웜톤의 엔지니어드 스톤 베이지 계열 —\n골드·카퍼 톤 베인이 우드 소재와 배색했을 때 특히 잘 어울립니다.',
  gray: '차분한 뉴트럴 톤의 엔지니어드 스톤 그레이 계열 —\n모던하고 도시적인 공간 연출에 적합합니다.',
  dark: '깊이감 있는 엔지니어드 스톤 다크 톤 —\n공간에 무게감과 고급스러운 존재감을 더합니다.',
};
const VT_SPECS = ['3230×1630 · 20T', '3230×1630 · 30T'];

function classifyViateraTone(name, collection) {
  if (VT_OVERRIDE[name]) return VT_OVERRIDE[name];
  for (const k of VT_DARK) if (name.includes(k)) return 'dark';
  for (const k of VT_GRAY) if (name.includes(k)) return 'gray';
  for (const k of VT_BEIGE) if (name.includes(k)) return 'beige';
  for (const k of VT_WHITE) if (name.includes(k)) return 'white';
  return VT_COLLECTION_DEFAULT[collection] || 'white';
}

// ── BMC 실데이터 (data/products-bmc.json, 은성 자체 BMC 바이컬 라인 4종) ──
const BMC_TONE = { '바이컬 화이트': 'white', '바이컬 브라운': 'dark', '바이컬 그레이': 'gray', '바이컬 밀키': 'white' };
const BMC_STYLE = { '바이컬': '솔리드 · Solid' };
const BMC_DESC = {
  white: '포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 화이트 톤 —\n세면대·상판 일체형 제작이 가능합니다.',
  beige: '포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 베이지 톤 —\n세면대·상판 일체형 제작이 가능합니다.',
  gray: '포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 그레이 톤 —\n세면대·상판 일체형 제작이 가능합니다.',
  dark: '포천 자체 공장에서 주문 치수로 성형하는 은성 BMC 다크 톤 —\n세면대·상판 일체형 제작이 가능합니다.',
};
const BMC_SPECS = ['주문 성형 · 10T', '주문 성형 · 15T'];

function classifyBmcTone(name) {
  return BMC_TONE[name] || 'white';
}

// ── 색상 필터용 세분화 (White/Ivory/Beige/Gold/Brown/Gray/Dark Gray/Black) ──
// 기존 4단계 tone(white/beige/gray/dark)을 이름 키워드로 한 번 더 세분화합니다.
// 공식 컬러 분류가 아니라 이름 기반 근사치이므로, 결과가 어색하면 키워드를 조정하세요.
const COLOR_GOLD_KW = ['골드'];
const COLOR_IVORY_KW = ['아이보리'];
const COLOR_BLACK_KW = ['블랙', '오닉스', '에보니', '나이트', '미드나잇'];
const COLOR_BROWN_KW = ['브라운', '카퍼', '엄버', '커피', '호두', '월넛'];

export const COLOR_LABEL = { white: 'White', ivory: 'Ivory', beige: 'Beige', gold: 'Gold', brown: 'Brown', gray: 'Gray', darkgray: 'Dark Gray', black: 'Black' };
export const COLOR_SWATCH = { white: '#F5F3EE', ivory: '#F0E6D2', beige: '#E3D0B0', gold: '#C9A24B', brown: '#6B4A32', gray: '#9CA3AF', darkgray: '#4B5563', black: '#1A1A1A' };
export const COLOR_LIGHT = new Set(['white', 'ivory', 'beige']);
export const COLOR_ORDER = ['white', 'ivory', 'beige', 'gold', 'brown', 'gray', 'darkgray', 'black'];

function refineColor(name, tone) {
  if (tone === 'beige') {
    if (COLOR_IVORY_KW.some(k => name.includes(k))) return 'ivory';
    if (COLOR_GOLD_KW.some(k => name.includes(k))) return 'gold';
    return 'beige';
  }
  if (tone === 'dark') {
    if (COLOR_BROWN_KW.some(k => name.includes(k))) return 'brown';
    if (COLOR_BLACK_KW.some(k => name.includes(k))) return 'black';
    return 'darkgray';
  }
  return tone; // white → white, gray → gray
}

/* 제품 스와치 색감 보정 (전 소재 공통)
   소스가 LX 서버의 550×550 썸네일이라 파일 자체를 손댈 수 없다. 대신
   렌더 시점에 CSS 필터로 채도·대비를 올려 석재의 깊이감을 살린다.
   값은 요청 범위(채도 +10~15%, 대비 +8~12%, 밝기 -3~5%)의 중간값.
   여기 한 곳만 고치면 쇼룸 카드·상세 히어로·대형 텍스처·확대뷰에 모두 적용된다. */
const SWATCH_TINT = 'saturate(1.12) contrast(1.10) brightness(0.97)';

function mapRealItems(raw, { classify, desc, style, styleDefault, specs, stdSize, finish, brand, origin, material }) {
  return raw.map((p, i) => {
    const tone = classify(p.name, p.collection);
    const spec = specs[i % specs.length];
    const [size, thick] = spec.split(' · ');
    return {
      en: p.name, ko: p.collection, tone,
      color: refineColor(p.name, tone),
      desc: desc[tone],
      code: p.code, spec, size, thick,
      // 제품별 개별 사이즈 대신 소재별 표준 사이즈 하나로 통일해 표기한다
      stdSize,
      finish,
      style: style[p.collection] || styleDefault,
      brand, origin, material,
      img: p.image, tint: SWATCH_TINT,
    };
  });
}

let catalogLoaded = null;

// data/products-himacs.json, data/products-terracanto.json을 fetch로 불러와
// CATALOG.HIMACS.items / CATALOG.PORCELAIN.items를 채운 뒤 CATALOG를 반환합니다.
// 여러 번 호출해도 fetch는 한 번만 실행됩니다.
export function getCatalog() {
  if (!catalogLoaded) {
    catalogLoaded = Promise.all([
      fetch('data/products-himacs.json').then(res => res.json()),
      fetch('data/products-terracanto.json').then(res => res.json()),
      fetch('data/products-viatera.json').then(res => res.json()),
      fetch('data/products-bmc.json').then(res => res.json()),
    ])
      .then(([himacsRaw, terracantoRaw, viateraRaw, bmcRaw]) => {
        CATALOG.HIMACS.items = mapRealItems(himacsRaw, {
          classify: classifyHimacsTone, desc: HM_DESC, style: HM_STYLE, styleDefault: '솔리드 · Solid',
          specs: HM_SPECS, stdSize: '12T × 3680 × 760', finish: 'Matte', brand: 'LX Hausys', origin: '한국', material: '인조대리석',
        });
        CATALOG.PORCELAIN.items = mapRealItems(terracantoRaw, {
          classify: classifyPorcelainTone, desc: PC_DESC, style: PC_STYLE, styleDefault: '스톤 · Stone',
          specs: PC_SPECS, stdSize: '12T × 3200 × 1600', finish: 'Polished', brand: 'LX Hausys', origin: '이탈리아 (Made in Italy)', material: '포세린',
        });
        CATALOG.VIATERA.items = mapRealItems(viateraRaw, {
          classify: classifyViateraTone, desc: VT_DESC, style: VT_STYLE, styleDefault: '마블 · Marble',
          specs: VT_SPECS, stdSize: '20T × 3040 × 1400', finish: 'Polished', brand: 'LX Hausys', origin: '한국 · 미국', material: '엔지니어드 스톤',
        });
        CATALOG.BMC.items = mapRealItems(bmcRaw, {
          classify: classifyBmcTone, desc: BMC_DESC, style: BMC_STYLE, styleDefault: '솔리드 · Solid',
          specs: BMC_SPECS, stdSize: '다양한 규격 — 용도에 따라 맞춤 생산', finish: 'Matte', brand: '(주)은성 BMC', origin: '한국 (포천 자체 공장)', material: 'BMC 인조대리석',
        });
        return CATALOG;
      })
      .catch(err => { console.error('카탈로그 데이터 로드 실패', err); return CATALOG; });
  }
  return catalogLoaded;
}

// 레퍼런스 시공 사진 (실제 시공 사례)
const REFERENCE_WORKS = [
  { img: 'assets/ref-kitchen.jpg', label: '주방 상판 및 씽크 시공' },
  { img: 'assets/ref-cafe-counter.jpg', label: '카페 카운터 상판 시공' },
  { img: 'assets/ref-wall-top.jpg', label: '벽체 및 상판 마감 시공' },
];

export const REFERENCES = {
  white: REFERENCE_WORKS,
  beige: REFERENCE_WORKS,
  gray: REFERENCE_WORKS,
  dark: REFERENCE_WORKS,
};
