/* 서버 전용 Supabase 클라이언트.
   service role 키는 RLS 를 우회하므로 Functions 안에서만 쓰고 브라우저에 절대 내보내지 않는다.
   키는 Netlify 환경변수(process.env)에서만 읽는다. */
import { createClient } from '@supabase/supabase-js';

let cached = null;

export function getSupabase() {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.');
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  return cached;
}

/* 접수 시각을 한국 시간(KST) 문자열로. 예: 2026-09-08 14:05 */
export function formatKST(date = new Date()) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(date);
  const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders }
  });
}
