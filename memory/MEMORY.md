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

- `eunsung-homepage`: 실사진(라이프스타일/쇼룸 등 마케팅용 컷)이 부족함 — 현재 `images/`엔 시공 중(보양필름·박스 그대로) 사진뿐. 새 사진 필요한 요청 오면 kevin에게 확보 방법부터 확인할 것

## 도구 & 워크플로우

<!-- 도구 quirk, 유용한 패턴, 발견된 단축경로 -->

## 교훈 (Lessons Learned)

<!-- 실수에서 배운 것, 예상과 달랐던 것 -->

- AskUserQuestion에 60초간 응답 없으면 타임아웃됨 — 이미지 소스 등 진짜 막힌 결정은 최선의 판단(placeholder 등)으로 진행하고 나중에 되돌리기 쉽게 만들어둘 것
- support.js 가 `#dc-root` 를 height:100% 로 고정한다 — x-dc 밖(뒤)에 섹션을 두면 겹치므로 그 페이지에서 `#dc-root{height:auto!important}` 로 풀 것 (2026-11 index.html)
- x-dc 템플릿 안 버튼의 `onClick="{{ fn }}"` 은 로직 클래스에 fn 이 없어도 조용히 아무 일도 안 한다 — 예전 메인 문의 폼이 이렇게 몇 달간 접수가 안 됐음. 폼은 x-dc 밖 일반 HTML + home.js 로 처리
- 원격 세션의 VM(device_bash)은 이 repo 에 커밋까지는 되지만(삭제 권한 필요: git lock 파일) push 는 GitHub 자격증명이 없어 안 된다 → kevin 이 GitHub Desktop 등에서 Push
