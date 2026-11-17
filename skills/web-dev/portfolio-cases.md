# 시공사례 고치기 · 추가하기

**언제 사용**: 시공사례의 제목·지역·컬러·설명·사진을 바꾸거나, 사례를 새로 넣거나 뺄 때
**마지막 개선**: 2026-11-17
**성공 횟수**: 1

## 절차

1. `scandi/data/cases.json` 만 고친다. 사례 한 건이 `{ }` 한 묶음이고, 위에서부터 목록에 나오는 순서다.
   - `tone` + `use` = 제목 (예: `아이보리 화이트` + `라운지 카운터`)
   - `region` 지역 · `scope` 시공 범위 · `desc` 한두 문장 · `material` 소재
   - `space`: `kitchen` 주방 | `bath` 욕실 | `wall` 아트월 | `commercial` 상업 공간
   - `toneGroup`: `white` | `beige` | `gray` | `dark` (목록의 컬러 필터)
   - `color.code`: LX 제품 코드(`data/products-*.json` 의 `code`). **실제 사용한 컬러로 확인되면 `exact` 를 `true` 로** → 화면 표기가 "비슷한 컬러"에서 "사용 컬러"로 바뀐다
   - `similar`: 함께 보여줄 비슷한 컬러 코드 최대 3개
   - `photos`: 첫 장이 대표사진. 세로·파노라마 사진은 `pos`(예: `"50% 60%"`)로 4:3 틀에서 보일 위치를 잡는다
   - `en`: EN 모드 표기
2. 새 사진은 `scandi/images/cases/<id>/01.jpg` 식으로 넣는다(긴 변 1600px 안팎). `/images/*` 는 1년 캐시라 **같은 이름으로 덮어쓰지 말고 새 이름**으로.
3. `node scandi/scripts/build-portfolio.js` 실행. 값이 틀리면(없는 코드·없는 사진·id 중복) 무엇을 고칠지 알려 주고 멈춘다.
4. 로컬에서 확인 — 상세 주소가 `/portfolio/<id>` 라 확장자 없는 주소를 `.html` 로 찾아 주는 서버가 필요하다([local-preview.md](local-preview.md) 의 서버에 "파일이 없으면 `.html` 을 붙여 다시 찾기" 한 줄을 더한다). 루트는 `scandi/`.
5. 커밋 + push (Netlify 자동 배포). 생성물(`portfolio.html` · `portfolio/*.html` · `js/i18n-portfolio.js` · `sitemap.xml`)도 같이 커밋한다 — Netlify 에는 빌드 명령이 없다.

## 주의사항

- `portfolio.html` · `portfolio/*.html` · `js/i18n-portfolio.js` 는 생성물이다. 직접 고치면 다음 빌드에 지워진다. 화면 문구·구조는 `scripts/build-portfolio.js`, 모양은 `assets/css/portfolio.css`, 동작은 `assets/js/portfolio.js`.
- `portfolio.css` · `portfolio.js` 를 고쳤으면 build-portfolio.js 의 `ASSET_V` 를 올리고 다시 빌드한다(`/assets/*` 1년 immutable 캐시).
- 카드용 축소 사진(`<이름>-card.webp`, 800×600 을 덮는 크기)과 컬러 칩(`images/cases/_sw/<코드>.webp`, 120px)은 있으면 쓰고 없으면 원본을 쓴다. 이 머신엔 python 이 없어 축소본을 못 만든다 — 안 만들어도 정상 동작하고, 만들려면 원격 세션(PIL)에서.
- 상세 페이지는 `<base href="/">` 다. 템플릿에 `href="#..."` 만 적으면 홈으로 간다.
- `scripts/build-seo.js` 는 돌릴 필요 없다(build-portfolio.js 가 portfolio.html 의 SEO-JSONLD 구간을 그대로 옮겨 싣는다). 돌리면 보호 파일 showroom.html · product-detail.html 까지 다시 써지니 그 둘은 `git checkout --` 으로 되돌린다.
- 포세린 말고 비아테라·하이막스 사례를 넣을 때: `color.code` 에 그 제품 코드를 쓰면 브랜드 표기(LX 비아테라 / LX 하이막스)와 제품 링크가 따라온다. `material` 문구(예: `비아테라 20T`)와 EN 사전(`build-portfolio.js` 의 `put('포세린 12T', …)` 옆에 한 줄)을 같이 넣는다.

## 결과 예시

2026-11-17 개편 때 사례 23건을 이 방식으로 옮겼다. 제목 한 줄 수정 → 빌드 1초 → 목록 카드 · 상세 제목 · 브라우저 탭 제목 · 공유 미리보기 · 문의 폼에 실리는 사례명 · EN 사전이 한 번에 바뀐다.
