import { getPool } from 'backend/db/pool';
import { Sample } from 'backend/types/db/sample';
import { SearchSampleParams } from 'backend/types/dbparams/sample/searchSampleParams';
import { sql } from 'slonik';

export async function searchSamples(params: SearchSampleParams): Promise<Sample[]> {
    const pool = await getPool();
    const { keyword, category, limit, offset } = params;

    const keywordCondition = keyword ? sql.fragment`AND name ILIKE ${'%' + keyword + '%'}` : sql.fragment``;

    const categoryCondition = category ? sql.fragment`AND category = ${category}` : sql.fragment``;

    const query = sql.unsafe`
    SELECT id, name, category, created_at AS "createdAt"
    FROM samples
    WHERE 1 = 1
      ${keywordCondition}
      ${categoryCondition}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    const rows = await pool.any(query);
    return rows as Sample[];
}
