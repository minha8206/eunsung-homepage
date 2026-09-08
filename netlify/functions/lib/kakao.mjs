/* 카카오 "나에게 보내기" 연동.
   토큰은 kakao_tokens 테이블(id=1, 항상 한 행)에 보관하고 service role 로만 읽고 쓴다.
   - access_token 은 6시간, refresh_token 은 60일 유효.
   - refresh 요청 시 refresh_token 의 남은 기간이 1개월 미만이면 새 refresh_token 이 응답에 포함되므로
     그때 테이블을 갱신한다. (kakao-refresh 스케줄 함수가 매주 호출해 60일 만료를 막는다.) */
import { getSupabase } from './supabase.mjs';

const TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const MEMO_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';

function form(obj) {
  return new URLSearchParams(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString();
}

async function postToken(params) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: form(params)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(`kakao token ${res.status}: ${data.error || ''} ${data.error_description || ''}`.trim());
  }
  return data;
}

/* 최초 1회: 인가 코드 → 토큰 교환 후 저장 */
export async function exchangeCode(code) {
  const data = await postToken({
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    code
  });
  await saveTokens(data.access_token, data.refresh_token);
  return data;
}

/* 저장된 refresh_token 으로 access_token 재발급. 새 refresh_token 이 오면 함께 저장. */
export async function refreshAccessToken() {
  const sb = getSupabase();
  const { data: row, error } = await sb.from('kakao_tokens').select('refresh_token').eq('id', 1).maybeSingle();
  if (error) throw new Error(`kakao_tokens 조회 실패: ${error.message}`);
  if (!row || !row.refresh_token) throw new Error('kakao_tokens 에 refresh_token 이 없습니다. kakao-auth 로 최초 연동을 먼저 하세요.');

  const data = await postToken({
    grant_type: 'refresh_token',
    client_id: process.env.KAKAO_REST_API_KEY,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
    refresh_token: row.refresh_token
  });
  await saveTokens(data.access_token, data.refresh_token || row.refresh_token);
  return data.access_token;
}

export async function saveTokens(accessToken, refreshToken) {
  const sb = getSupabase();
  const { error, status, statusText } = await sb.from('kakao_tokens').upsert(
    { id: 1, access_token: accessToken, refresh_token: refreshToken, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
  if (error) {
    const err = new Error(`kakao_tokens 저장 실패: ${error.message}`);
    /* 진단용: PostgREST 응답 status 와 error 객체 전체(message/details/hint/code) */
    err.supabase = { status, statusText, error };
    throw err;
  }
}

/* 텍스트 템플릿으로 나에게 보내기. text 는 200자 제한. */
export async function sendMemo({ text, url, buttonTitle }) {
  const accessToken = await refreshAccessToken();
  const template = {
    object_type: 'text',
    text: String(text).slice(0, 200),
    link: { web_url: url, mobile_web_url: url },
    button_title: buttonTitle
  };
  const res = await fetch(MEMO_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: form({ template_object: JSON.stringify(template) })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.result_code !== 0) {
    throw new Error(`kakao memo ${res.status}: ${data.code || ''} ${data.msg || ''}`.trim());
  }
  return true;
}
