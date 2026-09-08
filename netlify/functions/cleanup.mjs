/* 스케줄: 매월 1일 00:00 UTC
   contact.html 안내문("상담 목적에만 사용하고 3년 후 파기합니다")에 맞춰
   접수 후 3년이 지난 문의를 삭제한다. */
import { schedule } from '@netlify/functions';
import { getSupabase } from './lib/supabase.mjs';

export const handler = schedule('0 0 1 * *', async () => {
  try {
    const cutoff = new Date();
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 3);
    const { error, count } = await getSupabase()
      .from('inquiries')
      .delete({ count: 'exact' })
      .lt('created_at', cutoff.toISOString());
    if (error) throw new Error(error.message);
    console.log(`[cleanup] deleted ${count ?? 0} inquiries older than ${cutoff.toISOString()}`);
  } catch (e) {
    console.error('[cleanup] failed:', e);
  }
  return { statusCode: 200 };
});
