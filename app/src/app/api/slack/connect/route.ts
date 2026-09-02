import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 事前準備:
// 1. https://api.slack.com/apps でアプリを作成(既存のbot用アプリと同じでもOK)
// 2. 「OAuth & Permissions」→ Redirect URLs に SLACK_REDIRECT_URI を追加
// 3. 「OpenID Connect」を有効化し、scope: openid profile email を許可
// 4. .env に SLACK_CLIENT_ID / SLACK_CLIENT_SECRET / SLACK_REDIRECT_URI / SLACK_TEAM_ID を設定

export async function POST(req: NextRequest) {
    const state = crypto.randomBytes(16).toString('hex');

    const authorizeUrl = new URL('https://slack.com/openid/connect/authorize');
    authorizeUrl.searchParams.set('client_id', process.env.SLACK_CLIENT_ID!);
    authorizeUrl.searchParams.set('redirect_uri', process.env.SLACK_REDIRECT_URI!);
    authorizeUrl.searchParams.set('scope', 'openid profile email');
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('state', state);
    // ワークスペースを固定。未参加のユーザーの場合、Slack側の画面で
    // このワークスペースへの参加を案内するUIが表示される。
    authorizeUrl.searchParams.set('team', process.env.SLACK_TEAM_ID!);

    const res = NextResponse.json({ url: authorizeUrl.toString() });

    res.cookies.set('slack_oauth_state', state, {
        httpOnly: true,
        secure: true,
        maxAge: 600,
        path: '/',
    });

    return res;
}
