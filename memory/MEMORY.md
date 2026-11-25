# MEMORY.md — 에이전트 개인 노트

*환경 사실, 프로젝트 컨벤션, 도구 quirk, 교훈을 기록한다.*
*항목당 1-2줄. 중복 금지. 오래된 항목은 교체.*

---

## 환경

<!-- 예시:
- OS: Windows 11, 작업 폴더: C:\Users\user-pc\Claude\Projects\cowork
- 에이전트 구조: Hermes 폐쇄형 학습 루프 패턴 (2026-06-16 세팅)
-->

- 에이전트 구조: Hermes closed learning loop 패턴으로 초기화 (2026-06-16)
- 작업 폴더: C:\Users\user-pc\Claude\Projects\cowork
- 이 머신엔 python 미설치 (Store 스텁뿐), Node.js는 있음 — 로컬 서버는 node로 (자세한 건 [skills/web-dev/local-preview.md](../skills/web-dev/local-preview.md))
- git 커밋 author identity가 repo에 미설정 상태였음 — `git log`에서 기존 author(`Eunsung <minha8206@gmail.com>`) 확인 후 로컬(`--global` 아님) config로 맞춤

## 프로젝트 컨벤션

<!-- 프로젝트별 규칙, 네이밍, 스타일 -->

- 시공사례는 생성물이다(2026-11 개편) — `scandi/data/cases.json` 만 고치고 `node scandi/scripts/build-portfolio.js`. `portfolio.html` · `portfolio/*.html` · `js/i18n-portfolio.js` · sitemap 의 PORTFOLIO-CASES 구간은 직접 고치지 말 것 (자세한 건 [skills/web-dev/portfolio-cases.md](../skills/web-dev/portfolio-cases.md))
- 하위 폴더 페이지(`portfolio/<id>.html`)는 `<base href="/">` 를 둔다 — 공통 스크립트가 `contact.html` 같은 상대 주소를 쓴다. 그 안에서는 `#..` 만 적은 링크 금지

- `eunsung-homepage`: 실사진(라이프스타일/쇼룸 등 마케팅용 컷)이 부족함 — 현재 `images/`엔 시공 중(보양필름·박스 그대로) 사진뿐. 새 사진 필요한 요청 오면 kevin에게 확보 방법부터 확인할 것

## 도구 & 워크플로우

- 오른쪽 아래는 플로팅 상담 버튼(.iw-root, z 9999, 높이 약 162px)·모바일 하단 CTA 바(.es-ctabar, z 9000) 자리 — 새 고정 요소(팝업 등)는 이 둘을 피하거나 같은 z 로 DOM 뒤에 붙일 것 (2026-11 holiday-popup.js)

- 모바일 메뉴(mobile-nav.js v3, 2026-11)는 CSS 를 스스로 주입한다(.mnv). site.css 의 옛 .mnav-* 는 보호 파일 2개(showroom·product-detail, ?v= 못 붙임)의 캐시된 옛 JS 용이라 그 참조를 바꾸기 전엔 지우지 말 것

<!-- 도구 quirk, 유용한 패턴, 발견된 단축경로 -->

## 교훈 (Lessons Learned)

- `node scripts/build-seo.js` 는 **보호 파일 showroom.html · product-detail.html 의 JSON-LD 도 다시 쓴다** — 다른 페이지 때문에 돌렸으면 두 파일은 `git checkout -- ` 로 되돌릴 것 (2026-11 시공사례 개편)
- 원격(클라우드) 세션은 이 repo 를 GitHub 에서 직접 받아 push 까지 된다(2026-11-17) — device_bash 의 "push 불가"와 다른 경로
- 원격 세션에서 kevin PC 폴더는 못 읽지만 구글 드라이브 커넥터가 붙으면 `직접 수정한거`(현장 사진) 폴더를 바로 받을 수 있다 — 스크린샷만 왔을 땐 드라이브부터 찾아볼 것 (2026-11-26)
- 원격 세션에서는 jsDelivr · Google Fonts 가 막혀 있다 — 화면 확인은 Pretendard 를 npm 으로 받아 로컬 글꼴로 깔고 본다. 연말 팝업(holiday-popup.js)은 오른쪽 아래를 크게 덮으니 새 페이지 첫 화면과 겹치는지 꼭 볼 것

<!-- 실수에서 배운 것, 예상과 달랐던 것 -->

- AskUserQuestion에 60초간 응답 없으면 타임아웃됨 — 이미지 소스 등 진짜 막힌 결정은 최선의 판단(placeholder 등)으로 진행하고 나중에 되돌리기 쉽게 만들어둘 것
- support.js 가 `#dc-root` 를 height:100% 로 고정한다 — x-dc 밖(뒤)에 섹션을 두면 겹치므로 그 페이지에서 `#dc-root{height:auto!important}` 로 풀 것 (2026-11 index.html)
- x-dc 템플릿 안 버튼의 `onClick="{{ fn }}"` 은 로직 클래스에 fn 이 없어도 조용히 아무 일도 안 한다 — 예전 메인 문의 폼이 이렇게 몇 달간 접수가 안 됐음. 폼은 x-dc 밖 일반 HTML + home.js 로 처리
- 원격 세션의 VM(device_bash)은 이 repo 에 커밋까지는 되지만(삭제 권한 필요: git lock 파일) push 는 GitHub 자격증명이 없어 안 된다 → kevin 이 GitHub Desktop 등에서 Push
- `/assets/*` · `/images/*` · `/vendor/*` 는 `_headers` 에서 1년 immutable 캐시 — 같은 이름으로 고치면 재방문자는 옛 파일을 계속 쓴다. 고친 파일은 참조에 `?v=날짜` 를 붙이거나 새 이름으로 (2026-11 home.js 사고)
