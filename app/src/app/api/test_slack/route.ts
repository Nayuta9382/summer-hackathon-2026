import { sendslackMessage } from '@/backend/services/slackService';
import { any } from 'zod/v4';

export async function GET() {
    await sendslackMessage('テスト通知');
    return Response.json({ ok: true }, { status: 200 });
}
