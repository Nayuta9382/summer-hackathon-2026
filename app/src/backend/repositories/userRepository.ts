import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { UsersParams, UsersWithNotificationProvidersParams, UsersWithSensorsParams } from '../types/dbparams/users/usersParams';
import { User } from '../types/db/user';

// user_id をもとに 1 人のユーザー情報を取得する
export async function selectUserById(userId: number): Promise<UsersParams> {
    const pool = await getPool();
    const query = sql.unsafe`SELECT
                   u.user_id,
                   u.user_name,
                   u.is_sound_enabled,
                   u.notification_sound_id,
                   u.created_at AS user_created_at,
                   u.updated_at AS user_updated_at,
                   s.sound_id,
                   s.sound_name,
                   s.file_url
                   FROM "users" u
                   LEFT JOIN
                   notification_sounds s
                   ON u.notification_sound_id = s.sound_id
                   WHERE u.user_id = ${userId}`;
    const user = await pool.one(query);
    return user as UsersParams;
}

// user_name をもとに 1 人のユーザー情報を取得する
export async function selectUserByName(userName: string): Promise<User | null> {
    const pool = await getPool();
    const query = sql.unsafe`SELECT
                   user_id AS "userId",
                   user_name AS "userName",
                   password_hash AS "passwordHash",
                   notification_sound_id AS "notificationSoundId",
                   is_sound_enabled AS "isSoundEnabled",
                   created_at AS "createdAt",
                   updated_at AS "updatedAt"
                   FROM "users"
                   WHERE user_name = ${userName}`;
    const user = await pool.maybeOne(query);
    return user as User | null;
}

// user_id をもとに、パスワードハッシュを含むユーザー情報を取得する
export async function selectUserWithPasswordById(userId: number): Promise<User | null> {
    const pool = await getPool();
    const query = sql.unsafe`SELECT
                   user_id AS "userId",
                   user_name AS "userName",
                   password_hash AS "passwordHash",
                   notification_sound_id AS "notificationSoundId",
                   is_sound_enabled AS "isSoundEnabled",
                   created_at AS "createdAt",
                   updated_at AS "updatedAt"
                   FROM "users"
                   WHERE user_id = ${userId}`;
    const user = await pool.maybeOne(query);
    return user as User | null;
}

// user_id を指定して、パスワード(ハッシュ済み)のみを更新する
export async function updateUserPassword(userId: number, passwordHash: string): Promise<User | null> {
    const pool = await getPool();
    const query = sql.unsafe`
        UPDATE "users"
        SET
            password_hash = ${passwordHash},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING
            user_id AS "userId",
            user_name AS "userName",
            password_hash AS "passwordHash",
            notification_sound_id AS "notificationSoundId",
            is_sound_enabled AS "isSoundEnabled",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
    `;
    const user = await pool.maybeOne(query);
    return user as User | null;
}

// user_name が既に使われているか確認する
export async function existsUserByName(userName: string): Promise<boolean> {
    const pool = await getPool();
    const query = sql.unsafe`
        SELECT 1
        FROM "users"
        WHERE user_name = ${userName}
        LIMIT 1
    `;
    const row = await pool.maybeOne(query);
    return row != null;
}

// ユーザーを新規登録する
export async function insertUser(userName: string, passwordHash: string): Promise<User> {
    const pool = await getPool();
    const query = sql.unsafe`
        INSERT INTO "users" (
            user_name,
            password_hash
        )
        VALUES (
            ${userName},
            ${passwordHash}
        )
        RETURNING
            user_id AS "userId",
            user_name AS "userName",
            password_hash AS "passwordHash",
            notification_sound_id AS "notificationSoundId",
            is_sound_enabled AS "isSoundEnabled",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
    `;
    const user = await pool.one(query);
    return user as unknown as User;
}
