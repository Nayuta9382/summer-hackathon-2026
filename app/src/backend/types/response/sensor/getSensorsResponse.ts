export type GetSensorResponse = {
    sensorId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    createdAt: Date;
    tags: {
        tagId: number;
        tagName: string;
    }[];
    // 既読・未読それぞれの検知日時一覧
    readDetectedAts: Date[];
    unreadDetectedAts: Date[];
};
