import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { SensorDetectionHistory } from '../types/db/sensorDetectionHistory';

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
