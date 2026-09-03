import { insertSensorDetectionHistory, markSensorDetectionHistoriesAsRead } from '../repositories/SensorDetectionHistoryRepository';
import { SensorDetectionHistory } from '../types/db/sensorDetectionHistory';

// センサー検知履歴を登録する
export async function registerSensorDetectionHistory(sensorId: number, detectedAt: Date): Promise<SensorDetectionHistory> {
    const sensorDetectionHistory = await insertSensorDetectionHistory(sensorId, detectedAt);

    return sensorDetectionHistory;
}

// 指定センサーの未読検知履歴をすべて既読にする
export async function readSensorDetectionHistories(sensorId: number): Promise<SensorDetectionHistory[]> {
    const sensorDetectionHistories = await markSensorDetectionHistoriesAsRead(sensorId);

    return sensorDetectionHistories;
}
