import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { UsersParams } from '../types/dbparams/users/usersParams';

export async function selectUserById(userId: string): Promise<UsersParams> {
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
