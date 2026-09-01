import { insertSensorDetectionHistory } from '../repositories/SensorDetectionHistoryRepository';
import { SensorDetectionHistory } from '../types/db/sensorDetectionHistory';

// センサー検知履歴を登録する
export async function registerSensorDetectionHistory(sensorId: number, detectedAt: Date): Promise<SensorDetectionHistory> {
    const sensorDetectionHistory = await insertSensorDetectionHistory(sensorId, detectedAt);

    return sensorDetectionHistory;
}
