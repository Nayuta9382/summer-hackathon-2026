import { handleApiError } from '@/backend/errors/errors';
import { addTag } from '@/backend/services/tagService';
import { CreateTagResponse } from '@/backend/types/response/tag/tagResponse';

// タグを登録する処理
export async function POST(req: Request) {
    try {
        // ユーザIDを取得する
        const userId = 1;

        // リクエストbodyを取得する
        const body = await req.json();

        const tagResponse: CreateTagResponse = await addTag(userId, body);

        return Response.json({ data: tagResponse }, { status: 201 });
    } catch (err) {
        return handleApiError(err);
    }
}
