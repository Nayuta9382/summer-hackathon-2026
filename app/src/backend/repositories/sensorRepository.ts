import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { SensorParams } from '../types/dbparams/sensor/sensorParams';

// sensorsテーブルにセンサー本体を登録する
export async function insertSensor(params: { userId: number; sensorName: string; ipAddress: string }): Promise<SensorParams> {
    const pool = await getPool();

    const query = sql.unsafe`
        INSERT INTO sensors (user_id, sensor_name, ip_address)
        VALUES (${params.userId}, ${params.sensorName}, ${params.ipAddress})
        RETURNING sensor_id, user_id, sensor_name, ip_address,
                  is_enabled, del_flag, created_at, updated_at
    `;

    const sensor = await pool.one(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return sensor as SensorParams;
}

// sensor_tagsテーブルにセンサーとタグの紐付けを登録する
export async function insertSensorTags(sensorId: number, tagIds: number[]): Promise<void> {
    const pool = await getPool();

    for (const tagId of tagIds) {
        const query = sql.unsafe`
            INSERT INTO sensor_tags (sensor_id, tag_id)
            VALUES (${sensorId}, ${tagId})
        `;

        await pool.query(query);
    }
}
