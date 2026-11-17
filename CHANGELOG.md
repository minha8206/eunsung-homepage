# CHANGELOG — esstone.co.kr (scandi/)

## 2026-11-17 · 시공사례 전면 개편 — 정적 목록 + 사례별 상세 페이지 (밝은 톤)

- **kevin 요청**: "깔끔해 보이면서도 정리가 안 된 느낌", 표기를 컬러 + 용도 + 지역으로, 상세는 "확대하기" 말고 완전히 분리, 사용한 컬러를 사진과 함께 올리고 바로 그 컬러로 들어가게. 시안으로 고른 것 — 표기 "두 줄 + 컬러 칩", 목록 시안, 상세 **B-1 갤러리형**(독립 페이지 · 대표사진 한 장 + 작은 사진). 팝업 창(A)과 모자이크(B-2)는 탈락.
- **구조가 바뀌었다 — x-dc(React) 를 걷어내고 정적 생성으로.** `data/cases.json`(사례 한 건 = 한 묶음, 위에서부터 목록 순서) → `node scandi/scripts/build-portfolio.js` → `portfolio.html`(목록) + `portfolio/<id>.html` 23개(상세, 주소 `/portfolio/<id>`) + `js/i18n-portfolio.js`(EN 사전) + `sitemap.xml` 의 PORTFOLIO-CASES 구간. **이 네 가지는 생성물이라 직접 고치지 않는다.** 예전엔 초기 HTML 에 템플릿 문법만 있어 사례가 검색에 안 잡혔고 `#case/..` 주소는 공유 미리보기가 전부 같았다 — 이제 사례마다 title · description · og:image(대표사진) · JSON-LD(BreadcrumbList + CreativeWork)가 있다.
- **표기**: 제목 = `tone` + `use`(예: 아이보리 화이트 라운지 카운터), 아랫줄 = 지역 | 소재, 왼쪽에 컬러 칩. 분류는 한글로 — 공간(주방 14 · 욕실 4 · 아트월 2 · 상업 공간 3) + 컬러 톤(화이트 · 베이지·크림 · 그레이 · 다크) 필터. 고른 값은 주소(`?space=&tone=`)에 남는다. 사진이 깔끔한 사례를 앞에, 보양 필름·박스가 보이는 사례를 뒤에 뒀다.
- **상세(B-1)**: 왼쪽 대표사진 틀(4:3 고정, 가로 스크롤 스냅 — 손가락으로 넘김) + 작은 사진 줄 + "크게 보기"(전체 화면, 키보드 ←/→/ESC), 오른쪽에 제목 · 설명 · **컬러 카드**(견본 사진 + 제품명 + 코드 → `product-detail.html?code=`) · 소재/시공 범위/지역 표 · "이 컬러로 견적 문의" · 카카오톡. 아래 "비슷한 컬러" 4종 → "비슷한 톤의 다른 사례" 3건. 사진이 1장이면 작은 사진 줄만 빠진다.
- **컬러는 지금 전부 추정이다.** `color.code` 는 사진을 보고 고른 LX 포세린(kevin 선택 "다")이라 `exact:false` → "비슷한 컬러 / 가장 비슷한 컬러"로 표시된다. 실제 사용 컬러가 확인되면 코드를 맞추고 `exact:true` 로 바꾸면 "사용 컬러"로 바뀐다. **지역도 예전 값 그대로**(kevin 이 나중에 고칠 예정) — 판교 사진은 `images/cases/yeouido` 와 같은 주방, 동탄은 `seolleung` 과 같은 회의실, 운정 2번째 사진은 `misa` 폴더다.
- **견적 연결**: "이 컬러로 견적 문의"는 `contact.html?case=<제목 · 지역 · 컬러명 코드>` — contact.html 의 기존 prefillFromCase 가 문의 내용에 채운다(contact.html 무변경). 상세에서는 헤더 "견적 문의" · 플로팅 "견적 문의" · 모바일 하단 바도 같은 주소를 쓴다: `portfolio.js` 가 inquiry-widget.js 가 만든 `#esCtabar` 의 전화 버튼을 "이 컬러로 견적 문의"로 바꾸고 카카오톡을 앞에 둔다(바 크기·층위는 그대로).
- **신규** `assets/css/portfolio.css` · `assets/js/portfolio.js`(참조 `?v=20261117` — 고치면 build-portfolio.js 의 `ASSET_V` 를 올리고 다시 빌드). 클래스 접두사 `.pfx`(site.css 에 남은 옛 `.pf-*` 와 안 겹침). 헤더·푸터는 index.html 밝은 톤과 같은 마크업, 헤더만 `position:sticky`. 글꼴 Pretendard 1종, 금색 · 영문 소제목 · 세리프 제목 제거.
- **상세는 `<base href="/">`** — 한 단계 아래 폴더인데 공통 스크립트(상담 버튼 · 모바일 메뉴 · 검색)가 `contact.html` 같은 상대 주소를 쓰기 때문. 그래서 상세 안에서는 `#..` 만 적은 링크를 쓰면 안 된다(홈으로 간다).
- **사진**: 카드·작은 사진용 축소본 `images/cases/<id>/<이름>-card.webp`(37장, 합계 1.3MB)와 컬러 칩 `images/cases/_sw/<코드>.webp`(120px, 23장)를 추가. 둘 다 "있으면 쓰고 없으면 원본" — 새 사진을 넣고 축소본을 안 만들어도 페이지는 정상이다(이 머신엔 python 이 없으므로 축소본은 원격 세션에서 만들었다). 세로·파노라마 사진은 `photos[].pos` 로 4:3 틀에서 보일 위치를 잡는다.
- **연말 팝업과의 충돌 처리(상세만)**: holiday-popup.js 카드(오른쪽 아래 380px)가 상세의 컬러·문의 영역을 통째로 덮어서, 상세에서는 작은 탭으로 시작하게 했다(인라인 스크립트가 `esh_minimized` 를 잠깐 켰다가 load 뒤에 끈다 — 다른 페이지에서는 평소대로 뜬다). 작은 탭과 플로팅 버튼 라벨도 ≤1700px 에서는 아이콘 크기로 줄였다(portfolio.css). 되돌리려면 build-portfolio.js 의 `quietPopup: true` 한 줄과 portfolio.css 의 `.pfx-case .esh-mini` 블록을 지우면 된다. holiday-popup.js 자체는 무변경.
- **EN**: `js/i18n-portfolio.js` 가 사전 본체(i18n-en.js, EN 을 고를 때만 받음)가 `window.I18N_EN` 에 대입되는 순간 끼어들어 사례 제목·설명·라벨을 합친다(본체에 있는 키는 안 건드림). 사례 영문은 cases.json 의 `en`.
- **옛 주소**: `portfolio#case/<id>` 로 들어오면 `portfolio/<id>.html` 로 보낸다(id 는 예전과 같다). canonical 은 목록 `/portfolio.html` 그대로, 상세는 `/portfolio/<id>`. sitemap 에 사례 23건 추가.
- 무변경: contact.html · index.html · site.css · inquiry-widget.js · holiday-popup.js · mobile-nav.js · search-overlay.js · **보호 파일 showroom.html · product-detail.html**. `scripts/build-seo.js` 는 portfolio.html 의 SEO-JSONLD 구간을 계속 관리한다(build-portfolio.js 가 그 구간을 그대로 옮겨 싣는다). ⚠ build-seo.js 를 돌리면 보호 파일 2개의 JSON-LD 도 다시 써진다 — 이번에 확인차 돌렸다가 두 파일은 `git checkout` 으로 되돌렸다.
- 남은 것(미수정): `js/i18n-en.js` 의 옛 시공사례 키(사례 제목 23개 등)와 `site.css` 의 옛 `.pf-*` 모바일 규칙, 루트의 `scandi/portfolio.js`(옛 11건 목록, 어디서도 안 씀), index.html 로직의 PORTFOLIO 배열(템플릿에서 안 씀)은 죽은 코드로 남아 있다. `assets/js/search-overlay.js` 색인에는 사례가 없다(immutable 캐시 + 보호 파일 참조 때문에 손대지 않음). 769~1400px 폭에서는 플로팅 아이콘이 본문 오른쪽 끝을 10~30px 겹친다(전 페이지 공통 동작).
- 확인(로컬 서버 + 헤드리스 크롬): 1440 · 1920 · 1024 · 390 폭, 필터(공간·톤·주소 진입·빈 결과·초기화), 옛 해시 이동, 카드 → 상세, 작은 사진·화살표(끝에서 처음으로)·크게 보기·ESC, 문의 폼 미리 채움, 컬러 카드 → 제품 페이지, 모바일 하단 바 교체, 모바일 메뉴, KO/EN 전환, 가로 넘침 없음, JS 오류 없음. 외부 CDN(Pretendard · Google Fonts)은 원격 세션에서 막혀 있어 같은 글꼴을 로컬에 깔고 봤다 — **실제 기기 확인 필요**.

## 2026-11-17 · 모바일 메뉴 v3 — 2단 배열 (글꼴·크기 하나로, 금색 제거)

- **`assets/js/mobile-nav.js` 다시 그림** (kevin 요청: "글씨체·크기 하나로, AI 티 안 나게, 금색 배열 빼고" → 시안 A/B/C 중 C 선택). 왼쪽 단 메뉴(회사소개·시공 과정·시공사례·스토어·문의) / 오른쪽 단 소재(포세린·엔지니어드 스톤·인조대리석·BMC), 아래 미스트 박스에 대표전화·휴대전화·카카오톡 상담, 맨 아래 검색·로그인·KO/EN.
- 글꼴 Pretendard 1종 · 글자 크기 17px 1종(로고 워드마크만 Cormorant 유지). 위계는 굵기와 회색으로만. 색은 잉크 #16202A · 미스트 #F0F5F8, 레이크 블루 #2C6E96 은 "현재 페이지" 표시에만. 금색 · 01~05 번호 · MENU/MATERIALS/CONSULTATION 영문 소제목 · 순차 등장 애니메이션 · 알약 버튼 제거.
- **스타일을 JS 가 직접 주입**(`<style id="esMnavCss">`, 클래스 접두사 `.mnv`). /assets/* 1년 immutable 캐시 때문에 JS 와 site.css 세대가 섞여도 깨지지 않게 한 파일로 묶었다. Pretendard 는 페이지에 없으면 같은 jsDelivr 주소를 스크립트가 붙인다.
- 참조를 `mobile-nav.js?v=20261117` 로 — about · bmc · bmc/products · contact · facility · index · portfolio · privacy · store · store-gorilla-grip. **보호 파일 showroom.html · product-detail.html 은 손대지 않음** → 이 두 페이지는 `?v=` 가 없어, 예전에 방문한 브라우저는 캐시가 풀릴 때까지 옛 메뉴(v2)가 보인다(처음 방문자는 새 메뉴). 그래서 `mobile.css`/`site.css` 의 옛 `.mnav-*` 규칙은 **일부러 남겨 뒀다** — 두 보호 파일의 참조에 `?v=` 를 붙인 뒤에 지울 것.
- `js/i18n-en.js`: '메뉴' → Menu, '대표전화' → Office, '휴대전화' → Mobile.
- 확인: 320 · 360 · 390 · 768 폭, KO/EN, 버거 열기·닫기·ESC, 검색/로그인 연결, 링크 이동, 현재 페이지 표시(showroom ?cat= 포함).
- 참고(미수정): EN 모드에서 모바일 헤더(.nav-right)가 화면 폭을 넘겨 가로 스크롤이 생기는 것이 테스트 중 보였다 — 메뉴와 무관하게 이전 코드에서도 동일. 실제 기기에서 확인 필요.

## 2026-11-10 · 연말 프로모션 팝업 (실측 방문 무료 · 11/30 자동 종료)

- **`assets/js/holiday-popup.js` 신규** — 마크업·CSS·가랜드 SVG를 스스로 주입하는 단일 스크립트(x-dc 밖, body 끝). 데스크톱은 오른쪽 아래 380px 카드(접속 3초 후), 모바일(≤768)은 하단 시트 + 어두운 배경(스크롤 30% 또는 6초 후). 닫기/X/ESC/배경 → 작은 알약 탭으로 줄어듦(sessionStorage `esh_minimized`, 같은 방문 동안 유지), "오늘 하루 보지 않기" → 24시간 숨김(localStorage `esh_hide_until`). `CONFIG.END_AT` = 2026-12-01 00:00 KST 부터 아무것도 띄우지 않는다. 동작 줄이기 설정이면 눈·전구 애니메이션 없음.
- 디자인: Cloud Dancer #F0EEE9 바탕 + 체리 레드 #A11A2E, Pretendard(jsDelivr) · Instrument Serif · Geist Mono(Google Fonts, 스크립트가 직접 로드). 사진은 은성 시공 현장 `images/promo/holiday-kitchen-2026.jpg`(1140×600, 86KB).
- "무료 실측 신청하기"는 inquiry-widget.js 와 같은 규칙 — 페이지에 `#inquiry` 가 있으면 그리로 스크롤, 없으면 contact.html. 카카오톡은 같은 오픈채팅 주소.
- 층위: 플로팅 상담 버튼(.iw-root)과 같은 z-index 9999 에 DOM 뒤라 위에 그려지고, 검색(10001)·로그인(10000) 모달보다는 아래. 작은 탭은 데스크톱에선 상담 버튼 묶음 위, 모바일에선 하단 CTA 바 위에 놓인다. 창 높이가 카드보다 낮으면 카드를 비율대로 축소.
- 삽입 페이지: index · about · bmc · bmc/products · contact · facility · portfolio · store · store-gorilla-grip (inquiry-widget.js 바로 뒤, `?v=20261110`). privacy · admin 제외, **보호 파일 showroom.html · product-detail.html 은 손대지 않음**.
- 같은 날 수정: 데스크톱·모바일 모두 접속 즉시 표시(DESKTOP_DELAY·MOBILE_DELAY 0), 캐시 키 `?v=20261110b`.
- 12월 이후 정리: 스크립트는 날짜가 지나면 스스로 멈추므로 급하지 않음. 지울 땐 위 9개 페이지의 script 태그와 파일 2개만 빼면 된다.

## 2026-11-03 · 메인 페이지 밝은 톤 리디자인 (시안 C-1) + 메인 문의 폼 실제 접수 연결

- **히어로**: 스크롤 확장 연출(200vh 래퍼 + sticky, 스크롤 진행도 → 영상 크기)을 걷어내고, 첫 화면을 꽉 채운 영상이 autoplay muted loop 로 그냥 재생되게 바꿨다. 영상 위에 바로 카피(eyebrow · Noto Serif KR 300 헤드라인 · 흰 테두리 "견적 문의하기" + 밑줄 "시공사례 보기"), 아래 반투명 유리 띠에 소재 4종 링크, 띠 오른쪽에 일시정지 버튼(aria-pressed). 동작 줄이기 설정이면 정지 화면으로 시작. 화면 밖에서는 영상이 쉰다.
- **영상 재인코딩** `assets/video/hero-bright-{desktop,mobile}.mp4` + `hero-bright-poster{,-mobile}.jpg` 신규 — 원본 `hero-scroll.mp4`(무변경)에서 위아래 검은 띠를 잘라내고(1920×860, 모바일은 가운데 608×860 → 720×1018) 감마·채도·색균형으로 밝게. 데스크톱 3.9MB · 모바일 1.8MB. 예전 `hero-scroll-{desktop,mobile}.mp4` · `hero-poster*.jpg` 는 메인에서 더 이상 쓰지 않는다(파일은 남겨둠).
- **헤더(메인 전용)**: 히어로 위에서는 투명 + 흰 글씨, 내려가면 흰 반투명. `home.js` 가 `<html>` 에 `hd-over` 를 켜고 끈다. 데스크톱 nav 의 "문의" 대신 오른쪽 끝에 "견적 문의" 필 버튼(#inquiry, ≤640 숨김). nav hover 골드 제거.
- **톤**: 흰 배경 + 잉크 #16202A · 레이크 블루 #2C6E96 · 미스트 #F0F5F8(샘플북 v2 토큰). 메인 본문 산세리프는 contact.html 과 같은 Pretendard(jsDelivr), Noto Serif KR 은 300 웨이트 추가. 소재 배너는 사진을 어둡게 덮지 않고 그림자·골드 제거, 소재별 "컬러 보기" 링크 추가. 스토리 영상 라벨/헤드라인 정리 + "시공 과정 보기" 링크. 플로팅 견적 버튼 · 모바일 하단 CTA 바 색을 메인에서만 잉크/카카오 옐로로.
- **문의 섹션 · 푸터를 x-dc 밖으로** 옮기고 밝은 톤으로 다시 그림. support.js 가 `#dc-root` 를 height:100% 로 고정하므로 메인에서는 `height:auto` 로 풀었다.
- **버그 수정 — 메인 문의 폼이 실제로 접수되지 않던 문제**: 예전 폼 버튼은 x-dc 로직에 없는 `sendInquiry` 를 가리켜 아무 일도 하지 않았다. 이제 contact.html 과 같은 `/.netlify/functions/contact` 로 같은 형식(name·phone·inquiry_type·message·consent·website 허니팟)을 보낸다. 개인정보 동의 체크 + "더 보기" 추가, 문의 유형은 contact.html 과 같은 5종, 공백·점으로 적은 전화번호는 하이픈으로 맞춰 보낸다.
- `js/i18n-en.js` 에 새 카피 EN 키. JSON-LD · 공통 CSS(site.css) · 다른 페이지는 무변경.
- **캐시 핫픽스**: `/assets/*` 가 `_headers` 에서 1년 immutable 이라, 예전에 방문한 브라우저가 옛 `home.js` 를 계속 써서 새 히어로 영상이 시작되지 않았다(data-src 를 src 로 올리는 코드가 옛 파일엔 없음). index.html 에서 `assets/js/home.js?v=20261103` 으로 참조해 캐시 키를 바꿨다. **앞으로 /assets/ 아래 JS·CSS 를 고치면 참조하는 쪽의 ?v= 를 올릴 것.**

## 2026-10-26 · 스토어 신설 (/store) + Gorilla Grip 2.1 상품 페이지 + 헤더 "스토어" 메뉴

- **`store.html` 신규** — 스토어 인트로(네이비 #0b1626 히어로, 골드 eyebrow) · "판매 중" 대표 상품 블록(이미지 + 정보, 가격 3,500,000원 부가세 포함, 재고 3대) · 구매 절차 4단계 · 카카오톡 입고 알림 띠 · 쇼룸 방문 CTA. contact.html 과 같은 일반 HTML(x-dc/React 없음).
- **`store-gorilla-grip.html` 신규** — Monument Toolworks Parallign Gorilla Grip 2.1 Camless(GG2-20000-13) 상품 상세. 갤러리(썸네일 5 · 라이트박스 · 키보드/스와이프) + sticky 구매 박스(110V 변압기 안내) · 선택 이유 3 · 사양표/구성품 · 사용 전 확인(케이스 라벨 5항목 번역)/적용 현장 · 구매 문의 폼 · FAQ 6. 폼은 `/.netlify/functions/contact` 로 보내며 `inquiry_type` = "구매 문의 · Gorilla Grip 2.1 진공 심세터", 본문에 수량·수령 방법을 앞세운다(서버 50자 제한 안). 플로팅 위젯 "견적 문의" 가 잡는 `#inquiry` 앵커를 폼 섹션에 둠. Product JSON-LD(가격·재고 포함)는 build-seo.js 대상이 아니라 수기 관리.
- **`assets/css/store.css`**, **`images/store/`**(쇼룸 촬영 원본을 크롭·WebP 변환 6장 + OG 1200×630) 신규.
- **공통 헤더**: 데스크톱 nav 와 구형 모바일 패널에 "스토어"(시공사례 뒤) — about · bmc · bmc/products · contact · facility · index · portfolio · privacy. `assets/js/mobile-nav.js` PRIMARY 에도 추가. 메뉴가 9개가 되어 **버거 브레이크포인트를 1080 → 1279** 로 올렸다(사이트의 터치 기준 ≤1279 와 통일; 기존에도 1081~1200 구간에서 nav 가 로고·아이콘과 겹치고 있었음). gap 32 → 28px(≤1400 은 22px). `mobile.css`(→ site.css 재빌드) · `mobile-nav.js` 의 1080 도 1279 로. **보호 파일 showroom.html · product-detail.html 은 손대지 않음** → 이 두 페이지 헤더에는 아직 "스토어" 가 없다.
- 푸터 COMPANY 에 Store 링크, `search-overlay.js` 페이지 색인에 스토어/상품, `i18n-en.js` '스토어': 'Store', `sitemap.xml` 에 /store · /store-gorilla-grip.

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
