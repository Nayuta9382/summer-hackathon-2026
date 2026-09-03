export type SensorDetectionHistoryParams = {
    detectionId?: number;
    sensorId: number;
    detectedAt: Date;
    readAt: Date | null;
};
