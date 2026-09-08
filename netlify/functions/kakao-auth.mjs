/* GET /.netlify/functions/kakao-auth?secret=SETUP_SECRET — 카카오 최초 연동(1회)
   1) secret 확인 → 카카오 동의 화면으로 302
   2) 카카오가 ?code=&state= 로 돌려보내면 state 를 SETUP_SECRET 과 대조 → 토큰 교환 → kakao_tokens 저장 */
import { timingSafeEqual } from 'node:crypto';
import { exchangeCode } from './lib/kakao.mjs';
import { describeKey, probeTable } from './lib/supabase.mjs';

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function html(body, status = 200) {
  const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>카카오 연동</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F5F1E8;color:#0e2440;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif}
.card{background:#fff;padding:40px 44px;border:1px solid rgba(14,36,64,.08);text-align:center;max-width:420px}
h1{font-size:20px;font-weight:500;margin:0 0 10px}p{margin:0;font-size:14px;line-height:1.7;color:rgba(14,36,64,.65)}code{font-size:12px;word-break:break-all}</style></head>
<body><div class="card">${body}</div></body></html>`;
  return new Response(page, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

export default async (req) => {
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });

  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) return html('<h1>설정 오류</h1><p>SETUP_SECRET 환경변수가 없습니다.</p>', 500);

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const secret = url.searchParams.get('secret');
  const kakaoError = url.searchParams.get('error');

  if (kakaoError) {
    const desc = url.searchParams.get('error_description') || '';
    return html(`<h1>카카오 인증이 취소되었습니다</h1><p>${escapeHtml(kakaoError)} — ${escapeHtml(desc)}</p>`, 400);
  }

  /* 2단계: 카카오 콜백 (code + state) */
  if (code) {
    if (!safeEqual(state, setupSecret)) return html('<h1>403</h1><p>state 값이 일치하지 않습니다.</p>', 403);
    try {
      await exchangeCode(code);
      return html('<h1>카카오 연동 완료.</h1><p>이 창을 닫으세요.<br>이제 새 문의가 들어오면 카카오톡 "나와의 채팅"으로 알림이 옵니다.</p>');
    } catch (e) {
      console.error('[kakao-auth] exchange failed:', e, e.supabase || '');
      /* 진단 정보: 사용된 키(앞 8자·형식·JWT role), 요청 URL, Supabase 원본 응답 status·body */
      const keyInfo = describeKey();
      const probe = await probeTable('kakao_tokens').catch((x) => ({ error: String(x) }));
      const debug = {
        error: String(e.message || e),
        supabaseClientResponse: e.supabase || null,
        key: keyInfo,
        probe
      };
      console.error('[kakao-auth] debug:', JSON.stringify(debug));
      return html(
        `<h1>토큰 발급 실패</h1><p><code>${escapeHtml(e.message || e)}</code></p>` +
        `<p>Kakao Developers 의 Redirect URI, REST API 키, Client Secret 설정과 아래 Supabase 진단을 확인한 뒤 다시 시도하세요.</p>` +
        `<pre style="text-align:left;font-size:11.5px;line-height:1.5;white-space:pre-wrap;word-break:break-all;background:#F5F1E8;padding:12px;margin-top:16px;max-height:60vh;overflow:auto">${escapeHtml(JSON.stringify(debug, null, 2))}</pre>`,
        500
      );
    }
  }

  /* 1단계: secret 확인 후 동의 화면으로 */
  if (!safeEqual(secret, setupSecret)) return html('<h1>403</h1><p>접근 권한이 없습니다.</p>', 403);

  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;
  if (!clientId || !redirectUri) return html('<h1>설정 오류</h1><p>KAKAO_REST_API_KEY / KAKAO_REDIRECT_URI 환경변수가 없습니다.</p>', 500);

  const authorize = new URL('https://kauth.kakao.com/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'talk_message');
  authorize.searchParams.set('state', setupSecret);

  return new Response(null, { status: 302, headers: { Location: authorize.toString(), 'Cache-Control': 'no-store' } });
};
