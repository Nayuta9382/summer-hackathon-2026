import {
    insertSlackProvider,
    selectSlackProviderByUserId,
    activateNotificationProvider,
    deactivateSlackProvidersByUserId,
    selectActiveSlackProviderIdByUserId,
} from '../repositories/slackProviderRepository';
import { slackProviderParams } from '../types/dbparams/slackProvider/slackProviderParams';

// Slackプロバイダーを登録し、プロバイダーのオブジェクトを返す
export async function createSlackProvider(userId: number, slackProviderId: string): Promise<slackProviderParams> {
    const slackProvider: slackProviderParams = await insertSlackProvider({
        userId,
        slackProviderId,
    });

    return slackProvider;
}

// 既存のSlackプロバイダーを全て無効化した上で、既に登録済みならactive_flgをtrueにし、無ければ新規登録する
export async function upsertSlackProvider(userId: number, slackProviderId: string): Promise<slackProviderParams> {
    // 同じユーザーの既存Slackプロバイダーを一旦全て無効化する
    await deactivateSlackProvidersByUserId(userId);

    const existing = await selectSlackProviderByUserId(userId);

    if (existing) {
        await activateNotificationProvider(existing.id);
        return { ...existing, activeFlg: true };
    }

    return await createSlackProvider(userId, slackProviderId);
}

// ユーザーIDに紐づく有効なSlackユーザーIDを取得する（存在しなければnull）
export async function getActiveSlackProviderId(userId: number): Promise<string | null> {
    return await selectActiveSlackProviderIdByUserId(userId);
}
