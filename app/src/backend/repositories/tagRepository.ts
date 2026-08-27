import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { Tag } from '../types/db/tag';

// タグ情報を取得する
export async function selectTagsByUserId(userId: string): Promise<Tag[]> {
    // データベースの接続情報を取得する
    const pool = await getPool();

    // SQLを定義する
    const query = sql.unsafe`SELECT * FROM tags WHERE user_id = ${userId}`;

    // データベースからデータを取得する
    const tags = await pool.any(query);

    return tags as Tag[];
}
