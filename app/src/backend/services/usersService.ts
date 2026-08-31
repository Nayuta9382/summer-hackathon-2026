import { selectUserById, selectUserByName } from '../repositories/userRepository';
import { User } from '../types/db/user';
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

// // user_name をもとに 1 人のユーザー情報を取得し、userオブジェクトでレスポンスする
export async function getUserByName(userName: string): Promise<User | null> {
    const user = await selectUserByName(userName);
    return user;
}
