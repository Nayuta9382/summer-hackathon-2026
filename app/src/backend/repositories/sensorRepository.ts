import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { SensorParams } from '../types/dbparams/sensor/sensorParams';
import { Sensor } from '../types/db/sensor';

// sensorsテーブルにセンサー本体を登録する
export async function insertSensor(params: { userId: number; sensorName: string; url: string }): Promise<Sensor> {
    const pool = await getPool();

    const query = sql.unsafe`
        INSERT INTO sensors (user_id, sensor_name, url)
        VALUES (${params.userId}, ${params.sensorName}, ${params.url})
        RETURNING sensor_id, user_id, sensor_name, url,
                  is_enabled, del_flag, created_at, updated_at
    `;

    const sensor = await pool.one(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return sensor as Sensor;
}

// // sensor_tagsテーブルにセンサーとタグの紐付けを登録する
// export async function insertSensorTags(sensorId: number, tagIds: number[]): Promise<void> {
//     const pool = await getPool();

//     for (const tagId of tagIds) {
//         const query = sql.unsafe`
//             INSERT INTO sensor_tags (sensor_id, tag_id)
//             VALUES (${sensorId}, ${tagId})
//         `;

//         await pool.query(query);
//     }
// }
