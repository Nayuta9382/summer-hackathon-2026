// Slack に通知を送信するための共通処理。
// 1) DM 通知: Slack user ID を使って conversations.open -> chat.postMessage
// 2) チャンネル通知: SLACK_CHANNEL_ID を使って chat.postMessage
// 3) 既存の Webhook 設定: フォールバックとして利用

import { slackBotToken, slackChannelId, slackeWebhookUrl } from '../config/slack';
import { createSlackProvider, upsertSlackProvider } from './slackProviderService';

// Slack user ID (例: U1234567890) を受け取り、そのユーザーへの DM を送る。
// まず conversations.open で DM チャネルを開いてから、chat.postMessage でメッセージを送る。
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

// 今回はべた書きで別ファイルに記述は省略
type SlackApiResponse = {
    ok?: boolean;
    error?: string;
    channel?: {
        id?: string;
    };
};

type SlackOAuthResult = { status: 'connected' } | { status: 'error' } | { status: 'wrong_workspace' } | { status: 'unauthorized' };

// Slack OAuthのcallback処理をまとめたビジネスロジック
// 1) codeをアクセストークン + id_tokenに交換
// 2) id_tokenからSlackユーザーIDを取り出す
// 3) 固定ワークスペース以外を弾く
// 4) アプリユーザーとSlackユーザーIDをDBに紐付け
// 5) 連携完了のDMを送信
export async function handleSlackOAuthCallback(code: string, appUserId: number | null): Promise<SlackOAuthResult> {
    // codeをアクセストークン + id_tokenに交換(Sign in with Slack)
    const tokenRes = await fetch('https://slack.com/api/openid.connect.token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.SLACK_CLIENT_ID!,
            client_secret: process.env.SLACK_CLIENT_SECRET!,
            code,
            redirect_uri: process.env.SLACK_REDIRECT_URI!,
            grant_type: 'authorization_code',
        }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.ok) {
        return { status: 'error' };
    }

    // id_token(JWT)をデコードしてSlackのユーザーID(sub)を取り出す
    const idToken = tokenData.id_token as string;
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8'));
    const slackUserId = payload.sub as string; // 例: "U0123ABCD"
    const slackTeamId = payload['https://slack.com/team_id'] as string | undefined;

    // 固定ワークスペース以外からの認証は弾く(安全策)
    if (slackTeamId && slackTeamId !== process.env.SLACK_TEAM_ID) {
        return { status: 'wrong_workspace' };
    }

    // 現在ログイン中のアプリユーザーを特定できなければ未認可
    if (!appUserId) {
        return { status: 'unauthorized' };
    }

    // DBにSlackユーザーIDを登録(既存があれば無効化して再有効化、無ければ新規登録)
    await upsertSlackProvider(appUserId, slackUserId);
    // 接続完了通知のDMを送信
    await sendSlackDmToUser(slackUserId, 'Slack連携が完了しました');

    return { status: 'connected' };
}
