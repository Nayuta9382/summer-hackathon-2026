import { sql } from 'slonik';
import { getPool } from '../db/pool';
import { Tag } from '../types/db/tag';
import { SensorTag } from '../types/dbparams/sensor/sensorParams';

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

// 指定されたタグIDのタグ情報を取得する
export async function selectTagsByIds(tagIds: number[], userId: number): Promise<SensorTag[]> {
    const pool = await getPool();

    const query = sql.unsafe`
        SELECT tag_id, tag_name
        FROM tags
        WHERE user_id = ${userId}
          AND tag_id = ANY(${sql.array(tagIds, 'int4')})
    `;

    const tags = await pool.any(query);

    return tags as SensorTag[];
}

// タグ情報（tag_name, color_code）を更新する。存在しない場合はnullを返す
export async function updateTag(tagId: number, tagName: string, colorCode: string): Promise<Tag | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        UPDATE tags
        SET
            tag_name = ${tagName},
            color_code = ${colorCode},
            updated_at = CURRENT_TIMESTAMP
        WHERE tag_id = ${tagId}
        RETURNING tag_id, user_id, tag_name, color_code, created_at, updated_at
    `;

    const tag = await pool.maybeOne(query);

    return tag as Tag | null;
}

// タグを削除する（物理削除）。存在しない場合はnullを返す
export async function deleteTag(tagId: number): Promise<{ tagId: number } | null> {
    const pool = await getPool();

    const query = sql.unsafe`
        DELETE FROM tags
        WHERE tag_id = ${tagId}
        RETURNING tag_id
    `;

    const deleted = await pool.maybeOne(query);

    return deleted as { tagId: number } | null;
}
