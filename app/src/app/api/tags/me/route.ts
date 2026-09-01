import { handleApiError } from '@/backend/errors/errors';
import { getTagsByUserId } from '@/backend/services/tagService';
import { TagListItemResponse } from '@/backend/types/response/tag/tagResponse';

// ユーザIDからタグの一覧を取得する
export async function GET() {
    try {
        // ユーザIDを受け取る
        const userId = 1;

        // データベースからタグの情報を検索する
        const tagResponse: TagListItemResponse[] = await getTagsByUserId(userId);

        // JSONをレスポンスする(200版)
        return Response.json(tagResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
