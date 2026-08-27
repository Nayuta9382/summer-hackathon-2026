// DB から取得するユーザー情報の型
// users テーブル + notification_sounds テーブルを JOIN した結果を想定
export type UsersParams = {
    userId: number;
    userName: string;
    isSoundEnabled: boolean;
    notificationSoundId: number;
    createdAt: Date;
    updatedAt: Date;

    soundId: string;
    soundName: string;
    fileUrl: string;
};
