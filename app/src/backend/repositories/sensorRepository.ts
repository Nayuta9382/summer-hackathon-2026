import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { Sensor } from '../types/db/sensor';
import { UsersWithSensorsParams } from '../types/dbparams/users/usersParams';
import { SensorWithTagsParams } from '../types/dbparams/sensor/sensorWithTagsParams';
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

// 指定ユーザーに紐づくセンサー一覧を、タグ情報とともに取得する（論理削除済みは除外）
// 1センサーに紐づくタグが複数あるため、戻り値はタグの数だけ行が返る
export async function selectSensorsWithTagsByUserId(userId: number): Promise<SensorWithTagsParams[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            sensors.sensor_id,
            sensors.sensor_name,
            sensors.url,
            sensors.is_enabled,
            sensors.created_at,

            tags.tag_id,
            tags.tag_name
        FROM sensors
        LEFT JOIN sensor_tags
            ON sensor_tags.sensor_id = sensors.sensor_id
        LEFT JOIN tags
            ON tags.tag_id = sensor_tags.tag_id
        WHERE sensors.user_id = ${userId}
            AND sensors.del_flag = FALSE
        ORDER BY sensors.created_at DESC
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as SensorWithTagsParams[];
}

// 指定センサーIDのセンサー情報を、タグ情報とともに取得する（論理削除済みは除外）
// 1センサーに紐づくタグが複数あるため、戻り値はタグの数だけ行が返る
export async function selectSensorWithTagsBySensorId(sensorId: number): Promise<SensorWithTagsParams[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            sensors.sensor_id,
            sensors.sensor_name,
            sensors.url,
            sensors.is_enabled,
            sensors.created_at,

            tags.tag_id,
            tags.tag_name
        FROM sensors
        LEFT JOIN sensor_tags
            ON sensor_tags.sensor_id = sensors.sensor_id
        LEFT JOIN tags
            ON tags.tag_id = sensor_tags.tag_id
        WHERE sensors.sensor_id = ${sensorId}
            AND sensors.del_flag = FALSE
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as SensorWithTagsParams[];
}
// センサー本体（sensor_name, url）を更新する。存在しない場合はnullを返す
export async function updateSensor(sensorId: number, sensorName: string, url: string): Promise<Sensor | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE sensors
        SET
            sensor_name = ${sensorName},
            url = ${url},
            updated_at = CURRENT_TIMESTAMP
        WHERE sensor_id = ${sensorId}
            AND del_flag = FALSE
        RETURNING
            sensor_id, user_id, sensor_name, url,
            is_enabled, del_flag, created_at, updated_at
    `;

    const sensor = await pool.maybeOne(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return sensor as unknown as Sensor | null;
}
