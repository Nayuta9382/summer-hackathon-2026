import { AUTH_ERROR_RESPONSE, getUserIdFromRequest } from '@/backend/auth/authService';
import { handleApiError } from '@/backend/errors/errors';
import { getTagsByUserId } from '@/backend/services/tagService';
import { TagListItemResponse } from '@/backend/types/response/tag/tagResponse';

// ユーザIDからタグの一覧を取得する
export async function GET(request: Request) {
    try {
        // proxyが認証後に設定したユーザーIDを取得する
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return Response.json(AUTH_ERROR_RESPONSE, { status: AUTH_ERROR_RESPONSE.status });
        }

        // データベースからタグの情報を検索する
        const tagResponse: TagListItemResponse[] = await getTagsByUserId(userId);

        // JSONをレスポンスする(200版)
        return Response.json(tagResponse);
    } catch (err) {
        return handleApiError(err);
    }
}
