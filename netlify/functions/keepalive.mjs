/* 스케줄: 매일 00:00 UTC
   Supabase Free 플랜은 7일간 활동이 없으면 프로젝트를 일시정지한다.
   가벼운 select 한 번으로 활동 기록을 남겨 정지를 막는다. */
import { schedule } from '@netlify/functions';
import { getSupabase } from './lib/supabase.mjs';

export const handler = schedule('0 0 * * *', async () => {
  try {
    const { error } = await getSupabase().from('inquiries').select('id').limit(1);
    if (error) throw new Error(error.message);
    console.log('[keepalive] ok');
  } catch (e) {
    console.error('[keepalive] failed:', e);
  }
  return { statusCode: 200 };
});
