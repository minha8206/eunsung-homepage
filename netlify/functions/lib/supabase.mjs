/* 서버 전용 Supabase 클라이언트.
   service role 키는 RLS 를 우회하므로 Functions 안에서만 쓰고 브라우저에 절대 내보내지 않는다.
   키는 Netlify 환경변수(process.env)에서만 읽는다. anon/publishable 키 fallback 은 두지 않는다. */
import { createClient } from '@supabase/supabase-js';

let cached = null;

/* 환경변수 값 정리: 앞뒤 공백·줄바꿈·감싼 따옴표 제거 (붙여넣기 실수 방어) */
function cleanEnv(v) {
  return String(v ?? '').trim().replace(/^["']+|["']+$/g, '').trim();
}

export function getSupabaseConfig() {
  const url = cleanEnv(process.env.SUPABASE_URL).replace(/\/+$/, '');
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.');
  return { url, key };
}

export function getSupabase() {
  if (cached) return cached;
  const { url, key } = getSupabaseConfig();
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    /* supabase-js 는 기본으로 apikey + Authorization 에 같은 키를 넣지만, 여기서 명시해 둔다. */
    global: { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  });
  return cached;
}

/* ---------- 진단 ----------
   비밀값은 노출하지 않는다: 키 앞 8자·길이·형식, JWT 면 payload 의 role/ref 만 디코드. */
function decodeJwtPayload(key) {
  try {
    const part = key.split('.')[1];
    if (!part) return null;
    const json = Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const p = JSON.parse(json);
    return { role: p.role, ref: p.ref, iss: p.iss, exp: p.exp };
  } catch {
    return null;
  }
}

export function describeKey() {
  let url = '', key = '';
  try { ({ url, key } = getSupabaseConfig()); } catch (e) { return { error: e.message }; }
  const kind = key.startsWith('eyJ') ? 'legacy JWT'
    : key.startsWith('sb_secret_') ? 'new secret key'
    : key.startsWith('sb_publishable_') ? 'PUBLISHABLE (anon) KEY — 잘못된 키'
    : 'unknown';
  const jwt = key.startsWith('eyJ') ? decodeJwtPayload(key) : null;
  return {
    url,
    keyPrefix: key.slice(0, 8),
    keyLength: key.length,
    keyKind: kind,
    jwtRole: jwt ? jwt.role : undefined,
    jwtRef: jwt ? jwt.ref : undefined
  };
}

/* REST 엔드포인트에 같은 헤더로 직접 요청해 원본 status·body 를 돌려준다. */
export async function probeTable(table) {
  const { url, key } = getSupabaseConfig();
  const reqUrl = `${url}/rest/v1/${table}?select=id&limit=1`;
  try {
    const res = await fetch(reqUrl, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    const body = await res.text();
    return { url: reqUrl, status: res.status, statusText: res.statusText, body: body.slice(0, 2000) };
  } catch (e) {
    return { url: reqUrl, status: 0, statusText: 'fetch failed', body: String(e.message || e) };
  }
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
