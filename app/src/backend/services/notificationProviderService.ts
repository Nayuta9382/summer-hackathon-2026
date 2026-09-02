import { selectUsersWithNotificationProviders } from '../repositories/notificationProviderRepository';
import { UsersWithNotificationProvidersParams } from '../types/dbparams/users/usersParams';

// 指定ユーザーに紐づく通知プロバイダー情報を取得する
export async function getUsersWithNotificationProviders(userId: number): Promise<UsersWithNotificationProvidersParams[]> {
    const usersWithNotificationProviders = await selectUsersWithNotificationProviders(userId);

    return usersWithNotificationProviders;
}
