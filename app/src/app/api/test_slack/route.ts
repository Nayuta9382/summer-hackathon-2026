// Slack 通知の動作確認用エンドポイント。
// Slack user id を直接指定して、Bot Token 経由の DM 送信ができるかを確認する。

import { sendSlackDmToUser, sendslackMessage } from '@/backend/services/slackService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slackUserId = searchParams.get('slackUserId');

    if (slackUserId) {
        await sendSlackDmToUser(slackUserId, 'テストDM通知');
        return Response.json({ ok: true, mode: 'dm' }, { status: 200 });
    }

    await sendslackMessage('テスト通知');
    return Response.json({ ok: true, mode: 'channel' }, { status: 200 });
}
