export type SensorResponse = {
    // APIで返すセンサー情報。userIdは含めない
    sensorId: number;
    sensorName: string;
    ipAddress: string | null;
    isEnabled: boolean;
    delFlag: boolean;
    createdAt: Date;
    updatedAt: Date;

    tags: {
        tagId: number;
        tagName: string;
    }[];
};
