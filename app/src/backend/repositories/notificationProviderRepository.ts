import { sql } from 'slonik';
import { UsersWithNotificationProvidersParams } from '../types/dbparams/users/usersParams';
import { getPool } from '../db/pool';

// 指定ユーザーの notification_provider_masters（+ line_providers, slack_providers）を取得する
// 1ユーザーに紐づく通知プロバイダーが複数あるため、戻り値はプロバイダーの数だけ行が返る
export async function selectUsersWithNotificationProviders(userId: number): Promise<UsersWithNotificationProvidersParams[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            users.user_id,
            users.user_name,
            users.is_sound_enabled,
            users.notification_sound_id,
            users.created_at,
            users.updated_at,

            npm.id AS provider_master_id,
            npm.provider_type,
            npm.active_flg,
            npm.created_at AS provider_master_created_at,
            npm.updated_at AS provider_master_updated_at,

            line_providers.id AS line_provider_id,
            line_providers.provider_id AS line_provider_id2,

            slack_providers.id AS slack_provider_id,
            slack_providers.provider_id AS slack_provider_id2
        FROM users
        LEFT JOIN notification_provider_masters npm
            ON npm.user_id = users.user_id
            AND npm.active_flg = TRUE
        LEFT JOIN line_providers
            ON line_providers.id = npm.id
        LEFT JOIN slack_providers
            ON slack_providers.id = npm.id
        WHERE users.user_id = ${userId}
    `;

    const rows = await pool.any(query);

    // DBのカラム名はinterceptorでcamelCaseに変換される
    return rows as unknown as UsersWithNotificationProvidersParams[];
}
