import { selectUserById } from '../repositories/userRepository';
import { UsersParams } from '../types/dbparams/users/usersParams';

// DB のユーザー情報を API が返す形式へ変換する
export async function getUserById(userId: number) {
    // リポジトリからユーザー 1 件を取得
    const user: UsersParams = await selectUserById(userId);

    // API で返すレスポンス形式に詰め直す
    return {
        userId: user.userId,
        userName: user.userName,
        isSoundEnabled: user.isSoundEnabled,
        notificationSoundId: user.notificationSoundId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        soundId: user.soundId,
        soundName: user.soundName,
        fileUrl: user.fileUrl,
    };
}
