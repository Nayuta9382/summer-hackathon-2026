export type User = {
    userId: number;
    userName: string;
    passwordHash: string;
    notificationSoundId: number | null;
    isSoundEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
};
