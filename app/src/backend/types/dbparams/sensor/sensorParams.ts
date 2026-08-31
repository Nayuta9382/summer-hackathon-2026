export type SensorParams = {
    // sensorsテーブルの主キー
    sensorId: number;
    // センサーを所有するユーザーのID
    userId: number;
    sensorName: string;
    ipAddress: string | null;
    isEnabled: boolean;
    delFlag: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type SensorTag = {
    tagId: number;
    tagName: string;
};
