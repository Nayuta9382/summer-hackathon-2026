// Slack に通知を送信するための共通処理。
// Bot Token を優先し、未設定なら従来の Incoming Webhook を使う。

import { slackBotToken, slackChannelId, slackeWebhookUrl } from '../config/slack';

type SlackApiResponse = {
    ok?: boolean;
    error?: string;
    channel?: {
        id?: string;
    };
};

export async function sendSlackDmToUser(slackUserId: string, message: string) {
    if (!slackBotToken) {
        throw new Error('SLACK_BOT_TOKENが設定されていません');
    }

    if (!slackUserId) {
        throw new Error('Slack user id がありません');
    }

    const openRes = await fetch('https://slack.com/api/conversations.open', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${slackBotToken}`,
        },
        body: JSON.stringify({
            users: slackUserId,
        }),
    });

    const openData = (await openRes.json()) as SlackApiResponse;

    if (!openRes.ok || openData.ok !== true || !openData.channel?.id) {
        throw new Error(`Slack DM open failed: ${openData.error ?? openRes.statusText ?? 'unknown error'}`);
    }

    const dmChannelId = openData.channel.id;

    const postRes = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${slackBotToken}`,
        },
        body: JSON.stringify({
            channel: dmChannelId,
            text: message,
        }),
    });

    const postData = (await postRes.json()) as SlackApiResponse;

    if (!postRes.ok || postData.ok !== true) {
        throw new Error(`Slack DM送信失敗: ${postData.error ?? postRes.statusText ?? 'unknown error'}`);
    }

    return { ok: true, channelId: dmChannelId };
}

export async function sendslackMessage(message: string) {
    if (slackBotToken && slackChannelId) {
        const res = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${slackBotToken}`,
            },
            body: JSON.stringify({
                channel: slackChannelId,
                text: message,
            }),
        });

        const data = (await res.json()) as SlackApiResponse;

        if (!res.ok || data.ok !== true) {
            throw new Error(`Slack通知失敗: ${data.error ?? res.statusText ?? 'unknown error'}`);
        }

        return { ok: true, data };
    }

    if (!slackeWebhookUrl) {
        throw new Error('SLACK_BOT_TOKEN / SLACK_CHANNEL_ID または SLACK_WEBHOOK_URL が設定されていません');
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
