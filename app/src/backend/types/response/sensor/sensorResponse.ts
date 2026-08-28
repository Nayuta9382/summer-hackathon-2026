export type SensorResponse = {
    // APIで返すセンサー情報。userIdは含めない
    sensorId: number;
    sensorName: string;
    ipAddress: string | null;
    isEnabled: boolean;
    delFlag: boolean;
    createdAt: Date;
    updatedAt: Date;
};

// タグ作成時のレスポンスタイプ
export type CreateSensorResponse = SensorResponse;

// タグ一覧取得処理のレスポンスタイプ
export type SensorListItemResponse = SensorResponse;
