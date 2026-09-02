import { authorizeRequest } from '@/backend/auth/authService';
import { SLACK_ERROR_REDIRECT_PATH, SLACK_LOGIN_REDIRECT_PATH, SLACK_SUCCESS_REDIRECT_PATH } from '@/backend/config/slack';
import { handleSlackOAuthCallback } from '@/backend/services/slackService';

import { NextRequest, NextResponse } from 'next/server';

// Slack側の仕様上、ここだけはGETのまま(認可後にブラウザがこのURLへリダイレクトされてくる)
export async function GET(req: NextRequest) {
    // Slackからのリダイレクトに付与されているcodeとstateを取得
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // CSRF対策として、認可リクエスト時にCookieへ保存しておいたstateと比較する
    const savedState = req.cookies.get('slack_oauth_state')?.value;

    // 成功時・失敗時のリダイレクト先をあらかじめ変数にまとめておく
    const successRedirectUrl = new URL(SLACK_SUCCESS_REDIRECT_PATH, req.url);
    const loginRedirectUrl = new URL(SLACK_LOGIN_REDIRECT_PATH, req.url);
    const errorRedirectUrl = new URL(SLACK_ERROR_REDIRECT_PATH, req.url);

    // codeが無い、stateが無い、またはstateが一致しない場合は不正なリクエストとして弾く
    if (!code || !state || state !== savedState) {
        return NextResponse.redirect(errorRedirectUrl);
    }

    // 現在ログイン中のアプリユーザーを特定(未ログインならnullが返る想定)
    const appUserId = await authorizeRequest();

    try {
        // 以下をまとめて実行するビジネスロジックを呼び出す
        // 1) codeをアクセストークン + id_tokenに交換(Sign in with Slack)
        // 2) id_tokenからSlackユーザーIDを取り出す
        // 3) 固定ワークスペース以外からの認証は弾く(安全策)
        // 4) アプリユーザーとSlackユーザーIDをDBに紐付け登録
        // 5) 連携完了通知としてSlack DMを送信
        const result = await handleSlackOAuthCallback(code, appUserId);

        // ログイン中のアプリユーザーが特定できなかった場合はログイン画面へ
        if (result.status === 'unauthorized') {
            return NextResponse.redirect(loginRedirectUrl);
        }

        // トークン交換失敗・別ワークスペースからの認証など、connected以外は結果に応じた失敗用リダイレクト先へ
        if (result.status !== 'connected') {
            const failureRedirectUrl = new URL(`${SLACK_ERROR_REDIRECT_PATH}?reason=${result.status}`, req.url);
            return NextResponse.redirect(failureRedirectUrl);
        }

        // 全て成功した場合は連携完了として成功用リダイレクト先へ
        return NextResponse.redirect(successRedirectUrl);
    } catch (error) {
        // Slack API通信エラーやDB登録エラーなど、想定外の例外はここでまとめてキャッチする
        console.error('Slack OAuth連携エラー:', error);
        return NextResponse.redirect(errorRedirectUrl);
    }
}
