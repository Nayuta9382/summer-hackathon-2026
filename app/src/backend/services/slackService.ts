export async function sendslackMessage(message: string) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error('SLACK_WEBHOOK_URLが設定されていません');
    }

    const res = await fetch(webhookUrl, {
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
