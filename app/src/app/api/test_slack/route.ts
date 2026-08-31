// Slack 通知の動作確認用エンドポイント。
// 開発時に Slack への送信が成功しているかを簡単に確認するために使用する。
// 本番環境では不要な場合があるため、必要に応じて削除またはアクセス制限を行う。

import { sendslackMessage } from '@/backend/services/slackService';
import { any } from 'zod/v4';

export async function GET() {
    await sendslackMessage('テスト通知');
    return Response.json({ ok: true }, { status: 200 });
}
