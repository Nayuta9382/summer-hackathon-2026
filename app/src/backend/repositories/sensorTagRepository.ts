import { sql } from 'slonik';
import { getPool } from '../db/pool';

// 指定センサーの既存タグ紐付けを全削除する
export async function deleteSensorTagsBySensorId(sensorId: number): Promise<void> {
    const pool = await getPool();

    const query = sql.unsafe`
        DELETE FROM sensor_tags
        WHERE sensor_id = ${sensorId}
    `;

    await pool.query(query);
}

// 指定センサーに、渡されたタグID配列を紐付ける
export async function insertSensorTags(sensorId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) {
        return;
    }

    const pool = await getPool();

    const values = tagIds.map((tagId) => sql.fragment`(${sensorId}, ${tagId})`);

    const query = sql.unsafe`
        INSERT INTO sensor_tags (sensor_id, tag_id)
        VALUES ${sql.join(values, sql.fragment`, `)}
    `;

    await pool.query(query);
}
