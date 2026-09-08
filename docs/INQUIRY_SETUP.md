# 문의 접수 시스템 — 배포 후 설정 가이드

esstone.co.kr 의 문의 폼(`contact.html`)은 Web3Forms 대신 자체 구조로 동작한다.

```
contact.html ─POST─▶ /.netlify/functions/contact
                        ├─ ① Supabase inquiries 테이블 저장
                        ├─ ② Resend 이메일 (NOTIFY_EMAILS 전원)
                        └─ ③ 카카오톡 "나에게 보내기"
/admin ─────────────▶ admin.html (Google 로그인 → admin_users 확인 → 목록·상태·메모·삭제)
```

세 단계는 각각 독립적으로 시도된다. 하나라도 성공하면 방문자에게 "접수 완료"를 보여주고,
DB 저장이 실패하면 이메일·카톡 본문 맨 위에 **"⚠️ DB 저장 실패 — 이 알림이 유일한 기록입니다"** 가 붙는다.

---

## 배포 후 순서대로 할 일

### 1. Supabase 테이블 만들기

1. [Supabase 대시보드](https://supabase.com/dashboard) → 프로젝트 `iqjnvsrvpbubwvrfobtg` → 왼쪽 **SQL Editor** → **New query**
2. 저장소의 `supabase/migrations/001_inquiries.sql` 내용 **전체**를 붙여넣고 **Run**
   - 맨 아래 `insert into admin_users(email) values ('minha8206@gmail.com')` 까지 포함해서 실행한다. 이 한 줄이 관리자 등록이다.
   - 여러 번 실행해도 안전하다(`if not exists`, `on conflict do nothing`).
3. 왼쪽 **Table Editor** 에 `inquiries`, `kakao_tokens`, `admin_users` 세 테이블이 보이면 완료.

> **Google 로그인 Redirect URL 확인** — Supabase → **Authentication → URL Configuration → Redirect URLs** 에
> `https://esstone.co.kr/admin` 이 들어 있어야 한다. `https://esstone.co.kr/*` 같은 와일드카드가 이미 있으면 그대로 두면 된다.
> 없으면 `/admin` 로그인 후 다른 페이지로 튕긴다.

### 2. 카카오톡 연동 (최초 1회)

브라우저 주소창에 아래 주소를 입력한다. `SETUP_SECRET값` 자리에는 Netlify 환경변수 `SETUP_SECRET` 에 넣어둔 값을 그대로 쓴다.

```
https://esstone.co.kr/.netlify/functions/kakao-auth?secret=SETUP_SECRET값
```

1. 카카오 로그인·동의 화면이 뜨면 **"카카오톡 메시지 전송"** 항목에 동의
2. **"카카오 연동 완료. 이 창을 닫으세요."** 가 보이면 끝. 토큰은 `kakao_tokens` 테이블(id=1)에 저장됐다.
3. 이후에는 `kakao-refresh` 스케줄 함수가 매주 토큰을 갱신하므로 다시 할 필요가 없다.
   (60일 넘게 사이트가 완전히 멈춰 있었다면 이 단계를 한 번 더 하면 된다.)

> 403 이 나오면 `secret=` 값이 SETUP_SECRET 과 다르다.
> "토큰 발급 실패" 가 나오면 [Kakao Developers](https://developers.kakao.com) 앱 설정을 확인한다 — 아래 **카카오 앱 설정 체크리스트** 참고.

### 3. 관리 페이지 접속 확인

1. `https://esstone.co.kr/admin` 접속 → **Google로 로그인** → `minha8206@gmail.com` 선택
2. "아직 접수된 문의가 없습니다" 가 보이는 빈 목록이 나오면 정상
3. "접근 권한이 없습니다" 가 나오면 → 1단계의 `admin_users` insert 가 실행되지 않았거나 다른 Google 계정으로 로그인한 것

### 4. 테스트 문의로 전체 흐름 확인

1. `https://esstone.co.kr/contact` 에서 문의 하나를 보낸다 (이름에 "테스트" 등)
2. 확인할 곳
   - `/admin` 목록에 새 행 (굵게, "신규" 표시, 상단 배지 "신규 1건")
   - `NOTIFY_EMAILS` 에 적은 이메일 주소 전부에 `[은성 홈페이지 문의] 테스트 · 견적 문의` 메일
   - 카카오톡 **"나와의 채팅"** 방에 `📩 새 문의` 메시지 + "관리페이지 열기" 버튼
     (나에게 보내기는 2단계에서 인증한 카카오 계정 한 곳에만 온다)
3. `/admin` 에서 행을 눌러 상세 열기 → 상태를 "진행중"으로 바꾸고, 메모를 저장하고, 마지막에 **삭제**까지 눌러 본다

### 5. 문제가 생기면

**Netlify 대시보드 → 사이트(rainbow-florentine-97f972) → Logs → Functions → `contact`**

- 함수는 단계별로 `[contact] DB insert failed: …`, `[contact] email failed: …`, `[contact] kakao failed: …` 를 남긴다.
- 마지막 줄 `[contact] {"name":…,"results":{"db":true,"email":true,"kakao":true}}` 에서 어느 단계가 false 인지 보면 된다.
- 스케줄 함수 로그는 같은 곳에서 `kakao-refresh`, `keepalive`, `cleanup` 을 고른다.

| 증상 | 확인할 것 |
|---|---|
| 폼에서 "전송에 실패했습니다" | 셋 다 실패한 경우. Functions 로그의 `detail` 확인. 대부분 환경변수 오타 |
| DB 는 저장되는데 메일이 안 옴 | `RESEND_API_KEY`, `MAIL_FROM` 도메인이 Resend 에서 **Verified** 인지, `NOTIFY_EMAILS` 쉼표 구분 |
| 메일은 오는데 카톡이 안 옴 | 2단계(kakao-auth)를 안 했거나, Kakao 앱에서 `talk_message` 동의항목이 꺼져 있음 |
| `/admin` 로그인 후 홈으로 튕김 | Supabase Redirect URLs 에 `https://esstone.co.kr/admin` 없음 |
| `/admin` "접근 권한이 없습니다" | `admin_users` 에 로그인한 이메일이 없음 |
| `/admin` 목록이 비어 있는데 DB엔 데이터 있음 | RLS 정책 미적용 — 1단계 SQL 다시 실행 |

---

## 환경변수 (Netlify → Site configuration → Environment variables)

| 키 | 용도 | 어디서 얻나 |
|---|---|---|
| `SUPABASE_URL` | Supabase 프로젝트 주소 | Supabase → Project Settings → **API** → Project URL (`https://iqjnvsrvpbubwvrfobtg.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | RLS 를 우회하는 서버 전용 키. **브라우저에 절대 노출 금지** | Supabase → Project Settings → **API** → `service_role` (secret) |
| `RESEND_API_KEY` | 이메일 발송 | [Resend](https://resend.com) → **API Keys** → Create API Key (`re_…`) |
| `MAIL_FROM` | 발신자 표시. 예: `은성 홈페이지 <noreply@esstone.co.kr>` | Resend → **Domains** 에서 `esstone.co.kr` 을 추가하고 DNS(DKIM/SPF) 인증을 마친 뒤 그 도메인의 주소를 쓴다. 인증 전에는 `onboarding@resend.dev` 로만 보낼 수 있음(본인 계정 메일로만 수신) |
| `NOTIFY_EMAILS` | 알림 받을 주소, **쉼표 구분**. 예: `minha8206@gmail.com,office@esstone.co.kr` | 직접 입력 |
| `KAKAO_REST_API_KEY` | 카카오 OAuth client_id | [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → 앱 → **앱 키** → REST API 키 |
| `KAKAO_CLIENT_SECRET` | 토큰 교환 시 추가 인증 (선택) | Kakao Developers → 앱 → **카카오 로그인 → 보안** → Client Secret 생성. 활성화 상태를 "사용함"으로 하면 반드시 넣어야 하고, 안 쓰면 비워두고 보안 탭도 "사용 안함" |
| `KAKAO_REDIRECT_URI` | 인증 후 돌아올 주소 | 고정값 `https://esstone.co.kr/.netlify/functions/kakao-auth` — Kakao Developers → 카카오 로그인 → **Redirect URI** 에 **똑같이** 등록해야 함 |
| `SETUP_SECRET` | `kakao-auth` 함수 보호용 비밀값 | 아무 긴 랜덤 문자열(예: 32자 이상). 2단계 주소에 붙여 쓴다 |

환경변수를 바꾼 뒤에는 **Deploys → Trigger deploy** 로 재배포해야 함수에 반영된다.

### 카카오 앱 설정 체크리스트 (Kakao Developers)

- **앱 설정 → 플랫폼 → Web** : 사이트 도메인 `https://esstone.co.kr` 등록
- **제품 설정 → 카카오 로그인** : 활성화 **ON**, Redirect URI 에 `https://esstone.co.kr/.netlify/functions/kakao-auth`
- **제품 설정 → 카카오 로그인 → 동의항목** : **카카오톡 메시지 전송 (talk_message)** 을 "이용 중 동의" 이상으로 설정
- **카카오 로그인 → 보안** : Client Secret 을 쓰면 `KAKAO_CLIENT_SECRET` 에 넣고, 안 쓰면 비활성화
- 나에게 보내기는 **인증한 본인 계정의 "나와의 채팅"** 에만 도착한다. 다른 사람에게도 보내려면 별도 채널/친구 메시지 API 가 필요하다.

---

## 자동 실행되는 함수 (스케줄)

| 함수 | 주기 (UTC) | 하는 일 |
|---|---|---|
| `kakao-refresh` | 매주 월 00:00 (KST 월 09:00) | 카카오 refresh_token 갱신·저장 — 문의가 없어도 60일 만료를 막는다 |
| `keepalive` | 매일 00:00 (KST 09:00) | `inquiries` 에 select 1건 — Supabase Free 플랜 7일 미사용 일시정지 방지 |
| `cleanup` | 매월 1일 00:00 | 접수 3년 지난 문의 삭제 (안내문 "3년 후 파기" 준수). 삭제 건수를 로그에 남김 |

스케줄 함수는 배포된 사이트에서만 돈다. Netlify → Logs → Functions 에서 실행 기록을 볼 수 있다.

---

## 파일 위치

| 경로 | 내용 |
|---|---|
| `netlify.toml` | Functions 디렉터리·esbuild 번들러, `/admin → /admin.html` rewrite |
| `netlify/functions/contact.mjs` | 문의 접수 (DB → 이메일 → 카톡) |
| `netlify/functions/kakao-auth.mjs` | 카카오 최초 연동 (1회) |
| `netlify/functions/kakao-refresh.mjs` · `keepalive.mjs` · `cleanup.mjs` | 스케줄 함수 |
| `netlify/functions/lib/` | Supabase 클라이언트·카카오 API 공용 코드 |
| `supabase/migrations/001_inquiries.sql` | 테이블·RLS·관리자 등록 |
| `scandi/contact.html` | 문의 폼 (fetch → 함수) |
| `scandi/admin.html` | 관리 페이지 (`/admin`) |
| `scandi/robots.txt` · `scandi/_headers` | `/admin` 검색 노출 차단 |

## 관리자 추가·삭제

Supabase SQL Editor 에서:

```sql
insert into admin_users(email) values ('새관리자@gmail.com');
delete from admin_users where email = '빼는사람@gmail.com';
```

Google 로그인에 쓰는 이메일과 정확히 같아야 한다.
