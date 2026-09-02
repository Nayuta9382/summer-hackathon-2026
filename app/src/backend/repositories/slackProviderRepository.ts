import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { slackProviderParams } from '../types/dbparams/slackProvider/slackProviderParams';

const PROVIDER_TYPE = 'SLACK';

// Slackプロバイダーを登録する（CTEで1クエリにまとめて挿入）
export async function insertSlackProvider(params: { userId: number; slackProviderId: string }): Promise<slackProviderParams> {
    const pool = await getPool();

    const query = sql.unsafe`
        WITH master AS (
            INSERT INTO notification_provider_masters (provider_type, user_id)
            VALUES (${PROVIDER_TYPE}, ${params.userId})
            RETURNING id, active_flg
        )
        INSERT INTO slack_providers (id, provider_type, provider_id)
        SELECT master.id, ${PROVIDER_TYPE}, ${params.slackProviderId}
        FROM master
        RETURNING
            id,
            provider_type AS "providerType",
            provider_id AS "providerId",
            (SELECT active_flg FROM master) AS "activeFlg",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
    `;

    const slackProvider = await pool.one(query);

    return slackProvider as slackProviderParams;
}

// ユーザーIDに紐づくSlackプロバイダーを1件取得する（存在しなければnull）
export async function selectSlackProviderByUserId(userId: number): Promise<slackProviderParams | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT
            npm.id,
            npm.provider_type AS "providerType",
            sp.provider_id AS "providerId",
            npm.active_flg AS "activeFlg",
            npm.created_at AS "createdAt",
            npm.updated_at AS "updatedAt"
        FROM notification_provider_masters npm
        INNER JOIN slack_providers sp ON sp.id = npm.id
        WHERE npm.user_id = ${userId}
        LIMIT 1
    `;

    const slackProvider = await pool.maybeOne(query);

    return slackProvider as slackProviderParams | null;
}

// notification_provider_masters の active_flg を true に更新する
export async function activateNotificationProvider(id: number): Promise<void> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE notification_provider_masters
        SET active_flg = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
    `;

    await pool.query(query);
}

// 指定ユーザーIDに紐づくnotification_provider_mastersのSlackレコードを全て無効化する
export async function deactivateSlackProvidersByUserId(userId: number): Promise<void> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE notification_provider_masters
        SET active_flg = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
          AND provider_type = ${PROVIDER_TYPE}
    `;

    await pool.query(query);
}

// ユーザーIDに紐づく有効なSlackプロバイダーのprovider_id(SlackユーザーID)を取得する（存在しなければnull）
export async function selectActiveSlackProviderIdByUserId(userId: number): Promise<string | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT sp.provider_id AS "providerId"
        FROM notification_provider_masters npm
        INNER JOIN slack_providers sp ON sp.id = npm.id
        WHERE npm.user_id = ${userId}
          AND npm.provider_type = ${PROVIDER_TYPE}
          AND npm.active_flg = TRUE
        LIMIT 1
    `;

    const result = await pool.maybeOne(query);

    return result ? (result.providerId as string) : null;
}
