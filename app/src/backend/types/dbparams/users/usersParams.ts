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

// users テーブル + sensors テーブルを JOIN した結果を想定
export type UsersWithSensorsParams = {
    userId: number;
    userName: string;
    isSoundEnabled: boolean;
    notificationSoundId: number;
    createdAt: Date;
    updatedAt: Date;

    // sensors テーブル分
    sensorId: number;
    sensorName: string;
    url: string;
    isEnabled: boolean;
    delFlag: boolean;
    sensorCreatedAt: Date;
    sensorUpdatedAt: Date;
};

// users テーブル + notification_provider_masters + line_providers + slack_providers を JOIN した結果を想定
// 1ユーザーに紐づく通知プロバイダーが複数あるため、戻り値はプロバイダーの数だけ行が返る
export type UsersWithNotificationProvidersParams = {
    userId: number;
    userName: string;
    isSoundEnabled: boolean;
    notificationSoundId: number;
    createdAt: Date;
    updatedAt: Date;

    // notification_provider_masters テーブル分
    providerMasterId: number;
    providerType: string;
    activeFlg: boolean;
    providerMasterCreatedAt: Date;
    providerMasterUpdatedAt: Date;

    // line_providers テーブル分（LINEでない場合は null）
    lineProviderId: number | null;
    lineProviderId2: string | null; // line_providers.provider_id

    // slack_providers テーブル分（SLACKでない場合は null）
    slackProviderId: number | null;
    slackProviderId2: string | null; // slack_providers.provider_id
};
