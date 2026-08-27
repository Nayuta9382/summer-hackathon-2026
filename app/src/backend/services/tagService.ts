import { insertTag, selectTagsByUserId } from '../repositories/tagRepository';
import { Tag } from '../types/db/tag';
import { AddTagRequestSchema } from '../types/request/tag/addTagRequest';
import { TagResponse } from '../types/response/tag/tagResponse';

// タグの一覧をユーザIDから取得する
export async function getTagsByUserId(userId: string) {
    // repositoryからタグの一覧を受け取る
    const tags: Tag[] = await selectTagsByUserId(userId);

    // レスポンスオブジェクトに詰めなおす(for分とかで詰めなおすのの省略版的なやつ)
    const tagResponses: TagResponse[] = tags.map((item) => ({ ...item }));

    return tagResponses;
}

// タグを登録する処理
export async function addTag(userId: number, rawBody: unknown): Promise<Tag> {
    // バリデーション(失敗時はZodErrorが自動でthrowされ、handleApiErrorのzod部分がレスポンスする)
    const { tagName, colorCode } = AddTagRequestSchema.parse(rawBody);

    // DBへ登録
    const newTag = await insertTag({ userId, tagName, colorCode });

    const tagResponse: TagResponse = {
        ...newTag,
        userId: String(newTag.userId),
    };

    return tagResponse;
}
