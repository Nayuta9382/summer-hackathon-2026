// センサー一覧取得APIのレスポンス（1件分）
export type GetSensorResponse = {
    sensorId: number;
    sensorName: string;
    url: string | null;
    isEnabled: boolean;
    createdAt: Date;
};
