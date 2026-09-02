// sensor_detection_histories の取得結果（複数センサー分をまとめて取得する用）
export type SensorDetectionHistoryParams = {
    sensorId: number;
    detectedAt: Date;
    readAt: Date | null;
};
