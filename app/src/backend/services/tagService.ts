import { insertTag, selectTagsByUserId } from '../repositories/tagRepository';
import { Tag } from '../types/db/tag';
import { AddTagRequestSchema } from '../types/request/tag/addTagRequest';
import { CreateTagResponse, TagListItemResponse } from '../types/response/tag/tagResponse';

// タグの一覧をユーザIDから取得する
export async function getTagsByUserId(userId: number): Promise<TagListItemResponse[]> {
    // repositoryからタグの一覧を受け取る
    const tags: Tag[] = await selectTagsByUserId(userId);

    // レスポンスオブジェクトに詰めなおす(for分とかで詰めなおすのの省略版的なやつ)
    const tagResponses: TagListItemResponse[] = tags.map(({ userId, ...rest }) => rest);

    return tagResponses;
}

// タグを登録する処理
export async function addTag(userId: number, rawBody: unknown): Promise<CreateTagResponse> {
    // バリデーション(失敗時はZodErrorが自動でthrowされ、handleApiErrorのzod部分がレスポンスする)
    const { tagName, colorCode } = AddTagRequestSchema.parse(rawBody);

    // DBへ登録
    const newTag = await insertTag({ userId, tagName, colorCode });

    // newTagからuserIdを除いてTagResponse形式にする
    const { userId: _, ...tagResponse } = newTag;

    return tagResponse as CreateTagResponse;
}
