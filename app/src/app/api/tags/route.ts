import { AUTH_ERROR_RESPONSE, getUserIdFromRequest } from '@/backend/auth/authService';
import { handleApiError } from '@/backend/errors/errors';
import { addTag } from '@/backend/services/tagService';
import { CreateTagResponse } from '@/backend/types/response/tag/tagResponse';

// タグを登録する処理
export async function POST(request: Request) {
    try {
        // proxyが認証後に設定したユーザーIDを取得する
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return Response.json(AUTH_ERROR_RESPONSE, { status: AUTH_ERROR_RESPONSE.status });
        }

        // リクエストbodyを取得する
        const body = await request.json();

        const tagResponse: CreateTagResponse = await addTag(userId, body);

        return Response.json({ data: tagResponse }, { status: 201 });
    } catch (err) {
        return handleApiError(err);
    }
}
