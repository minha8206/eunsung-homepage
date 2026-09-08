# esstone.co.kr 문의 접수 · /admin 관리

**목표**: 문의 폼을 외부 서비스(Web3Forms) 의존 없이 자체 처리하고, 접수 내역을 사이트 안(/admin)에서 관리한다.
**현재 상태**: 코드 배포 완료(2026-09-08). Supabase SQL 실행 · 카카오 최초 연동 · 실 테스트는 kevin 이 `docs/INQUIRY_SETUP.md` 순서대로 진행해야 함.
**다음 할 일**: 배포 후 1~5단계 확인. 문제 시 Netlify → Logs → Functions → contact.
**관련 스킬**: -
**마지막 업데이트**: 2026-09-08

## 맥락

- Netlify 사이트 `rainbow-florentine-97f972`: base 없음(저장소 루트), publish `scandi/`, 브랜치 `main`. 그래서 `netlify.toml`·`package.json`·`netlify/functions/` 는 루트에, `admin.html`·`robots.txt` 는 scandi/ 에 둔다. node_modules 가 publish 디렉터리 밖에 있어 배포에 섞이지 않는다.
- 흐름: contact.html → `/.netlify/functions/contact` → ① Supabase inquiries(service role) → ② Resend → ③ 카카오 나에게 보내기. 각각 독립 try/catch, 하나라도 성공하면 200.
- 카카오 refresh_token 은 60일 만료 → `kakao-refresh` 스케줄(매주 월)로 갱신. 나에게 보내기는 인증한 계정 1곳에만 간다.
- Supabase: 프로젝트 `iqjnvsrvpbubwvrfobtg`, anon 키는 login-modal.js 와 동일. 권한은 RLS(`admin_users` 이메일) 가 담당. inquiries insert 정책 없음(브라우저 삽입 불가).
- 환경변수 9개는 Netlify 에 이미 등록됨(이름 확인 완료): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, MAIL_FROM, NOTIFY_EMAILS, KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI, SETUP_SECRET.
- 로컬 검증은 `netlify dev` 에 더미 env 를 인라인으로 넘겨서(실제 메일·카톡 안 나감). Git Bash 에서 curl 인자에 한글을 넣으면 CP949 로 깨지니 검증 시 주의(파일 heredoc 은 UTF-8 정상).

## 완료된 마일스톤

- [x] Netlify Functions 5개 + lib, SQL 마이그레이션, contact.html 교체, admin.html, 설정·문서 (2026-09-08)
- [ ] Supabase SQL 실행 + 카카오 연동 + 실 테스트 (kevin)
