import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { UsersParams } from '../types/dbparams/users/usersParams';
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
