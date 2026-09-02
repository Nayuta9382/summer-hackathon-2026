// Slack への通知先設定。
// DM 通知は Slack user ID (U...) を使う前提で、Bot Token を利用する。
// 既存の Incoming Webhook も残しておき、テストやフォールバック用に使えるようにする。
export const slackeWebhookUrl = process.env.SLACK_WEBHOOK_URL ?? '';

export const slackBotToken = process.env.SLACK_BOT_TOKEN ?? '';

export const slackChannelId = process.env.SLACK_CHANNEL_ID ?? '';

// Slack OAuth連携のリダイレクト先パスをまとめておく

export const SLACK_SUCCESS_REDIRECT_PATH = '/seikou';
export const SLACK_LOGIN_REDIRECT_PATH = '/login';
export const SLACK_ERROR_REDIRECT_PATH = '/sipppai';
