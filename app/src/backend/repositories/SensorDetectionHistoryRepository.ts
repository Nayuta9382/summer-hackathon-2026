import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { SensorDetectionHistory } from '../types/db/sensorDetectionHistory';
import { SensorDetectionHistoryParams } from '../types/dbparams/history/sensorDetectionHistoryParams';

// sensor_detection_histories に1件INSERTし、登録結果を返す（read_atは未読のためnull固定）
export async function insertSensorDetectionHistory(sensorId: number, detectedAt: Date): Promise<SensorDetectionHistory> {
    const pool = await getPool();

    const query = sql.unsafe`
        INSERT INTO sensor_detection_histories (
            sensor_id,
            detected_at,
            read_at
        )
        VALUES (
            ${sensorId},
            ${detectedAt.toISOString()},
            NULL
        )
        RETURNING
            detection_id,
            sensor_id,
            detected_at,
            read_at,
            created_at,
            updated_at
    `;

    const row = await pool.one(query);

    return row as unknown as SensorDetectionHistory;
}

// 指定センサーID群に紐づく検知履歴一覧を取得する
export async function selectDetectionHistoriesBySensorIds(sensorIds: number[]): Promise<SensorDetectionHistoryParams[]> {
    if (sensorIds.length === 0) {
        return [];
    }

    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            sensor_id,
            detected_at,
            read_at
        FROM sensor_detection_histories
        WHERE sensor_id = ANY(${sql.array(sensorIds, 'int4')})
        ORDER BY detected_at DESC
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as SensorDetectionHistoryParams[];
}
