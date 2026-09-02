export type SensorDetectionHistory = {
    detectionId: number;
    sensorId: number;
    detectedAt: Date;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
