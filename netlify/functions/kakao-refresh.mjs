/* 스케줄: 매주 월요일 00:00 UTC (한국 시간 월요일 09:00)
   문의가 한동안 없어도 카카오 refresh_token(60일 만료)이 죽지 않도록 주기적으로 갱신해 저장한다.
   카카오는 refresh_token 잔여 기간이 1개월 미만일 때만 새 refresh_token 을 내려주므로 주 1회면 충분하다. */
import { schedule } from '@netlify/functions';
import { refreshAccessToken } from './lib/kakao.mjs';

export const handler = schedule('0 0 * * 1', async () => {
  try {
    await refreshAccessToken();
    console.log('[kakao-refresh] ok');
  } catch (e) {
    console.error('[kakao-refresh] failed:', e);
  }
  return { statusCode: 200 };
});
