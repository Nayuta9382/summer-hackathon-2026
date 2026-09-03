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
            detection_id,
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

// 指定センサーIDに紐づく未読の検知履歴をすべて既読にする（read_atを現在時刻でUPDATE）
export async function markSensorDetectionHistoriesAsRead(sensorId: number): Promise<SensorDetectionHistory[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE sensor_detection_histories
        SET
            read_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE sensor_id = ${sensorId}
            AND read_at IS NULL
        RETURNING
            detection_id,
            sensor_id,
            detected_at,
            read_at,
            created_at,
            updated_at
    `;

    const rows = await pool.any(query);

    return rows as unknown as SensorDetectionHistory[];
}

// 指定した検知履歴ID(detectionId)を1件だけ既読にする（read_atを現在時刻でUPDATE）
export async function markSensorDetectionHistoryAsReadById(detectionId: number): Promise<SensorDetectionHistory | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE sensor_detection_histories
        SET
            read_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE detection_id = ${detectionId}
            AND read_at IS NULL
        RETURNING
            detection_id,
            sensor_id,
            detected_at,
            read_at,
            created_at,
            updated_at
    `;

    const row = await pool.maybeOne(query);

    return row as unknown as SensorDetectionHistory | null;
}
