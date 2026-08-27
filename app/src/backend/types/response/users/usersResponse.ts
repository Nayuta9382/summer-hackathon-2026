// API から返すユーザー情報の型
// クライアントへ渡すために DB の生データを整形した形
export type UsersResponse = {
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
