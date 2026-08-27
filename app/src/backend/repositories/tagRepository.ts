import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { Tag } from '../types/db/tag';

// タグ情報を取得する
export async function selectTagsByUserId(userId: number): Promise<Tag[]> {
    // データベースの接続情報を取得する
    const pool = await getPool();

    // SQLを定義する
    const query = sql.unsafe`SELECT * FROM tags WHERE user_id = ${userId}`;

    // データベースからデータを取得する
    const tags = await pool.any(query);

    return tags as Tag[];
}

// タグを登録する
export async function insertTag(params: { userId: number; tagName: string; colorCode: string }): Promise<Tag> {
    const pool = await getPool();

    const query = sql.unsafe`
        INSERT INTO tags (user_id, tag_name, color_code)
        VALUES (${params.userId}, ${params.tagName}, ${params.colorCode ?? null})
        RETURNING tag_id, user_id, tag_name, color_code, created_at, updated_at
    `;

    const tag = await pool.one(query);

    return tag as Tag;
}
