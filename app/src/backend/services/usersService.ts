import createError from 'http-errors';
import { existsUserByName, insertUser, selectUserById, selectUserByName, selectUserWithPasswordById, updateUserPassword } from '../repositories/userRepository';
import { User } from '../types/db/user';
import { UsersParams } from '../types/dbparams/users/usersParams';
import bcrypt from 'bcryptjs';

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

// user_name をもとに 1 人のユーザー情報を取得し、userオブジェクトでレスポンスする
export async function getUserByName(userName: string): Promise<User | null> {
    const user = await selectUserByName(userName);
    return user;
}

// パスワードを変更する（現在のパスワードを検証してから更新する）
export async function changeUserPassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    // 現在のユーザー情報（passwordHash含む）を取得
    const user = await selectUserWithPasswordById(userId);

    if (user == null) {
        throw createError(404, 'ユーザーが見つかりません');
    }

    // 現在のパスワードが正しいか検証
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
        throw createError(400, '現在のパスワードが正しくありません');
    }

    // 新しいパスワードをハッシュ化して更新
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updated = await updateUserPassword(userId, newPasswordHash);

    if (updated == null) {
        throw createError(404, 'ユーザーが見つかりません');
    }
}

// ユーザー名が既に使われているか確認する
export async function checkUserNameAvailable(userName: string): Promise<boolean> {
    const exists = await existsUserByName(userName);
    return !exists;
}

// 新規ユーザーを登録する
export async function registerUser(userName: string, password: string): Promise<User> {
    const exists = await existsUserByName(userName);

    if (exists) {
        throw createError(409, 'そのユーザー名は既に使用されています');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await insertUser(userName, passwordHash);

    return user;
}
