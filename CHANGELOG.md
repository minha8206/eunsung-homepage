# CHANGELOG — esstone.co.kr (scandi/)

## 2026-09-03 · 성능 · 버그 · 모바일 정비

### 1. BMC 메뉴 링크
- showroom.html, product-detail.html 의 상단 메뉴 · 구형 모바일 패널 · 푸터 → `bmc.html`
- 전 페이지 공통 드로어(`assets/js/mobile-nav.js`)와 검색 오버레이(`assets/js/search-overlay.js`)의 BMC 항목도 `bmc.html`
- bmc.html 본문의 "전체 컬러 보기 →" / 컬러 카드는 의도대로 `showroom.html?cat=BMC` 유지

### 2. 미디어
**영상** (`assets/video/`, 원본 hero-scroll.mp4 · story-montage.mp4 는 그대로 둠)

| 파일 | 규격 | 크기 |
|---|---|---|
| hero-scroll.mp4 (원본, 이제 미참조) | 1920×1080 · 18.8Mbps · 음성 트랙 포함 | 22.7MB |
| hero-scroll-desktop.mp4 | 1920×1080 · CRF 28 · 무음 · faststart | 2.5MB |
| hero-scroll-mobile.mp4 | 720×1280 세로 중앙 크롭 · CRF 30 | 0.98MB |
| story-montage.mp4 (원본, 미참조) | 1920×1080 | 13.4MB |
| story-montage-desktop.mp4 | 1920×1080 · CRF 33 | 3.8MB |
| story-montage-mobile.mp4 | 1280×720 · CRF 32 | 2.1MB |
| hero-poster-mobile.jpg / story-poster.jpg | 세로 포스터 · 스토리 포스터 (신규) | 46KB / 30KB |

- 히어로: `<source media="(min-width:1024px)">` / `(max-width:1023px)` 분기, `preload="metadata"`, 포스터는 뷰포트에 맞는 한 장만 지정하고 `<head>` 에서 preload. 소스는 `data-src` 로 두었다가 첫 콘텐츠 페인트 뒤에 붙인다(포스터·CSS 와 대역폭 경쟁 방지).
- 스토리 몽타주: `preload="none"` + `autoplay` 속성 제거, IntersectionObserver 가 반 화면 앞에서 load(), 20% 보일 때 play(). 포스터도 그때 붙인다.
- index 의 Google 지도 iframe `loading="lazy"`.

**이미지** (긴 변 1600px · WebP q80 · 원본 파일은 디스크에 그대로 남아 있음 — 삭제는 확인 후)

| 대상 | 전 | 후 |
|---|---|---|
| images/facility/*.png 5장 | 34.4MB | 0.55MB |
| assets/about-factory-sunset · showroom-hero · island-quartzite · lobby-cream · about-factory-interior · about-warehouse-agv · marble-gold/white/dark · porcelain · viatera · himacs | 12.4MB | 0.9MB |
| images/cases/{yeoju/01-03, namyangju/01, seongsu/02-03} | 2.1MB | 0.9MB |
| showroom.js 제품 이미지 22개 (minha8206.github.io 외부 호스트, 최대 17MB) → `images/showroom/<코드>.webp` 17장 | 55MB | 1.4MB |

- 첫 화면 밖 배경 이미지는 `data-bg` + `assets/js/lazy-bg.js`(IntersectionObserver, 반 화면 앞) 로 지연 로드: index 소재 배너 4장, facility 공정 사진 2~10번. `<img>` 는 width/height 명시 + `decoding="async"`, 기존 `loading="lazy"` 유지.
- `scandi/_headers`: `/assets/*` `/images/*` `/vendor/*` → 1년 immutable, HTML → `max-age=0, must-revalidate`.

### 3. 코드
- **폰트**: Cormorant Garamond · Manrope 는 Google 의 latin 가변 woff2 를 `assets/fonts/` 에 자체 호스팅(동일 파일·동일 unicode-range → 글꼴 모양 동일) 하고 `<link rel=preload>`. Google 은 UA 마다 파일 URL 이 달라 외부 URL preload 는 빗나갔다. Noto Serif KR 은 Google CSS 를 첫 페인트 뒤에 JS 로 주입(display=swap). 요청하던 weight 는 전부 실제 사용 중이라(Manrope 300 ×2, Cormorant 500 italic ×1 포함) 줄이지 않았다.
- **contact.html Pretendard**: 이 페이지 전용 산세리프로 실제 사용 중(`--ct-sans`) → 제거하지 않고 비차단 로드로 변경.
- **React**: unpkg 대신 `vendor/react*.production.min.js` (SRI 로 원본 동일 확인) 를 `defer` 로 support.js 앞에 둠. support.js 도 `defer` (기존엔 head 동기 스크립트).
- **CSS 번들**: 공통 CSS 10개 → `assets/css/site.css` (`node scripts/build-css.js` 로 생성. **개별 css 를 고치면 반드시 재빌드**). 렌더 차단 요청 10 → 1. 페이지별 인라인 nav CSS 는 showroom/product-detail/contact 가 같은 선택자를 다른 값으로 덮고 있어 분리하면 모습이 바뀌므로 그대로 둠.
- **JS**: `js/i18n-en.js`(60KB) 는 EN 이 저장돼 있거나 토글할 때만 로드. login-modal 의 Supabase 세션 복구(54KB CDN)는 `load` 이후로 지연. index 인라인 스크립트 3개 → `assets/js/home.js`.
- **LCP 발견**: bmc 히어로 배경, facility 첫 공정 사진, showroom 첫 두 상품 이미지 `<link rel=preload>`.
- **showroom CLS 0.60 → 0.05**: 카탈로그 로딩 중 빈 그리드 때문에 푸터가 올라왔다 밀리던 것 → 로딩 상태(`:not(:has(.pgrid))`)에서만 래퍼 `min-height:100vh`.

### 4. 모바일 히어로
- `assets/js/home.js`: 데스크톱(≥1024) 은 기존 스크롤 확장 코드 그대로(재시도 로직 포함). 모바일(≤1023) 은 별도 경로 — 100svh 풀스크린, `autoplay muted loop playsinline` 무한 재생, 스크롤 진행도·rAF·currentTime 조작 없음. 재생 거부 시 포스터 유지 + 첫 터치 때 1회 재시도. 같은 포스터를 `.vhero-media` 배경으로도 깔아 둠.
- CSS: 데스크톱 구조 규칙은 `@media (min-width:1024px)`, 모바일은 별도 블록. `mobile-pages.css` 의 `!important` 덮어쓰기 블록 제거. EUNSUNG 타이틀·카피 유지, 하단 "SCROLL" 유도 1개(CTA 바 위).

### 5. 모바일 점검 (headless Chrome, 375/390/430 × 8페이지)
자동 점검 항목: 가로 스크롤 · 뷰포트 밖 요소 · 터치 영역 <44px · overflow 로 잘린 텍스트 · 한글 keep-all 누락 · `<img>` 비율 왜곡 · 고정 헤더가 첫 콘텐츠를 가리는지.
- 가로 스크롤: 없음(전 페이지 scrollWidth = 뷰포트). contact 의 `.ct-hp` 는 의도된 허니팟(오프스크린) → 제외.
- 텍스트 잘림 / keep-all 누락: 없음(typography.css 가 전역 keep-all).
- 고정 헤더 가림: 없음(index 는 영상이 헤더 뒤로 지나가는 의도된 구조).
- **수정**
  - about: LX 로고 `<img>` 가 164×30 박스에 늘려 그려짐(6.17:1 → 5.47:1) → `object-fit:contain`
  - bmc: "전체 컬러 보기 →" 97×26, "제품 카탈로그 전체 보기 →" 149×26 → `::after` 로 44px 터치 영역
  - product-detail: 브레드크럼 홈/쇼룸/카테고리 12~35px 폭 → padding/음수 margin 으로 터치 폭 확장
  - 드로어 KO/EN 토글 40px 폭 → 44px
  - index 모바일 히어로: 스크롤 유도가 하단 CTA 바(58px) 에 가려짐 → 바 위로 이동
- **드로어**(`assets/css/mobile.css` `.mnav-*`): 한글은 Noto Serif KR 400 으로 통일(상단 메뉴 500 → 400, 검색/로그인/카카오 버튼 500 → 400), 위계는 크기(상단 24~30px / 소재 17px)로만. 리듬 — 섹션 간격 36px, 유틸 줄과 상담 블록 위에 같은 하이라인 + 24px, 아이브로우/캡션 아래 12px, 자간 .3em 통일. 번호 컬럼(22px + 14px) 과 하위 메뉴 들여쓰기(36px) 정렬 유지.

### Lighthouse (모바일 · 로컬 정적 서버 · 시뮬레이션 스로틀링 · 1회 측정)

| 페이지 | Performance 전 → 후 | LCP 전 → 후 | 비고 |
|---|---|---|---|
| index | 84 → **80** | 4.1s → 5.0s | LCP 요소가 포스터(영상) → `EUNSUNG` 텍스트로 바뀜. 실측(unthrottled) LCP 는 ~0.3s |
| showroom | 41 → **63~68** | 8.8s → 8.3s | CLS 0.60 → 0.05. 총 전송량 1.9MB → 1.8MB |
| bmc | 74 → **82** | 5.0s → 4.5s | |
| facility | 69 → **78** | 10.1s → 5.2s | 총 전송량 36MB → 1.3MB |

**목표(80 / LCP 2.5s) 미달 원인과 한계**
- 이 사이트는 `support.js`(x-dc 런타임)가 페이지를 다시 fetch 하고 React 로 전체를 클라이언트에서 다시 그린다. `<x-dc>` 안의 모든 콘텐츠(헤더 포함)는 그 마운트 이후에야 보인다. Lighthouse 의 LCP 시뮬레이션은 LCP 이전에 시작된 모든 요청(React 140KB + 런타임 59KB + HTML 재요청 + 페이지 스크립트)을 비관적 그래프에 넣기 때문에, 이 구조를 바꾸지 않는 한 모바일 LCP 2.5s 는 닿지 않는다.
- index: Chrome 은 뷰포트를 꽉 채우는 이미지를 배경으로 보고 LCP 후보에서 제외한다(96svh 로 줄이면 후보가 됨 — 실험으로 확인). 그래서 모바일 풀스크린 히어로에서는 포스터가 아닌 타이틀 텍스트가 LCP 가 되고, 텍스트 LCP 는 위의 비관적 그래프에 그대로 묶인다. 실제 사용자 측정(CrUX) 관점에서는 텍스트가 0.3s 에 그려지므로 유리한 변화다.
- showroom: 166KB HTML 재요청 → 카탈로그 JSON 4개(두 번 요청됨: i18n-products.js 와 catalog-data.js 가 각각) → 그리드 렌더 순서라 LCP 이미지가 늦게 시작한다. 3D/필터 로직은 건드리지 않았다.
- Lighthouse 는 1회 측정이라 ±5점 흔들린다(showroom 63~68).

### 확인 필요 / 후속
- Netlify publish 디렉터리가 `scandi/` 인지 확인 — `_headers` 는 그 기준으로 동작한다. 저장소 루트 `_redirects` 는 구 사이트용이다.
- 변환된 원본(PNG/JPG 23개 + 비참조 mp4 2개, 약 100MB) 삭제 여부.
- `favicon.ico` 가 없어 전 페이지 404 1건 — 파비콘 준비되면 추가.
