# CHANGELOG — esstone.co.kr (scandi/)

## 2026-09-08 · 개인정보처리방침 페이지(/privacy) 신설 + 문의 폼 "더 보기" 링크

- **`privacy.html` 신규**: contact.html 의 head(메타·폰트·site.css·공통 스크립트)·헤더·푸터를 그대로 가져오고, 히어로(골드 eyebrow "PRIVACY POLICY" · 제목 · 한 줄 설명 · 시행일 2026-09-08)와 본문(최대 780px 단일 컬럼, `h2` 조항 제목은 Noto Serif KR, 표는 헤어라인 보더 · 모바일 가로 스크롤). 배경은 크림 #F5F1E8. `/privacy` 는 Netlify Pretty URL 로 동작(_redirects 불필요).
- **본문 [분기] 반영**: 폼 데이터가 Netlify Function → Supabase 저장 + Resend 이메일 + 카카오톡 알림으로 흐르므로 제4조 위탁 표를 Supabase, Inc. · Resend, Inc. · 카카오(주)(국내) · Netlify, Inc. 로 구성(Web3Forms 제외). 일반 회원가입·구글/카카오 소셜 로그인이 있어 제1조 목적 · 제2조 표에 회원 행 추가, "회원가입을 받지 않으며" 문구 대신 14세 미만 문구만. 트래킹 스크립트 없음 → 제8조 쿠키 미사용 + 로그인 유지용 localStorage 안내 한 문장. 보호책임자 이언기(대표), 연락처 010-5430-2580 / ceramices@naver.com.
- **contact.html**: 동의 라벨 오른쪽에 "더 보기"(`/privacy`, 새 탭, `<label>` 밖이라 체크 토글 안 됨). 골드 밑줄 12.5px.
- **공통 푸터**: 카피라이트 옆에 "개인정보처리방침" 링크 — about · bmc · bmc/products · contact · facility · index · portfolio · privacy. 카피라이트 텍스트 노드는 그대로 두어 i18n 키 유지. 보호 파일(showroom · product-detail)은 제외.
- `sitemap.xml` 에 privacy.html 추가, `js/i18n-en.js` 에 '더 보기' · '개인정보처리방침' 키.


## 2026-09-08 · 문의 페이지 안내 정보 · 동의 문구 · 플로팅 위젯 상시 노출

- **contact.html 상담 안내**: TEL 은 010-5430-2580 하나만(tel: 링크 포함), E-MAIL ceramices@naver.com, HOURS 구분자 `~` 로 통일하고 "(휴게)" 삭제. 제목·메타·하단 감사 문구·푸터의 031-544-7272 는 요청 범위 밖이라 그대로.
- **이메일 교체**: eunsung8585@naver.com → ceramices@naver.com — about · bmc · bmc/products · facility · index · portfolio · contact 의 JSON-LD·푸터, `js/i18n-en.js`, `scripts/build-seo.js`(BIZ.email). 보호 파일 showroom.html · product-detail.html 은 그대로 남아 있음(수정 금지).
- **동의 체크박스**: 라벨 "개인정보 수집 및 이용에 동의합니다"(필수 * 유지), 설명 문구와 `.ct-agree-sub` 규칙 삭제, 체크박스를 라벨과 세로 중앙 정렬.
- **플로팅 위젯**(`assets/js/inquiry-widget.js` · `assets/css/inquiry-widget.css` → `site.css` 재빌드): 채팅 아이콘 메인 버튼 · X 닫기 · is-open 토글 · 바깥 클릭/Esc 닫기 · 세션 1회 안내 말풍선을 제거. 카카오톡 상담 · 전화 문의 · 견적 문의 3개는 기존 펼친 상태의 디자인·순서·위치·링크 그대로 항상 표시. ≤768 은 기존처럼 하단 CTA 바가 대신하므로 모바일 간격 변경 없음.
- **package.json**: 루트의 `"type": "module"` 제거 — scandi/scripts 의 CommonJS 빌드 스크립트(build-css · build-seo)가 깨졌었다. Functions 는 .mjs 라 영향 없음.


## 2026-09-08 · 문의 폼 자체 처리 + /admin 문의 관리

**무엇**: `contact.html` 의 Web3Forms 전송을 자체 Netlify Function 으로 교체. 폼 제출 → `/.netlify/functions/contact` → ① Supabase `inquiries` 저장 → ② Resend 이메일(NOTIFY_EMAILS) → ③ 카카오톡 "나에게 보내기". 세 단계는 독립적으로 try/catch — 하나라도 성공하면 접수 완료, DB 실패 시 알림 상단에 "⚠️ DB 저장 실패" 표기. `/admin`(admin.html) 에서 Google 로그인 후 목록·상태(신규/진행중/완료)·메모·삭제. RLS 로 `admin_users` 에 등록된 이메일만 접근.

**파일**
- 저장소 루트: `netlify.toml`(publish=scandi, functions=netlify/functions, esbuild, `/admin → /admin.html`), `package.json`(@supabase/supabase-js, @netlify/functions), `netlify/functions/{contact,kakao-auth,kakao-refresh,keepalive,cleanup}.mjs` + `lib/{supabase,kakao}.mjs`, `supabase/migrations/001_inquiries.sql`, `docs/INQUIRY_SETUP.md`(배포 후 순서·환경변수 표·트러블슈팅).
- scandi/: `contact.html`(Web3Forms 제거, JSON fetch, `website` 허니팟, 실패 문구 변경), `admin.html` 신규(noindex, 크림/네이비/골드, 모바일은 카드 + 하단 시트), `robots.txt`·`_headers` 에 /admin 차단, `js/i18n-en.js` 실패 문구 EN.
- 스케줄: `kakao-refresh` 매주 월 00:00 UTC(refresh_token 60일 만료 방지), `keepalive` 매일(Supabase Free 7일 정지 방지), `cleanup` 매월 1일(3년 지난 문의 삭제).

**배포 후 할 일**: `docs/INQUIRY_SETUP.md` 1~5단계 (SQL 실행 → kakao-auth 1회 → /admin 로그인 → 테스트 문의). Supabase Auth Redirect URLs 에 `https://esstone.co.kr/admin` 필요.

**검증**(netlify dev, 더미 env): contact 405/400(형식·연락처·동의)/허니팟 200/전부 실패 500 + detail, kakao-auth 403·302·state 403, `/admin` rewrite 200, contact.html 에 web3forms/botcheck 잔재 0. admin.html 은 Supabase 목 데이터로 목록·상세·상태 세그먼트 렌더 확인, 콘솔 에러 0. hero-scroll.mp4 · showroom.html · product-detail.html 무변경.


## 2026-09-04 · 헤더 유틸리티 내비 리디자인 (검색 · KO/EN · 계정 · 버거)

**v2 (같은 날)**: v1 의 골드 헤어라인 · 넓은 자간 대문자 · 78% 아이콘이 구식이라는 피드백 → 밝고 선명한 방향으로 재설계. 아이콘 20px · 1.75 스트로크 · 네이비 100%, hover 에만 12px 라운드 틴트. KO/EN 은 흰색 필이 미끄러지는 세그먼트 토글(트랙 rgba(14,36,64,.06), 데스크톱 30px / 모바일 32px, `<html lang>` 으로 위치). 버거는 2줄. 드로어의 검색/로그인은 틴트 필, 닫기는 베어 + hover 틴트. 포커스 링은 블루 #2f6fed. 골드는 유틸에서 쓰지 않는다. 마크업 구조·로직은 v1 과 동일.

**왜**: 원형 보더 아이콘 + 세로 구분선 조합이 템플릿처럼 보였다. 소재/석재(Cosentino · Caesarstone · Neolith · Laminam · LX Hausys), 럭셔리 가구(Minotti · Poliform · B&B Italia · Cassina), 미니멀(Aesop · Vitra) 11개 사이트의 실제 HTML/CSS 를 조사한 공통 패턴 — 보더 없는 베어 글리프(12~24px, 얇은 스트로크) · 구분선 없이 간격(20~32px)만으로 분리 · 두 글자 대문자 언어 코드(파이프/슬래시/깃발 없음) · 유틸 텍스트는 GNB 보다 작고 가볍게 · hover 는 색/불투명도 변화 — 를 은성 시스템으로 옮겼다.

**무엇**
- 신규 `assets/css/header-utils.css` (site.css 번들 마지막에 추가, `scripts/build-css.js`). 각 페이지 helmet `<style>` 의 단일 클래스 규칙을 `.nav-right …` 특이성으로 덮는다 — 9개 페이지 helmet CSS 는 건드리지 않았다.
- 아이콘: 44×44 투명 버튼(상하 -5px 마진으로 헤더 높이 유지) 안에 19px · stroke 1.5 글리프, 불투명도 .78 → hover 1. 버거는 21px, 원형 보더 제거.
- 언어: `KO  EN` Manrope 500 · 11px · 자간 .18em · 대문자, 파이프 제거. 활성 언어 아래 1px 골드 헤어라인(#bf8e5a, `<html lang>` 값으로 CSS 만으로 그림 — i18n.js 가 쓰는 속성), 비활성은 .45(i18n 의 inline .5 유지).
- 마크업(9개 페이지 `.nav-right` 블록만): `<span class="nav-ic">` → `<button type="button" class="nav-ic" aria-label="검색|로그인">`, `<b>KO</b>` 안에 `<button class="lang-btn" lang aria-label>` — Enter 로 생긴 click 의 target 이 button 이라 i18n 의 `closest('.lang b')` 위임이 그대로 잡힌다. SVG 는 `aria-hidden focusable="false"`. 검색/로그인/언어 로직(search-overlay.js · login-modal.js · i18n.js)은 무변경.
- 포커스: `:focus-visible` 에 1.5px 골드 아웃라인(안쪽 -4px). 터치 타겟은 ≤1279 에서 전부 44×44 (mobile.css 기존 규칙 + 버튼이 상자를 꽉 채움).
- 로그인 상태 칩(`.lm-account-btn`): 알약 보더 → 아이콘 + 이름 + 캐럿의 베어 텍스트(대문자 11px).
- 모바일 드로어(`mobile.css` · `mobile-nav.js` 마크업 문자열): 닫기 버튼 원형 보더 제거, 검색/로그인 알약 → 아이콘+텍스트, KO/EN 은 헤더와 같은 대문자 코드 + 골드 헤어라인(구분선 제거).

**검증**(puppeteer, 1440 / 390): 검색 오버레이 · 로그인 모달 · KO/EN 클릭 · Enter 키 전환 · 드로어 안 검색/언어 모두 동작, 콘솔 에러 0. 헤더 높이 73px 동일. showroom.html · product-detail.html 은 `.nav-right` 4개 요소 외 무변경(hero-scroll.mp4 무관).

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
