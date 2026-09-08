/* POST /.netlify/functions/contact — contact.html 문의 폼 접수
   ① Supabase inquiries 저장 → ② Resend 이메일 → ③ 카카오톡 나에게 보내기
   세 단계는 서로 독립적으로 시도한다. 하나라도 성공하면 200, 전부 실패하면 500. */
import { getSupabase, formatKST, json } from './lib/supabase.mjs';
import { sendMemo } from './lib/kakao.mjs';

const ADMIN_URL = 'https://esstone.co.kr/admin';
const MAX_MESSAGE = 2000;

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function validate(body) {
  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const inquiry_type = String(body.inquiry_type ?? '').trim();
  const message = String(body.message ?? '').trim();
  const consent = body.consent === true;

  if (!name || name.length > 100) return { error: '이름을 확인해 주세요.' };
  if (!phone || !/^[0-9-]+$/.test(phone) || phone.length > 20) return { error: '연락처는 숫자와 하이픈만 입력할 수 있습니다.' };
  if (phone.replace(/\D/g, '').length < 9) return { error: '연락처를 다시 확인해 주세요.' };
  if (!inquiry_type || inquiry_type.length > 50) return { error: '문의 유형을 선택해 주세요.' };
  if (!message) return { error: '문의 내용을 입력해 주세요.' };
  if (message.length > MAX_MESSAGE) return { error: `문의 내용은 ${MAX_MESSAGE}자 이하로 적어주세요.` };
  if (!consent) return { error: '개인정보 수집·이용에 동의해 주세요.' };

  return { data: { name, phone, inquiry_type, message, consent } };
}

const DB_WARN = '⚠️ DB 저장 실패 — 이 알림이 유일한 기록입니다';

async function sendEmail(inq, { receivedAt, dbFailed }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const to = String(process.env.NOTIFY_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!apiKey || !from || to.length === 0) throw new Error('RESEND_API_KEY / MAIL_FROM / NOTIFY_EMAILS 환경변수가 없습니다.');

  const subject = `[은성 홈페이지 문의] ${inq.name} · ${inq.inquiry_type}`;
  const telHref = 'tel:' + inq.phone.replace(/[^0-9+]/g, '');

  const textLines = [];
  if (dbFailed) textLines.push(DB_WARN, '');
  textLines.push(
    `이름: ${inq.name}`,
    `연락처: ${inq.phone}`,
    `문의 유형: ${inq.inquiry_type}`,
    `접수 시각: ${receivedAt} (KST)`,
    '',
    '문의 내용:',
    inq.message,
    '',
    `관리 페이지: ${ADMIN_URL}`
  );
  const text = textLines.join('\n');

  const warnHtml = dbFailed
    ? `<div style="margin-top:16px;padding:12px 14px;background:#fff4ec;border:1px solid #f2c9a7;color:#8a4b12;font-size:14px;line-height:1.5">${esc(DB_WARN)}</div>`
    : '';

  const html = `<!doctype html><html lang="ko"><body style="margin:0;padding:24px;background:#F5F1E8;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#0e2440">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(14,36,64,.08);padding:28px 30px">
    <div style="font:600 11px/1 sans-serif;letter-spacing:.24em;color:#BF8E5A">EUNSUNG · 새 문의</div>
    ${warnHtml}
    <h1 style="margin:18px 0 6px;font-size:22px;font-weight:500">${esc(inq.name)} <span style="color:rgba(14,36,64,.5);font-weight:400">· ${esc(inq.inquiry_type)}</span></h1>
    <table style="width:100%;border-collapse:collapse;margin-top:18px;font-size:14px;line-height:1.7">
      <tr><td style="width:88px;padding:6px 0;color:rgba(14,36,64,.55);vertical-align:top">이름</td><td style="padding:6px 0">${esc(inq.name)}</td></tr>
      <tr><td style="padding:6px 0;color:rgba(14,36,64,.55);vertical-align:top">연락처</td><td style="padding:6px 0"><a href="${esc(telHref)}" style="color:#0e2440;text-decoration:none;border-bottom:1px solid #BF8E5A">${esc(inq.phone)}</a></td></tr>
      <tr><td style="padding:6px 0;color:rgba(14,36,64,.55);vertical-align:top">유형</td><td style="padding:6px 0">${esc(inq.inquiry_type)}</td></tr>
      <tr><td style="padding:6px 0;color:rgba(14,36,64,.55);vertical-align:top">접수 시각</td><td style="padding:6px 0">${esc(receivedAt)} (KST)</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px 18px;background:#F5F1E8;font-size:14px;line-height:1.8;white-space:pre-wrap;word-break:break-word">${esc(inq.message)}</div>
    <div style="margin-top:26px;text-align:center"><a href="${ADMIN_URL}" style="display:inline-block;padding:13px 26px;background:#BF8E5A;color:#fff;text-decoration:none;font-size:14px;letter-spacing:.04em">관리 페이지 열기</a></div>
    <div style="margin-top:14px;text-align:center;font-size:12px;color:rgba(14,36,64,.45)">${ADMIN_URL}</div>
  </div></body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text, html })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return true;
}

async function sendKakao(inq, { dbFailed }) {
  const head = dbFailed ? DB_WARN + '\n' : '';
  const preview = inq.message.replace(/\s+/g, ' ').trim();
  const snippet = preview.length > 60 ? preview.slice(0, 60) + '…' : preview;
  const text = `${head}📩 새 문의\n${inq.name} · ${inq.phone}\n${inq.inquiry_type}\n${snippet}`;
  return sendMemo({ text, url: ADMIN_URL, buttonTitle: '관리페이지 열기' });
}

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method Not Allowed' }, 405, { Allow: 'POST' });

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: '요청 형식이 올바르지 않습니다.' }, 400); }
  if (!body || typeof body !== 'object') return json({ ok: false, error: '요청 형식이 올바르지 않습니다.' }, 400);

  /* 허니팟: 사람에게 보이지 않는 website 칸에 값이 있으면 봇. 조용히 성공한 척 한다. */
  if (typeof body.website === 'string' && body.website.trim() !== '') return json({ ok: true });

  const v = validate(body);
  if (v.error) return json({ ok: false, error: v.error }, 400);
  const inq = v.data;
  const user_agent = (req.headers.get('user-agent') || '').slice(0, 500);
  const receivedAt = formatKST();

  const results = { db: false, email: false, kakao: false };
  const errors = {};

  /* ① DB 저장 */
  try {
    const { error } = await getSupabase().from('inquiries').insert({ ...inq, user_agent, status: 'new' });
    if (error) throw new Error(error.message);
    results.db = true;
  } catch (e) {
    errors.db = String(e.message || e);
    console.error('[contact] DB insert failed:', errors.db);
  }
  const dbFailed = !results.db;

  /* ② 이메일 · ③ 카카오톡 — DB 실패와 무관하게 병렬로 시도 */
  const [emailRes, kakaoRes] = await Promise.allSettled([
    sendEmail(inq, { receivedAt, dbFailed }),
    sendKakao(inq, { dbFailed })
  ]);
  if (emailRes.status === 'fulfilled') results.email = true;
  else { errors.email = String(emailRes.reason?.message || emailRes.reason); console.error('[contact] email failed:', errors.email); }
  if (kakaoRes.status === 'fulfilled') results.kakao = true;
  else { errors.kakao = String(kakaoRes.reason?.message || kakaoRes.reason); console.error('[contact] kakao failed:', errors.kakao); }

  const anyOk = results.db || results.email || results.kakao;
  console.log('[contact]', JSON.stringify({ name: inq.name, type: inq.inquiry_type, results }));

  if (!anyOk) return json({ ok: false, error: '접수 처리에 실패했습니다.', detail: errors }, 500);
  return json({ ok: true });
};
