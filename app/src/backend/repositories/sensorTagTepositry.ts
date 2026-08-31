import { sql } from 'slonik';
import { getPool } from '../db/pool';

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
