// Slack 通知の動作確認用エンドポイント。
// userId を渡すと DB から Slack user id を解決して DM を送る。

import { sendSlackDmByUserId } from '@/backend/services/notificationProviderService';
import { sendSlackDmToUser, sendslackMessage } from '@/backend/services/slackService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const slackUserId = searchParams.get('slackUserId');

    if (userIdParam) {
        const userId = Number(userIdParam);

        if (Number.isNaN(userId)) {
            return Response.json({ ok: false, error: 'userId is not a number' }, { status: 400 });
        }

        await sendSlackDmByUserId(userId, 'DB連携テスト通知');
        return Response.json({ ok: true, mode: 'db-dm', userId }, { status: 200 });
    }

    if (slackUserId) {
        await sendSlackDmToUser(slackUserId, 'テストDM通知');
        return Response.json({ ok: true, mode: 'dm', slackUserId }, { status: 200 });
    }

    await sendslackMessage('テスト通知');
    return Response.json({ ok: true, mode: 'channel' }, { status: 200 });
}
