// Slack に通知を送信するための共通処理。
// Webhook を使用して、簡易的なメッセージ通知を行う。
// 通知専用の機能として扱い、ビジネスロジックと切り分ける。

import { slackeWebhookUrl } from '../config/slack';

export async function sendslackMessage(message: string) {
    if (!slackeWebhookUrl) {
        throw new Error('SLACK_WEBHOOK_URLが設定されていません');
    }

    const res = await fetch(slackeWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: message,
        }),
    });

    if (!res.ok) {
        throw new Error(`Slack通知失敗: ${res.status}`);
    }

    return { ok: true };
}
