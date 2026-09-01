import { handleApiError } from '@/backend/errors/errors';
import { editTag } from '@/backend/services/tagService';
import { UpdateTagRequestSchema } from '@/backend/types/request/tag/updateTagRequest';

// タグIDを指定してタグ情報（タグ名・カラーコード）を編集する
export async function PUT(request: Request, { params }: { params: Promise<{ tagId: string }> }) {
    try {
        const { tagId } = await params;

        const rawBody = await request.json();
        const body = UpdateTagRequestSchema.parse(rawBody);

        const tagResponse = await editTag(Number(tagId), body);

        return Response.json({ data: tagResponse }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
