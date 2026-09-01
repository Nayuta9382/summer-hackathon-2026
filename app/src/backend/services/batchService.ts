// バッチ処理時に行うビジネスロジック

import { checkSensor } from './fetch/sensorFetchService';
import { registerSensorDetectionHistory } from './SensorDetectionHistoryService';
import { getUsersWithSensors } from './sensorService';
import { getUsersWithNotificationProviders } from './notificationProviderService'; // ①import追加

// 登録されているセンサ情報の一覧を取得し、センサが反応してるかを取得し、反応時DB登録＆メッセージ送信を行う
export async function runSensorBatch() {
    const usersWithSensors = await getUsersWithSensors();

    // センサー未登録・無効なセンサーを除外する
    const targets = usersWithSensors.filter((row) => row.sensorId != null && row.isEnabled);

    // 各センサー処理を並列して行う
    await Promise.allSettled(
        targets.map(async (row) => {
            const sensorData = await checkSensor(row.url as string); // ②型エラー対策（url: string | null のため）

            if (sensorData == null || !sensorData.motion) {
                return;
            }

            // 通知プロバイダー情報の一覧をユーザ情報とともに取得する
            const usersWithProviders = await getUsersWithNotificationProviders(row.userId); // ③引数にuserIdを渡す

            // DBに検知履歴を登録する
            const detectedAt = new Date();
            await registerSensorDetectionHistory(row.sensorId as number, detectedAt); // ④usersWithProviders.sensorId → row.sensorId

            // 通知プロバイダーに通知を送信する
        }),
    );
}
