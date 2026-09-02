import { selectUsersWithNotificationProviders } from '../repositories/notificationProviderRepository';
import { UsersWithNotificationProvidersParams } from '../types/dbparams/users/usersParams';
import { sendSlackDmToUser } from './slackService';

// 指定ユーザーに紐づく通知プロバイダー情報を取得する
export async function getUsersWithNotificationProviders(userId: number): Promise<UsersWithNotificationProvidersParams[]> {
    const usersWithNotificationProviders = await selectUsersWithNotificationProviders(userId);

    return usersWithNotificationProviders;
}

export async function getSlackProviderUserId(userId: number): Promise<string | null> {
    const rows = await selectUsersWithNotificationProviders(userId);

    const slackProvider = rows.find((row) => row.providerType === 'SLACK' && row.activeFlg && row.slackProviderId2);

    return slackProvider?.slackProviderId2 ?? null;
}

export async function sendSlackDmByUserId(userId: number, message: string) {
    const slackUserId = await getSlackProviderUserId(userId);

    if (!slackUserId) {
        throw new Error(`userId=${userId} に紐づく Slack provider が見つかりません`);
    }

    return sendSlackDmToUser(slackUserId, message);
}
