import { insertSensorDetectionHistory, markSensorDetectionHistoriesAsRead, markSensorDetectionHistoryAsReadById } from '../repositories/SensorDetectionHistoryRepository';
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

// 指定した検知履歴ID(detectionId)を1件だけ既読にする
export async function readSensorDetectionHistoryById(detectionId: number): Promise<SensorDetectionHistory | null> {
    const sensorDetectionHistory = await markSensorDetectionHistoryAsReadById(detectionId);

    return sensorDetectionHistory;
}
