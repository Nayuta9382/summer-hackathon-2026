import { selectUserById } from '../repositories/userRepository';
import { UsersParams } from '../types/dbparams/users/usersParams';

export async function getUserById(userId: string) {
    const user: UsersParams = await selectUserById(userId);

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
