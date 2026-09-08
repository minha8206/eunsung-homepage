-- ============================================================================
-- esstone.co.kr 문의 접수 — 초기 스키마
-- Supabase 대시보드 → SQL Editor 에 전체를 붙여넣고 Run.
-- 여러 번 실행해도 안전하도록 if not exists / drop policy if exists 를 쓴다.
-- ============================================================================

-- ---------- 1. 문의 ----------
create table if not exists public.inquiries (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  phone         text,
  inquiry_type  text,
  message       text,
  consent       boolean,
  status        text        not null default 'new',   -- new | in_progress | done
  admin_note    text,
  user_agent    text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);

-- ---------- 2. 카카오 토큰 (항상 id=1 한 행, service role 전용) ----------
create table if not exists public.kakao_tokens (
  id            int         primary key check (id = 1),
  access_token  text,
  refresh_token text,
  updated_at    timestamptz
);

-- ---------- 3. 관리자 화이트리스트 ----------
create table if not exists public.admin_users (
  email       text        primary key,
  created_at  timestamptz not null default now()
);

-- ---------- 4. RLS ----------
alter table public.inquiries    enable row level security;
alter table public.kakao_tokens enable row level security;
alter table public.admin_users  enable row level security;

-- admin_users: 로그인한 사용자는 자기 이메일 행만 볼 수 있다 (관리자 여부 확인용)
drop policy if exists "admin_users: self select" on public.admin_users;
create policy "admin_users: self select"
  on public.admin_users
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- inquiries: admin_users 에 등록된 이메일로 로그인한 사용자만 조회·수정·삭제
--   insert 정책은 만들지 않는다 → 브라우저에서는 삽입 불가, Netlify Function 이 service role 로만 삽입.
drop policy if exists "inquiries: admin select" on public.inquiries;
create policy "inquiries: admin select"
  on public.inquiries
  for select
  to authenticated
  using (exists (select 1 from public.admin_users a where a.email = (auth.jwt() ->> 'email')));

drop policy if exists "inquiries: admin update" on public.inquiries;
create policy "inquiries: admin update"
  on public.inquiries
  for update
  to authenticated
  using      (exists (select 1 from public.admin_users a where a.email = (auth.jwt() ->> 'email')))
  with check (exists (select 1 from public.admin_users a where a.email = (auth.jwt() ->> 'email')));

drop policy if exists "inquiries: admin delete" on public.inquiries;
create policy "inquiries: admin delete"
  on public.inquiries
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users a where a.email = (auth.jwt() ->> 'email')));

-- kakao_tokens: 정책 없음 = anon/authenticated 모두 접근 불가. service role 만 읽고 쓴다.

-- ---------- 4-1. 테이블 권한(GRANT) ----------
-- Supabase 는 보통 기본 권한(default privileges)으로 처리하지만, 프로젝트 설정에 따라 빠질 수 있어 명시한다.
-- service_role 은 RLS 를 우회하고 세 테이블 전부 읽고 쓴다.
grant usage on schema public to service_role, authenticated, anon;
grant all on table public.inquiries, public.kakao_tokens, public.admin_users to service_role;
-- 관리 페이지(브라우저, authenticated)는 RLS 정책 범위 안에서만 동작. insert 권한은 주지 않는다.
grant select, update, delete on table public.inquiries to authenticated;
grant select on table public.admin_users to authenticated;
-- 이후 SQL Editor 에서 만드는 테이블에도 service_role 권한이 자동으로 붙도록
alter default privileges in schema public grant all on tables to service_role;

-- ---------- 5. 관리자 등록 ----------
insert into admin_users(email) values ('minha8206@gmail.com') on conflict (email) do nothing;
