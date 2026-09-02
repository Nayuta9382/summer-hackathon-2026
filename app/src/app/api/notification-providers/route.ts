// app/api/notification-providers/route.ts

import { getActiveSlackProviderId } from '@/backend/services/slackProviderService';
import { NextResponse } from 'next/server';

// ユーザーIDから有効な通知プロバイダーが登録されているかどうかを返すAPI
// 現状DBから判定できるのはSlackのみ。LINEは未実装のため固定でfalseを返す
export async function GET() {
    // TODO: 本来は認証情報から取得する。現状は仮の固定値
    const userId = 3;

    // 有効なSlackプロバイダーIDを取得し、存在するかどうかで判定する
    const slackProviderId = await getActiveSlackProviderId(userId);

    return NextResponse.json({
        slack: slackProviderId != null,
        line: false, // LINEは未実装のため固定でfalseを返す
    });
}
