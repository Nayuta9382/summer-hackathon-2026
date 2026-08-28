import { handleApiError } from '@/backend/errors/errors';
import { addTag, getTagsByUserId } from '@/backend/services/tagService';
import { CreateTagResponse, TagListItemResponse } from '@/backend/types/response/tag/tagResponse';

// ユーザIDからタグの一覧を取得する
export async function GET(req: Request) {
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
