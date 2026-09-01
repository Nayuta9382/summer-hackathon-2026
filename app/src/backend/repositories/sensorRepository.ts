import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { Sensor } from '../types/db/sensor';
import { UsersWithSensorsParams } from '../types/dbparams/users/usersParams';
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

// ユーザ情報を紐づけたセンサ情報の一覧を取得する
export async function selectUsersWithSensors(): Promise<UsersWithSensorsParams[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            users.user_id,
            users.user_name,
            users.is_sound_enabled,
            users.notification_sound_id,
            users.created_at,
            users.updated_at,

            sensors.sensor_id,
            sensors.sensor_name,
            sensors.url,
            sensors.is_enabled,
            sensors.del_flag,
            sensors.created_at AS sensor_created_at,
            sensors.updated_at AS sensor_updated_at
        FROM users
        LEFT JOIN sensors
            ON sensors.user_id = users.user_id
            AND sensors.del_flag = FALSE
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as UsersWithSensorsParams[];
}

// 指定ユーザーに紐づくセンサー一覧を取得する（論理削除済みは除外）
export async function selectSensorsByUserId(userId: number): Promise<Sensor[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            sensor_id,
            user_id,
            sensor_name,
            url,
            is_enabled,
            del_flag,
            created_at,
            updated_at
        FROM sensors
        WHERE user_id = ${userId}
            AND del_flag = FALSE
        ORDER BY created_at DESC
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as Sensor[];
}
